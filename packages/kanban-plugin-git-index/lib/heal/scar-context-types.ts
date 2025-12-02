export interface ScarEvent {
  timestamp: Date;
  operation: string;
  details: Record<string, unknown>;
  severity: string;
}

export interface ScarContext {
  reason: string;
  eventLog: ScarEvent[];
  previousScars: unknown[];
  searchResults: Array<{
    taskId: string;
    title: string;
    relevance: number;
    snippet: string;
  }>;
  metadata: { tag: string; narrative?: string };
  llmOperations: Array<Record<string, unknown>>;
  gitHistory: unknown[];
}
