import {read} from '@form8ion/ignore-file';

export default async function readIgnoreFile({projectRoot}) {
  return read({projectRoot, name: 'eslint'});
}
