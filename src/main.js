/**
 * Feed reader core
 * @ndaidong
 **/

var bella = require('bellajs');
var Promise = require('promise-wtf');
var parser = require('xml2json');
var fetch = require('node-fetch');
var FXML = require('friendly-xml');
var Entities = require('html-entities').XmlEntities;
var Entity = new Entities();

var isString = bella.isString;
var isArray = bella.isArray;
var isObject = bella.isObject;

var toJSON = (source) => {
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

var normalize = ({link, title, pubDate, author, contentSnippet, content}) => {

  if (!link || !title ||
    !isString(link) || !isString(title) ||
    link.length < 10 || title.length < 10) {
    return false;
  }

  let publishedDate = bella.date.utc(pubDate);

  if (!publishedDate) {
    return false;
  }

  if (author && isString(author)) {
    author = Entity.decode(author);
    author = bella.ucwords(author);
  }

  if (content && isString(content)) {
    content = Entity.decode(content);
  }

  if (contentSnippet && isString(contentSnippet)) {
    contentSnippet = Entity.decode(contentSnippet);
    contentSnippet = bella.stripTags(contentSnippet);
  } else if (content) {
    contentSnippet = bella.stripTags(content);
  }

  if (contentSnippet && isString(contentSnippet)) {
    contentSnippet = contentSnippet.replace(/(\r\n|\n|\r)/gm, ' ');
  }

  if (contentSnippet && contentSnippet.length > 160) {
    contentSnippet = bella.truncate(contentSnippet, 156);
  }

  try {
    contentSnippet = Entity.decode(contentSnippet);
    title = Entity.decode(title);
    link = Entity.decode(link);
  } catch (e) {
    return false;
  }

  return {
    link,
    title,
    contentSnippet,
    publishedDate,
    author,
    content
  };
};

var toRSS = (res) => {
  let a = {
    title: res.title || '',
    link: res.link,
    entries: []
  };

  if (res.entries) {
    let modify = (item) => {
      let link = item.link;
      let title = item.title;
      let contentSnippet = item.description;
      let pubDate = item.pubDate;
      let author = item['dc:creator'] || item.author || item.creator || '';
      let content = item['content:encoded'] || item.content || item.description || '';
      return normalize({link, title, pubDate, author, contentSnippet, content});
    };

    a.entries = res.entries.map(modify);
  }
  return a;
};

var toATOM = (res) => {
  let a = {
    title: res.title || '',
    link: res.link,
    entries: []
  };
  if (res.entries) {
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
      } else if (isObject(link) && bella.hasProperty(link, 'href')) {
        link = link.href;
      }

      let contentSnippet = item.summary || item.description || '';

      let author = item.author;
      if (isObject(author) && author.name) {
        author = author.name;
      }

      let content = item.content;
      if (isObject(content) && content.$t) {
        content = content.$t;
      }
      return normalize({link, title, pubDate, author, contentSnippet, content});
    };

    a.entries = res.entries.map(modify);
  }
  return a;
};


var parse = (url) => {
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
          entries: t.item
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
          entries: t.entry
        };
        result = toATOM(a);
      }
      if (result && result.entries && result.entries.length) {
        return resolve(result);
      }
      return reject(new Error('Parsing failed'));
    }).catch((e) => {
      return reject(e);
    });
  });
};

module.exports = {
  parse
};
