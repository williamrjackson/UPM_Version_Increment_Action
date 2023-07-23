const core = require('@actions/core');
const { context, gitHub } = require('@actions/github');

function run() {
  try {
    const jsonPath = core.getInput('path');
    const inc = core.getInput('increment');
    var fs = require('fs')
    fs.readFile(jsonPath, 'utf8', function (err, data) {
      if (err) {
        console.log(err);
      } else {
        let jsonData = JSON.parse(data);
        let ver = jsonData['version'];


        const nums = ver.split('.');
        let maj = parseInt(nums[0]);
        let min = parseInt(nums[1]);
        let pch = parseInt(nums[2]);

        if (checkTag(`v${ver}`)) {
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

          ver = maj + "." + min + "." + pch
          jsonData['version'] = newVer;
          // Stringify and write to file.
          fs.writeFile(jsonPath, JSON.stringify(jsonData), function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
        core.setOutput("value", ver);
      }
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

function checkTag(tag) {
  console.log(`Searching for tag: ${tag}`);

  // Get owner and repo from context of payload that triggered the action
  const { owner, repo } = context.repo

  try {
    const getRefResponse = github.git.getRef({
      owner,
      repo,
      ref: `tags/${tag}`
    });
    const getRefResponse2 = github.git.getRef({
      owner,
      repo,
      ref: `tags/shouldfail`
    });
    console.log(`should match: ${getRefResponse}`)
    console.log(`should fail: ${getRefResponse2}`)
    if (getRefResponse.status === 200) {
      console.log("Tag was found");
      return true;
    }

  } catch (error) {
    console.log("Tag was not found");
  }
  return false;
}

run();