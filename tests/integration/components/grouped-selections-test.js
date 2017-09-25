import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('grouped-selections', 'Integration | Component | grouped selections', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{grouped-selections}}`);

  assert.equal(this.$().text().trim(), '');
});
