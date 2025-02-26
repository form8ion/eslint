import {write} from '@form8ion/ignore-file';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import writeIgnoreFile from './writer.js';

vi.mock('@form8ion/ignore-file');

describe('ignore file writer', () => {
  it('should write the ignore file, removing duplicate entries', async () => {
    const projectRoot = any.string();
    const duplicateIgnores = any.listOf(any.word);
    const singularIgnores = any.listOf(any.word);
    const ignores = [...duplicateIgnores, ...singularIgnores, ...duplicateIgnores];

    await writeIgnoreFile({projectRoot, ignores});

    expect(write).toHaveBeenCalledWith({
      projectRoot,
      name: 'eslint',
      ignores: [...duplicateIgnores, ...singularIgnores]
    });
  });
});
