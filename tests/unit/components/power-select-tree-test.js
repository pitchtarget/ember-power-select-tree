import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { get, set } = Ember;

const selectedOptions = [{key: 1, label: 'one'}];
const treeOptions = [{
  groupName: 'Interests',
  isSelectable: true,
  options: [{
      key: 1, label: 'one'
    }, {
      key: 2, label: 'two'
    }, {
      groupName: 'SubInterests',
      isSelectable: true,
      options: [{key: 5, label: 'five'}]
    }
  ]}, {
    groupName: 'Demographics',
    options: [
      {key: 3, label: 'three'},
      {key: 4, label: 'four'}
    ],
    isSelectable: true
  }
];
const simpleTree = {key: 1, options: [{key: 2}, {key: 3}]};
const advancedTreeOptions = [{
  'isSelectable': true,
  'isChecked': false,
  'isCollapsed': true,
  'nodeName': 'Interests',
  'options': [{
    'isChecked': false,
    'key': 1,
    'label': 'one',
    'isSelectable': true,
    'humanPath': 'Interests',
    'path': ['Interests']
  }, {
    'isChecked': false,
    'key': 2,
    'label': 'two',
    'isSelectable': true,
    'humanPath': 'Interests',
    'path': ['Interests']
  }, {
    'isSelectable': true,
    'isChecked': false,
    'isCollapsed': true,
    'nodeName': 'SubInterests',
    'options': [{
      'isChecked': false,
      'key': 5,
      'label': 'five',
      'isSelectable': true,
      'humanPath': 'Interests > SubInterests',
      'path': ['Interests', 'SubInterests']
    }]
  }]}, {
  'isChecked': false,
  'isSelectable': true,
  'isCollapsed': true,
  'nodeName': 'Demographics',
  'options': [{
    'isChecked': false,
    'key': 3,
    'label': 'three',
    'isSelectable': true,
    'humanPath': 'Demographics',
    'path': ['Demographics']
  }, {
    'key': 4,
    'isChecked': false,
    'label': 'four',
    'isSelectable': true,
    'humanPath': 'Demographics',
    'path': ['Demographics']
  }]
}];

moduleForComponent('power-select-tree', 'Unit | Component | power select tree', {
  unit: true
});

test('advancedTreeOptions', function(assert) {
  assert.expect(1);

  let subject = this.subject();
  set(subject, 'treeOptions', treeOptions);
  const advanced = get(subject, 'advancedTreeOptions');
  assert.deepEqual(advanced, advancedTreeOptions, 'advancedTreeOptions is correctly calculated');
});

test('init', function(assert) {
  assert.expect(1);

  let subject = this.subject({selectedOptions, treeOptions});
  const selectedOpts = get(subject, '__selectedOptions');
  assert.deepEqual(selectedOpts, [{
    key: 1, label: 'one', isSelectable: true, isChecked: true, path: ['Interests'], humanPath: 'Interests'
  }], ' It correctly sets __selectedOptions given some selectedOptions');
});

test('currentOptions', function(assert) {
  assert.expect(2);
  let subject = this.subject({selectedOptions, treeOptions});
  const opts = get(subject, 'currentOptions');
  assert.deepEqual(opts[0], {
    'isChecked': false,
    'isCollapsed': true,
    'isSelectable': true,
    'nodeName': 'Interests',
    'options': [{
      'isChecked': true,
      'isSelectable': true,
      'key': 1,
      'label': 'one',
      'humanPath': 'Interests',
      'path': ['Interests']
    }, {
      'isChecked': false,
      'isSelectable': true,
      'key': 2,
      'label': 'two',
      'humanPath': 'Interests',
      'path': ['Interests']
    }, {
      'isChecked': false,
      'isCollapsed': true,
      'isSelectable': true,
      'nodeName': 'SubInterests',
      'options': [{
        'isChecked': false,
        'isSelectable': true,
        'key': 5,
        'label': 'five',
        'humanPath': 'Interests > SubInterests',
        'path': ['Interests', 'SubInterests']
      }]
    }]
  }, 'The first Object is correct');
  assert.deepEqual(opts[1], {
    'isChecked': false,
    'isCollapsed': true,
    'isSelectable': true,
    'nodeName': 'Demographics',
    'options': [{
      'isChecked': false,
      'isSelectable': true,
      'key': 3,
      'label': 'three',
      'path': ['Demographics'],
      'humanPath': 'Demographics'
    }, {
      'isChecked': false,
      'isSelectable': true,
      'key': 4,
      'label': 'four',
      'path': ['Demographics'],
      'humanPath': 'Demographics'
    }]
  }, 'It correctly computes currentOptions');
});

test('groupedSelectedOptions', function(assert) {
  assert.expect(1);

  let subject = this.subject({ treeOptions });
  set(subject, '__selectedOptions', [
    {key: 1, label: 'one', isSelectable: true, isChecked: true, path: ['Interests'], humanPath: 'Interests'},
    {key: 5, label: 'five', isSelectable: true, isChecked: true, path: ['Interests'], humanPath: 'Interests'},
    {key: 4, label: 'four', isSelectable: true, isChecked: true, path: ['Demographics'], humanPath: 'Demographics'}
  ]);
  assert.deepEqual(get(subject, 'groupedSelectedOptions'), [{
    'options': [{
      'isChecked': true,
      'isSelectable': true,
      'key': 4,
      'label': 'four',
      'humanPath': 'Demographics',
      'path': ['Demographics']
    }],
    'humanPath': 'Demographics',
    'nodeName': 'Demographics'
  }, {
    'options': [{
      'isChecked': true,
      'isSelectable': true,
      'key': 1,
      'label': 'one',
      'humanPath': 'Interests',
      'path': ['Interests']
    }, {
      'isChecked': true,
      'isSelectable': true,
      'key': 5,
      'label': 'five',
      'humanPath': 'Interests',
      'path': ['Interests']
    }],
    'humanPath': 'Interests',
    'nodeName': 'Interests'
  }], 'It correctly calculates groupedSelectedOptions');
});

test('_setChecked checks element present in the given array', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  const el = {key: 1};
  subject._setChecked(el, [{key: 1}, {key: 2}]);
  assert.ok(get(el, 'isChecked'), 'The element has been checked when presenti in the array');
});

test('_setChecked does not check element if is not present in the given array', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  const el = {key: 1111};
  subject._setChecked(el, [{key: 1}, {key: 2}]);
  assert.ok(!get(el, 'isChecked'), 'The element has not been checked');
});

test('_buildPath', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  const nodeWithPath = subject._buildPath({
    'nodeName': 'Interests',
    'options': [{}, {}, {
      nodeName: 'SubInterests', options: [{}]
    }, {
      nodeName: 'Foo', options: [{}]
    }]
  });
  assert.deepEqual(nodeWithPath, {
    'nodeName': 'Interests',
    'options': [{'path': ['Interests'], 'humanPath': 'Interests'}, {'path': ['Interests'], 'humanPath': 'Interests'}, {
      'nodeName': 'SubInterests',
      'options': [{'path': ['Interests', 'SubInterests'], 'humanPath': 'Interests > SubInterests'}]
    }, {
      'nodeName': 'Foo',
      'options': [{'path': ['Interests', 'Foo'], 'humanPath': 'Interests > Foo'}]
    }]
  }, 'Path is correctly populated recursively');
});

test('_collapsableOption for leaf', function(assert) {
  assert.expect(2);
  let subject = this.subject();
  const collapsible = subject._collapsableOption(Ember.assign({}, treeOptions[0]));
  const leaves = subject._getLeaves(collapsible);
  assert.ok(leaves.every(l => get(l, 'isSelectable')), true, 'All leaves are selectable');
  assert.ok(leaves.every(l => !get(l, 'isChecked')), true, 'All leaves are not checked by default');
});

test('_collapsableOption for group', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  const collapsible = subject._collapsableOption(Ember.assign({}, treeOptions[0]));
  assert.deepEqual(collapsible, {
    'isSelectable': true,
    'isChecked': false,
    'isCollapsed': true,
    'nodeName': 'Interests',
    'options': [{
      'isChecked': false,
      'key': 1,
      'label': 'one',
      'isSelectable': true
    }, {
      'isChecked': false,
      'key': 2,
      'label': 'two',
      'isSelectable': true
    }, {
      'isSelectable': true,
      'isChecked': false,
      'isCollapsed': true,
      'nodeName': 'SubInterests',
      'options': [{
        'isChecked': false,
        'key': 5,
        'label': 'five',
        'isSelectable': true
      }]
    }]
  }, 'It correctly sets the collapsible option');
});

test('_getLeaves', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  const leaves = subject._getLeaves(simpleTree);
  assert.equal(leaves.length, 2, 'It return all the leaves');
});

test('_findInternalNode', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  const node = subject._findInternalNode({options: advancedTreeOptions}, 'SubInterests');
  assert.deepEqual(node, {
    'isSelectable': true,
    'isChecked': false,
    'isCollapsed': true,
    'nodeName': 'SubInterests',
    'options': [{
      'isChecked': false,
      'key': 5,
      'label': 'five',
      'isSelectable': true,
      'humanPath': 'Interests > SubInterests',
      'path': ['Interests', 'SubInterests']
    }]
  }, 'It return the Internal node given a nodeName');
});

test('_treeTraverse', function(assert) {
  assert.expect(3);
  let subject = this.subject();
  const foo = (node) => {
    assert.ok(true, `Function called for node with key: ${node.key}`);
  };
  subject._treeTraverse(Ember.assign({}, simpleTree), foo);
});

test('onTreeSelectionChange', function(assert) {
  assert.expect(2);
  let subject = this.subject();
  set(subject, 'onTreeSelectionChange', (foo) => {
    assert.ok(true, 'Action has been called');
    assert.equal(foo, 'foo', 'Action has been called with correct params');
  });

  subject.onTreeSelectionChange('foo');
});
