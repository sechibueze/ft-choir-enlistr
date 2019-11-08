const { pool } = require('./DbTables');

module.exports = class Model {
  constructor(table) {
    this.table = table;
    this.pool = pool;
  }

  select(fields, clause = '') {
    const query = `SELECT ${fields} FROM ${this.table} ${clause}`;
    console.log('select query:', query);
    return this.pool.query(query);

  }

  insert(fields, values, clause = '') {
    // const placeholder = this.prepareFields(values);//Object.keys(fields);
    const query = `INSERT INTO ${this.table} (${fields}) VALUES (${values}) ${clause}`;
    // logger(`${this.table} insert query : `, query, values);
    // console.log('query', query);
    return this.pool.query(query, values);
  }

  insertQuery(text, values) {

    return this.pool.query(text, values);
  }

  update(field, value, constraint = '') {
    //UPDATE customers SET email = 'segoo@gmail.com', status = TRUE WHERE id = 5 RETURNING email;
    const query = `UPDATE ${this.table} SET ${field} = '${value}' ${constraint}`;
    // logger(`${this.table} update query : `, query);
    return this.pool.query(query);

  }

  delete(clause = '') {
    const query = `DELETE FROM ${this.table} ${clause}`;
    // logger(`${this.table} delete query : `, query);
    return this.pool.query(query);
  }

}
