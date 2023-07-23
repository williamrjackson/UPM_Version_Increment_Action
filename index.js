const core = require('@actions/core');

try {
  const jsonPath = core.getInput('path');
  const inc = core.getInput('increment');
  var fs = require('fs')
  fs.readFile(jsonPath, 'utf8', function (err,data) {
    if (err) {
      console.log(err);
    } else {
      const util = require('node:util');
      const exec = util.promisify(require('node:child_process').exec);
      
      const { stdout, stderr } = exec('git tag');
      console.log('stdout:', stdout);
      console.error('stderr:', stderr);
      
        let jsonData = JSON.parse(data);
        let ver = jsonData['version'];

        const nums = ver.split('.');
        let maj = parseInt(nums[0]);
        let min = parseInt(nums[1]);
        let pch = parseInt(nums[2]);

        switch(inc) {
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

        const newVer = maj + "." + min + "." + pch 
        jsonData['version'] = newVer;
        core.setOutput("value", newVer);

        // Stringify and write to file.
        fs.writeFile("test.txt", JSON.stringify(jsonData), function(err) {
        if (err) {
            console.log(err);
        }
      });
    }
});
} catch (error) {
  core.setFailed(error.message);
}