import {scaffold as scaffoldConfig} from './config';
import {scaffold as scaffoldIgnore} from './ignore';

export default async function ({projectRoot, scope, ignore}) {
  await Promise.all([
    scaffoldConfig({projectRoot, scope}),
    scaffoldIgnore({projectRoot, ignore})
  ]);

  return {
    devDependencies: [`${scope}/eslint-config`],
    scripts: {
      'lint:js': 'eslint . --cache',
      'lint:js:fix': 'run-s lint:js -- --fix'
    },
    vcsIgnore: {files: ['.eslintcache']}
  };
}
