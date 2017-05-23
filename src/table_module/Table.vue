<template>
  <v-client-table :data="tableData" :columns="columns" :options="options"></v-client-table>
</template>

<script>
// utils
import _findIndex from 'lodash.findindex';
import fakeData from '../../utils/fake_data.json';

// configs
import useTableOptions from './configs/use_table_options.js';
import tableColumns from './configs/columns.js';
import sortableColumns from './configs/sortable_columns.js';
import rowsGrouping from './configs/rows_grouping.js';

// vue
import Vue from 'vue';
import { ClientTable, Event } from 'vue-tables-2';
import VueCookie from 'vue-cookie';

// templates
import * as cellTemplates from '../templates/cell_templates.jsx';
import tableTemplate from '../templates/table_template.js';

// vue-components
import favoriteButton from '../components/FavoriteButton.vue';
import symbolCell from '../components/SymbolCell.vue';

// needed for group sorting
let groupSorter = function (cellName) {
  return function (ascending) {
    return function (a, b) {
      let groupA = a[rowsGrouping.prop];
      let groupB = b[rowsGrouping.prop];

      let cellA = typeof a[cellName] == 'string' ? a[cellName].toLowerCase() : a[cellName];
      let cellB = typeof b[cellName] == 'string' ? b[cellName].toLowerCase() : b[cellName];

      // sort by group name
      if (rowsGrouping.ascending) {
        if (groupA > groupB) return 1;
        if (groupA < groupB) return -1;
      } else {
        if (groupA < groupB) return 1;
        if (groupA > groupB) return -1;
      }

      // sort by cell name
      if (ascending) {
        if (cellA >= cellB) return 1;
        if (cellA < cellB) return -1;
      } else {
        if (cellA <= cellB) return 1;
        if (cellA > cellB) return -1;
      }
    }
  }
};

// implementing custom sorting function to all columns
let customSorting = (function () {
  let columns = tableColumns;
  let obj = {};

  for (var i = 0; i < columns.length; i++) {
    obj[columns[i]] = groupSorter(columns[i]);
  }

  return obj;
})();

// implementing
Vue.component('favoriteCell', favoriteButton);
Vue.component('symbolCell', symbolCell);
Vue.use(ClientTable, useTableOptions, false, tableTemplate('client'));
Vue.use(VueCookie);

export default {
  created() {
    // favorite button
    Event.$on('table-row:favorite-clicked', (data) => {
      let index = _findIndex(this.$data.tableData, (i) => i.id == data.id);
      this.$data.tableData.splice(index, 1, data);
    });

    // pull shown groups from cookies
    this.$data.shownGroups = this.$cookie.get('openedGroups').split(',') || [];
  },
  methods: {
    toggleGroup (groupName) {
      let index = this.shownGroups.indexOf(groupName);

      if (index == -1) {
        this.shownGroups.push(groupName);
      } else {
        this.shownGroups.splice(index, 1);
      }

      // update cookies
      this.$cookie.set('openedGroups', this.shownGroups);
    }
  },
  data() {
    return {
      columns: tableColumns,
      tableData: fakeData,
      shownGroups: [],
      options: {
        templates: {
          ...cellTemplates,
          symbol: 'symbolCell',
          is_favorite: 'favoriteCell'
        },
        rowsGrouping: rowsGrouping,
        sortable: sortableColumns,
        orderBy: {
          ascending: true,
          column: 'symbol'
        },
        rowClassCallback(row) {
          return `table-row table-row__${row.status}`;
        },
        customSorting: customSorting
      }
    }
  }
}
</script>

<style lang='scss'>
.table-row {
  &__active {
    td {
      opacity: 1;
    }
  }

  &__archived {
    td {
      opacity: .3;
    }
  }
}
</style>
