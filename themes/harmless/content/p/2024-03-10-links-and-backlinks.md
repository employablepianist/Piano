+++
title = "Links and Backlinks"
date = 2024-03-10
+++

This post is about the **backlinks system** in the Zola Harmless theme.
Backlinks automatically collect all pages that link to the current page
and display them in the sidebar or footer.

## Why backlinks matter

In the *digital garden* concept, backlinks play a key role:

1. They show *how* different notes are connected
2. They help *discover* unexpected connections
3. They create a *knowledge network*, not just a set of isolated pages

## Related pages

This post links to several other pages on the site:

- [Hello, World](/p/hello-world/) — the first blog post
- [Markdown Features](/p/markdown-test/) — an overview of Markdown syntax
- [Test Note](/w/test-note/) — a wiki note for testing connections

Check each of these pages — they should all show a **backlink**
pointing to this post.

## How it works

```javascript
// Pseudocode: backlink collection
const backlinks = {};

for (const page of allPages) {
  for (const link of extractLinks(page.content)) {
    if (!backlinks[link.target]) {
      backlinks[link.target] = [];
    }
    backlinks[link.target].push(page.url);
  }
}
```

## Conclusion

Backlinks are one of the key features of this theme. They turn an ordinary blog
into a *network of interconnected notes*, where each page is enriched with
context from other pages.
