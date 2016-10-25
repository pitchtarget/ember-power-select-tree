import Ember from 'ember';
import layout from '../templates/components/tree-options';
import OptionsComponent from 'ember-power-select/components/power-select/options';

export default Ember.Component.extend({
  layout,

  actions: {
    onToggleGroup(node) {
      this.sendAction('onToggleGroup', node);
    }
  }
});
