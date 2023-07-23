const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');

async function run() {
  var fs = require('fs').promises;
  try {
    const jsonPath = core.getInput('path');
    const inc = core.getInput('increment');
    let maj = 0;
    let min = 0;
    let pch = 0;
    var ver = "";
    await fs.readFile(jsonPath, 'utf8', function (err, data) {
      if (err) {
        core.setFailed(err);
      } else {
        let jsonData = JSON.parse(data);
        ver = jsonData['version'];


        const nums = ver.split('.');
        maj = parseInt(nums[0]);
        min = parseInt(nums[1]);
        pch = parseInt(nums[2]);
      }
    })
  } catch (error) {
    core.setFailed(error);
  }
  var tagExists = await checkTag(ver);
  if (tagExists) {
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
        core.setFailed(err);
      }
    });
  };
  core.setOutput("value", ver);
}

async function checkTag(tag) {
  console.log(`Searching for tag: ${tag}`);
  const token = core.getInput('github_token');
  if (!token) {
    setFailed('Input `github_token` is required');
    return;
  }
  // Get owner and repo from context of payload that triggered the action
  const { owner, repo } = context.repo
  const octokit = getOctokit(token)
  try {
    const getRefResponse = await octokit.rest.git.getRef({
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