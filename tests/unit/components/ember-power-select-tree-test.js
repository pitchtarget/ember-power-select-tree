import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { get, set } = Ember;

// const selectedOptions = [{key: 1, label: 'one'}];
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
    'path': 'Interests'
  }, {
    'isChecked': false,
    'key': 2,
    'label': 'two',
    'isSelectable': true,
    'path': 'Interests'
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
      'path': 'Interests > SubInterests'
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
    'path': 'Demographics'
  }, {
    'key': 4,
    'isChecked': false,
    'label': 'four',
    'isSelectable': true,
    'path': 'Demographics'
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

// test('init', function(assert) {
//   assert.expect(1);
// });
//
// test('currentOptions', function(assert) {
//   assert.expect(1);
// });
//
// test('groupedSelectedOptions', function(assert) {
//   assert.expect(1);
// });
//
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
    }]
  });
  assert.deepEqual(nodeWithPath, {
    'nodeName': 'Interests',
    'options': [{'path': 'Interests'}, {'path': 'Interests'}, {
      'nodeName': 'SubInterests',
      'options': [{'path': 'Interests > SubInterests'}]
    }]
  }, 'Path is correctly populated recursively');
});

test('_collapsableOption for leaf', function(assert) {
  assert.expect(2);
  let subject = this.subject();
  const collapsible = subject._collapsableOption(Object.assign({}, treeOptions[0]));
  const leaves = subject._getLeaves(collapsible);
  assert.ok(leaves.every(l => get(l, 'isSelectable')), true, 'All leaves are selectable');
  assert.ok(leaves.every(l => !get(l, 'isChecked')), true, 'All leaves are not checked');
});

test('_collapsableOption for group', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  const collapsible = subject._collapsableOption(Object.assign({}, treeOptions[0]));
  assert.deepEqual(collapsible, {
    'isSelectable': true,
    'isChecked': false,
    'isCollapsed': true,
    'nodeName': 'Interests',
    'options': [{
      'isChecked': false,
      'key': 1,
      'label': 'one',
      'isSelectable': true,
    }, {
      'isChecked': false,
      'key': 2,
      'label': 'two',
      'isSelectable': true,
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

test('_traverseTree', function(assert) {
  assert.expect(3);
  let subject = this.subject();
  const foo = (node) => {
    assert.ok(true, `Function called for node with key: ${node.key}`);
  };
  subject._traverseTree(simpleTree, foo);
});

test('onTreeSelectionChange', function(assert) {
  assert.expect(1);
  let subject = this.subject();
  set(subject, 'onTreeSelectionChange', () => {
    assert.ok(true, 'Action has been called');
  });

  subject.onTreeSelectionChange({});
});
