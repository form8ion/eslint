import any from '@travi/any';
import {expect, it, describe, vi} from 'vitest';

import {scaffold as scaffoldConfig} from './config/index.js';
import scaffold from './scaffolder.js';

vi.mock('./config/index.js');

describe('scaffolder', () => {
  const scope = `@${any.string()}`;
  const projectRoot = any.string();

  it('should scaffold the eslint details', async () => {
    const {dependencies, vcsIgnore} = await scaffold({projectRoot, config: {scope}});

    expect(dependencies.javascript.development).toEqual([`${scope}/eslint-config`]);
    expect(vcsIgnore.files).toEqual(['.eslintcache']);
    expect(scaffoldConfig).toHaveBeenCalledWith({projectRoot, scope});
  });
});
