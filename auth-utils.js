/**
 * Ensure the supplied email is valid
 *
 * @param  {String} email Email address supplied by the user.
 * @return {Boolean}      True if the email is valid, otherwise false.
 */
exports.validateEmail = function(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.length > 128) {
      return false;
    }

    return re.test(String(email).toLowerCase());
}

/**
 * Ensure the supplied username is valid
 *
 * @param  {String}  username Username supplied by the user.
 * @return {Boolean}          True if the username is valid, otherwise false.
 */
exports.validateUsername = function(username) {
  // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
  const re = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  return re.test(String(username));
}

/**
 * Check if the supplied email address is already in use
 *
 * @param  {pg.Client} cli   Postgres client object.
 * @param  {String}    email User-supplied email address.
 * @return {Boolean}         True if the email is in use, otherwise false.
 */
exports.emailInUse = async function(cli, email) {
  const query = await cli.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (query.rows.length !== 0) {
    return false;
  }

  return true;
}
