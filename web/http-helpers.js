var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(asset, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      callback(data);
    }
  });
};

// As you progress, keep thinking about what helper functions you can put here!
exports.urlStatus = function(url, callback) {
  archive.isUrlArchived(url, (filePresent) => {
    if (filePresent) { //url has a file archived
      callback('archived');
    } else {
      archive.isUrlInList(url, (urlPresent) => {
        if (urlPresent) { //url not archived, is in list
          callback('queued');
        } else {
          callback('notFound'); //brand new url!
        }
      }); 
    }
  });
};



