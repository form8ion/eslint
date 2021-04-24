import {resolve} from 'path';
import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';

let scaffold, lift;
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, scaffold} = require('@form8ion/eslint'));

  stubbedFs({
    node_modules: stubbedNodeModules
  });
});

After(function () {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  await scaffold({projectRoot: process.cwd()});
});

When('the project is lifted', async function () {
  this.result = await lift({projectRoot: process.cwd(), configs: this.additionalShareableConfigs});
});
