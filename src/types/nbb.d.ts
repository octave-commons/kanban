declare module 'nbb' {
  export function loadFile(path: string): Promise<Record<string, unknown>>;
  export function loadString(code: string, opts?: Record<string, unknown>): Promise<unknown>;
}
