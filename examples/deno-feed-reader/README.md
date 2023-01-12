# deno-feed-reader

With `deno`, we have not much thing to do. Just start the server:

```bash
# reload if needed
deno cache --reload index.ts

# start server
deno run --allow-net --allow-env --allow-read index.ts
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
