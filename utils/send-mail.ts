"use server";
import nodemailer from "nodemailer";
import { EMAIL } from "./consts";
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

const verifyRecaptcha = async (token: string) => {
  try {
    console.log({ token, secret: process.env.RECAPTCHA_SECRET_KEY });
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      throw new Error("No Recaptcha Secret Key");
    }

    if (!token) {
      throw new Error("No Recaptcha Token");
    }

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    );
    const data = await response.json();
    console.log({ data });
    if (!data.success) {
      throw new Error("Recaptcha verification failed");
    }
  } catch (err) {
    console.error("Error verifying recaptcha: ", err);
    throw new Error("Error verifying recaptcha: " + err);
  }
};

export async function sendMail(params: {
  email: string;
  subject: string;
  text: string;
  html?: string;
  recaptchaToken: string;
  fromName?: string;
}) {
  const { email, subject, text, html, recaptchaToken, fromName } = params;

  await verifyRecaptcha(recaptchaToken).catch((e) => {
    throw new Error("Error verifying recaptcha: " + e);
  });

  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error("SMTP Server Not Verified");
    }
  } catch (error) {
    console.error("Something Went Wrong", error);
    throw new Error("SMTP Server Not Verified: " + error);
  }
  try {
    const info = await transporter.sendMail({
      from: {
        name: fromName || "MK-Web Formulaire de Contact",
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
    return info;
  } catch (e) {
    throw new Error("Error sending mail: " + e);
  }
}
