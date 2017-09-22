import Ember from 'ember';
import layout from '../templates/components/grouped-selections';
const { get, Component } = Ember;

export default Component.extend({
  layout,
  actions: {
    removeNodeOrLeaf() {
      get(this, 'removeNodeOrLeaf')(...arguments);
    }
  }
});
