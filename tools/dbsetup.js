const pg = require('pg');
const pgConString = "postgres://retroadmin:password@localhost:5432/retroctf";
const pgClient = new pg.Client(pgConString);

pgClient.connect();

const jump = {
  'challname': 'Jump!',
  'filename': 'jump.bin',
  'route': 'jump',
  'author': 'zznop',
  'description': 'Cause inside-out is wiggity, wiggity, wiggity wack',
  'longdescription': 'Cause inside-out is wiggity, wiggity, wiggity wack',
  'flag': 'flag{b0bf0b43681eb9565caac9209cef8ffab73e2274}'
}

/**
 * Drop all of the tables
 */
async function dropTables() {
  await pgClient.query('DROP TABLE users');
  await pgClient.query('DROP TABLE challenges');
  await pgClient.query('DROP TABLE solves');
}

/**
 * Create the tables and populate the challenges
 */
async function setupDatabase() {
  try {
    await pgClient.query(
      'CREATE TABLE users (id UUID NOT NULL, username VARCHAR(64) NOT NULL, ' +
      'email VARCHAR(128) NOT NULL, password VARCHAR(64) NOT NULL, ' +
      'role INT NOT NULL, enabled BOOL NOT NULL, ' + 
      'CONSTRAINT users_pkey PRIMARY KEY(id))'
    );

    await pgClient.query(
      'CREATE TABLE challenges (id INT PRIMARY KEY, ' +
      'challname VARCHAR(128) NOT NULL, filename VARCHAR(128) NOT NULL, ' +
      'route VARCHAR(128) NOT NULL, author VARCHAR(128) NOT NULL, ' +
      'description VARCHAR(280) NOT NULL, ' +
      'longdescription VARCHAR(1024) NOT NULL, flag VARCHAR(128) NOT NULL)'
    );

    await pgClient.query(
      'CREATE TABLE solves (id SERIAL PRIMARY KEY, uid UUID NOT NULL, ' + 
      'cid INT NOT NULL)'
    );

    await pgClient.query(
      'INSERT INTO challenges (id, challname, filename, route, author, ' +
      'description, longdescription, flag) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        1, jump.challname, jump.filename,
        jump.route, jump.author, jump.description,
        jump.longdescription, jump.flag
      ]
    );

    pgClient.end();
  } catch (err) {
    console.log(err.message);
  }
}

dropTables();
setupDatabase();
