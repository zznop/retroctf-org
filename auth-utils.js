exports.validateEmail = function(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.length > 128) {
      return false;
    }

    return re.test(String(email).toLowerCase());
}

exports.validateUsername = function(username) {
  const re = /^[a-zA-Z0-9]+$/;

  if (username.length > 64) {
    return false;
  }

  return re.test(String(username));
}

exports.emailInUse = async function(cli, email) {
  const query = await cli.query(
    'SELECT * FROM users WHERE email = $1', [email.toLowerCase()]
  );

  if (query.rows.length != 0) {
    return false;
  }

  return true;
}
