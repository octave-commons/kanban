export interface Task {
  uuid: string;
  title: string;
  status: string;
  priority: string;
  labels: string[];
  created_at: Date;
  updated_at: Date;
  estimates: Record<string, string>;
}
