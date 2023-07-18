const fs = require('fs');
const core = require('@actions/core');
const { context } = require('@actions/github');
const { Octokit } = require('@octokit/rest');

const jsonPath = core.getInput('input-file');
const token = core.getInput('repo-token');

const octokit = new Octokit({ auth: token });
const { owner, repo } = context.repo;
const pullNum = core.getInput('pr-number')
async function listPRCommits() {
  var feats = []; 
  var other = [];
  var maints = [];
  var docs = [];
  var fixes = [];
  var breaks = [];
  try {
    const { data: commits } = await octokit.pulls.listCommits({
      owner,
      repo,
      pull_number: pullNum 
    });
    for (var i in commits) {
      const { message, author, committer } = commits[i].commit;
      msgType = message.split('(')[0];
      msgScope = message.substring(message.indexOf('(') + 1, message.indexOf(')'))
      logMessage = `${msgScope}: ${message.split(':')[1]}`
      switch (msgType) {
        case 'FEAT':
          feats.push(logMessage);
          break;
        case 'FIX':
          fixes.push(logMessage);
          break;
        case 'DOC':
          docs.push(logMessage);
          break;
        case 'MAINT':
          maints.push(logMessage);
          break;
        case 'BREAK':
          breaks.push(logMessage);
          break;
        default:
          other.push(message)
      }
    }
    var logText = '';
    feats.length > 0 ? logText += `## Features: ${checkIfEmpty(feats)}\n\n` : false;
    maints.length > 0 ? logText += `## Maints: ${checkIfEmpty(maints)}\n\n` : false;
    fixes.length > 0 ? logText += `## Fixes: ${checkIfEmpty(fixes)}\n\n` : false;
    docs.length > 0 ? logText += `## Docs: ${checkIfEmpty(docs)}\n\n` : false;
    other.length > 0 ? logText += `## Other: ${checkIfEmpty(other)}\n\n` : false;

    console.log(logText);
    core.setOutput('changelog-text', logText);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}
function checkIfEmpty(list) {
  if (list.length > 0) {
    var logList = '\n'
    for (var i in list) {
      logList += `* ${list[i]}\n`
    }
    return `${logList}`
  }
}

listPRCommits();
