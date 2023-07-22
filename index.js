const core = require('@actions/core');

try {
  const jsonPath = core.getInput('path');
  const inc = core.getInput('increment');
  var fs = require('fs')
  fs.readFile(jsonPath, 'utf8', function (err,data) {
    if (err) {
      console.log(err);
    } else {
        const { exec } = require('node:child_process')
        // run the `ls` command using exec
        exec('git tag', (err, output) => {
            // once the command has completed, the callback function is called
            if (err) {
                // log and return if we encounter an error
                console.error("could not execute command: ", err);
                return;
            }
            // log the output received from the command
            console.log(output);
        })
      
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