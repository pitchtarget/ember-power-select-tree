import { get } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/grouped-selections';

export default Component.extend({
  layout,
  actions: {
    removeNodeOrLeaf() {
      get(this, 'removeNodeOrLeaf')(...arguments);
    }
  }
});
