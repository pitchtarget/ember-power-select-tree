/* jshint expr: true */
import Ember from 'ember';
import layout from '../templates/components/power-select-tree';
const { get, set, isBlank, computed, A, Component, $ } = Ember;

export default Component.extend({
  layout,
  classNames: ['ember-power-select-tree'],
  defaultLabelOpt: 'label',
  defaultDelimiter: ' > ',
  __selectedOptions: null,
  advancedTreeOptions: computed('treeOptions.[]', function() {
    return A(get(this, 'treeOptions'))
      .map(o => this._collapsableOption(o))
      .map(o => this._buildPath(o));
  }),
  currentOptions: computed('advancedTreeOptions.[]', '__selectedOptions.[]', function() {
    const __selectedOptions = get(this, '__selectedOptions');
    return get(this, 'advancedTreeOptions')
      .map(o => this._treeTraverse(o, (node) => this._setChecked(node, __selectedOptions)));
  }),

  groupedSelectedOptions: computed('__selectedOptions.[]', function() {
    return A(get(this, '__selectedOptions')).reduce((prev, curr) => {
      const humanPath = get(curr, 'humanPath') || '';
      const group = prev.findBy('humanPath', humanPath);
      if (group) {
        get(group, 'options').pushObject(curr);
      } else {
        prev.pushObject({
          humanPath,
          options: A([curr]),
          nodeName: get(A(humanPath.split(get(this, 'defaultDelimiter'))), 'lastObject')
        });
      }

      return prev;
    }, A()).sortBy('humanPath');
  }),

  init() {
    this._super(...arguments);

    if (!get(this, 'labelOpt')) {
      set(this, 'labelOpt', get(this, 'defaultLabelOpt'));
    }

    this._setSelectedOptions();
  },

  didReceiveAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    let oldSelected;
    let newSelected;

    if (oldAttrs) {
      oldSelected = JSON.stringify(get(oldAttrs, 'selectedOptions'));
    }

    if (newAttrs) {
      newSelected = JSON.stringify(get(newAttrs, 'selectedOptions'));
    }

    if (!isBlank(get(this, 'selectedOptions')) && (oldSelected !== newSelected)) {
      this._setSelectedOptions();
    }
  },

  _setSelectedOptions() {
    const selectedOptions = A(get(this, 'selectedOptions'));
    let leaves = get(this, 'advancedTreeOptions')
      .map(o => this._treeTraverse(o, (node) => this._setChecked(node, selectedOptions)))
      .map(o => this._getLeaves(o));
    let node;
    let filteredOptions = selectedOptions.map(opt => {
      node = [].concat(...leaves).find(
        leaf => get(opt, 'key') === get(leaf, 'key') && get(opt, 'type') === get(leaf, 'type')
      );

      if (node) {
        return node;
      }

      set(opt, 'humanPath', get(opt, 'path').join(get(this, 'defaultDelimiter')));
      return opt;
    });
    set(this, '__selectedOptions', isBlank(selectedOptions) ? A() : filteredOptions);
  },

  _setChecked(o, __selectedOptions, isChecked = true) {
    if (A(__selectedOptions).find(
      opt => get(opt, 'key') === get(o, 'key') && get(opt, 'type') === get(o, 'type')
    )) {
      set(o, 'isChecked', isChecked);
    }
  },

  _buildPath(node, currPath = A()) {
    let newNode = Ember.$.extend(true, {}, node);
    const path = get(node, 'path');
    if (path && path.length) {
      set(newNode, 'humanPath', path.join(get(this, 'defaultDelimiter')));
      return newNode;
    }

    if (!get(node, 'nodeName') && currPath.length) {
      set(newNode, 'humanPath', currPath.join(get(this, 'defaultDelimiter')));
      set(newNode, 'path', currPath);
    } else {
      currPath.push(get(node, 'nodeName'));
      set(newNode, 'options', A(get(node, 'options')).map(
        o => this._buildPath(o, [].concat(...currPath)))
      );
      currPath = A();
    }

    return newNode;
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

  _treeTraverse(root, visit) {
    visit(root);
    const options = A(get(root, 'options'));
    if (options.length) {
      options.forEach(o => this._treeTraverse(o, visit));
    }

    return root;
  },

  _findInternalNode(root, nameOrPath) {
    if (get(root, 'nodeName') === nameOrPath || get(root, 'humanPath') === nameOrPath) {
      return root;
    }
    let tmp, node;
    A(get(root, 'options')).forEach(o => {
      tmp = this._findInternalNode(o, nameOrPath);
      if (tmp) {
        node = tmp;
      }
    });

    return node;
  },

  onTreeSelectionChange(opts) {
    return get(this, 'onTreeSelectionChange')(opts);
  },

  scrollDropdownToSelected(el) {
    const container = $('.ember-power-select-tree-list').first();
    const scrollTop = $(el).offset().top - container.offset().top + container.scrollTop();
    return container.animate({ scrollTop }, 500);
  },

  actions: {
    handleSearch() {
      get(this, 'handleSearch')(...arguments);
      return false; // prevents default searching behaviour
    },
    onToggleGroup(group, evt) {
      // Check if checkbox or container is clicked
      const tagName = get(evt, 'target.tagName').toLowerCase();
      if (tagName === 'label' || tagName === 'input') {
        return;
      }
      set(group, 'isCollapsed', !get(group, 'isCollapsed'));

      return this.scrollDropdownToSelected(get(evt, 'target'));
    },
    removeNodeOrLeaf(nodeOrLeaf) {
      const __selectedOptions = get(this, '__selectedOptions');
      const isNode = !get(nodeOrLeaf, 'key');
      const key = isNode ? 'humanPath' : 'key';
      __selectedOptions.removeObjects(
        __selectedOptions.filterBy(key, get(nodeOrLeaf, key))
      );
      this._treeTraverse(nodeOrLeaf, o => set(o, 'isChecked', false));
      if (isNode) { // unchecks the group itself
        set(
          this._findInternalNode(
            {options: get(this, 'currentOptions')},
            get(nodeOrLeaf, 'nodeName') || get(nodeOrLeaf, 'humanPath')), 'isChecked', false
        );
      }
      set(this, '__selectedOptions', __selectedOptions);
    },
    handleChecked(nodeOrLeaf) {
      const newVal = !get(nodeOrLeaf, 'isChecked');
      const _setChecked = node => set(node, 'isChecked', newVal);
      const __selectedOptions = A(get(this, '__selectedOptions'));
      const __selectedOptionsKeys = __selectedOptions.map(o => get(o, 'key'));
      const nodeKey = get(nodeOrLeaf, 'key');
      const leaves = this._getLeaves(nodeOrLeaf);

      this._treeTraverse(nodeOrLeaf, _setChecked);

      if (get(nodeOrLeaf, 'nodeName')) {
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
