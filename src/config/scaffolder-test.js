import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';

import * as writer from './writer.js';
import scaffold from './scaffolder.js';

suite('config scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(writer, 'default');
  });

  teardown(() => sandbox.restore());
  test('that the config file is created', async () => {
    const projectRoot = any.string();
    const scope = any.word();

    await scaffold({projectRoot, scope});

    assert.calledWith(writer.default, {path: projectRoot, config: {root: true, extends: scope}});
  });
});
