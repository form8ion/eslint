// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {lift, scaffold} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

(async () => {
  await scaffold({projectRoot: process.cwd(), config: {scope: '@foo'}});

  await lift({
    projectRoot: process.cwd(),
    results: {
      eslint: {configs: ['mocha', 'react'], ignore: {directories: []}},
      buildDirectory: 'lib'
    }
  });
})();
