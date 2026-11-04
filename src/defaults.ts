import conventionalCommitTypes = require('./types');
import type { Options } from './options';

const defaults: Options = {
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
  jiraOptional: false,
  jiraLocation: 'pre-description',
  jiraPrepend: '',
  jiraAppend: '',
  githubRepo: 'digitalroute/dr-dazzler-team',
  exclamationMark: false,
};

export = defaults;
