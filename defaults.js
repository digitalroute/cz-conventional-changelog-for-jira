var conventionalCommitTypes = require('./types');

module.exports = {
  types: conventionalCommitTypes,
  jiraMode: true,
  skipScope: true,
  maxHeaderWidth: 72,
  minHeaderWidth: 2,
  maxLineWidth: 100,
  jiraPrefix: 'DAZ',
  jiraOptional: false,
  jiraLocation: 'pre-description',
  jiraPrepend: '',
  jiraAppend: '',
  exclamationMark: false
};
