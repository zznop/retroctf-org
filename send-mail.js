const nodemailer = require('nodemailer')

/**
 * Send a verification email to the specified email address
 *
 * @param  {String}   emailAddr Receiver's email address.
 * @param  {String}   uuid     User's UUID (for link construction).
 * @param  {Response} res      Server HTTP response.
 */
exports.sendVerificationEmail = function(emailAddr, uuid, res) {
  const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 25,
    secure: false,
    tls:{
      rejectUnauthorized: false,
    },
  });

  const emailContent =
        '<p>Hi,</p>' +
        '<p>Welcome to Retro CTF.</p>' +
        '<p>Before you get started, we need to verify your email address. ' +
        'Just click <a href=\'https://retroctf.org/account/verify/' + uuid +
        '\'>here.</a></p>' +
        '<p>Happy hacking!</p>';

  const mailOptions = {
    from: '"Retro CTF" <noreply@retroctf.org>',
    to: emailAddr,
    subject: 'Please verify your email address',
    html: emailContent,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      res.redirect(
        '/signup?status=' +
        encodeURIComponent('Please, contact support to enable your account')
      );
    }

    // Success
    res.redirect(
      '/signup?status=' +
      encodeURIComponent('Account created! Check your email')
    );
  });
}
