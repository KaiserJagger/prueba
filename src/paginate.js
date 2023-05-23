class Paginate {
    constructor(items, currentPage = 1, perPage = 10) {
      this.items = items;
      this.currentPage = currentPage;
      this.perPage = perPage;
      this.totalItems = items.length;
      this.totalPages = Math.ceil(this.totalItems / this.perPage);
      this.offset = (this.currentPage - 1) * this.perPage;
      this.paginatedItems = this.items.slice(this.offset, this.offset + this.perPage);
    }
  }
  
  export default Paginate;
  