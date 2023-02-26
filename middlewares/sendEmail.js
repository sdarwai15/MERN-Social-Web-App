const NodeMailer = require("nodemailer");

module.exports = {
	async sendEmail(options) {
		const transporter = NodeMailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
		});

		const mailOptions = {
			from: process.env.SMTP_USER,
			to: options.email,
			subject: options.subject,
			text: options.message,
		};

		return transporter.sendMail(mailOptions);
	},
};
