export type CliContext = Readonly<{
  readonly boardFile: string;
  readonly tasksDir: string;
  readonly argv: ReadonlyArray<string>;
}>;

export type CommandResult = unknown;

export type CommandHandler = (
  args: ReadonlyArray<string>,
  context: CliContext,
) => Promise<CommandResult>;
