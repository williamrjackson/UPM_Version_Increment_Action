const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');

async function run() {
  const inc = core.getInput('increment');
  
  let ver = await getVersion();

  var tagExists = await checkTag(ver);
  if (tagExists) {
    const nums = ver.split('.');
    let maj = parseInt(nums[0]);
    let min = parseInt(nums[1]);
    let pch = parseInt(nums[2]);

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
  };
  core.setOutput("value", ver);
}
async function getVersion()
{
  var fs = require('fs').promises;
  const jsonPath = core.getInput('path');
  await fs.readFile(jsonPath, 'utf8', function (err, data) {
    if (err) {
      core.setFailed(err);
    } else {
      jsonData = JSON.parse(data);
      return jsonData['version'];
    }
  })
}

async function writeVersion(version)
{
  var fs = require('fs').promises;
  const jsonPath = core.getInput('path');
  await fs.readFile(jsonPath, 'utf8', function (err, data) {
    if (err) {
      core.setFailed(err);
    } else {
      jsonData = JSON.parse(data);
      jsonData['version'] = version;
      fs.writeFile(jsonPath, JSON.stringify(jsonData), function (err) {
        if (err) {
          core.setFailed(err);
        }
      });
    }
  })
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