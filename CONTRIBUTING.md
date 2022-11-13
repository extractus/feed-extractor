# Contributing to feed-reader

While `feed-reader` is just a simple library with personal purpose, I'm happy if it can be useful for you too.

Anyway, I hope it always gets better, so pull requests are welcome, though larger proposals should be discussed first.

As an OSS, it should follow the Unix philosophy: "do one thing and do it well".

## Installation

- Ensure you have `node` and `npm` installed.
- After cloning the repository, run `npm install` in the root of the repository.
- Run `npm test` to ensure that everything works correctly in your environment.

If it works well, you can start modifying your fork.

In this process, you can use [`node eval.js` command](https://github.com/ndaidong/feed-reader#quick-evaluation) to evaluate your changes.


## Third-party libraries

Please avoid using libaries other than those available in the standard library, unless necessary.

This library needs to be simple and flexible to run on multiple platforms such as Deno, Bun, or even browser.


## Coding convention

Please follow [standardjs](https://standardjs.com/) style guide.

Make sure your code lints before opening a pull request.


```bash
cd feed-reader

# check coding convention issue
npm run lint

# auto fix coding convention issue
npm run lint:fix
```

*When you run `npm test`, the linting process will be triggered at first.*


## Testing

Be sure to run the unit test suite before opening a pull request. An example test run is shown below.

```bash
cd feed-reader
npm test
```

![feed-reader unit test](https://i.imgur.com/xTwZK6B.png)

If test coverage decreased, please check test scripts and try to improve this number.


## Documentation

If you've changed APIs, please update README and [the examples](https://github.com/ndaidong/feed-reader/tree/main/examples).


## Clean commit histories

When you open a pull request, please ensure the commit history is clean.
Squash the commits into logical blocks, perhaps a single commit if that makes sense.

What you want to avoid is commits such as "WIP" and "fix test" in the history.
This is so we keep history on master clean and straightforward.

For people new to git, please refer the following guides:

- [Writing good commit messages](https://github.com/erlang/otp/wiki/writing-good-commit-messages)
- [Commit Message Guidelines](https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53)


## License

By contributing to `feed-reader`, you agree that your contributions will be licensed under its [MIT license](https://github.com/ndaidong/feed-reader/blob/main/LICENSE).

---
