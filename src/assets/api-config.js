const API = {
  key: "x-apikey",
  value: "tpapi01",
  config: {
    books: {
      // get book info
      //  => books/<book-id>
      info: "http://43.225.6.172/onlinebrowse/api/booklocator/getBook?bookId=:id",

      // get books using query (search)
      //  => /api/books?query=<query>
      search: "http://43.225.6.172/onlinebrowse/api/booklocator/searchBook?keyword=:query",

      // get all books by category
      //  => /api/category/<category-id>/books
      byCategory: "http://43.225.6.172/onlinebrowse/api/booklocator/getBooksByCategory?categoriesId=:id"
    },
    shelves: {
      // get shelf info
      // => /api/shelves/:id
      info: "http://43.225.6.172/onlinebrowse/api/booklocator/getshelf?shelf=:id",

      // get all shelves from wing
      //  => /api/wing/<wing>/shelves
      // wing = north | east | south | west
      fromWing: "http://43.225.6.172/onlinebrowse/api/booklocator/getshelves?wing=:wing"
    }
  }
};