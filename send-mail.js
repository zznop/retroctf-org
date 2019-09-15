const nodemailer = require('nodemailer')

/**
 * Send a verification email to the specified email address
 *
 * @param  {String}  emailAddr Receiver's email address.
 * @param  {String}  uuid      User's UUID (for link construction).
 * @return {Boolean}           True on success, False on failure.
 */
exports.sendVerificationEmail = function(emailAddr, uuid) {
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
        '<p>Before you get started, we need to verify your email address.' +
        'Just click <a href=\'https://retroctf.org/verify/' + uuid +
        '\'>this link</a></p>' +
        '<p>Happy hacking!</p>';

	const mailOptions = {
			from: '"Retro CTF" <noreply@retroctf.org>',
			to: emailAddr,
			subject: 'Please verify your email address',
			html: emailContent,
	};

	return transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
					return false;
			}

      return true;
	});
}
