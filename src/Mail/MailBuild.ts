import {MailElement} from "./MailElement.js";

/**
 * Represents a complete, render-ready email payload produced by {@link MailBuilder}.
 * Combines the common {@link MailElement} fields with a subject line.
 */
export interface MailBuild extends MailElement {
    /** The email subject line. */
    subject: string;
}