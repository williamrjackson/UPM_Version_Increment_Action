const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');

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
  const token = core.getInput( 'github_token' );
  if ( ! token ) {
    setFailed( 'Input `github_token` is required' );
    return;
  }
  // Get owner and repo from context of payload that triggered the action
  const { owner, repo } = context.repo
  const octokit = getOctokit(token)
  try {
    const getRefResponse = octokit.rest.git.getRef({
      owner,
      repo,
      ref: `tags/${tag}`
    });
    console.log(`should match: ${getRefResponse.status}`)
    if (getRefResponse.status === 200) {
      console.log("Tag was found");
      return true;
    }

  } catch (error) {
    console.log(`error: ${error.message}`);
  }
  return false;
}

run();