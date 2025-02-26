import {write} from '@form8ion/ignore-file';

export default async function writeIgnoreFile({projectRoot, ignores}) {
  await write({projectRoot, name: 'eslint', ignores: [...new Set(ignores)]});
}
