const pg = require('pg');
const pgConString = "postgres://retroadmin:password@localhost:5432/retroctf";
const pgClient = new pg.Client(pgConString);

pgClient.connect();

const jump = {
  'challname': 'Jump!',
  'filename': 'jump.bin',
  'author': 'zznop',
  'description': 'Cause inside-out is wiggity, wiggity, wiggity wack',
  'longdescription': 'Cause inside-out is wiggity, wiggity, wiggity wack',
  'flag': 'flag{b0bf0b43681eb9565caac9209cef8ffab73e2274}'
}

async function main() {
  try {
    const query = await pgClient.query(
      'INSERT INTO challenges (id, challname, filename, author, description, longdescription, flag) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        1, jump['challname'], jump['filename'],
        jump['author'], jump['description'], jump['longdescription'],
        jump['flag']
      ]
    );

    pgClient.end();
  } catch (err) {
    console.log(err.message);
  }
}

main();
