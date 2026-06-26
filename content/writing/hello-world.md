---
title: "Hello, World"
date: "2026-06-27"
description: "A first post — and a quick tour of what this writing setup can render."
---

This is the first entry. It's also a quick tour of everything the writing setup
supports, so you can see how a real article will look.

## Formatting

You get **bold**, _italics_, ~~strikethrough~~, and `inline code`. Links look
like [this one to Keploy](https://keploy.io) and open in a new tab.

> Blockquotes are styled with a green rule on the left — handy for pull quotes
> or asides.

## Lists

- Bullet lists
- with multiple items
  - and nested ones

1. Numbered lists
2. work too

- [x] Task lists render checkboxes
- [ ] like GitHub

## Code

Fenced code blocks get syntax highlighting:

```ts
async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { slug, ...data, content };
}
```

## Tables

| Feature        | Supported |
| -------------- | --------- |
| Headings       | ✅        |
| Code blocks    | ✅        |
| Tables         | ✅        |
| Footnotes      | ✅[^1]    |

That's the whole toolkit. Write in the editor, hit save, commit, and it's live.

[^1]: Footnotes render at the bottom, just like this.
