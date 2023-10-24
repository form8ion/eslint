import {fileTypes} from '@form8ion/core';
import * as configFile from '@form8ion/config-file';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import writeConfig from './writer.js';

suite('config writer', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(configFile, 'write');
  });

  teardown(() => sandbox.restore());

  test('that the rc writer is informed that this deals with the config for eslint', async () => {
    const path = any.string();
    const config = any.simpleObject();

    await writeConfig({path, config});

    assert.calledWith(configFile.write, {name: 'eslint', format: fileTypes.YAML, path, config});
  });
});
