/**
 * Feed reader core
 * @ndaidong
 **/

'use strict'; // to use "let" keyword

var Promise = require('bluebird');
var bella = require('bellajs');
var parser = require('xml2json');
var request = require('request');

var toJSON = (source) => {
  return new Promise((resolve, reject) => {
    request.get(source, (err, response, body) => {
      if(err){
        return reject(err);
      }
      try{
        let json = bella.isString(body) ? parser.toJson(body) : body;
        let ob = JSON.parse(json);
        if(ob && bella.isObject(ob)){
          return resolve(ob);
        }
        return reject({
          error: 'Something wrong!',
          source: source,
          data: body
        });
      }
      catch(e){
        return reject(e);
      }
    });
  });
}


var toRSS = (res) => {
  let a = {
    title: res.title,
    description: res.description,
    entries: []
  }
  if(res.entries){
    let es = [];
    res.entries.forEach((item) => {
      let title = item.title;
      let description = item.description;
      let pubDate = item.pubDate;
      let creator = item['dc:creator'];
      let content = item['content:encoded'];
      es.push({
        link: item.link,
        title: item.title,
        description: description,
        pubDate: pubDate,
        creator: creator
      });
    });
    a.entries = es;
  }
  console.log(a);
  return a;
}


var parse = (url) => {
  return new Promise((resolve, reject) => {
    toJSON(url).then((o) => {
      if(o.rss && o.rss.channel){
        let t = o.rss.channel;
        let a = {
          title: t.title,
          description: t.description,
          entries: t.item
        }
        return toRSS(a);
      }
      else{
        console.log(o);
      }
      return reject(new Error('No item added'));
    }).catch((e) => {
      console.log(e);
      return reject(e);
    });
  });
}

module.exports = {
  parse: parse
}
