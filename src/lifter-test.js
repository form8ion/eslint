import * as core from '@form8ion/core';
import deepmerge from 'deepmerge';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as configLifter from './config/lifter';
import * as ignoreLifter from './ignore/lifter';
import lift from './lifter';

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
    const results = any.simpleObject();
    const configResults = any.simpleObject();
    const ignoreResults = any.simpleObject();
    core.fileExists.withArgs(`${projectRoot}/.eslintrc.yml`).resolves(true);
    configLifter.default.withArgs({configs, projectRoot}).resolves(configResults);
    ignoreLifter.default.withArgs({projectRoot, buildDirectory, ignore}).resolves(ignoreResults);
    deepmerge.all.withArgs([configResults, ignoreResults]).returns(results);

    assert.deepEqual(
      await lift({projectRoot, results: {eslint: {configs, ignore}, buildDirectory}}),
      results
    );
  });

  test('that `eslint` not existing in the results does not result in an error', async () => {
    await lift({projectRoot, results: {buildDirectory}});

    assert.calledWith(ignoreLifter.default, {projectRoot, buildDirectory, ignore: {}});
  });
});
