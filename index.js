const core = require('@actions/core');
const github = require('@actions/github');

try {
  const jsonPath = core.getInput('package-json');
  const time = (new Date()).toTimeString();
  var fs = require('fs')
  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) {
      console.log(err);
    } else {
        let jsonData = JSON.parse(data);

        let ver = jsonData["version"];

      console.log(ver)
      core.setOutput("new-version", time);
    }
});
} catch (error) {
  core.setFailed(error.message);
}
