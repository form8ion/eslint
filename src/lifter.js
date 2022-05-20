import {fileExists} from '@form8ion/core';
import {warn} from '@travi/cli-messages';
import liftConfig from './config-lifter';

export default async function ({projectRoot, configs}) {
  if (!await fileExists(`${projectRoot}/.eslintrc.yml`)) {
    warn('No existing configuration found for ESLint. Skipping configuration extension');

    return {};
  }

  return liftConfig({configs, projectRoot});
}
