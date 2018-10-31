const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(`${__dirname}/db.json`)
const middlewares = jsonServer.defaults()
const _ = require('lodash');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

const flatCategories = (node) => {
  return node.categories ?
    [ Object.assign({}, node, { categories: [] }), _.map(node.categories, flatCategories)]
    : Object.assign({}, node, { categories: null});
}

const flatWingCategories = (wingNo) => {
  return router.db.get('shelves').value()[wingNo].shelves.reduce((categories, shelf) => {
    return [...categories, ..._.flatMapDeep(shelf.categories, flatCategories)];
  }, []);
}

const flatShelfCategories = (wingNo) => {
  return router.db.get('shelves').value()[wingNo].shelves.map(shelf => {
    return _.flatMapDeep(shelf.categories, flatCategories);
  });
}

const prepareFlatWingCategories = () => {
  let wingCategories = [];
  for (let i = 0; i < 4; i++) {
    wingCategories.push(flatWingCategories(i));
  }
  return wingCategories;
}

const getCategoryInfo = (category) => {
  let wingCategories = prepareFlatWingCategories();
  let wing = 0, shelf = 0, label = '';
  for (let w = 0; w < 4; w++) {
    const categories = wingCategories[w].map(cat => cat.value);
    if (categories.includes(category)) {
      label = wingCategories[w].find(x => x.value == category).label;
      wing = w;
      const wingShelfCategories = flatShelfCategories(wing);
      for (let s = 0; s < wingShelfCategories.length; s++) {
        const categories = wingShelfCategories[s].map(cat => cat.value);
        if (categories.includes(category)) {
          shelf = parseInt(router.db.get('shelves').value()[w].shelves[s].value.replace('S.', ''));
        }
      }
    }
  }
  return { label, value: category, wing, shelf }
}

const getBookIndicator = (bookId) => {
  let wingShelf = [];
  const book = router.db.get('books').find({value: bookId}).value();
  if (book.categories) {
    book.categories.forEach(category => {
      let data = getCategoryInfo(category);
      wingShelf.push({ wing: data.wing, shelf: data.shelf });
    });
  }
  return wingShelf;
}

const getBooks = (query) => {
  const books = router.db.get('books')
    .filter(obj => obj.title.toLowerCase().includes(query.toLowerCase())).value();
  return books;
}

const getAllShelves = () => {
  const shelves = router.db.get('shelves').value();
  return [
    ...shelves[0].shelves,
    ...shelves[1].shelves,
    ...shelves[2].shelves,
    ...shelves[3].shelves,
  ];
}

// Add custom routes before JSON Server router
// (1)
server.get('/categories/:id', (req, res) => {
  const id = req.params.id;
  const info = getCategoryInfo(id);
  res.jsonp(info);
})

// (2)
server.get('/wing/:wing/shelves', (req, res) => {
  const wing = req.params.wing;
  const info = router.db.get('shelves').find({value:wing}).value();
  res.jsonp(info.shelves);
})

// (3)
server.get('/books/:id', (req, res) => {
  const id = req.params.id;
  const info = router.db.get('books').find({value:id}).value();
  res.jsonp(info);
})

// (4)
server.get('/shelves/:id', (req, res) => {
  const id = req.params.id;
  const info = getAllShelves().find(s => s.value == id);
  res.jsonp(info || {});
})

// (5) "/categories/:category/books": "/books?categories_contains=:category",

// (6) "/books?q=:query": "/books?title_like=:query"
server.get('/books', (req, res) => {
  const query = req.query.q;
  let books = getBooks(query);
  books = books.map(book => {
    const indicator = getBookIndicator(book.value);
    if(indicator.length){
      book = Object.assign(book, indicator[0]);
    }
    return book;
  })
  res.jsonp(books);
})

server.use(jsonServer.rewriter(require(`${__dirname}/routes.json`)))

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('The API is now running...')
})