module.exports = {
  feat: {
    description: 'A new feature',
    title: 'Features'
  },
  fix: {
    description: 'A bug fix',
    title: 'Bug Fixes'
  },
  docs: {
    description: 'Documentation only changes',
    title: 'Documentation'
  },
  refactor: {
    description:
      'A code change that neither fixes a bug nor adds a feature (formatting, performance improvement, etc)',
    title: 'Code Refactoring'
  },
  test: {
    description: 'Adding missing tests or correcting existing tests',
    title: 'Tests'
  },
  build: {
    description:
      'Changes that affect the build system or external dependencies (npm, webpack, typescript)',
    title: 'Builds'
  },
  ci: {
    description:
      'Changes to our CI configuration files and scripts (NOTE: Does not bump the version)',
    title: 'Continuous Integrations'
  },
  chore: {
    description: "Other changes that don't modify src or test files",
    title: 'Chores'
  },
  revert: {
    description: 'Reverts a previous commit',
    title: 'Reverts'
  }
};
