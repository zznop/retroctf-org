# retroctf.org

# Database Setup

Create the database and user with psql:

```
CREATE DATABASE "retroctf";
CREATE USER retroadmin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE retroctf TO retroadmin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO retroadmin;
```

Create the tables and insert the challenges with `dbsetup.js` in `/tools`:

```
$ node dbsetup.js

```


# Installation

Clone the repository and install the dependencies with `npm`:

```
$ npm install
```

Start the app with `npm start` or `./bin/www`

