import {promises as fs} from 'fs';
import {load} from 'js-yaml';
import {fileExists} from '@form8ion/core';
import {warn} from '@travi/cli-messages';
import liftConfig from './config-lifter';

export default async function ({projectRoot, configs}) {
  const pathToExistingConfig = `${projectRoot}/.eslintrc.yml`;

  if (!await fileExists(pathToExistingConfig)) {
    warn('No existing configuration found for ESLint. Skipping configuration extension');

    return {};
  }

  const existingConfig = load(await fs.readFile(pathToExistingConfig, 'utf-8'));

  return liftConfig({configs, scope: existingConfig.extends});
}
