import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set, Component } = Ember;

export default Component.extend({
  layout,
  _collapsableOption(opt) {
    const component = this;
    const isSelectable = get(opt, 'isSelectable');
    const groupName = get(opt, 'groupName');
    const options = get(opt, 'options') || [];
    const isCollapsed = get(opt, 'isCollapsed') || true;
    if (groupName) {
      return {
        nodeName: groupName,
        options: options.map(component._collapsableOption.bind(component)),
        isSelectable,
        isCollapsed,
      };
    }

    set(opt, 'isSelectable', true);
    return opt;
  },

  init() {
    this._super(...arguments);
    const component = this;
    set(this, 'currentOptions', get(component, 'treeOptions').map(component._collapsableOption.bind(component)));
  },

  // TODO: update currentOptions by merging updated treeOptions
  // didReceiveAttrs({newAttrs}) {
  //   this._super(...arguments);
  //   if (newAttrs.treeOptions) {
  //     set(this, 'currentOptions', this.remapTreeOptions());
  //   }
  // },

  actions: {
    onToggleGroup(nodeOrLeaf) {
      if (nodeOrLeaf.nodeName) {
        set(nodeOrLeaf, 'isCollapsed', !get(nodeOrLeaf, 'isCollapsed'));
      }
    },
    handleChecked(nodeOrLeaf) {
    }
  }
});
