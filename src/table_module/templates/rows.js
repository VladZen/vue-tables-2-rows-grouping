var _values = require('lodash.values');

module.exports = function (h, that) {
  var rows = [];
  var columns;
  var rowKey = that.opts.uniqueKey;

  var rowClass;
  var data = that.source == 'client' ? that.filteredData : that.tableData;
  var shownGroups = that.$parent.shownGroups;

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
        let toggleIconClass = currentGroupIsCollapsed ? 'glyphicon glyphicon-chevron-down' : 'glyphicon glyphicon-chevron-up';

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
        columns.push(
          <td class={ that.columnClass(column) }>
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

      // в массив columns вставляется ячейка для разворачивания дочерней строки
      if (that.opts.childRow) columns.push(
        <td on-click={ that.toggleChildRow.bind(that,row[rowKey]) }
            class={ `VueTables__child-row-toggler ` + that.childRowTogglerClass(row[rowKey]) }>
            &nbsp;
        </td>
      );

      that.allColumns.map(function (column) {
        columns.push(
          <td class={ that.columnClass(column) }>
            { that.render(row, column, h) }
          </td>
        )
      }.bind(that));

      rowClass = that.opts.rowClassCallback ? that.opts.rowClassCallback(row) : '';

      rows.push(
        <tr on-click={ that.rowWasClicked.bind(that, row) }
            class={ rowClass } >{ columns }</tr>
      );

      if (that.opts.childRow && this.rowsToggleState['row_' + row[rowKey]]) {
        var childRow = that.opts.childRow;
        var template = typeof childRow === 'function' ? childRow.apply(that, [h, row]) : h(childRow, {
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
