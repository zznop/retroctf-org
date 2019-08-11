# retroctf.org

# Database Setup

```
CREATE DATABASE "retroctf";
CREATE USER retroadmin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO retroadmin;

CREATE TABLE users (
 id UUID NOT NULL,
 username CHAR(64) NOT NULL,
 email CHAR(128) NOT NULL,
 password CHAR(64) NOT NULL,
 role INT NOT NULL,
 CONSTRAINT users_pkey PRIMARY KEY(id)
);

INSERT INTO users (id, username, email, password, role)
  VALUES ('b7ae4d1e-01ee-4b74-8b12-3bc8051d7c38', 'zznop', 'zznop0x90@gmail.com', '5E884898DA28047151D0E56F8DC6292773603D0D6AABBDD62A11EF721D1542D8', 1);
```