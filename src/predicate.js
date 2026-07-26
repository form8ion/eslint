import {fileExists} from '@form8ion/core';

export default function eslintInUse({projectRoot}) {
  return fileExists(`${projectRoot}/.eslintrc.yml`);
}
