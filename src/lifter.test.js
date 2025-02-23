import deepmerge from 'deepmerge';
import {fileExists} from '@form8ion/core';

import any from '@travi/any';
import {expect, it, vi, describe} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import {lift as liftConfig} from './config/index.js';
import {lift as liftIgnore} from './ignore/index.js';
import lift from './lifter.js';

vi.mock('deepmerge');
vi.mock('@form8ion/core');
vi.mock('./config/index.js');
vi.mock('./ignore/index.js');

describe('lifter', () => {
  const configs = any.listOf(any.word);
  const ignore = any.simpleObject();
  const projectRoot = any.string();
  const buildDirectory = any.string();

  it('should lift the existing config', async () => {
    const mergedResults = any.simpleObject();
    const configResults = any.simpleObject();
    const ignoreResults = any.simpleObject();
    when(fileExists).calledWith(`${projectRoot}/.eslintrc.yml`).thenResolve(true);
    when(liftConfig).calledWith({configs, projectRoot}).thenResolve(configResults);
    when(liftIgnore).calledWith({projectRoot, buildDirectory, ignore}).thenResolve(ignoreResults);
    when(deepmerge.all)
      .calledWith([
        configResults,
        ignoreResults,
        {scripts: {'lint:js': 'eslint . --cache', 'lint:js:fix': "run-s 'lint:js -- --fix'"}}
      ])
      .thenReturn(mergedResults);

    expect(await lift({projectRoot, results: {eslint: {configs, ignore}, buildDirectory}})).toEqual(mergedResults);
  });

  it('should not result in an error when `eslint` does not exist in the results', async () => {
    await lift({projectRoot, results: {buildDirectory}});

    expect(liftIgnore).toHaveBeenCalledWith({projectRoot, buildDirectory, ignore: {}});
  });
});
