import {exists} from '@form8ion/ignore-file';

export default function ignoreFileExists({projectRoot}) {
  return exists({projectRoot, name: 'eslint'});
}
