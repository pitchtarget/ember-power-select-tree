/* jshint expr: true */
import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set, isBlank, computed, A, Component } = Ember;

export default Component.extend({
  layout,
  currentOptions: computed('treeOptions.[]', function() {
    // TODO if all leaf of a tree are selected check the parent node
    const treeOptions = get(this, 'treeOptions');
    return treeOptions
      .map(o => this._collapsableOption(o))
      .map(o => this._buildPath(o));
  }),

  groupedSelectedOptions: computed('__selectedOptions.[]', function() {
    // TODO: property that groups selectedOptions by path
    // return A(get(this, '__selectedOptions'))
  }),

  init() {
    this._super(...arguments);

    if (isBlank(get(this, 'selectedOptions'))) {
      set(this, '__selectedOptions', A());
    } else {
      this._buildSelectedOptions();
    }
  },

  _buildSelectedOptions() {
    const newOpts = A();
    const setPath = o => {
      if (A(get(this, 'selectedOptions')).isAny('key', get(o, 'key'))) {
        set(o, 'path', get(o, 'path'));
        set(o, 'isChecked', true);
        newOpts.pushObject(Object.assign({}, o));
      }
    };

    // Check selected items
    A(get(this, 'currentOptions')).forEach(o => this._traverseTree(o, setPath));
    set(this, '__selectedOptions', newOpts);
  },

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

  onTreeSelectionChange(opts = get(this, '__selectedOptions')) {
    return get(this, 'onTreeSelectionChange')(opts);
  },

  actions: {
    onToggleGroup(nodeOrLeaf) {
      const __selectedOptions = A(get(this, '__selectedOptions'));
      const nodeKey = get(nodeOrLeaf, 'key');
      if (nodeOrLeaf.nodeName) {
        return set(nodeOrLeaf, 'isCollapsed', !get(nodeOrLeaf, 'isCollapsed'));
      }

      const isLeafChecked = get(nodeOrLeaf, 'isChecked');
      if (isLeafChecked) {
        __selectedOptions.removeObject(__selectedOptions.findBy('key', nodeKey));
      } else {
        __selectedOptions.pushObject(nodeOrLeaf);
      }
      set(nodeOrLeaf, 'isChecked', !isLeafChecked);

      set(this, '__selectedOptions', __selectedOptions);
      this.onTreeSelectionChange();
    },
    handleChecked(nodeOrLeaf) {
      const newVal = !get(nodeOrLeaf, 'isChecked');
      const setChecked = node => set(node, 'isChecked', newVal);
      const __selectedOptions = A(get(this, '__selectedOptions'));
      const nodeKey = get(nodeOrLeaf, 'key');
      const leaves = this._getLeaves(nodeOrLeaf);

      this._traverseTree(nodeOrLeaf, setChecked);

      if (nodeOrLeaf.nodeName) {
        !newVal ?
          leaves.forEach(l => __selectedOptions.removeObject(__selectedOptions.findBy('key', get(l, 'key')))) :
          __selectedOptions.pushObjects(leaves);
      } else {
        !newVal ?
          __selectedOptions.removeObject(__selectedOptions.findBy('key', nodeKey)) :
          __selectedOptions.pushObject(nodeOrLeaf);
      }

      set(this, '__selectedOptions', __selectedOptions);
      this.onTreeSelectionChange();
    }
  }
});
