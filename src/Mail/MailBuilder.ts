import {MailElement} from "./MailElement.js";
import {MailBuild} from "./MailBuild.js";
import {defaultMailStyle} from "./defaultMailStyle.js";

const breakString = "\r\n\r\n";

/**
 * Creates an anchor/link element for emails.
 *
 * @param url - The URL to link to. Defaults to "/".
 * @param text - The visible text of the link. Defaults to the URL value.
 * @returns A {@link MailElement} containing HTML and text variants.
 */
export function link(url: string = "/", text: string = url): MailElement {
    return {
        html: `<a href="${url}" target="_blank">${text}</a>${breakString}`,
        text: url + breakString
    };
}

/**
 * Creates a paragraph element for emails.
 *
 * @param text - The paragraph content.
 * @returns A {@link MailElement} containing HTML and text variants.
 */
export function paragraph(text: string): MailElement {
    return {
        html: `<p>${text}</p>${breakString}`,
        text: text + breakString
    }
}

/**
 * Creates a heading element for emails.
 *
 * @param text - Heading content.
 * @param size - Heading level from 1–6. Defaults to 1.
 * @returns A {@link MailElement} containing HTML and text variants.
 */
export function heading(text: string, size = 1): MailElement {
    return {
        html: `<h${size}>${text}</h${size}>${breakString}`,
        text: text + breakString,
    }
}

/**
 * Creates an image element for emails.
 *
 * @param url - The image URL.
 * @param alt - Alternative text and title attribute.
 * @param width - Width in pixels.
 * @param height - Height in pixels.
 * @returns A {@link MailElement} containing HTML and text variants.
 */
export function image(url: string, alt: string, width: number, height: number): MailElement {
    return {
        html: `<img src="${url}" alt="${alt}" title="${alt}" width="${width}" height="${height}" style="display:block"/>${breakString}`,
        text: alt + breakString
    }
}

/**
 * Creates a card container that wraps multiple mail elements.
 *
 * @param content - The child elements to include inside the card.
 * @returns A {@link MailElement} with concatenated child HTML/text inside a styled div.
 */
export function card(content: MailElement[]): MailElement {
    let html = `<div class="card">`;
    let text = "";

    for (const element of content) {
        html += element.html;
        text += element.text;
    }

    html += `</div>`;
    return {
        html,
        text
    }
}

/**
 * Fluent builder for composing styled email content and metadata.
 *
 * Typical usage:
 * ```ts
 * const mail = MailBuilder.default("https://example.com/logo.png")
 *   .subject("Welcome")
 *   .heading("Hello!")
 *   .paragraph("Thanks for joining.")
 *   .get();
 * ```
 */
export class MailBuilder {
    public subjectLine = "";
    public head = "";
    public body = "";
    public text = "";

    constructor() {
    }

    /**
     * Creates a new empty builder instance.
     */
    static new(): MailBuilder {
        return new MailBuilder();
    }

    /**
     * Creates a builder with default styles and a logo image.
     *
     * @param logoUrl - The URL of the logo to display at the top of the email.
     */
    static default(logoUrl: string): MailBuilder {
        return MailBuilder.new()
            .style(defaultMailStyle)
            .image(logoUrl, "Logo", 32, 32);
    }

    /**
     * Sets the email subject line.
     *
     * @param text - Subject text.
     */
    public subject(text: string): this {
        this.subjectLine = text;

        return this;
    }

    /**
     * Appends a heading to the email body.
     *
     * @param text - Heading content.
     * @param size - Heading level from 1–6. Defaults to 1.
     */
    public heading(text: string, size = 1): this {
        this.body += heading(text, size).html;
        this.text += heading(text, size).text;

        return this;
    }

    /**
     * Appends a paragraph to the email body.
     *
     * @param text - Paragraph content.
     */
    public paragraph(text: string): this {
        this.body += paragraph(text).html;
        this.text += paragraph(text).text;

        return this;
    }

    /**
     * Appends a link to the email body.
     *
     * @param url - Target URL.
     * @param text - Visible link text. Defaults to the URL value.
     */
    public link(url: string, text: string = url): this {
        this.body += link(url, text).html;
        this.text += link(url, text).text;

        return this;
    }

    /**
     * Adds a signature block with sender, company, current date, and optional settings link.
     *
     * @param sender - The sender's display name.
     * @param company - The company name.
     * @param settingsLink - Optional URL to allow the recipient to adjust settings.
     */
    public signature(sender: string, company: string, settingsLink?: string): this {
        const currentDate = new Date().toLocaleDateString();

        this.body += `<span>Kind regards,<br>${sender}</span><br><span class="small-text grey">${company}, ${currentDate}</span>`;
        this.text += `Kind regards,${breakString}${sender}${breakString}${company}, ${currentDate}${breakString}`;

        const disableLink = link(settingsLink, "settings");
        if (settingsLink) {
            this.body += `<br><span>You've enabled getting notifications for this in your ${disableLink.html}</span>`;
            this.text += `You've enabled getting notifications for this here ${disableLink.text}`;
        }

        return this;
    }

    /**
     * Appends raw CSS to the email's head inside a style tag.
     *
     * @param css - Styles to include.
     */
    public style(css: string): this {
        this.head += `<style>${css}</style>`;

        return this;
    }

    /**
     * Finalizes and returns the built email parts.
     *
     * @returns A {@link MailBuild} object with subject, HTML body, and plain text.
     */
    public get(): MailBuild {
        this.body = `<html><head>${this.head}</head><body><div class="root">${this.body}</div</body></html>`;

        return {
            subject: this.subjectLine,
            html: this.body,
            text: this.text
        }
    }

    /**
     * Appends a card container with the provided child elements.
     *
     * @param content - Elements to wrap in a styled card.
     */
    public card(content: MailElement[]): this {
        this.body += card(content).html;
        this.text += card(content).text;

        return this;
    }

    /**
     * Appends an image tag to the email body.
     *
     * @param url - Image URL.
     * @param alt - Alternative text and title attribute.
     * @param width - Width in pixels.
     * @param height - Height in pixels.
     */
    public image(url: string, alt: string, width: number, height: number): this {
        this.body += image(url, alt, width, height).html;
        this.text += image(url, alt, width, height).text;

        return this;
    }

    /**
     * Appends a blockquote with the provided text.
     *
     * @param text - The quote text.
     */
    quote(text: string): this {
        this.body += `<blockquote>${text}</blockquote>`
        this.text += `"${text}"${breakString}`;

        return this;
    }
}
