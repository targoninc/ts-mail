# How to use

## Install

| Package manager | Command                     |
|-----------------|-----------------------------|
| bun             | `bun i @targoninc/ts-mail`  |
| pnpm            | `pnpm i @targoninc/ts-mail` |
| npm             | `npm i @targoninc/ts-mail`  |

## Send mail

```typescript
import {Mail, MailBuilder} from "@targoninc/ts-mail";

// Build mail
mail = MailBuilder.default()
    .subject("You got mail")
    .heading("This is a mail")
    .paragraph(`Something happened!`)
    .card([
        paragraph("Some details"),
        link("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "Relevant site")
    ])
    .signature("Platform", "Company", "https://site.com/settings")
    .get();

// Send mail
Mail.sendDefault("noreply@nowhere", mail);
```
