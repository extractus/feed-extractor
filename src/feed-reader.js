/**
 * Feed reader core
 * @ndaidong
 **/

'use strict'; // to use "let" keyword

var Promise = require('bluebird');
var bella = require('bellajs');
var parser = require('xml2json');
var fetch = require('node-fetch');
var FXML = require('friendly-xml');
var Entities = require('html-entities').XmlEntities;
var Entity = new Entities();

var toJSON = (source) => {
  return new Promise((resolve, reject) => {
    fetch(source).then((res) => {
      if(res.ok && res.status === 200){
        return res.text();
      }
      throw new Error('Fetching failed: ' + source);
    }).then((xml) => {
      let fallback = () => {
        FXML.ParseString(xml, (ob) => {
          if(ob && bella.isObject(ob)){
            return resolve(ob);
          }
          return reject(new Error('Parsing failed: ' + source));
        });
      }
      try{
        let json = parser.toJson(xml);
        let ob = JSON.parse(json);
        if(ob && bella.isObject(ob)){
          return resolve(ob);
        }
        return fallback();
      }
      catch(e){
        return fallback(e);
      }
    }).catch((err) => {
      return reject(err);
    });
  });
}

var normalize = (link, title, pubDate, creator, description, content) => {

  if(!link || !title){
    return false;
  }

  let pubtime = bella.date.utc(pubDate);

  if(!pubtime){
    return false;
  }

  if(creator){
    creator = Entity.decode(creator);
    creator = bella.ucwords(creator);
  }

  if(content){
    content = Entity.decode(content);
  }

  if(description){
    description = Entity.decode(description);
    description = bella.stripTags(description);
  }
  else if(content){
    description = bella.stripTags(content);
  }

  if(description){
    description = description.replace(/(\r\n|\n|\r)/gm, ' ');
  }

  if(description.length > 160){
    description = bella.truncate(description, 156);
  }
  description = Entity.decode(description);

  title = Entity.decode(title);

  link = Entity.decode(link);

  return {
    link: link,
    title: title,
    contentSnippet: description,
    publishedDate: pubtime,
    author: creator,
    content: content
  }
}

var toRSS = (res) => {
  let a = {
    title: res.title || '',
    link: res.link,
    entries: []
  }
  if(res.entries){
    let modify = (item) => {
      let link = item.link;
      let title = item.title;
      let description = item.description;
      let pubDate = item.pubDate;
      let creator = item['dc:creator'] || '';
      let content = item['content:encoded'] || '';

      return normalize(link, title, pubDate, creator, description, content);
    }
    a.entries = res.entries.map(modify);
  }
  return a;
}

var toATOM = (res) => {
  let a = {
    title: res.title || '',
    link: res.link,
    entries: []
  }
  if(res.entries){
    let modify = (item) => {
      let pubDate = item.updated || item.published;
      let title = item.title;
      if(bella.isObject(title) && title.$t){
        title = title.$t;
      }
      let link = item.link;
      if(bella.isArray(link) && link.length > 0){
        let tmpLink = '';
        for(let i = 0; i < link.length; i++){
          if(link[i].rel === 'alternate'){
            tmpLink = link[i].href;
            break;
          }
        }
        link = tmpLink;
      }
      let description = item.summary || item.description || '';

      let creator = item.author;
      if(bella.isObject(creator) && creator.name){
        creator = creator.name;
      }

      let content = item.content;
      if(bella.isObject(content) && content.$t){
        content = content.$t;
      }

      return normalize(link, title, pubDate, creator, description, content);
    }
    a.entries = res.entries.map(modify);
  }
  return a;
}


var parse = (url) => {
  return new Promise((resolve, reject) => {
    toJSON(url).then((o) => {
      let result;
      if(o.rss && o.rss.channel){
        let t = o.rss.channel;
        let ot = t.title || '';
        if(bella.isObject(ot)){
          t.title = ot.type === 'text' ? ot.$t : '';
        }
        let a = {
          title: t.title,
          link: url,
          entries: t.item
        }
        result = toRSS(a);
      }
      else if(o.feed && o.feed.entry){
        let t = o.feed;
        let ot = t.title || '';
        if(bella.isObject(ot)){
          t.title = ot.type === 'text' ? ot.$t : '';
        }
        let a = {
          title: t.title,
          link: url,
          entries: t.entry
        }
        result = toATOM(a);
      }
      if(result && result.entries && result.entries.length){
        return resolve(result);
      }
      return reject(new Error('Parsing failed'));
    }).catch((e) => {
      return reject(e);
    });
  });
}

let url = '';
var dtest = (src) => {
  parse(src).then((re) => {
    console.log(re);
  }).catch((er) => {
    console.log(er);
  });
}

if(url){
  dtest(url);
}

module.exports = {
  parse: parse
}
