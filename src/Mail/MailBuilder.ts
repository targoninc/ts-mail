import {MailElement} from "./MailElement.js";
import {MailBuild} from "./MailBuild.js";
import {defaultMailStyle} from "./defaultMailStyle.js";

const breakString = "\r\n\r\n";

export function link(url: string = "/", text: string = url): MailElement {
    return {
        html: `<a href="${url}" target="_blank">${text}</a>${breakString}`,
        text: url + breakString
    };
}

export function paragraph(text: string): MailElement {
    return {
        html: `<p>${text}</p>${breakString}`,
        text: text + breakString
    }
}

export function heading(text: string, size = 1): MailElement {
    return {
        html: `<h${size}>${text}</h${size}>${breakString}`,
        text: text + breakString,
    }
}

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

export class MailBuilder {
    public subjectLine = "";
    public head = "";
    public body = "";
    public text = "";

    constructor() {
    }

    static new(): MailBuilder {
        return new MailBuilder();
    }

    static default(logoUrl: string): MailBuilder {
        return MailBuilder.new()
            .style(defaultMailStyle)
            .image(logoUrl, "Logo", 32, 32);
    }

    public subject(text: string): this {
        this.subjectLine = text;

        return this;
    }

    public heading(text: string, size = 1): this {
        this.body += heading(text, size).html;
        this.text += heading(text, size).text;

        return this;
    }

    public paragraph(text: string): this {
        this.body += paragraph(text).html;
        this.text += paragraph(text).text;

        return this;
    }

    public link(url: string, text: string = url): this {
        this.body += link(url, text).html;
        this.text += link(url, text).text;

        return this;
    }

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

    public style(css: string): this {
        this.head += `<style>${css}</style>`;

        return this;
    }

    public get(): MailBuild {
        this.body = `<html><head>${this.head}</head><body><div class="root">${this.body}</div</body></html>`;

        return {
            subject: this.subjectLine,
            html: this.body,
            text: this.text
        }
    }

    public card(content: MailElement[]): this {
        this.body += card(content).html;
        this.text += card(content).text;

        return this;
    }

    public image(url: string, alt: string, width: number, height: number): this {
        this.body += `<img src="${url}" alt="${alt}" title="${alt}" width="${width}" height="${height}" style="display:block"/>`;

        return this;
    }

    quote(text: string): this {
        this.body += `<blockquote>${text}</blockquote>`
        this.text += `"${text}"${breakString}`;

        return this;
    }
}
