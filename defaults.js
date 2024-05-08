var conventionalCommitTypes = require('./types');

module.exports = {
  types: conventionalCommitTypes,
  jiraMode: true,
  skipScope: true,
  skipType: false,
  skipDescription: false,
  skipBreaking: false,
  customScope: false,
  maxHeaderWidth: 72,
  minHeaderWidth: 2,
  maxLineWidth: 100,
  jiraPrefix: 'DAZ',
  jiraNumber: '12345',
  jiraOptional: false,
  jiraLocation: 'pre-description',
  jiraPrepend: '',
  jiraAppend: '',
  exclamationMark: false
};
