/* jshint expr: true */
import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set, computed, A, Component } = Ember;

export default Component.extend({
  layout,
  currentOptions: computed('treeOptions.[]', function() {
    // TODO if all leaf of a tree are selected check the parent node
    const treeOptions = get(this, 'treeOptions');
    return treeOptions
      .map(o => this._collapsableOption(o))
      .map(o => this._buildPath(o));
  }),

  __selectedOptions: computed('selectedOptions.[]', 'currentOptions.[]', function() {
    const newOpts = A();
    const setPath = o => {
      if (A(get(this, 'selectedOptions')).isAny('key', get(o, 'key'))) {
        set(o, 'path', get(o, 'path'));
        set(o, 'isChecked', true);
        newOpts.pushObject(o);
      }
    };

    A(get(this, 'currentOptions')).forEach(o => this._traverseTree(o, setPath));
    return newOpts;
  }),
  // TODO: property that groups selectedOptions by path

  _buildPath(node, currPath = []) {
    if (!get(node, 'nodeName')) {
      set(node, 'path', currPath.join(' > '));
    } else {
      currPath.push(node.nodeName);
      get(node, 'options').forEach(o => this._buildPath(o, currPath));
      currPath = [];
    }

    return node;
  },

  _collapsableOption(opt) {
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
        options: options.map(o => this._collapsableOption(o))
      };
    }

    set(opt, 'isSelectable', true);
    return opt;
  },

  _getLeaves(root, leaves = A()) {
    (get(root, 'options') || A()).forEach(
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

  // onTreeSelectionChange() {
  //   return get(this, 'onTreeSelectionChange')(get(this, '__selectedOptions'));
  // },

  actions: {
    onToggleGroup(nodeOrLeaf) {
      const selectedOptions = A(get(this, 'selectedOptions'));
      const nodeKey = get(nodeOrLeaf, 'key');
      if (nodeOrLeaf.nodeName) {
        return set(nodeOrLeaf, 'isCollapsed', !get(nodeOrLeaf, 'isCollapsed'));
      }

      const isLeafChecked = get(nodeOrLeaf, 'isChecked');
      if (isLeafChecked) {
        selectedOptions.removeObject(selectedOptions.findBy('key', nodeKey));
      } else {
        selectedOptions.pushObject(nodeOrLeaf);
      }
      set(nodeOrLeaf, 'isChecked', !isLeafChecked);
      // this.onTreeSelectionChange();
      set(this, 'selectedOptions', selectedOptions);
    },
    handleChecked(nodeOrLeaf) {
      const newVal = !get(nodeOrLeaf, 'isChecked');
      const setChecked = node => set(node, 'isChecked', newVal);
      const selectedOptions = A(get(this, 'selectedOptions'));
      const nodeKey = get(nodeOrLeaf, 'key');
      const leaves = this._getLeaves(nodeOrLeaf);

      this._traverseTree(nodeOrLeaf, setChecked);

      if (nodeOrLeaf.nodeName) {
        !newVal ?
          leaves.forEach(l => selectedOptions.removeObject(selectedOptions.findBy('key', get(l, 'key')))) :
          selectedOptions.pushObjects(leaves);
      } else {
        !newVal ?
          selectedOptions.removeObject(selectedOptions.findBy('key', nodeKey)) :
          selectedOptions.pushObject(nodeOrLeaf);
      }
      // this.onTreeSelectionChange();
      set(this, 'selectedOptions', selectedOptions);
    }
  }
});
