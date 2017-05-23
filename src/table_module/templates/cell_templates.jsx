const CPV = (h, row) => moneyCell(h, 'CPV', row);
const EPV = (h, row) => moneyCell(h, 'EPV', row);
const cost = (h, row) => moneyCell(h, 'cost', row);
const profit = (h, row) => moneyCell(h, 'profit', row);
const revenue = (h, row) => moneyCell(h, 'revenue', row);
const clicks = (h, row) => rawCell(h, 'clicks', row);
const visits = (h, row) => rawCell(h, 'visits', row);
const CR = (h, row) => percentCell(h, 'CR', row);
const CTR = (h, row) => percentCell(h, 'CTR', row);
const CV = (h, row) => percentCell(h, 'CV', row);

function percentCell (h, cellName, row) {
  return <span class='cell-inner cell-inner__percent'>{ row[cellName] } %</span>;
}

function moneyCell (h, cellName, row) {
  return <span class='cell-inner cell-inner__money'>$ { row[cellName] }</span>;
}

function rawCell (h, cellName, row) {
  return <span class='cell-inner cell-inner__raw'>{ row[cellName] }</span>;
}

export { CPV, EPV, cost, profit, revenue, clicks, visits, CR, CTR, CV };
