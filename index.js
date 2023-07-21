const core = require('@actions/core');
const github = require('@actions/github');

try {
  const jsonPath = core.getInput('package-json');
  const time = (new Date()).toTimeString();
  var fs = require('fs')
  fs.readFile(jsonPath, 'utf8', function (err,data) {
    if (err) {
      console.log(err);
    } else {
        let jsonData = JSON.parse(data);

        let ver = jsonData["version"];
        var nums = ver.replace(' ', '').split('.')
        var revision = parseInt(nums[nums.length -1]);
        nums[nums.length -1] = revision + 1;
                
        console.log(nums[nums.length -1])
        core.setOutput("new-version", nums[0] + "." + nums[1] + "." + nums[2]);
    }
});
} catch (error) {
  core.setFailed(error.message);
}
