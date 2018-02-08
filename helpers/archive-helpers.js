var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')

};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function() {
  return new Promise (function(resolve, reject) {
    fs.readFile(exports.paths.list, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        urlArray = data.split('\n');
        resolve(urlArray);
      }
    });
  });
};


exports.isUrlInList = function(url) {
  return new Promise(function(resolve, reject) {
    exports.readListOfUrls()
      .then(function(urlArray) {
        var found;
        if (urlArray.includes(url)) {
          found = true;
        } else {
          found = false;
        }
        return found;
      });
  });
};


exports.addUrlToList = function(url) {
  return new Promise(function(resolve, reject) {
    exports.readListOfUrls()
      .then(function(urlArray) {
        fs.appendFile(exports.paths.list, `\n${url}`, 'utf8', function(err) {
          if (err) {
            reject(err);
          } else {
            var positiveMessage = 'url appended to list';
            resolve(positiveMessage);
          }
        }); 
      });
  });
};

exports.isUrlArchived = function(url) {
  return new Promise(function(resolve, reject) {
    var found;
    fs.stat(path.join(exports.paths.archivedSites, url), (err) => {
      if (err) {
        found = false;
        resolve(false);
      } else {
        found = true;
        resolve(false);
      }
    });
  });
};

exports.downloadUrls = function(urls) {
  console.log(urls);
  urls.forEach(url => {
    //request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url))
  //can also do 
    if (url.length > 5) {
      var file = fs.createWriteStream(exports.paths.archivedSites + '/' + url);
      http.get(`http://${url}`, function(response) {
        response.pipe(file);
      });
    }
  });
};





























