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

module.exports = {
  toJSON: toJSON
}
