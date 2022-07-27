import deepmerge from 'deepmerge';
import {fileExists} from '@form8ion/core';
import {info, warn} from '@travi/cli-messages';

import {lift as liftConfig} from './config';
import {lift as liftIgnore} from './ignore';

export default async function ({projectRoot, configs, buildDirectory}) {
  if (!await fileExists(`${projectRoot}/.eslintrc.yml`)) {
    warn('No existing configuration found for ESLint. Skipping configuration extension');

    return {};
  }

  info('Lifting ESLint');

  return deepmerge.all(await Promise.all([
    liftConfig({configs, projectRoot}),
    liftIgnore({projectRoot, buildDirectory})
  ]));
}
