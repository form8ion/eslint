import core from '@form8ion/core';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import configFileExists from './predicate';

suite('predicate', () => {
  const projectRoot = any.string();
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned when a config file exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.eslintrc.yml`).resolves(true);

    assert.isTrue(await configFileExists({projectRoot}));
  });

  test('that `false` is returned when a config file does not exist', async () => {
    core.fileExists.resolves(false);

    assert.isFalse(await configFileExists({projectRoot}));
  });
});
