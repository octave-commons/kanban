export class CommandUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommandUsageError';
  }
}

export class CommandNotFoundError extends Error {
  constructor(command: string) {
    super(`Unknown subcommand: ${command}`);
    this.name = 'CommandNotFoundError';
  }
}
