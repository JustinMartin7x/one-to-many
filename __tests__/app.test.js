const { response } = require('express');
const fs = require('fs');
const request = require('supertest');
const app = require('../lib/utils/app');
const Authors = require('../lib/utils/models/Authors');
const Books = require('../lib/utils/models/Books');
const pool = require('../lib/utils/pool');





describe('app end point', () => {
  beforeAll(() => {
    return pool.query(fs.readFileSync(`${__dirname}/../sql/setupSQL.sql`, 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it ('creates a new Author via Post', async() => {
    const res = await request(app)
      .post('/authors')
      .send({
        name: 'Aleron Kong',
        books: 'the land',
        genre: 'LitRPG'
      });
    expect(res.body).toEqual({
      id: '1',
      name: 'Aleron Kong',
      books: 'the land',
      genre: 'LitRPG'
    });
  });



  it ('finds an author by id via Get', async() => {

    const author = await Authors.create(
      {
        name: 'Richard Dawkins',
        books: 'The God Delusion',
        genre: 'non-fic'
      });

    const books = await Promise.all([
      {
        title: 'hello world',
        author_id: author.id
      },
      {
        title: 'am i done yet',
        author_id: author.id
      }
    ].map(books => Books.create(books)));
  

    const response = await request(app)
      .get(`/authors/${author.id}`);


    expect(response.body).toEqual({
      ...author,
      books });
  });





  it ('updates an Author by using id and PUT', async() => {
    const author = await Authors.create({ name: 'Aleron Kong', books: 'The Land, Gods Eye', genre: 'LITRPG GNOMES RULE!' });
    const response = await request(app)
      .put(`/authors/${author.id}`)
      .send({
        name: 'Aleron MFing Kong',
        books: 'The Land, Gods EYE GNOMES RULE!!',
        genre: 'LITRPG GNOMES RULE!'
      });
    expect(response.body).toEqual({
      id: '3',
      name: 'Aleron MFing Kong',
      books: 'The Land, Gods EYE GNOMES RULE!!',
      genre: 'LITRPG GNOMES RULE!' 
    });
  });
  it('it deletes author bu using ID and Delete route', async() => {
    const author = await Authors.create({ name: 'Orson Wells', books: '1984', genre: 'distopian fiction' });
    const response = await request(app)
      .delete(`/authors/${author.id}`);
    expect(response.body).toEqual(author);
  });
  ////////// test for BOOKS
  it ('creates a new Book via Post', async() => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'the land',
        author_id: 1
      });
    expect(res.body).toEqual({
      id: '3',
      title: 'the land',
      author_id: '1'
    });
  });

  it ('should return a book by using Get', async() => {
    const author = await Authors.create({ name: 'me', books: 'how to code', genre: 'fantasy' });
    const book = await Books.create({ title: 'how to code ', author_id: author.id });
  
    const res = await request(app)
      .get(`/books/${book.id}`);
    expect(res.body).toEqual(book);
  });

  it ('should update a book by ID and PUT route', async() => {
    const author = await Authors.create({ name: 'tom riddle', books: 'fail army', genre: 'fiction' });
    const book = await Books.create({ title: 'fubar', author_id: author.id }); 
    const res = await request(app)
      .put(`/books/${book.id}`)
      .send({ title: 'still failing', author_id: author.id });
    expect(res.body).toEqual({ id: book.id,  title: 'still failing', author_id: book.author_id });
  });
  
  it ('should delete a book by ID using .delete', async() => {
    const author = await Authors.create({ name: 'Voldemort', books: 'how to fail at killing a kid', genre: 'humor' });
    const book = await Books.create({ title: 'the dark arts', author_id: author.id });
    const res = await request(app)
      .delete(`/books/${book.id}`);
    expect(res.body).toEqual(book);
  });

});
