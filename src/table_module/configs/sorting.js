export default function(sortableColumns, groupByObject) {
  // needed for group sorting
  let groupSorter = function (cellName) {
    return function (ascending) {
      return function (a, b) {
        let groupA = a[groupByObject.prop];
        let groupB = b[groupByObject.prop];

        let cellA = typeof a[cellName] == 'string' ? a[cellName].toLowerCase() : a[cellName];
        let cellB = typeof b[cellName] == 'string' ? b[cellName].toLowerCase() : b[cellName];

        // sort by group name
        if (groupByObject.ascending) {
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
  let obj = {};
  for (let i = 0; i < sortableColumns.length; i++) {
    obj[sortableColumns[i]] = groupSorter(sortableColumns[i]);
  }

  return obj;
}
