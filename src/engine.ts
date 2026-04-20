import { execSync } from 'child_process';
import chalk from 'chalk';
import boxen from 'boxen';
import wrap from 'word-wrap';
import type * as inquirer from 'inquirer';

type Cz = typeof inquirer;

import defaults = require('./defaults');
import LimitedInputPrompt = require('./LimitedInputPrompt');
import type { Options, Answers, JiraLocation } from './options';

type _CommitCallback = (message: string) => void;

interface _Prompter {
  prompter(cz: Cz, commit: _CommitCallback, testMode?: boolean): void;
}

const filter = (array: Array<string | false>): string[] =>
  array.filter((x): x is string => Boolean(x));

const filterSubject = (subject: string): string => {
  subject = subject.trim();
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};

function engine(options: Options): engine.Prompter {
  const getFromOptionsOrDefaults = <K extends keyof Options>(
    key: K,
  ): Options[K] => (options[key] ?? defaults[key]) as Options[K];

  const getJiraIssueLocation = (
    location: JiraLocation | string,
    type = '',
    scope = '',
    jiraWithDecorators: string,
    subject: string,
  ): string => {
    let headerPrefix = type + scope;
    if (headerPrefix !== '') {
      headerPrefix += ': ';
    }
    switch (location) {
      case 'pre-type':
        return jiraWithDecorators + headerPrefix + subject;
      case 'pre-description':
        return headerPrefix + jiraWithDecorators + subject;
      case 'post-description':
        return headerPrefix + subject + ' ' + jiraWithDecorators;
      case 'post-body':
        return headerPrefix + subject;
      default:
        return headerPrefix + jiraWithDecorators + subject;
    }
  };

  const decorateJiraIssue = (jiraIssue: string | undefined): string => {
    const prepend = options.jiraPrepend || '';
    const append = options.jiraAppend || '';
    return jiraIssue ? `${prepend}${jiraIssue}${append} ` : '';
  };

  const types = getFromOptionsOrDefaults('types');

  const length =
    Object.keys(types).reduce((a, b) => (a.length >= b.length ? a : b), '')
      .length + 1;
  const choices = Object.entries(types).map(([key, type]) => ({
    name: (key + ':').padEnd(length) + ' ' + type.description,
    value: key,
  }));

  const minHeaderWidth = getFromOptionsOrDefaults('minHeaderWidth');
  const maxHeaderWidth = getFromOptionsOrDefaults('maxHeaderWidth');

  const branchName = execSync('git branch --show-current').toString().trim();
  const jiraIssueRegex =
    /(?<jiraIssue>(?<!([a-zA-Z0-9]{1,10})-?)[a-zA-Z0-9]+-\d+)/;
  const matchResult = branchName.match(jiraIssueRegex);
  const jiraIssue = matchResult?.groups?.jiraIssue;

  const hasScopes = Boolean(
    options.scopes &&
    Array.isArray(options.scopes) &&
    options.scopes.length > 0,
  );
  const customScope = !options.skipScope && hasScopes && options.customScope;
  const scopes = customScope
    ? [...(options.scopes ?? []), 'custom']
    : options.scopes;

  const getProvidedScope = (answers: Answers): string | undefined =>
    answers.scope === 'custom' ? answers.customScope : answers.scope;

  return {
    prompter: function (cz: Cz, commit: _CommitCallback, testMode?: boolean) {
      cz.registerPrompt('limitedInput', LimitedInputPrompt as unknown as never);

      cz.prompt([
        {
          type: 'list',
          name: 'type',
          when: !options.skipType,
          message: "Select the type of change that you're committing:",
          choices: choices,
          default: options.skipType ? '' : options.defaultType,
        },
        {
          type: 'input',
          name: 'jira',
          message:
            'Enter JIRA issue (' +
            getFromOptionsOrDefaults('jiraPrefix') +
            '-12345)' +
            (options.jiraOptional ? ' (optional)' : '') +
            ':',
          when: options.jiraMode,
          default: jiraIssue || '',
          validate: function (jira: string) {
            return (
              (options.jiraOptional && !jira) ||
              /^(?<!([a-zA-Z0-9]{1,10})-?)[a-zA-Z0-9]+-\d+$/.test(jira)
            );
          },
          filter: function (jira: string) {
            return jira.toUpperCase();
          },
        },
        {
          type: hasScopes ? 'list' : 'input',
          name: 'scope',
          when: !options.skipScope,
          choices: hasScopes ? scopes : undefined,
          message:
            'What is the scope of this change (e.g. component or file name): ' +
            (hasScopes ? '(select from the list)' : '(press enter to skip)'),
          default: options.defaultScope,
          filter: function (value: string) {
            return value.trim().toLowerCase();
          },
        },
        {
          type: 'input',
          name: 'customScope',
          when: ({ scope }: { scope?: string }) => scope === 'custom',
          message: 'Type custom scope (press enter to skip)',
        },
        {
          type: 'limitedInput',
          name: 'subject',
          message: 'Write a short, imperative tense description of the change:',
          default: options.defaultSubject,
          maxLength: maxHeaderWidth - (options.exclamationMark ? 1 : 0),
          leadingLabel: (answers: Answers) => {
            let scope = '';
            const providedScope = getProvidedScope(answers);
            if (providedScope && providedScope !== 'none') {
              scope = `(${providedScope})`;
            }

            const jiraWithDecorators = decorateJiraIssue(answers.jira);
            return getJiraIssueLocation(
              options.jiraLocation,
              answers.type,
              scope,
              jiraWithDecorators,
              '',
            ).trim();
          },
          validate: (input: string) =>
            input.length >= minHeaderWidth ||
            `The subject must have at least ${minHeaderWidth} characters`,
          filter: function (subject: string) {
            return filterSubject(subject);
          },
        } as unknown as never,
        {
          type: 'input',
          name: 'body',
          when: !options.skipDescription,
          message:
            'Provide a longer description of the change: (press enter to skip)\n',
          default: options.defaultBody,
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          when: !options.skipBreaking,
          message: 'Are there any breaking changes?',
          default: false,
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message:
            'You do know that this will bump the major version, are you sure?',
          default: false,
          when: function (answers: Answers) {
            return answers.isBreaking;
          },
        },
        {
          type: 'input',
          name: 'breaking',
          message: 'Describe the breaking changes:\n',
          when: function (answers: Answers) {
            return answers.isBreaking;
          },
        },
        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: 'Does this change affect any open issues?',
          default: Boolean(options.defaultIssues),
          when: !options.jiraMode,
        },
        {
          type: 'input',
          name: 'issuesBody',
          default: '-',
          message:
            'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n',
          when: function (answers: Answers & { breakingBody?: string }) {
            return (
              answers.isIssueAffected && !answers.body && !answers.breakingBody
            );
          },
        },
        {
          type: 'input',
          name: 'issues',
          message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
          when: function (answers: Answers) {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined,
        },
      ]).then(async function (answers: Answers) {
        const wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth,
        };

        const providedScope = getProvidedScope(answers);
        let scope = providedScope ? '(' + providedScope + ')' : '';

        const addExclamationMark = options.exclamationMark && answers.breaking;
        scope = addExclamationMark ? scope + '!' : scope;

        const jiraWithDecorators = decorateJiraIssue(answers.jira);

        const head = getJiraIssueLocation(
          options.jiraLocation,
          answers.type,
          scope,
          jiraWithDecorators,
          answers.subject,
        );

        let body: string | false = answers.body
          ? wrap(answers.body, wrapOptions)
          : false;
        if (options.jiraMode && options.jiraLocation === 'post-body') {
          if (body === false) {
            body = '';
          } else {
            body += '\n\n';
          }
          body += jiraWithDecorators.trim();
        }

        let breaking: string | false = answers.breaking
          ? answers.breaking.trim()
          : '';
        breaking = breaking
          ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '')
          : '';
        breaking = breaking ? wrap(breaking, wrapOptions) : false;

        const issues: string | false = answers.issues
          ? wrap(answers.issues, wrapOptions)
          : false;

        const fullCommit = filter([head, body, breaking, issues]).join('\n\n');

        if (testMode) {
          return commit(fullCommit);
        }

        console.log();
        console.log(chalk.underline('Commit preview:'));
        console.log(boxen(chalk.green(fullCommit), { padding: 1, margin: 1 }));

        const { doCommit } = await cz.prompt<{ doCommit: boolean }>([
          {
            type: 'confirm',
            name: 'doCommit',
            message: 'Are you sure that you want to commit?',
          },
        ]);

        if (doCommit) {
          commit(fullCommit);
        }
      });
    },
  };
}

namespace engine {
  export type CommitCallback = _CommitCallback;
  export type Prompter = _Prompter;
}

export = engine;
