module.exports = function(source) {
  return function(h) {
    var rows = require('./rows')(h, this);
    var normalFilter = require('./normal-filter')(h, this);
    var dropdownPagination = require('./dropdown-pagination')(h, this);
    var noResults = require('./no-results')(h, this);
    var pagination = require('./pagination')(h, this);
    var dropdownPaginationCount = require('./dropdown-pagination-count')(h, this);
    var headings = require('./headings')(h, this);
    var perPage = require('./per-page')(h, this);


    return <div class={"w-75 VueTables VueTables--" + this.source}>
      <div class="row">
        <div class="col-md-6">
          {normalFilter}
        </div>
        <div class="col-md-6">
          {dropdownPagination}
          {perPage}
        </div>
      </div>
      <table class={'VueTables__table table ' + this.opts.skin}>
        <thead class="thead-inverse">
          <tr>
            {headings}
          </tr>
        </thead>
    
        <tbody>
          {noResults}
          {rows}
         </tbody>
      </table>
      {pagination}
      {dropdownPaginationCount}
    </div>
  }
}
