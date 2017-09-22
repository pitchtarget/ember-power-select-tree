import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('grouped-selections', 'Integration | Component | grouped selections', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{grouped-selections}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#grouped-selections}}
      template block text
    {{/grouped-selections}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
