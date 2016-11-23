import Ember from 'ember';
import layout from '../templates/components/tree-options';

const { get, Component } = Ember;

export default Component.extend({
  layout,
  tagName: 'ul',
  classNames: ['ember-power-select-tree-list'],
  actions: {
    onToggleGroup() {
      get(this, 'onToggleGroup')(...arguments);
    },
    handleChecked() {
      get(this, 'handleChecked')(...arguments);
    }
  }
});
