import { set, get } from '@ember/object';
import Controller from '@ember/controller';

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
        options: [{
          key: 5, label: 'five'
        }, {
          groupName: 'SubSubInterests',
          isSelectable: true,
          options: [{key: 6, label: 'six'}]
        }]
      }, {
        groupName: 'Foooooo',
        isSelectable: true,
        options: [{
          key: 55, label: 'cinquantacinque'
        }, {
          key: 66, label: 'sixsix'
        }]
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
    handleSearch(q, evt) {
      set(this, 'query', get(evt, 'key'));
    },
    onTreeSelectionChange(selected) {
      set(this, 'selectedOptions', selected);
    }
  }
});
