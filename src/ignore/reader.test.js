import {read} from '@form8ion/ignore-file';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import readIgnoreFile from './reader.js';

vi.mock('@form8ion/ignore-file');

describe('ignore file reader', () => {
  const projectRoot = any.string();

  it('should load existing entries from the ignore file', async () => {
    const existingIgnores = any.listOf(any.word);
    when(read).calledWith({projectRoot, name: 'eslint'}).thenResolve(existingIgnores);

    expect(await readIgnoreFile({projectRoot})).toEqual(existingIgnores);
  });
});
