import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('power-select-tree', 'Integration | Component | power select tree', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{power-select-tree}}`);
  assert.equal(this.$().text().trim(), '');
});
