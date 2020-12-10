const pool = require('../pool');

module.exports = class Books {
    id;
    title;
    author_id;

    constructor(row) {
      this.id = String(row.id);
      this.title = row.title;
      this.author_id = String(row.author_id);
    }
    static async create({ title, author_id }) {
      const { rows } = await pool.query(
        // insert into books table, author_id references author id, shown as author name
        'INSERT INTO books (title, author_id) VALUES ($1, $2) RETURNING *',
        [title, author_id] 
      );
      return new Books(rows[0]);
    }

    static async read(id) {
      const { rows } = await pool.query(
        'SELECT * FROM books WHERE id=$1',
        [id]
      );
      if(!rows[0]) {
        throw new Error(`no book with ID ${id}`);
      }
      return new Books(rows[0]);
    }

    static async update(id, { title, author_id }) {
      const { rows } = await pool.query(
        `UPDATE books
          SET title=$1,
              author_id=$2
          Where id=$3
          RETURNING *
          `,
        [title, author_id, id]
      );
      return new Books(rows[0]);
    }
    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM books WHERE id=$1 RETURNING *',
        [id]
      );
      return new Books(rows[0]);
    }
};
