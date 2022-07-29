import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';

let scaffold, lift, test;
const __dirname = dirname(fileURLToPath(import.meta.url));
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(async function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, scaffold, test} = await import('@form8ion/eslint'));

  stubbedFs({node_modules: stubbedNodeModules});
});

After(function () {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  await scaffold({
    projectRoot: process.cwd(),
    config: {scope: this.eslintConfigScope}
  });
});

When('the project is lifted', async function () {
  const projectRoot = process.cwd();

  if (await test({projectRoot})) {
    this.result = await lift({
      projectRoot,
      configs: this.additionalShareableConfigs,
      buildDirectory: this.buildDirectory
    });
  }
});
