import { get } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/tree-options';

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
