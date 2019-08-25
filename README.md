# retroctf.org

# Dependencies

```
npm install express
npm install crypto
npm install pg
npm install express-session
npm install uuid
```

# Database Setup

```
CREATE DATABASE "retroctf";
CREATE USER retroadmin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO retroadmin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO retroadmin;

CREATE TABLE users (
 id UUID NOT NULL,
 username CHAR(64) NOT NULL,
 email CHAR(128) NOT NULL,
 password CHAR(64) NOT NULL,
 role INT NOT NULL,
 CONSTRAINT users_pkey PRIMARY KEY(id)
);

CREATE TABLE challenges (
  id INT PRIMARY KEY,
  challname VARCHAR(128) NOT NULL,
  filename VARCHAR(128) NOT NULL,
  author VARCHAR(128) NOT NULL,
  description VARCHAR(280) NOT NULL,
  longdescription VARCHAR(1024) NOT NULL,
  flag VARCHAR(128) NOT NULL,
);

INSERT INTO users (id, username, email, password, role)
  VALUES ('b7ae4d1e-01ee-4b74-8b12-3bc8051d7c38', 'admin', 'admin@retroctf.org', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 1);

```
