const express = require('express');
const Authors = require('./models/Authors');
const Books = require('./models/Books');
const app = express();

app.use(express.json());


// CRUD 
app.post('/authors', (req, res, next) => {
  Authors
    .create(req.body)
    .then(author => res.send(author))
    .catch(next);
});
app.get('/authors/:id', (req, res, next) => {
  Authors
    .read(req.params.id)
    .then(authors => res.send(authors))
    .catch(next);
});
app.put('/authors/:id', (req, res, next) => {
  Authors
    .update(req.params.id, req.body)
    .then(authors => res.send(authors))
    .catch(next);
});
app.delete('/authors/:id', (req, res, next) => {
  Authors
    .delete(req.params.id)
    .then(authors => res.send(authors))
    .catch(next);
});

app.post('/books', (req, res, next) => {
  Books
    .create(req.body)
    .then(book => res.send(book))
    .catch(next);
});

app.get('/books/:id', (req, res, next) => {
  Books
    .read(req.params.id)
    .then(book => res.send(book))
    .catch(next);
});


app.put('/books/:id', (req, res, next) => {
  Books
    .update(req.params.id, req.body)
    .then(book => res.send(book))
    .catch(next);

});
app.delete('/books/:id', (req, res, next) => {
  Books
    .delete(req.params.id)
    .then(book => res.send(book))
    .catch(next);
});
module.exports = app;

