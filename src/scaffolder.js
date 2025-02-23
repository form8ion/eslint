import {scaffold as scaffoldConfig} from './config/index.js';

export default async function ({projectRoot, config: {scope}}) {
  await scaffoldConfig({projectRoot, scope});

  return {
    dependencies: {javascript: {development: [`${scope}/eslint-config`]}},
    vcsIgnore: {files: ['.eslintcache']}
  };
}
