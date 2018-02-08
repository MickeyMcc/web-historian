var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request')

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

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      callback(data.split('\n'));
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(urlList => {
    callback(urlList.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  exports.readListOfUrls(urlList => {
    // urlList.push(url);
    // console.log(urlList);
    fs.appendFile(exports.paths.list, `\n${url}`, "utf8", callback);
  });
};

exports.isUrlArchived = function(url, callback) {
  return (fs.stat(path.join(exports.paths.archivedSites, url), (err) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  }));
};

exports.downloadUrls = function(urls) {
  console.log(urls);
  urls.forEach(url => {
    //request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url))
  //can also do 
    if (url.length > 5) {
      var file = fs.createWriteStream(exports.paths.archivedSites + '/' + url);
      http.get('http://' + url, function(response) {
        response.pipe(file);
      });
    }
  });
};





























