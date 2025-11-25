export type CommandGroup = {
  name: string;
  description: string;
  commands: string[];
};

export const COMMAND_GROUPS: CommandGroup[] = [
  {
    name: 'board',
    description: 'Board operations',
    commands: ['push', 'pull', 'sync', 'regenerate', 'count', 'audit', 'ui', 'dev'],
  },
  {
    name: 'task',
    description: 'Task operations',
    commands: ['create', 'update', 'delete', 'list', 'find', 'search'],
  },
  {
    name: 'heal',
    description: 'Healing and scar operations',
    commands: ['heal'],
  },
  {
    name: 'wip',
    description: 'Work-in-progress management',
    commands: [
      'enforce-wip-limits',
      'wip-monitor',
      'wip-compliance',
      'wip-violations',
      'wip-suggestions',
    ],
  },
];
