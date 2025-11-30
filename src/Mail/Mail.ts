import nodemailer from "nodemailer";
import * as NodeMail from "nodemailer/lib/mailer/index";
import {CLI} from "@targoninc/ts-logging";
import {MailBuild} from "./MailBuild.ts";

/**
 * Alias of Nodemailer's {@link NodeMail.Options} for convenience when constructing emails.
 */
export type Email = NodeMail.Options;

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

/**
 * Thin wrapper around Nodemailer for sending emails with logging and sane defaults.
 */
export class Mail {
    /**
     * Sends an email using the configured transporter.
     * The `from` address is automatically set from `process.env.MAIL_USER`.
     *
     * @param email - The email options to send.
     */
    static send(email: Email): void {
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

    /**
     * Convenience method to send a prebuilt email created by {@link MailBuilder}.
     *
     * @param email - Recipient email address.
     * @param mailBuild - The built mail parts (subject, html, text).
     */
    static sendDefault(email: string, mailBuild: MailBuild): void {
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