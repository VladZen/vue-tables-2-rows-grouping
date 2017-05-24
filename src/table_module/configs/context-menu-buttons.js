import { Event } from 'vue-tables-2';

let buttons = [
  {
    name: 'edit',
    order: 1,
    styleClass: 'btn btn-success',
    iconStyleClass: 'glyphicon glyphicon-pencil',
    type: 'link',
    href (row) {
      return `/edit/${row.id}`
    },
    target: '_blank'
  },
  {
    name: 'clone',
    order: 2,
    styleClass: 'btn btn-warning',
    iconStyleClass: 'glyphicon glyphicon-duplicate',
    type: 'link',
    href (row) {
      return `/clone/${row.id}`
    }
  },
  {
    name: 'delete',
    order: 3,
    styleClass: 'btn btn-danger',
    iconStyleClass: 'glyphicon glyphicon-trash',
    type: 'button',
    action (row) {
      Event.$emit('table-context-menu:delete-clicked', row);
    }
  }
];

export default buttons;
