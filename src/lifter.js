import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';

import {lift as liftConfig} from './config';
import {lift as liftIgnore} from './ignore';

export default async function ({
  projectRoot,
  results: {buildDirectory, eslint: {configs = [], ignore = {}} = {}}
}) {
  info('Lifting ESLint');

  return deepmerge.all(await Promise.all([
    liftConfig({configs, projectRoot}),
    liftIgnore({projectRoot, ignore, buildDirectory})
  ]));
}
