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
import customSorting from './configs/sorting.js';

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
      // needed for triggers of rows
      shownGroups: [],
      options: {
        templates: {
          ...cellTemplates,
          symbol: 'symbolCell',
          is_favorite: 'favoriteCell'
        },
        groupBy: rowsGrouping,
        sortable: sortableColumns,
        orderBy: {
          ascending: true,
          column: 'symbol'
        },
        rowClassCallback(row) {
          return `table-row table-row__${row.status}`;
        },
        // contains modified according to rows-grouping sorting function
        customSorting: customSorting(sortableColumns, rowsGrouping)
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
