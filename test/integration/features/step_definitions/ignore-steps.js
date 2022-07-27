import {promises as fs} from 'fs';
import {EOL} from 'os';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

Given('ignored directories are provided', async function () {
  this.ignoredDirectories = any.listOf(any.string);
});

Given('there is no ignore file', async function () {
  return undefined;
});

Given('a build directory is provided', async function () {
  this.buildDirectory = any.string();
});

Then('the provided directories are ignored', async function () {
  const ignoreContents = await fs.readFile(`${process.cwd()}/.eslintignore`, 'utf-8');
  const lines = ignoreContents.split(EOL);

  assert.includeMembers(lines, this.ignoredDirectories);
});

Then('the build directory is included in the ignore file', async function () {
  const ignoreContents = await fs.readFile(`${process.cwd()}/.eslintignore`, 'utf-8');
  const lines = ignoreContents.split(EOL);

  assert.includeMembers(lines, this.buildDirectory);
});
