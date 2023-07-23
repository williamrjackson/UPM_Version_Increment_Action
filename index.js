const core = require('@actions/core');

function run() {
  var fs = require('fs')
  try {
    const jsonPath = core.getInput('path');
    const inc = core.getInput('increment');
    let maj = 0;
    let min = 0;
    let pch = 0;
    var ver = "";
    var newVer = "";
    var jsonData;
    fs.readFile(jsonPath, 'utf8', function (err, data) {
      if (err) {
        core.setFailed(err);
      } else {
        jsonData = JSON.parse(data);
        ver = jsonData['version'];

        const nums = ver.split('.');
        maj = parseInt(nums[0]);
        min = parseInt(nums[1]);
        pch = parseInt(nums[2]);
      }
      switch (inc) {
        case "major":
          maj++;
          break;
        case "minor":
          min++;
          break;
        default:
          pch++;
          break;
      }
      newVer = maj + "." + min + "." + pch
      core.setOutput("incremented", ver);
      core.setOutput("version", newVer);
    });
    // {
    //   jsonData['version'] = newVer;
    //   // Stringify and write to file.
    //   fs.writeFile(jsonPath, JSON.stringify(jsonData), function (err) {
    //     if (err) {
    //       core.setFailed(err);
    //     }
    //   });
    //   console.log("wrote updated file");
    // }
    // else
    // {
    // }
  } catch (error) {
    core.setFailed(error);
  }
}


run();