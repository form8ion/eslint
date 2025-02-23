import {fileExists} from '@form8ion/core';

import {it, expect, vi, describe} from 'vitest';
import any from '@travi/any';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import configFileExists from './predicate.js';

vi.mock('@form8ion/core');

describe('predicate', () => {
  const projectRoot = any.string();

  it('should return `true` when a config file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.eslintrc.yml`).thenResolve(true);

    expect(await configFileExists({projectRoot})).toBe(true);
  });

  it('should return `false` when a config file does not exist', async () => {
    when(fileExists).calledWith(`${projectRoot}/.eslintrc.yml`).thenResolve(false);

    expect(await configFileExists({projectRoot})).toBe(false);
  });
});
