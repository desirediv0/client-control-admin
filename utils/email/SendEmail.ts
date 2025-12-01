import { Email } from "@/types/type";
import nodemailer from "nodemailer";
import {
  getDeleteTemplate,
  getVerificationTemplate,
} from "../temp/EmailTemplate";

const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMPT_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const SendEmail = async ({
  email,
  message,
  emailType,
}: Email): Promise<void> => {
  try {
    let htmlContent: string;
    let subject: string;

    if (emailType === "VERIFY") {
      subject = "Verify your email";
      htmlContent = getVerificationTemplate(message);
    } else if (emailType === "DELETE") {
      subject = "Delete your account";
      htmlContent = getDeleteTemplate(message);
    } else {
      throw new Error("Invalid email type");
    }

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
