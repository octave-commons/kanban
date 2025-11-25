import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { CommandHandler } from '../types.js';

type SectionResult = string | undefined;

const parseSectionFlag = (tokens: ReadonlyArray<string>): string | undefined => {
  for (const [index, token] of tokens.entries()) {
    if (token === '--section') {
      return tokens[index + 1];
    }
    if (token.startsWith('--section=')) {
      const value = token.slice('--section='.length);
      if (value.length > 0) {
        return value;
      }
    }
  }
  return undefined;
};

const extractSection = (content: string, section: string): SectionResult => {
  const sectionRegex = new RegExp(
    `^#{1,3}\\s+.*${section}.*$[\\s\\S]*?(?=\\n#{1,3}\\s+|\\n$|$)`,
    'im',
  );
  const match = content.match(sectionRegex);
  return match ? match[0].trim() : undefined;
};

const resolveProcessPath = (): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, '../../../..');
  return path.join(repoRoot, 'docs/agile/process.md');
};

const handleProcess: CommandHandler = async (args) => {
  const section = parseSectionFlag(args);
  const processDocPath = resolveProcessPath();

  try {
    const processContent = await readFile(processDocPath, 'utf8');

    if (section) {
      const extracted = extractSection(processContent, section);
      if (extracted) {
        console.log(extracted);
      } else {
        console.error(`Section "${section}" not found in process document`);
        console.log('Available sections:');
        const sections = processContent.match(/^#{1,3}\s+(.+)$/gm) || [];
        sections.forEach((s) => console.log(`  - ${s.replace(/^#{1,3}\s+/, '')}`));
        process.exit(1);
      }
      return null;
    }

    console.log('# 📋 Promethean Development Process');
    console.log('');
    console.log(
      'This document outlines the 6-step workflow for task development in the Promethean framework.',
    );
    console.log('Use --section <name> to view specific sections.');
    console.log('');
    console.log('Available sections: overview, fsm, transitions, blocking');
    console.log('');
    console.log('--- Full Process Document ---');
    console.log('');
    console.log(processContent);
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error reading process document: ${message}`);
    process.exit(1);
  }
};

const handleShowProcess: CommandHandler = async () => {
  const section = 'overview';
  const processDocPath = resolveProcessPath();

  try {
    const processContent = await readFile(processDocPath, 'utf8');
    const match = extractSection(processContent, section);

    if (match) {
      console.log(match);
    } else {
      console.log('# 📋 Promethean Development Process');
      console.log('');
      console.log(
        'This document outlines the 6-step workflow for task development in the Promethean framework.',
      );
      console.log('');
      console.log(
        'Key transitions: Incoming→Accepted→Breakdown→Ready→Todo→In Progress→Review→Document→Done',
      );
      console.log('');
      console.log('For detailed process information, see: docs/agile/process.md');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error reading process document: ${message}`);
  }

  return null;
};

export { handleProcess, handleShowProcess };
