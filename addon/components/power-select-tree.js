/* jshint expr: true */
import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set, computed, A, Component } = Ember;

export default Component.extend({
  layout,
  currentOptions: computed('treeOptions.[]'/*, 'selectedOptions.[]'*/, function() {
    // TODO check selected items
    // TODO if all leaf of a tree are selected check the parent node
    const treeOptions = get(this, 'treeOptions');
    // const selectedOptions = A(get(this, 'selectedOptions'));
    return this._buildPath(
      treeOptions.map(o => this._collapsableOption(o/*, selectedOptions*/))
    );
  }),

  // old code
  // init() {
  //   this._super(...arguments);
  //   set(this, 'currentOptions', get(this, 'treeOptions').map(o => this._collapsableOption(o)));
  //   // TODO if all leaf of a tree are selected check the parent node
  // }
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

  _collapsableOption(opt/*, selectedOptions = A()*/) {
    const isSelectable = get(opt, 'isSelectable');
    const isChecked = get(opt, 'isChecked')/* || selectedOptions.isAny('key', get(opt, 'key'))*/;
    const groupName = get(opt, 'groupName');
    const options = get(opt, 'options') || [];
    const isCollapsed = get(opt, 'isCollapsed') || true;
    if (groupName) {
      return {
        isSelectable,
        isCollapsed,
        isChecked,
        nodeName: groupName,
        options: options.map(o => this._collapsableOption(o/*, selectedOptions*/))
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
      this._traverseTree(nodeOrLeaf, setChecked);
      if (nodeOrLeaf.nodeName) {
        const leaves = this._getLeaves(nodeOrLeaf);
        !newVal ?
          selectedOptions.removeObjects(leaves) :
          selectedOptions.pushObjects(leaves);
      } else {
        !newVal ?
          selectedOptions.removeObject(nodeOrLeaf) :
          selectedOptions.pushObject(nodeOrLeaf);
      }
      set(this, 'selectedOptions', selectedOptions);
    }
  }
});
