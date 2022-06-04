import {fileTypes} from '@form8ion/core';
import {write} from '@form8ion/config-file';

export default function ({path, config}) {
  return write({name: 'eslint', format: fileTypes.YAML, path, config});
}
