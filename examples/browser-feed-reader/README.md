# browser-feed-reader

This demo shows how to use feed-reader at client side, with or without proxy.

To install:

```bash
npm i

# or pnpm, yarn
```

Start server:

```bash
npm start
```

Open `http://localhost:3103/` to test.

Basically `feed-reader` only works at server side.

However there are some noble publishers those enable `Access-Control-Allow-Origin` on their service.
For example with feed resource from [Washington Post](https://feeds.washingtonpost.com/rss/business/technology), [Decrypt](https://decrypt.co/feed) or [FeedBlitz](https://feeds.feedblitz.com/baeldung/cs&x=1) we can read from browser.

Another ideal environment to run `feed-reader` directly is browser extensions.

With the remaining cases, we need a proxy layer to bypass CORS policy.

---
