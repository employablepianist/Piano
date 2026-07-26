+++
title = "Markdown Features"
date = 2024-02-20
+++

This post demonstrates **all** the main Markdown features supported by the
Zola Harmless theme. It builds on ideas from the first post
[«Hello, World»](/p/hello-world/).

## Text and emphasis

Normal text. **Bold text**. *Italic*. ~~Strikethrough~~.
***Bold italic***. And `inline code` in the middle of a sentence.

## Lists

### Unordered list

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered list

1. Step one
2. Step two
   1. Substep 2.1
   2. Substep 2.2
3. Step three

## Blockquote

> Markdown is a markup language created by John Gruber in 2004.
> Its goal is to make writing for the web as simple
> and readable as possible, even in its raw form.
>
> > Nested quote for demonstration.

## Code block

Python example:

```python
from datetime import datetime

def create_slug(title: str) -> str:
    """Creates a URL-friendly slug from a title."""
    return title.lower().replace(' ', '-')

slug = create_slug("Hello, World")
print(f"Slug: {slug}")
date = datetime.now().strftime("%Y-%m-%d")
print(f"Date: {date}")
```

## Horizontal rule

---

## Table

| Element       | Syntax                 | Example              |
|---------------|------------------------|----------------------|
| Heading h2    | `## Text`             | ## Section          |
| Bold          | `**text**`            | **text**            |
| Italic        | `*text*`              | *text*              |
| Code          | `` `code` ``          | `code`              |
| Link          | `[text](url)`         | [link](/p/hello-world/) |
| Image         | `![alt](src)`         | ![Logo](/favicon.svg) |

## Image

![Project logo](/favicon.svg)

## Footnotes

Here's an example of text with a footnote[^1]. Notice how the footnote is rendered
in this theme.

[^1]: This is a footnote that should display as a marginal note.

## Links

- Go to the post [«Hello, World»](/p/hello-world/)
- Back to the [blog](/p/)
- View [wiki notes](/w/)
