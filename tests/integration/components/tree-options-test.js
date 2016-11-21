import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tree-options', 'Integration | Component | tree options', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{tree-options}}`);
  assert.equal(this.$().text().trim(), '');
});
