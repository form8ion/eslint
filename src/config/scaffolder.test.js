import any from '@travi/any';
import {it, describe, vi, expect} from 'vitest';

import writeConfig from './writer.js';
import scaffold from './scaffolder.js';

vi.mock('./writer.js');

describe('config scaffolder', () => {
  it('should create the config file', async () => {
    const projectRoot = any.string();
    const scope = any.word();

    await scaffold({projectRoot, scope});

    expect(writeConfig).toHaveBeenCalledWith({path: projectRoot, config: {root: true, extends: scope}});
  });
});
