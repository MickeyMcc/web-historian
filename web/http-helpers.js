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

exports.serveAssets = function(res, asset) {
  return new Promise(function(resolve, reject) {
    fs.readFile(asset, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// As you progress, keep thinking about what helper functions you can put here!
exports.urlStatus = function(url) {
  var urlStatus = '';
  return new Promise(function(resolve, reject) {
    archive.isUrlArchived(url)
      .then(function(found) {
        if (found) {
          urlStatus = 'archived'; 
        } else {
          archive.isUrlInList(url)
            .then(function(found) {
              if (found) {
                urlStatus = 'queued';
              } else {
                urlStatus = 'notFound';
              }
            });
        }
        resolve(urlStatus);
      });
  });
};



