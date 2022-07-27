import {resolve} from 'path';
import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';

let scaffold, lift;
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));
const packagePreviewDirectory = '../__package_previews__/eslint';

Before(function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, scaffold} = require('@form8ion/eslint'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    [packagePreviewDirectory]: {
      '@form8ion': {
        eslint: {
          node_modules: {
            ...stubbedNodeModules,
            '.pnpm': {
              node_modules: stubbedNodeModules,
              'ansi-styles@4.3.0': {
                node_modules: stubbedNodeModules
              }
            }
          }
        }
      }
    }
  });
});

After(function () {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  await scaffold({
    projectRoot: process.cwd(),
    scope: this.eslintConfigScope,
    ignore: {directories: this.ignoredDirectories}
  });
});

When('the project is lifted', async function () {
  this.result = await lift({
    projectRoot: process.cwd(),
    configs: this.additionalShareableConfigs,
    buildDirectory: this.buildDirectory
  });
});
