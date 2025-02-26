import {exists} from '@form8ion/ignore-file';

export default function ({projectRoot}) {
  return exists({projectRoot, name: 'eslint'});
}
