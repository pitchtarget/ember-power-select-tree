import Ember from 'ember';
import layout from '../templates/components/tree-options';

const { get, Component } = Ember;

export default Component.extend({
  layout,
  actions: {
    onToggleGroup(node) {
      get(this, 'onToggleGroup')(node);
    },
    handleChecked(node) {
      get(this, 'handleChecked')(node);
    }
  }
});
