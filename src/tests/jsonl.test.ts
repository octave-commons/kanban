import test from 'ava';

import { printJSONL } from '../lib/jsonl.js';

const captureStdout = (t: import('ava').ExecutionContext): string[] => {
  const writes: string[] = [];
  const originalWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = ((chunk: string | Uint8Array) => {
    writes.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'));
    return true;
  }) as typeof process.stdout.write;

  t.teardown(() => {
    process.stdout.write = originalWrite;
  });

  return writes;
};

test('printJSONL writes a single JSON line for objects', (t) => {
  const output = captureStdout(t);
  const payload = { ok: true, count: 2 };

  printJSONL(payload);

  t.is(output.length, 1);
  t.is(output[0], `${JSON.stringify(payload)}\n`);
});

test('printJSONL writes a JSON line per array entry', (t) => {
  const output = captureStdout(t);
  const payload = [{ id: 1 }, { id: 2 }];

  printJSONL(payload);

  t.deepEqual(output, payload.map((item) => `${JSON.stringify(item)}\n`));
});
