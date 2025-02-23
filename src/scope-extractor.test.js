import any from '@travi/any';
import {describe, expect, it} from 'vitest';

import extractScope from './scope-extractor.js';

describe('scope extractor', () => {
  const scope = any.word();

  it('should return a simple string directly', async () => {
    expect(extractScope({extends: scope})).toBe(scope);
  });

  it('should return the scope when first in the `extends` list', async () => {
    expect(extractScope({extends: [scope, `${scope}/${any.word()}`]})).toBe(scope);
  });

  it('should return the scope when in the middle of the `extends` list', async () => {
    const scopedConfigFactory = () => `${scope}/${any.word()}`;

    expect(extractScope({
      extends: [
        ...any.listOf(scopedConfigFactory),
        scope,
        ...any.listOf(scopedConfigFactory)
      ]
    })).toBe(scope);
  });
});
