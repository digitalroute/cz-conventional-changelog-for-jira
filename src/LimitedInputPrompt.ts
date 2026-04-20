import chalk from 'chalk';
/**
 * Inquirer is pinned at v8: this file extends the internal class at `inquirer/lib/prompts/input`, which was removed in v9+ (migrated to
 * function-based hooks via @inquirer/core). Upgrading is also blocked by commitizen v4 itself depending on inquirer v8 and passing its
 * instance as the `cz` parameter to this adapter.
 */
import InputPrompt = require('inquirer/lib/prompts/input');

interface LimitedInputOpt {
  maxLength: number;
  leadingLabel?: string | ((answers: Record<string, unknown>) => string);
}

class LimitedInputPrompt extends InputPrompt {
  private spacer!: string;
  private leadingLabel!: string;
  private leadingLength!: number;

  constructor(...args: ConstructorParameters<typeof InputPrompt>) {
    super(...args);

    const opt = this.opt as unknown as LimitedInputOpt;
    if (!opt.maxLength) {
      this.throwParamError('maxLength');
    }
    this.spacer = new Array(opt.maxLength).fill('-').join('');

    if (opt.leadingLabel) {
      if (typeof opt.leadingLabel === 'function') {
        this.leadingLabel =
          ' ' + opt.leadingLabel(this.answers as Record<string, unknown>);
      } else {
        this.leadingLabel = ' ' + opt.leadingLabel;
      }
    } else {
      this.leadingLabel = '';
    }

    this.leadingLength = this.leadingLabel.length;
  }

  remainingChar(): number {
    const opt = this.opt as unknown as LimitedInputOpt;
    const rl = this.rl as unknown as { line: string; cursor: number };
    return opt.maxLength - this.leadingLength - rl.line.length;
  }

  onKeypress(): void {
    const opt = this.opt as unknown as LimitedInputOpt;
    const rl = this.rl as unknown as { line: string; cursor: number };
    if (rl.line.length > opt.maxLength - this.leadingLength) {
      rl.line = rl.line.slice(0, opt.maxLength - this.leadingLength);
      rl.cursor--;
    }

    this.render();
  }

  getCharsLeftText(): string {
    const chars = this.remainingChar();

    if (chars > 15) {
      return chalk.green(`${chars} chars left`);
    } else if (chars > 5) {
      return chalk.yellow(`${chars} chars left`);
    } else {
      return chalk.red(`${chars} chars left`);
    }
  }

  render(error?: string): void {
    let bottomContent = '';
    let message = this.getQuestion();
    let appendContent = '';
    const isFinal = this.status === 'answered';

    if (isFinal) {
      appendContent = (this as unknown as { answer: string }).answer;
    } else {
      appendContent = (this.rl as unknown as { line: string }).line;
    }

    message = `${message}
  [${this.spacer}] ${this.getCharsLeftText()}
  ${this.leadingLabel} ${appendContent}`;

    if (error) {
      bottomContent = chalk.red('>> ') + error;
    }

    this.screen.render(message, bottomContent);
  }
}

export = LimitedInputPrompt;
