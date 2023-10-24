import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as configScaffolder from './config/scaffolder.js';
import * as ignoreScaffolder from './ignore/scaffolder.js';
import scaffold from './scaffolder.js';

suite('scaffolder', () => {
  let sandbox;
  const packageName = any.word();
  const scope = `@${any.string()}`;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(configScaffolder, 'default');
    sandbox.stub(ignoreScaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the dependency is installed if the config is defined', async () => {
    const result = await scaffold({config: {scope}});

    assert.deepEqual(result.devDependencies, [`${scope}/eslint-config`]);
  });

  test('that the scripts are defined', async () => {
    assert.deepEqual(
      (await scaffold({config: {packageName}})).scripts,
      {
        'lint:js': 'eslint . --cache',
        'lint:js:fix': 'run-s lint:js -- --fix'
      }
    );
  });

  test('that the cache file is ignored from version control', async () => {
    const result = await scaffold({config: {packageName}});

    assert.deepEqual(result.vcsIgnore.files, ['.eslintcache']);
  });

  test('that the base config is added to the root of the project if the config scope is provided', async () => {
    const projectRoot = any.string();

    await scaffold({projectRoot, config: {scope}});

    assert.calledWith(configScaffolder.default, {projectRoot, scope});
  });
});
