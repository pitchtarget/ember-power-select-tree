import Ember from 'ember';
import layout from '../templates/components/tree-options';

export default Ember.Component.extend({
  layout,

  actions: {
    onToggleGroup(node) {
      this.sendAction('onToggleGroup', node);
    }
  }
});
