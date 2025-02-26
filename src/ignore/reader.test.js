import {promises as fs} from 'node:fs';
import {EOL} from 'node:os';

import any from '@travi/any';
import {expect, describe, it, vi} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import readIgnoreFile from './reader.js';

vi.mock('node:fs');

describe('ignore file reader', () => {
  const projectRoot = any.string();

  it('should load existing entries from the ignore file', async () => {
    const existingIgnores = any.listOf(any.word);
    const existingIgnoreContent = existingIgnores.join(EOL);
    when(fs.readFile).calledWith(`${projectRoot}/.eslintignore`, 'utf-8').thenResolve(existingIgnoreContent);

    expect(await readIgnoreFile({projectRoot})).toEqual(existingIgnores);
  });
});
