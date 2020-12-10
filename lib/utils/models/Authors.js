const pool = require('../pool');

module.exports = class Authors {
    id;
    name;
    books;
    genre;

    constructor(row) {
      this.id = row.id;
      this.name = row.name;
      this.books = row.books;
      this.genre = row.genre;
    }

    //CRUD  Create, Read, Update, Delete

    static  async create({ name, books, genre }) {
      const { rows } = await pool.query(
        'INSERT INTO authors (name, books, genre) VALUES ($1, $2, $3) RETURNING *',
        [name, books, genre]
      );
      return new Authors(rows[0]);  
    }
    static async read(id) {
      const { rows } = await pool.query(
        'Select * FROM authors WHERE id=$1',
        [id]
      );
      if(!rows[0]) {
        throw new Error(`no author with id${id}`);
      }
      return new Authors(rows[0]);
    }
    static async update(id, { name, books, genre }) {
      const { rows } = await pool.query(
        `UPDATE authors
              SET name=$1,
                  books=$2,
                  genre=$3
              WHERE id=$4
              RETURNING *
              `,
        [name, books, genre, id]
      );
      return new Authors(rows[0]);
    }
    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM authors Where id=$1 RETURNING *',
        [id]
      );
      return new Authors(rows[0]);
    }
    
};
