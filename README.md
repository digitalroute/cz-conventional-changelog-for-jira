# cz-conventional-changelog-for-jira

Part of the [commitizen](https://github.com/commitizen/cz-cli) family. Prompts for [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) standard and also prompts for a mandatory JIRA issue.

[![npm version](https://img.shields.io/npm/v/@digitalroute/cz-conventional-changelog-for-jira.svg?style=flat-square)](https://www.npmjs.org/package/@digitalroute/cz-conventional-changelog-for-jira)
[![npm downloads](https://img.shields.io/npm/dm/@digitalroute/cz-conventional-changelog-for-jira.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@digitalroute/cz-conventional-changelog-for-jira&from=2015-08-01)
[![Build Status](https://img.shields.io/travis/digitalroute/cz-conventional-changelog-for-jira.svg?style=flat-square)](https://travis-ci.org/digitalroute/cz-conventional-changelog-for-jira)

## Features

- Works seamlessly with semantic-release 🚀
- Works seamlessly with Jira smart commits
- Automatically detects the Jira issue from the branch name

## Quickstart

### Installation

```bash
npm install commitizen @digitalroute/cz-conventional-changelog-for-jira
```

and then add the following to package.json:

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/@digitalroute/cz-conventional-changelog-for-jira"
    }
  }
}
```

### Usage

<p align="center">
	<image alt="Gif of terminal when using cz-conventional-changelog-for-jira" src="images/demo.gif" width="80%">
</p>

## Configuration

Like commitizen, you can specify the configuration of cz-conventional-changelog-for-jira through the package.json's `config.commitizen` key, or with environment variables.

| Environment variable | package.json   | Default   | Explanation                                                                                                                                                           |
| -------------------- | -------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CZ_JIRA_MODE         | jiraMode       | true      | If this is set to true, CZ will ask for a Jira issue and put it in the commit head. If set to false CZ will ask for the issue in the end, and can be used for GitHub. |
| CZ_MAX_HEADER_WIDTH  | maxHeaderWidth | 72        | This limits how long a commit message head can be.                                                                                                                    |
| CZ_MIN_HEADER_WIDTH  | minHeaderWidth | 2         | This limits how short a commit message can be.                                                                                                                        |
| CZ_MAX_LINE_WIDTH    | maxLineWidth   | 100       | Commit message bodies are automatically wrapped. This decides how long the lines will be.                                                                             |
| CZ_SKIP_SCOPE        | skipScope      | false     | If scope should be used in commit messages.                                                                                                                           |
| CZ_TYPE              | defaultType    | undefined | The default type.                                                                                                                                                     |
| CZ_SCOPE             | defaultScope   | undefined | The default scope.                                                                                                                                                    |
| CZ_SUBJECT           | defaultSubject | undefined | A default subject.                                                                                                                                                    |
| CZ_BODY              | defaultBody    | undefined | A default body.                                                                                                                                                       |
| CZ_ISSUES            | defaultIssues  | undefined | A default issue.                                                                                                                                                      |

### Commitlint

If using the [commitlint](https://github.com/conventional-changelog/commitlint) js library, the "maxHeaderWidth" configuration property will default to the configuration of the "header-max-length" rule instead of the hard coded value of 72. This can be ovewritten by setting the 'maxHeaderWidth' configuration in package.json or the CZ_MAX_HEADER_WIDTH environment variable.
