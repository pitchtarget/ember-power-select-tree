import Ember from 'ember';
const { set, Controller } = Ember;

export default Controller.extend({
  selectedOptions: [{
    key: 1, label: 'one'
  }],
  treeOptions: [{
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
  ],
  actions: {
    onTreeSelectionChange(selected) {
      set(this, 'selectedOptions', selected);
    }
  }
});
