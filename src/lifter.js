import deepmerge from 'deepmerge';

import {lift as liftConfig} from './config/index.js';
import {lift as liftIgnore} from './ignore/index.js';

export default async function lift(
  {projectRoot, results: {buildDirectory, eslint: {configs = [], ignore = {}} = {}}},
  {logger}
) {
  logger.info('Lifting ESLint');

  return deepmerge.all([
    ...await Promise.all([
      liftConfig({configs, projectRoot}, {logger}),
      liftIgnore({projectRoot, ignore, buildDirectory}, {logger})
    ]),
    {scripts: {'lint:js': 'eslint . --cache', 'lint:js:fix': "run-s 'lint:js -- --fix'"}}
  ]);
}
