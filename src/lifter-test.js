import * as core from '@form8ion/core';
import deepmerge from 'deepmerge';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as configLifter from './config/lifter.js';
import * as ignoreLifter from './ignore/lifter.js';
import lift from './lifter.js';

suite('lifter', () => {
  let sandbox;
  const configs = any.listOf(any.word);
  const ignore = any.simpleObject();
  const projectRoot = any.string();
  const buildDirectory = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
    sandbox.stub(configLifter, 'default');
    sandbox.stub(ignoreLifter, 'default');
    sandbox.stub(deepmerge, 'all');
  });

  teardown(() => sandbox.restore());

  test('that the existing config is lifted', async () => {
    const mergedResults = any.simpleObject();
    const configResults = any.simpleObject();
    const ignoreResults = any.simpleObject();
    core.fileExists.withArgs(`${projectRoot}/.eslintrc.yml`).resolves(true);
    configLifter.default.withArgs({configs, projectRoot}).resolves(configResults);
    ignoreLifter.default.withArgs({projectRoot, buildDirectory, ignore}).resolves(ignoreResults);
    deepmerge.all
      .withArgs([
        configResults,
        ignoreResults,
        {scripts: {'lint:js': 'eslint . --cache', 'lint:js:fix': "run-s 'lint:js -- --fix'"}}
      ])
      .returns(mergedResults);

    assert.deepEqual(
      await lift({projectRoot, results: {eslint: {configs, ignore}, buildDirectory}}),
      mergedResults
    );
  });

  test('that `eslint` not existing in the results does not result in an error', async () => {
    await lift({projectRoot, results: {buildDirectory}});

    assert.calledWith(ignoreLifter.default, {projectRoot, buildDirectory, ignore: {}});
  });
});
