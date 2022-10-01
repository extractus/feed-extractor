# bun-feed-reader

To install dependencies:

```bash
bun install --backend=copyfile
```

*I don't know why `bun install` doesn't work on my environment ([oven-sh/bun#1248](https://github.com/oven-sh/bun/issues/1248))*

Start server:

```bash
bun run index.ts
```

Open `http://localhost:3103/?url=https://news.google.com/rss` to see the result.


You can specify the following options via query string parameters:

- `includeEntryContent`
- `includeOptionalElements`
- `useISODateFormat`
- `normalization`

These params can be set to  `y` or `n`, with `y` is truthy, `n` is falsy.

For examples:

```
http://localhost:3103/?url=https://news.google.com/rss&includeEntryContent=y&useISODateFormat=n&includeOptionalElements=y
```


---
