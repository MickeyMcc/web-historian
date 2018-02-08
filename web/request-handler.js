var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var qs = require('querystring');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    console.log(req.url);
    if (req.url === '/') {
      httpHelpers.serveAssets(res, path.join(__dirname, 'public/index.html'))
        .then(function(data) {
          res.writeHead(200, httpHelpers.headers);
          res.end(data);      
        })
        .catch(() => console.log('error'));
      //is a request for a specific site
    } else if (req.url === '/styles.css') {
      httpHelpers.serveAssets(res, path.join(__dirname, 'public/styles.css'))
        .then(function(data) {
          res.writeHead(200, httpHelpers.headers);
          res.end(data);      
        })
        .catch(() => console.log('error'));
    } else {
      //check to see if it has already been archived
      httpHelpers.urlStatus(req.url)
        .then(function(status) {
          console.log(status);
          if (status === 'archived') {
            httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url))      
              .then(function(data) {
                res.writeHead(200, httpHelpers.headers);
                res.end(data);
              })
              .catch(() => console.log('error'));
          }
          if (status === 'queued') {
            httpHelpers.serveAssets(res, path.join(__dirname, 'public/loading.html'))      
              .then(function(data) {
                res.writeHead(303, httpHelpers.headers);
                res.end(data);
              })
              .catch(() => console.log('error'));

          }
          if (status === 'notFound') {
            res.writeHead(404, httpHelpers.headers);
            res.end();
          }
        });
    }
  } else if (req.method === 'POST' ) {
    console.log('POST');
    var newData = '';
    
    //collect the body
    req.on('data', function(data) {
      newData += data;
    });

    // when body is here, parse the url to be archived, 
    // add it to list
    // end message with 302 found message for some reason
    req.on('end', function() {
      var url = qs.parse(newData).url;
      console.log(url);
      
      httpHelpers.urlStatus(url)
        .then(status => {
          console.log(status);
          if (status === 'archived') {
            console.log('ARCHIVED FILE POSTED');
            httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites, url))
              .then(data => {
                res.writeHead(302, httpHelpers.headers);
                res.end(data);
              })
              .catch(() => console.log('error'));
          } else if (status === 'queued') {
            console.log('queued FILE POSTED');
            httpHelpers.serveAssets(res, path.join(__dirname, 'public/loading.html'))
              .then(data => {
                res.writeHead(303, httpHelpers.headers);
                res.end(data);
              })
              .catch(() => console.log('error'));

          } else if (status === 'notFound') {
            console.log('ADDING URL TO LIST', url);
            archive.addUrlToList(url)
              .then(() => {
                res.writeHead(302, httpHelpers.headers);
                httpHelpers.serveAssets(res, path.join(__dirname, 'public/loading.html'))
                  .then(data => {
                    res.end(data);
                  })
                  .catch(() => console.log('error'));
              })
              .catch(() => console.log('error'));
          } else {
            console.log('issue with URL STATUS');
          }
        })
        .catch(() => console.log('error'));
    });
  }
};
