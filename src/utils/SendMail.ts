import nodemailer from "nodemailer";
import { SMTP_EMAIL, SMTP_PASSWORD } from "../config/config";

export const sendMail = async (options: {
  to: string;
  subject: string;
  text: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: SMTP_EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};
