import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';

let scaffold, lift;
const __dirname = dirname(fileURLToPath(import.meta.url));
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(async function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, scaffold} = await import('@form8ion/eslint'));

  stubbedFs({node_modules: stubbedNodeModules});
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
