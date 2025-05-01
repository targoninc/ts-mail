import nodemailer from "nodemailer";
import {Options} from "nodemailer/lib/mailer";
import {CLI} from "@targoninc/ts-logging";
import {MailBuild} from "./Mail/MailBuild.ts";

export type Email = Options;

const requiredEnvVars = ["MAIL_HOST", "MAIL_USER", "MAIL_PASSWORD"];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar] || process.env[envVar].trim().length === 0);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing environment variables for mail: ${missingEnvVars.join(", ")}`);
}

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? "25"),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
});

export class Mail {
    static send(email: Email) {
        CLI.debug(`Sending email to ${email.to}: ${email.subject}`);
        email.from = process.env.MAIL_USER;
        transporter.sendMail(email, (error, info) => {
            if (error) {
                CLI.error("Error sending email: " + JSON.stringify(error));
            } else {
                CLI.info("Email sent: " + JSON.stringify(info));
            }
        });
    }

    static sendDefault(email: string, mailBuild: MailBuild) {
        Mail.send({
            to: email.trim(),
            subject: mailBuild.subject,
            replyTo: process.env.MAIL_REPLYTO ?? process.env.MAIL_USER,
            priority: "normal",
            text: mailBuild.text,
            html: mailBuild.html,
        })
    }
}
