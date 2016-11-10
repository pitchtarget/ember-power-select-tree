import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set, computed, A, Component } = Ember;

export default Component.extend({
  layout,
  currentOptions: computed('treeOptions', 'selectedOptions', function() {
    const component = this;
    const treeOptions = get(component, 'treeOptions');
    // const selectedOptions = get(component, 'selectedOptions');
    return this._buildPath(treeOptions.map(component._collapsableOption.bind(component)));
      // TODO filter
      // .filter(() => {
      //
      // });
  }),

  _buildPath(treeOptions, currPath = []) {
    treeOptions.forEach(o => {
      if (!o.nodeName) {
        return set(o, 'path', currPath.join(' > '));
      }

      currPath.push(o.nodeName);
      this._buildPath(get(o, 'options'), currPath);
    });
    return treeOptions;
  },

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

  _getLeaves(root, leaves = A()) {
    get(root, 'options').forEach(
      o => !o.nodeName ? leaves.pushObject(o) : this._getLeaves(o, leaves)
    );
    return leaves;
  },

  actions: {
    onToggleGroup(nodeOrLeaf) {
      const selectedOptions = A(get(this, 'selectedOptions'));
      if (nodeOrLeaf.nodeName) {
        return set(nodeOrLeaf, 'isCollapsed', !get(nodeOrLeaf, 'isCollapsed'));
      }
      selectedOptions.pushObject(nodeOrLeaf);
      set(this, 'selectedOptions', selectedOptions);
    },
    handleChecked(nodeOrLeaf) {
      const selectedOptions = A(get(this, 'selectedOptions'));
      if (nodeOrLeaf.nodeName) {
        selectedOptions.pushObjects(this._getLeaves(nodeOrLeaf));
      } else {
        selectedOptions.pushObject(nodeOrLeaf);
      }
      set(this, 'selectedOptions', selectedOptions);
    }
  }
});
