import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const srcDirPath = fileURLToPath(new URL('../src', import.meta.url));
const tokenPattern = /--[A-Za-z0-9-]+(?=\s*:)/g;
const seenTokens = new Map();
const errors = [];

const fileNames = (await readdir(srcDirPath)).filter((fileName) => fileName.endsWith('.css'));

for (const fileName of fileNames) {
  const filePath = join(srcDirPath, fileName);
  const content = await readFile(filePath, 'utf8');
  const tokens = content.match(tokenPattern) ?? [];

  if (tokens.length === 0) {
    errors.push(`${fileName}: no design token declarations found`);
    continue;
  }

  for (const token of tokens) {
    const previousFileName = seenTokens.get(token);

    if (previousFileName) {
      errors.push(`${token}: declared in both ${previousFileName} and ${fileName}`);
      continue;
    }

    seenTokens.set(token, fileName);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
