import {assert} from 'chai';
import any from '@travi/any';

import extractScope from './scope-extractor.js';

suite('scope extractor', () => {
  const scope = any.word();

  test('that a simple string is returned directly', () => {
    assert.equal(extractScope({extends: scope}), scope);
  });

  test('that the scope is returned when first in the `extends` list', () => {
    assert.equal(extractScope({extends: [scope, `${scope}/${any.word()}`]}), scope);
  });

  test('that the scope is returned when in the middle of the `extends` list', () => {
    const scopedConfigFactory = () => `${scope}/${any.word()}`;
    assert.equal(
      extractScope({extends: [...any.listOf(scopedConfigFactory), scope, ...any.listOf(scopedConfigFactory)]}),
      scope
    );
  });
});
