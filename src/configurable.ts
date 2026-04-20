import engine = require('./engine');
import defaults = require('./defaults');
import type { Options } from './options';

function configurable(overriddenOptions: Partial<Options>): engine.Prompter {
  return engine({ ...defaults, ...overriddenOptions } as Options);
}

export = configurable;
