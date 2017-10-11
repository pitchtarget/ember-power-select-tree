import { set } from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import { clickTrigger } from '../../helpers/ember-power-select';
import $ from 'jquery';
import hbs from 'htmlbars-inline-precompile';
const clickEPSTreeTrigger = () => clickTrigger('.ember-power-select-tree');
const getOptionNode = s => $(`.ember-power-select-tree-leaf:contains(${s})`);
const getGroupNode = s => $(`.ember-power-select-group:contains(${s})`);
const getSelectedGroup = s => $(`.ember-power-select-tree-selected-group:contains(${s})`);
const getSelectedOption = s => $(`.ember-power-select-tree-selected-option:contains(${s})`);
const selectOption = s => getOptionNode(s).find('.ember-power-select-tree-leaf-checkbox input').first().click();
const toggleGroup = s => getGroupNode(s).last().find('.ember-power-select-tree-group-container').first().click();
const selectGroup = s => getGroupNode(s).last().find('.ember-power-select-tree-group-checkbox input').first().click();
const isOptChecked = s => getOptionNode(s).last().find('input').prop('checked');
const isGroupChecked = s => getGroupNode(s).last().find('input').prop('checked');
const selectedOptions = [{key: 1, label: 'one'}];
const treeOptions = [{
  groupName: 'Interests',
  isSelectable: true,
  options: [{
      key: 1, label: 'one'
    }, {
      key: 2, label: 'two'
    }, {
      groupName: 'SubNodes',
      isSelectable: true,
      options: [
        {key: 5, label: 'five'},
        {
          groupName: 'DeepDeepInside',
          isSelectable: true,
          options: [{key: 6, label: 'six'}]
        }
      ]
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

moduleForComponent('power-select-tree', 'Integration | Component | power select tree', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);
  this.render(hbs`{{power-select-tree}}`);
  assert.equal(this.$('.ember-power-select-tree-selected-list').length, 1, 'The selected elements list is present');
  assert.equal(this.$('.ember-power-select-tree').length, 1, 'The EPS tree selector is present');
});

test('When clicking on the trigger the dropdown list should be visible', function(assert) {
  assert.expect(1);
  this.on('onTreeSelectionChange', () => {});
  set(this, 'treeOptions', treeOptions);
  this.render(hbs`{{power-select-tree
    treeOptions=treeOptions onTreeSelectionChange=(action 'onTreeSelectionChange')}}`);
  clickEPSTreeTrigger();
  assert.equal($('.ember-power-select-options').length, 1, 'Dropdown list options are shown');
});

test('Clicking on group label opens/closes the relative subtree', function(assert) {
  assert.expect(2);
  this.on('onTreeSelectionChange', () => {});
  set(this, 'treeOptions', treeOptions);
  this.render(hbs`{{power-select-tree
    treeOptions=treeOptions onTreeSelectionChange=(action 'onTreeSelectionChange')}}`);
  clickEPSTreeTrigger();
  toggleGroup('Interests');
  assert.equal(getGroupNode('Interests').find('.ember-power-select-options').length, 1, 'It shows its subtree');
  toggleGroup('Interests');
  assert.equal(getGroupNode('Interests').find('.ember-power-select-options').length, 0, 'It collapses its subtree');
});

test('Selecting/deselecting a leaf checks the checkbox and add the element to the selected list', function(assert) {
  assert.expect(3);
  this.on('onTreeSelectionChange', () => {});
  set(this, 'treeOptions', treeOptions);
  this.render(hbs`{{power-select-tree
    treeOptions=treeOptions onTreeSelectionChange=(action 'onTreeSelectionChange')}}`);
  clickEPSTreeTrigger();
  toggleGroup('Interests');
  selectOption('one');
  assert.ok(isOptChecked('one'), 'It Checks the checkbox');
  assert.equal(getSelectedGroup('Interests').length, 1, 'Group is created');
  assert.equal(getSelectedOption('one').length, 1, 'Option is selected and inserted under the right group');
});

test('Selecting/deselecting a group selects and add to the selected list all the subtree\'s elements',
  function(assert) {
  assert.expect(14);
  this.on('onTreeSelectionChange', () => {});
  set(this, 'treeOptions', treeOptions);
  this.render(hbs`{{power-select-tree
    treeOptions=treeOptions onTreeSelectionChange=(action 'onTreeSelectionChange')}}`);
  clickEPSTreeTrigger();
  toggleGroup('Interests');
  toggleGroup('SubNodes');
  toggleGroup('DeepDeepInside');
  selectGroup('Interests');
  assert.ok(isGroupChecked('Interests'), 'It checks the group');
  assert.ok(isGroupChecked('SubNodes'), 'It checks the subtree');
  assert.ok(isGroupChecked('DeepDeepInside'), 'It checks all subtrees');
  assert.ok(isOptChecked('one'), 'It checks the first sub el');
  assert.ok(isOptChecked('two'), 'It checks the second sub el');
  assert.ok(isOptChecked('five'), 'It checks the first sub sub el');
  assert.ok(isOptChecked('six'), 'It checks all sub elements');
  assert.equal(getSelectedGroup('Interests').length, 3,
    'It adds the main group to selected elements (one time only)');
  assert.equal(getSelectedGroup('Interests > SubNodes').length, 2, 'It adds subgroups to selected elements');
  assert.equal(getSelectedGroup('Interests > SubNodes > DeepDeepInside').length, 1,
    'It adds all subgroups to selected elements');
  assert.equal(getSelectedOption('one').length, 1, 'Option one is selected and inserted under the right group');
  assert.equal(getSelectedOption('two').length, 1, 'Option two is selected and inserted under the right group');
  assert.equal(getSelectedOption('five').length, 1, 'Option five is selected and inserted under the right group');
  assert.equal(getSelectedOption('six').length, 1, 'Option six is selected and inserted under the right group');
});

test('When Passing selectedOptions they are shown in list', function(assert) {
  assert.expect(2);
  this.on('onTreeSelectionChange', () => {});
  set(this, 'treeOptions', treeOptions);
  set(this, 'selectedOptions', selectedOptions);
  this.render(hbs`{{power-select-tree selectedOptions=selectedOptions
    treeOptions=treeOptions onTreeSelectionChange=(action 'onTreeSelectionChange')}}`);
  assert.equal(getSelectedGroup('Interests').length, 1, 'It shows selected elements in group');
  assert.equal(getSelectedOption('one').length, 1, 'Option selected is inserted under the right group');
});

test('onTreeSelectionChange is called when adding/removing elements', function(assert) {
  assert.expect(1);
  this.on('onTreeSelectionChange', (opts) => {
    assert.deepEqual(opts, [{
      'isChecked': true,
      'isSelectable': true,
      'key': 1,
      'label': 'one',
      'path': ['Interests'],
      'humanPath': 'Interests'
    }], 'Actions is called with correct options');
  });
  set(this, 'treeOptions', treeOptions);
  this.render(hbs`{{power-select-tree
    treeOptions=treeOptions onTreeSelectionChange=(action 'onTreeSelectionChange')}}`);
  clickEPSTreeTrigger();
  toggleGroup('Interests');
  selectOption('one');
});

test('onTreeSelectionChange is called when removing elements', function(assert) {
  assert.expect(1);
  this.on('onTreeSelectionChange', (opts) => {
    assert.deepEqual(opts, [], 'Actions is called with correct options');
  });
  set(this, 'treeOptions', treeOptions);
  set(this, 'selectedOptions', selectedOptions);
  this.render(hbs`{{power-select-tree
    selectedOptions=selectedOptions
    treeOptions=treeOptions onTreeSelectionChange=(action 'onTreeSelectionChange')}}`);

  this.$('.ember-power-select-tree-x').click();
});
