import {fileExists} from '@form8ion/core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import ignoreFileExists from './predicate.js';

vi.mock('@form8ion/core');

describe('ignore file predicate', () => {
  const projectRoot = any.string();

  it('should return `true` if the ignore file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.eslintignore`).thenResolve(true);

    expect(await ignoreFileExists({projectRoot})).toBe(true);
  });

  it('should return `false` if the ignore file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.eslintignore`).thenResolve(false);

    expect(await ignoreFileExists({projectRoot})).toBe(false);
  });
});
