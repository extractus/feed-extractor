# tsnode-feed-reader

Install dependencies:

```bash
npm i

# or pnpm, yarn
```

Build typescript source to javascript and start server:

```bash
npx tsc && node dist/index.js

# or simple
npm start
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
