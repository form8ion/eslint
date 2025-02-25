import {promises as fs} from 'node:fs';
import {EOL} from 'node:os';

import any from '@travi/any';
import {it, describe, vi, expect} from 'vitest';

import writeIgnoreFile from './writer.js';

vi.mock('node:fs');

describe('ignore file writer', () => {
  it('should write the ignore file, removing duplicate entries', async () => {
    const projectRoot = any.string();
    const duplicateIgnores = any.listOf(any.word);
    const singularIgnores = any.listOf(any.word);
    const ignores = [...duplicateIgnores, ...singularIgnores, ...duplicateIgnores];

    await writeIgnoreFile({projectRoot, ignores});

    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/.eslintignore`,
      [...duplicateIgnores, ...singularIgnores].join(EOL)
    );
  });
});
