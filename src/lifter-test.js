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
    ignoreLifter.default.withArgs({projectRoot, buildDirectory}).resolves(ignoreResults);
    deepmerge.all.withArgs([configResults, ignoreResults]).returns(results);

    assert.deepEqual(await lift({configs, projectRoot, buildDirectory}), results);
  });

  test('that no changes made when no config exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.eslintrc.yml`).resolves(false);

    assert.deepEqual(await lift({configs, projectRoot}), {});
  });
});
