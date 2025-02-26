import {exists} from '@form8ion/ignore-file';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import ignoreFileExists from './predicate.js';

vi.mock('@form8ion/ignore-file');

describe('ignore file predicate', () => {
  const projectRoot = any.string();

  it('should return `true` if the ignore file exists', async () => {
    when(exists).calledWith({projectRoot, name: 'eslint'}).thenResolve(true);

    expect(await ignoreFileExists({projectRoot})).toBe(true);
  });

  it('should return `false` if the ignore file exists', async () => {
    when(exists).calledWith({projectRoot, name: 'eslint'}).thenResolve(false);

    expect(await ignoreFileExists({projectRoot})).toBe(false);
  });
});
