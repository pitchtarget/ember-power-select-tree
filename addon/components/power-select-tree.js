import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set, computed, A, Component } = Ember;

export default Component.extend({
  layout,
  currentOptions: computed('treeOptions.[]'/*, 'selectedOptions.[]'*/, function() {
    const component = this;
    const treeOptions = get(component, 'treeOptions');
    // const selectedOptions = A(get(component, 'selectedOptions'));
    return this._buildPath(
      treeOptions
        .map(component._collapsableOption.bind(component))
    );
  }),

  // TODO: property that groups selectedOptions by path

  _buildPath(treeOptions, currPath = []) {
    treeOptions.forEach(o => {
      if (!o.nodeName) {
        return set(o, 'path', currPath.join(' > '));
      }

      currPath.push(o.nodeName);
      this._buildPath(get(o, 'options'), currPath);
      currPath = [];
    });
    return treeOptions;
  },

  _collapsableOption(opt) {
    const component = this;
    const isSelectable = get(opt, 'isSelectable');
    const isChecked = get(opt, 'isChecked');
    const groupName = get(opt, 'groupName');
    const options = get(opt, 'options') || [];
    const isCollapsed = get(opt, 'isCollapsed') || true;
    if (groupName) {
      return {
        isSelectable,
        isCollapsed,
        isChecked,
        nodeName: groupName,
        options: options.map(component._collapsableOption.bind(component))
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

  _traverseTree(root, func) {
    func(root);
    const options = A(get(root, 'options'));
    if (options.length) {
      options.forEach(o => this._traverseTree(o, func));
    }
  },

  actions: {
    onToggleGroup(nodeOrLeaf) {
      const selectedOptions = A(get(this, 'selectedOptions'));
      if (nodeOrLeaf.nodeName) {
        return set(nodeOrLeaf, 'isCollapsed', !get(nodeOrLeaf, 'isCollapsed'));
      }

      const isLeafChecked = get(nodeOrLeaf, 'isChecked');
      if (isLeafChecked) {
        selectedOptions.removeObject(nodeOrLeaf);
      } else {
        selectedOptions.pushObject(nodeOrLeaf);
      }
      set(nodeOrLeaf, 'isChecked', !isLeafChecked);
      set(this, 'selectedOptions', selectedOptions);
    },
    handleChecked(nodeOrLeaf) {
      const newVal = !get(nodeOrLeaf, 'isChecked');
      const setChecked = node => set(node, 'isChecked', newVal);

      const selectedOptions = A(get(this, 'selectedOptions'));
      if (nodeOrLeaf.nodeName) {
        this._traverseTree(nodeOrLeaf, setChecked);
        if (!newVal) {
          selectedOptions.removeObjects(this._getLeaves(nodeOrLeaf));
        } else {
          selectedOptions.pushObjects(this._getLeaves(nodeOrLeaf));
        }
      } else {
        if (!newVal) {
          selectedOptions.removeObject(nodeOrLeaf);
        } else {
          selectedOptions.pushObject(nodeOrLeaf);
        }
      }
      set(this, 'selectedOptions', selectedOptions);
    }
  }
});
