import nodemailer from 'nodemailer';

const forMailUser = process.env.GMAIL_USER;
const forMailPass = process.env.GMAIL_PASS;


const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: forMailUser,
    pass: forMailPass
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, to, subject, html }, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }
};
