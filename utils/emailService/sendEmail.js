import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (reciever, subject, text) => {
  const msg = {
    to: reciever,
    from: process.env.SENDGRID_EMAIL,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (err) {
    console.log("err is from here", err);
  }
};

export default sendEmail;
