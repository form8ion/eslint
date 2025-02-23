import {fileTypes} from '@form8ion/core';
import {write} from '@form8ion/config-file';

import any from '@travi/any';
import {it, vi, describe, expect} from 'vitest';

import writeConfig from './writer.js';

vi.mock('@form8ion/config-file');

describe('config writer', () => {
  it('should inform the rc writer that this deals with the config for eslint', async () => {
    const path = any.string();
    const config = any.simpleObject();

    await writeConfig({path, config});

    expect(write).toHaveBeenCalledWith({name: 'eslint', format: fileTypes.YAML, path, config});
  });
});
