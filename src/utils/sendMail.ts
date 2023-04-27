import nodemailer from "nodemailer";

export default function sendMail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SECURE_TLS,
    auth: {
      user: process.env.LOGIN,
      pass: process.env.EMAIL_PWD,
    },
  } as any);

  let mailOptions = {
    from: process.env.EMAIL,
    to,
    envelope: {
      from: `Jbzd <${process.env.EMAIL}>`,
      to,
    },
    subject,
    text,
  };

  transporter.sendMail(mailOptions, function (err: any, data: any) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email to confirm reservation is sent.");
    }
  });
}
