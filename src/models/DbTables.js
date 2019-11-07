/*****
 *  This module defines the DATABASE source for test environment
 *  in Travis CI build. It uses make-runnable package and written in ES5
 *  
 *  The data source for production is found in db.Config.js
 *  
 *  process.env.DB_CONNECT is set in Travis config vars
 */
const pg = require('pg');

let connection = process.env.DATABASE_URL || 'postgresql://postgres:christinme@localhost:5432/ft-choir-enlistr';//process.env.DB_CONNECT || process.env.DATABASE_URL_DEV || process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString: connection
});

pool.on('connect', () => console.log('DBTables:connected to DB with : ', connection));


// TBquery : a collection of CREATE TABLE queries for DB
// Optionally specify the < project > 
const util = (TBquery, project = '') => {
  pool.query(TBquery)
    .then(result => {
      console.log(`success: created ${project} tables`);
      pool.end();
    })
    .catch(e => {
      console.log(`error: failed to create ${project} tables`, e);
      pool.end();
    });
}

const createTables = () => {
  const tableQuery = `
  -- Create Members Table 
    CREATE TABLE IF NOT EXISTS
    members(
      user_id SERIAL NOT NULL PRIMARY KEY,
      choir_id VARCHAR(255) NOT NULL UNIQUE,
      surname VARCHAR(255) NOT NULL ,
      firstname VARCHAR(255) NOT NULL ,
      middlename VARCHAR(255) NOT NULL,
      team VARCHAR(255) NOT NULL ,
      part VARCHAR(255) NOT NULL ,
      gender VARCHAR(255) NOT NULL ,
      phone VARCHAR(255) NOT NULL,
      accomodation BOOLEAN NOT NULL DEFAULT FALSE,
      registered BOOLEAN NOT NULL DEFAULT FALSE,
      availability TEXT[] NOT NULL,
      otp VARCHAR(255), 
      entry_date DATE NOT NULL DEFAULT NOW()
    );
    
  -- Create Qualifiers Table 
    CREATE TABLE IF NOT EXISTS
    qualifiers(
      user_id SERIAL NOT NULL PRIMARY KEY,
      choir_id VARCHAR(255) NOT NULL UNIQUE,
      surname VARCHAR(255) NOT NULL
    );
  `;
  // Run the Query
  util(tableQuery, 'ft-choir-enlistr');
}

// Export for use in command line
module.exports = {
  createTables,
  pool
};
require('make-runnable');