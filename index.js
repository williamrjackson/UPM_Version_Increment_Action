const core = require('@actions/core');

try {
  const jsonPath = core.getInput('path');
  const targetVal = core.getInput('key');
  var fs = require('fs')
  fs.readFile(jsonPath, 'utf8', function (err,data) {
    if (err) {
      console.log(err);
    } else {
        let jsonData = JSON.parse(data);

        let ver = jsonData[targetVal];
        core.setOutput("value", ver);
    }
});
} catch (error) {
  core.setFailed(error.message);
}
