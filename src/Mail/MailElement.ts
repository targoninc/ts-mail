/**
 * Represents a piece of email content that can be rendered as both HTML and plain text.
 */
export interface MailElement {
    /** HTML representation, suitable for rich emails. */
    html: string,
    /** Plain-text representation, suitable as a text-only fallback. */
    text: string,
}