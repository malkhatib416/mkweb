"use server";
import nodemailer from "nodemailer";
import { EMAIL } from "./contactInfo";
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail(params: {
  email: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const { email, subject, text, html } = params;
  console.log("SMTP_SERVER_HOST", SMTP_SERVER_HOST, params);

  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error("SMTP Server Not Verified");
    }
  } catch (error) {
    console.error(
      "Something Went Wrong",
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error
    );
    return;
  }
  const info = await transporter.sendMail({
    from: {
      name: "MK-Web Formulaire de Contact",
      address: EMAIL,
    },
    to: {
      name: "MK-Web Formulaire de Contact",
      address: email,
    },
    subject: subject,
    text: text,
    html: html ? html : "",
  });
  console.log("Message Sent", info);
  console.log("Mail sent to", SITE_MAIL_RECIEVER);
  return info;
}
