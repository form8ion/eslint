import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';

import {lift as liftConfig} from './config';
import {lift as liftIgnore} from './ignore';

export default async function ({
  projectRoot,
  results: {buildDirectory, /* eslintConfigs = [], */ eslint: {configs = [], ignore = {}} = {}}
}) {
  info('Lifting ESLint');

  // const normalizedConfigs = [...eslintConfigs, ...configs];
  const normalizedConfigs = [...configs];

  return deepmerge.all(await Promise.all([
    liftConfig({configs: normalizedConfigs, projectRoot}),
    liftIgnore({projectRoot, ignore, buildDirectory})
  ]));
}
