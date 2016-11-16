/* jshint expr: true */
import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set, isBlank, computed, A, Component } = Ember;

export default Component.extend({
  layout,
  classNames: ['ember-power-select-tree'],
  __selectedOptions: null,
  advancedTreeOptions: computed('treeOptions.[]', function() {
    return A(get(this, 'treeOptions'))
      .map(o => this._collapsableOption(o))
      .map(o => this._buildPath(o));
  }),
  currentOptions: computed('advancedTreeOptions.[]', '__selectedOptions.[]', function() {
    const __selectedOptions = get(this, '__selectedOptions');
    return get(this, 'advancedTreeOptions')
      .map(o => this._traverseTree(o, (node) => this._setChecked(node, __selectedOptions)));
  }),

  groupedSelectedOptions: computed('__selectedOptions.[]', function() {
    return A(get(this, '__selectedOptions')).reduce((prev, curr) => {
      const path = get(curr, 'path');
      const group = prev.findBy('path', path);
      if (group) {
        get(group, 'options').pushObject(curr);
      } else {
        prev.pushObject({path, options: A([curr])});
      }

      return prev;
    }, A()).sortBy('path');
  }),

  init() {
    this._super(...arguments);

    const selectedOptions = A(get(this, 'selectedOptions'));
    let leaves = get(this, 'advancedTreeOptions')
      .map(o => this._traverseTree(o, (node) => this._setChecked(node, selectedOptions)))
      .map(o => this._getLeaves(o));

    set(this, '__selectedOptions', isBlank(selectedOptions) ? A() :
      [].concat(...leaves).filter(l => selectedOptions.isAny('key', get(l, 'key'))));
  },

  _setChecked(o, __selectedOptions) {
    if (A(__selectedOptions).isAny('key', get(o, 'key'))) {
      set(o, 'isChecked', true);
    }
  },

  _buildPath(node, currPath = A()) {
    if (!get(node, 'nodeName') && currPath.length) {
      set(node, 'path', currPath.join(' > '));
    } else {
      currPath.push(node.nodeName);
      get(node, 'options').forEach(o => this._buildPath(o, currPath));
      currPath = A();
    }

    return node;
  },

  _collapsableOption(opt) {
    const isSelectable = get(opt, 'isSelectable');
    const isChecked = leaf => get(leaf, 'isChecked');
    const isOptChecked = get(opt, 'isChecked');
    const groupName = get(opt, 'groupName');
    const options = get(opt, 'options') || [];
    const isCollapsed = get(opt, 'isCollapsed') || true;
    if (groupName) {
      return {
        isSelectable,
        isCollapsed,
        isChecked: options.some(isChecked) || isOptChecked || false,
        nodeName: groupName,
        options: options.map(o => this._collapsableOption(o))
      };
    }

    set(opt, 'isSelectable', true);
    set(opt, 'isChecked', !!isOptChecked);
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

    return root;
  },

  onTreeSelectionChange(opts) {
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
      this.onTreeSelectionChange(__selectedOptions);
    },
    handleChecked(nodeOrLeaf) {
      const newVal = !get(nodeOrLeaf, 'isChecked');
      const _setChecked = node => set(node, 'isChecked', newVal);
      const __selectedOptions = A(get(this, '__selectedOptions'));
      const __selectedOptionsKeys = __selectedOptions.map(o => get(o, 'key'));
      const nodeKey = get(nodeOrLeaf, 'key');
      const leaves = this._getLeaves(nodeOrLeaf);

      this._traverseTree(nodeOrLeaf, _setChecked);

      if (nodeOrLeaf.nodeName) {
        !newVal ?
          leaves.forEach(l => __selectedOptions.removeObject(__selectedOptions.findBy('key', get(l, 'key')))) :
          __selectedOptions.pushObjects(leaves.filter(l => !__selectedOptionsKeys.includes(get(l, 'key'))));
      } else {
        !newVal ?
          __selectedOptions.removeObject(__selectedOptions.findBy('key', nodeKey)) :
          __selectedOptions.pushObject(nodeOrLeaf);
      }

      set(this, '__selectedOptions', __selectedOptions);
      this.onTreeSelectionChange(__selectedOptions);
    }
  }
});
