var chai = require('chai');
var chalk = require('chalk');
var engine = require('./engine');
var mock = require('mock-require');
var semver = require('semver');

var types = require('./types');
var defaults = require('./defaults');

var expect = chai.expect;
chai.should();

var defaultOptions = defaults;

var type = 'func';
var scope = 'everything';
var jira = 'DAZ-123';
var subject = 'testing123';
const shortBody = 'a';
var longBody =
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a' +
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a' +
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a';
var longBodySplit =
  longBody.slice(0, defaultOptions.maxLineWidth).trim() +
  '\n' +
  longBody
    .slice(defaultOptions.maxLineWidth, 2 * defaultOptions.maxLineWidth)
    .trim() +
  '\n' +
  longBody.slice(defaultOptions.maxLineWidth * 2, longBody.length).trim();
var body = 'A quick brown fox jumps over the dog';
var issues = 'a issues is not a person that kicks things';
var longIssues =
  'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b' +
  'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b' +
  'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b';
var breakingChange = 'BREAKING CHANGE: ';
var breaking = 'asdhdfkjhbakjdhjkashd adhfajkhs asdhkjdsh ahshd';
var longIssuesSplit =
  longIssues.slice(0, defaultOptions.maxLineWidth).trim() +
  '\n' +
  longIssues
    .slice(defaultOptions.maxLineWidth, defaultOptions.maxLineWidth * 2)
    .trim() +
  '\n' +
  longIssues.slice(defaultOptions.maxLineWidth * 2, longIssues.length).trim();

describe('commit message', function() {
  it('only header w/ out scope', function() {
    expect(
      commitMessage({
        type,
        jira,
        subject
      })
    ).to.equal(`${type}: ${jira} ${subject}`);
  });
  it('only header w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject
      })
    ).to.equal(`${type}(${scope}): ${jira} ${subject}`);
  });
  it('header and body w/ out scope', function() {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body
      })
    ).to.equal(`${type}: ${jira} ${subject}\n\n${body}`);
  });
  it('header and body w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body
      })
    ).to.equal(`${type}(${scope}): ${jira} ${subject}\n\n${body}`);
  });
  it('header, body and issues w/ out scope', function() {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body,
        issues
      })
    ).to.equal(`${type}: ${jira} ${subject}\n\n${body}\n\n${issues}`);
  });
  it('header, body and issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body,
        issues
      })
    ).to.equal(`${type}(${scope}): ${jira} ${subject}\n\n${body}\n\n${issues}`);
  });
  it('header, body and long issues w/ out scope', function() {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body,
        issues: longIssues
      })
    ).to.equal(`${type}: ${jira} ${subject}\n\n${body}\n\n${longIssuesSplit}`);
  });
  it('header, body and long issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body,
        issues: longIssues
      })
    ).to.equal(
      `${type}(${scope}): ${jira} ${subject}\n\n${body}\n\n${longIssuesSplit}`
    );
  });
  it('header and long body w/ out scope', function() {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body: longBody
      })
    ).to.equal(`${type}: ${jira} ${subject}\n\n${longBodySplit}`);
  });
  it('header and long body w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody
      })
    ).to.equal(`${type}(${scope}): ${jira} ${subject}\n\n${longBodySplit}`);
  });
  it('header, long body and issues w/ out scope', function() {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body: longBody,
        issues
      })
    ).to.equal(`${type}: ${jira} ${subject}\n\n${longBodySplit}\n\n${issues}`);
  });
  it('header, long body and issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
        issues
      })
    ).to.equal(
      `${type}(${scope}): ${jira} ${subject}\n\n${longBodySplit}\n\n${issues}`
    );
  });
  it('header, long body and long issues w/ out scope', function() {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body: longBody,
        issues: longIssues
      })
    ).to.equal(
      `${type}: ${jira} ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`
    );
  });
  it('header, long body and long issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
        issues: longIssues
      })
    ).to.equal(
      `${type}(${scope}): ${jira} ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`
    );
  });
  it('header, long body, breaking change, and long issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
        breaking,
        issues: longIssues
      })
    ).to.equal(
      `${type}(${scope}): ${jira} ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`
    );
  });
  it('header, long body, breaking change (with prefix entered), and long issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
        breaking: `${breakingChange}${breaking}`,
        issues: longIssues
      })
    ).to.equal(
      `${type}(${scope}): ${jira} ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`
    );
  });
  it('header, body, breaking change, and issues w/ scope; exclamation mark enabled', function() {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body,
        breaking,
        issues
      },
        { ...defaultOptions, exclamationMark: true })
    ).to.equal(
      `${type}(${scope})!: ${jira} ${subject}\n\n${body}\n\n${breakingChange}${breaking}\n\n${issues}`
    );
  });
  it('header, body, breaking change, and issues w/o scope; exclamation mark enabled', function() {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body,
        breaking,
        issues
      },
        { ...defaultOptions, exclamationMark: true })
    ).to.equal(
      `${type}!: ${jira} ${subject}\n\n${body}\n\n${breakingChange}${breaking}\n\n${issues}`
    );
  });
  it('skip jira task when optional', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira: '',
          subject
        },
        { jiraOptional: true }
      )
    ).to.equal(`${type}(${scope}): ${subject}`);
  });
  it('default jiraLocation when unknown', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body
        },
        { jiraLocation: 'unknown-location' }
      )
    ).to.equal(`${type}(${scope}): ${jira} ${subject}\n\n${body}`);
  });
  it('pre-type jiraLocation', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body
        },
        { jiraLocation: 'pre-type' }
      )
    ).to.equal(`${jira} ${type}(${scope}): ${subject}\n\n${body}`);
  });
  it('pre-description jiraLocation', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body
        },
        { jiraLocation: 'pre-description' }
      )
    ).to.equal(`${type}(${scope}): ${jira} ${subject}\n\n${body}`);
  });
  it('post-description jiraLocation', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body
        },
        { jiraLocation: 'post-description' }
      )
    ).to.equal(`${type}(${scope}): ${subject} ${jira} \n\n${body}`);
  });
  it('jiraPrepend decorator', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body
        },
        { jiraPrepend: '-' }
      )
    ).to.equal(`${type}(${scope}): -${jira} ${subject}\n\n${body}`);
  });
  it('jiraAppend decorator', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body
        },
        { jiraAppend: '+' }
      )
    ).to.equal(`${type}(${scope}): ${jira}+ ${subject}\n\n${body}`);
  });
  it('jiraPrepend and jiraAppend decorators', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body
        },
        {
          jiraAppend: ']',
          jiraPrepend: '['
        }
      )
    ).to.equal(`${type}(${scope}): [${jira}] ${subject}\n\n${body}`);
  });
  it('jiraLocation, jiraPrepend, jiraAppend decorators', function() {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body
        },
        {
          jiraAppend: ']',
          jiraPrepend: '[',
          jiraLocation: 'pre-type'
        }
      )
    ).to.equal(`[${jira}] ${type}(${scope}): ${subject}\n\n${body}`);
  });
});

describe('validation', function() {
  it('subject exceeds max length', function() {
    expect(() =>
      commitMessage({
        type,
        scope,
        jira,
        subject: shortBody
      })
    ).to.throw(`The subject must have at least 2 characters`);
  });
  it('empty subject', function() {
    expect(() =>
      commitMessage({
        type,
        scope,
        subject: ''
      })
    ).to.throw(`The subject must have at least 2 characters`);
  });
  it('empty jira if not optional', function() {
    expect(() =>
      commitMessage(
        {
          type,
          scope,
          jira: '',
          subject
        },
        { jiraOptional: false }
      )
    ).to.throw(`Answer '' to question 'jira' was invalid`);
  });
});

describe('defaults', function() {
  it('defaultType default', function() {
    expect(questionDefault('type')).to.be.undefined;
  });
  it('defaultType options', function() {
    expect(
      questionDefault('type', customOptions({ defaultType: type }))
    ).to.equal(type);
  });
  it('defaultScope default', function() {
    expect(questionDefault('scope')).to.be.undefined;
  });
  it('defaultScope options', () =>
    expect(
      questionDefault('scope', customOptions({ defaultScope: scope }))
    ).to.equal(scope));

  it('defaultSubject default', () =>
    expect(questionDefault('subject')).to.be.undefined);
  it('defaultSubject options', function() {
    expect(
      questionDefault(
        'subject',
        customOptions({
          defaultSubject: subject
        })
      )
    ).to.equal(subject);
  });
  it('defaultBody default', function() {
    expect(questionDefault('body')).to.be.undefined;
  });
  it('defaultBody options', function() {
    expect(
      questionDefault('body', customOptions({ defaultBody: body }))
    ).to.equal(body);
  });
  it('defaultIssues default', function() {
    expect(questionDefault('issues')).to.be.undefined;
  });
  it('defaultIssues options', function() {
    expect(
      questionDefault(
        'issues',
        customOptions({
          defaultIssues: issues
        })
      )
    ).to.equal(issues);
  });
});

describe('filter', function() {
  it('lowercase scope', () =>
    expect(questionFilter('scope', 'HelloMatt')).to.equal('hellomatt'));
});

describe('when', function() {
  it('breaking by default', () =>
    expect(questionWhen('breaking', {})).to.be.undefined);
  it('breaking when isBreaking', () =>
    expect(
      questionWhen('breaking', {
        isBreaking: true
      })
    ).to.be.true);
  it('issues by default', () =>
    expect(questionWhen('issues', {})).to.be.undefined);
  it('issues when isIssueAffected', () =>
    expect(
      questionWhen('issues', {
        isIssueAffected: true
      })
    ).to.be.true);
});

describe('commitlint config header-max-length', function() {
  //commitlint config parser only supports Node 6.0.0 and higher
  if (semver.gte(process.version, '6.0.0')) {
    function mockOptions(headerMaxLength) {
      var options = undefined;
      mock('./engine', function(opts) {
        options = opts;
      });
      if (headerMaxLength) {
        mock('cosmiconfig', function() {
          return {
            load: function(cwd) {
              return {
                filepath: cwd + '/.commitlintrc.js',
                config: {
                  rules: {
                    'header-max-length': [2, 'always', headerMaxLength]
                  }
                }
              };
            }
          };
        });
      }

      mock.reRequire('./index');
      try {
        return mock
          .reRequire('@commitlint/load')()
          .then(function() {
            return options;
          });
      } catch (err) {
        return Promise.resolve(options);
      }
    }

    afterEach(function() {
      delete require.cache[require.resolve('./index')];
      delete require.cache[require.resolve('@commitlint/load')];
      delete process.env.CZ_MAX_HEADER_WIDTH;
      mock.stopAll();
    });

    it('with no environment or commitizen config override', function() {
      return mockOptions(72).then(function(options) {
        expect(options).to.have.property('maxHeaderWidth', 72);
      });
    });

    it('with environment variable override', function() {
      process.env.CZ_MAX_HEADER_WIDTH = '105';
      return mockOptions(72).then(function(options) {
        expect(options).to.have.property('maxHeaderWidth', 105);
      });
    });

    it('with commitizen config override', function() {
      mock('commitizen', {
        configLoader: {
          load: function() {
            return {
              maxHeaderWidth: 103
            };
          }
        }
      });
      return mockOptions(72).then(function(options) {
        expect(options).to.have.property('maxHeaderWidth', 103);
      });
    });
  } else {
    //Node 4 doesn't support commitlint so the config value should remain the same
    it('default value for Node 4', function() {
      return mockOptions(72).then(function(options) {
        expect(options).to.have.property('maxHeaderWidth', 100);
      });
    });
  }
});

describe('questions', function() {
  it('default jira question', function() {
    expect(questionPrompt('jira')).to.be.eq('Enter JIRA issue (DAZ-12345):');
  });
  it('optional jira question', function() {
    expect(questionPrompt('jira', [], { jiraOptional: true })).to.be.eq(
      'Enter JIRA issue (DAZ-12345) (optional):'
    );
  });
  it('scope with list', function() {
    expect(
      questionPrompt('scope', [], { scopes: ['scope1', 'scope2'] })
    ).to.be.eq(
      'What is the scope of this change (e.g. component or file name): (select from the list)'
    );
  });
  it('scope without list', function() {
    expect(questionPrompt('scope')).to.be.eq(
      'What is the scope of this change (e.g. component or file name): (press enter to skip)'
    );
  });
});

function commitMessage(answers, options) {
  options = options || defaultOptions;
  var result = null;
  engine(options).prompter(
    {
      prompt: function(questions) {
        return {
          then: function(finalizer) {
            processQuestions(questions, answers, options);
            finalizer(answers);
          }
        };
      },
      registerPrompt: () => {}
    },
    function(message) {
      result = message;
    },
    true
  );
  return result;
}

function processQuestions(questions, answers, options) {
  for (var i in questions) {
    var question = questions[i];

    var answer = answers[question.name];
    var validation =
      answer === undefined || !question.validate
        ? true
        : question.validate(answer, answers);
    if (validation !== true) {
      throw new Error(
        validation ||
          `Answer '${answer}' to question '${question.name}' was invalid`
      );
    }
    if (question.filter && answer) {
      answers[question.name] = question.filter(answer);
    }
  }
}

function getQuestions(options) {
  options = options || defaultOptions;
  var result = null;
  engine(options).prompter({
    prompt: function(questions) {
      result = questions;
      return {
        then: function() {}
      };
    },
    registerPrompt: () => {}
  });
  return result;
}

function getQuestion(name, options) {
  options = options || defaultOptions;
  var questions = getQuestions(options);
  for (var i in questions) {
    if (questions[i].name === name) {
      return questions[i];
    }
  }
  return false;
}

function questionPrompt(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.message && typeof question.message === 'string'
    ? question.message
    : question.message(answers);
}

function questionTransformation(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return (
    question.transformer &&
    question.transformer(answers[name], answers, options)
  );
}

function questionFilter(name, answer, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return (
    question.filter &&
    question.filter(typeof answer === 'string' ? answer : answer[name])
  );
}

function questionDefault(name, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.default;
}

function questionWhen(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.when(answers);
}

function customOptions(options) {
  Object.keys(defaultOptions).forEach(key => {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  });
  return options;
}
