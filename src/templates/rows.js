let _values = require('lodash.values');

module.exports = function (h, that) {
  let rows = [];
  let columns;
  let rowKey = that.opts.uniqueKey;

  let rowClass;
  let data = that.source == 'client' ? that.filteredData : that.tableData;
  let shownGroups = that.$parent.shownGroups;

  // highlighting max values
  if (that.opts.maxValuesColumns) {
    maxValues = data
    .reduce(function (result, current) {
      that.opts.maxValuesColumns.map(function (column) {
        // column max value is already defined
        if ((typeof result[column] == 'undefined') || (current[column] > result[column].value)) {
          result[column] = {
            row_id: current.id,
            value: current[column]
          };
        }
      });

      return result;
    }.bind(that), {});
  }

  // grouping implementation
  if (that.opts.groupBy) {
    // generating groups obj
    let groups = data
    .reduce(function (result, current) {
      columns = [];

      // search group name in cookies
      let currentGroupIsCollapsed = shownGroups.indexOf(current.category_name) == -1;

      // if group is not created yet, create it
      if (!result[current.category_name]) {
        let toggleIconClass = currentGroupIsCollapsed ?  that.opts.sortIcon.down : that.opts.sortIcon.up;
        toggleIconClass += ` ${that.opts.sortIcon.base}`;

        result[current.category_name] = [];
        // creating trigger row
        result[current.category_name].push(
          <tr class={ that.opts.groupBy.rowTriggerClass }>
            <td colspan={ that.allColumns.length + 1 }>
              <button class='btn-default btn'
                      type='button'
                      on-click={ that.$parent.toggleGroup.bind(that, current.category_name) }>
                <span class='text-capitalize'>{ current.category_name }</span>
                &nbsp;
                <i class={ toggleIconClass }></i>
              </button>
            </td>
          </tr>
        );
      }

      // do not render child rows if the group is collapsed
      if (currentGroupIsCollapsed) return result;

      that.allColumns.map(function (column) {
        let cellStyle = that.columnClass(column);

        // watching if value is max
        if (that.opts.maxValuesColumns && that.opts.cellMaxValueClass) {
          let isMaxCounted = that.opts.maxValuesColumns.indexOf(column) > -1;
          if (isMaxCounted && current.id == maxValues[column].row_id) cellStyle += that.opts.cellMaxValueClass;
        }

        columns.push(
          <td class={ cellStyle }>
            { that.render(current, column, h) }
          </td>
        )
      }.bind(that));

      rowClass = that.opts.rowClassCallback ? that.opts.rowClassCallback(current) : '';

      result[current.category_name].push(
        <tr on-click={ that.rowWasClicked.bind(that, current) }
            class={ rowClass } >{ columns }</tr>
      );

      return result;
    }.bind(that), {});

    _values(groups).forEach(function (current) {
      rows = [...rows, ...current];
    });
  } else {
    data.map(function (row, index) {
      columns = [];

      if (that.opts.childRow) columns.push(
        <td on-click={ that.toggleChildRow.bind(that,row[rowKey]) }
            class={ `VueTables__child-row-toggler ` + that.childRowTogglerClass(row[rowKey]) }>
            &nbsp;
        </td>
      );

      mapColumns.call(that, columns, )

      that.allColumns.map(function (column) {
        let cellStyle = that.columnClass(column);

        // watching if value is max
        if (that.opts.maxValuesColumns && that.opts.cellMaxValueClass) {
          let isMaxCounted = that.opts.maxValuesColumns.indexOf(column) > -1;
          if (isMaxCounted && current.id == maxValues[column].row_id) cellStyle += that.opts.cellMaxValueClass;
        }

        columns.push(
          <td class={ cellStyle }>
            { that.render(current, column, h) }
          </td>
        )
      }.bind(that));

      rowClass = that.opts.rowClassCallback ? that.opts.rowClassCallback(row) : '';

      rows.push(
        <tr on-click={ that.rowWasClicked.bind(that, row) }
            class={ rowClass } >{ columns }</tr>
      );

      if (that.opts.childRow && this.rowsToggleState['row_' + row[rowKey]]) {
        let childRow = that.opts.childRow;
        let template = typeof childRow === 'function' ? childRow.apply(that, [h, row]) : h(childRow, {
          attrs: {
            data: row
          }
        });
        rows.push(
          <tr class='VueTables__child-row'>
            <td colspan={ that.allColumns.length + 1 }>
              { template }
            </td>
          </tr>
        );
      }
    }.bind(that));
  }

  return rows;

};
