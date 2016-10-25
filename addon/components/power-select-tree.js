import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set } = Ember;

export default Ember.Component.extend({
  layout,
  treeOptions: [
    { groupName: 'Interests', options: [
        {key: 1, label: 'one'},
        {key: 2, label: 'two'},
        {
          groupName: 'SubInterests',
          options: [{key: 5, label: 'five'}]
        }
      ]
    },
    { groupName: 'Demographics', options: [{key: 3, label: 'three'}, {key: 4, label: 'four'}] }
  ],

  _collasableOption(opt) {
    const component = this;
    const groupName = get(opt, 'groupName');
    const options = get(opt, 'options') || [];
    const isCollapsed = get(opt, 'isCollapsed') || true;
    if (groupName) {
      return {
        nodeName: groupName,
        options: options.map(component._collasableOption.bind(component)),
        isCollapsed
      };
    }

    return opt;
  },

  init() {
    this._super(...arguments);
    const component = this;
    set(this, 'currentOptions', get(this, 'treeOptions').map(component._collasableOption.bind(component)));
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
    }
  }
});
