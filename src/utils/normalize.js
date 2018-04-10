// utils --> normalize

const Entities = require('html-entities').XmlEntities;
const Entity = new Entities();

const {
  isString,
  ucwords,
  stripTags,
  truncate,
} = require('bellajs');

const {
  utc,
} = require('bella-date');

const normalize = ({link, title, pubDate, author = '', contentSnippet = '', content = ''}) => {
  if (!link || !title || !isString(link) || !isString(title)) {
    return false;
  }

  let publishedDate;

  try {
    let d = (new Date(pubDate)).getTime();
    if (d) {
      publishedDate = utc(d);
    }
  } catch (e) {
    return false;
  }

  if (!publishedDate) {
    return false;
  }

  if (author && isString(author)) {
    author = Entity.decode(author);
    author = ucwords(author);
  }

  if (content && isString(content)) {
    content = Entity.decode(content);
  }

  if (contentSnippet && isString(contentSnippet)) {
    contentSnippet = Entity.decode(contentSnippet);
    contentSnippet = stripTags(contentSnippet);
  } else if (content) {
    contentSnippet = stripTags(content);
  }

  if (contentSnippet && isString(contentSnippet)) {
    contentSnippet = contentSnippet.replace(/(\r\n|\n|\r)/gm, ' ');
  }

  if (contentSnippet && contentSnippet.length > 160) {
    contentSnippet = truncate(contentSnippet, 156);
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
    content,
  };
};

module.exports = normalize;
