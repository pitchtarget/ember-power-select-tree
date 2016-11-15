import Ember from 'ember';
import layout from '../templates/components/tree-options';

const { get, Component } = Ember;

export default Component.extend({
  layout,
  tagName: 'ul',
  classNames: ['ember-power-select-tree-list', 'listClass'],
  listClass: '',
  groupClass: '',
  groupNameClass: '',
  optionsClass: '',
  optionClass: '',
  actions: {
    onToggleGroup(node) {
      get(this, 'onToggleGroup')(node);
    },
    handleChecked(node) {
      get(this, 'handleChecked')(node);
    }
  }
});
