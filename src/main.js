/**
 * Feed reader core
 * @ndaidong
 **/

global.Promise = require('promise-wtf');

const parser = require('xml2json');
const fetch = require('node-fetch');
const FXML = require('friendly-xml');

const {
  isArray,
  isObject,
  hasProperty,
} = require('bellajs');

const normalize = require('./utils/normalize');

const toJSON = (source) => {
  return new Promise((resolve, reject) => {
    fetch(source).then((res) => {
      if (res.ok && res.status === 200) {
        return res.text();
      }
      throw new Error('Fetching failed: ' + source);
    }).then((xml) => {
      let fallback = () => {
        FXML.ParseString(xml, (ob) => { // eslint-disable-line new-cap
          if (ob && isObject(ob)) {
            return resolve(ob);
          }
          return reject(new Error('Parsing failed: ' + source));
        });
      };

      try {
        let json = parser.toJson(xml);
        let ob = JSON.parse(json);
        if (ob && isObject(ob)) {
          return resolve(ob);
        }
        return fallback();
      } catch (e) {
        return fallback(e);
      }
    }).catch((err) => {
      return reject(err);
    });
  });
};

const toRSS = (res) => {
  let a = {
    title: res.title || '',
    link: res.link,
    entries: [],
  };

  let ls = res.entries || [];
  if (ls && isArray(ls)) {
    let modify = (item) => {
      let link = item.link;
      let title = item.title;
      let contentSnippet = item.description;
      let pubDate = item.pubDate;
      let author = item['dc:creator'] || item.author || item.creator || '';
      let content = item['content:encoded'] || item.content || item.description || '';
      return normalize({link, title, pubDate, author, contentSnippet, content});
    };

    a.entries = ls.map(modify).filter((item) => {
      return item !== false;
    });
  }
  return a;
};

const toATOM = (res) => {
  let a = {
    title: res.title || '',
    link: res.link,
    entries: [],
  };

  let ls = res.entries || [];
  if (ls && isArray(ls)) {
    let modify = (item) => {
      let pubDate = item.updated || item.published;
      let title = item.title;
      if (isObject(title) && title.$t) {
        title = title.$t;
      }
      let link = item.link;
      if (isArray(link) && link.length > 0) {
        let tmpLink = '';
        for (let i = 0; i < link.length; i++) {
          if (link[i].rel === 'alternate') {
            tmpLink = link[i].href;
            break;
          }
        }
        link = tmpLink;
      } else if (isObject(link) && hasProperty(link, 'href')) {
        link = link.href;
      }

      let contentSnippet = item.summary || item.description || '';

      let author = item.author || '';
      if (isObject(author) && author.name) {
        author = author.name;
      }

      let content = item.content || contentSnippet || '';

      if (isArray(content)) {
        content = content[0];
      }
      if (isObject(content)) {
        if (content.$t) {
          content = content.$t;
        } else {
          content = '';
        }
      }

      return normalize({link, title, pubDate, author, contentSnippet, content});
    };

    a.entries = ls.map(modify).filter((item) => {
      return item !== false;
    });
  }
  return a;
};


const parse = (url) => {
  return new Promise((resolve, reject) => {
    toJSON(url).then((o) => {
      let result;
      if (o.rss && o.rss.channel) {
        let t = o.rss.channel;
        let ot = t.title || '';
        if (isObject(ot)) {
          t.title = ot.type === 'text' ? ot.$t : '';
        }
        let a = {
          title: t.title,
          link: url,
          entries: t.item,
        };
        result = toRSS(a);
      } else if (o.feed && o.feed.entry) {
        let t = o.feed;
        let ot = t.title || '';
        if (isObject(ot)) {
          t.title = ot.type === 'text' ? ot.$t : '';
        }
        let a = {
          title: t.title,
          link: url,
          entries: t.entry,
        };
        result = toATOM(a);
      }
      if (result && result.entries && result.entries.length) {
        let arr = result.entries;
        result.entries = arr.filter((item) => {
          return item !== false;
        });
        return resolve(result);
      }
      return reject(new Error('Parsing failed'));
    }).catch((e) => {
      return reject(e);
    });
  });
};

module.exports = {
  parse,
};
