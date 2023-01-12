# node-feed-reader

Install dependencies:

```bash
npm i

# or pnpm, yarn
```

Start server:

```bash
npm start
```

Open `http://localhost:3103/?url=https://news.google.com/rss` to see the result.


You can specify the following options via query string parameters:

- `normalization`
- `useISODateFormat`

These params can be set to  `y` or `n`, with `y` is truthy, `n` is falsy.

For examples:

```
http://localhost:3103/?normalization=y&useISODateFormat=y&url=https://news.google.com/rss
```

---
