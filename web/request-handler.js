var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var qs = require('querystring');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      httpHelpers.serveAssets(res, path.join(__dirname, 'public/index.html'), data => {
        res.end(data);
      });
      //is a request for a specific site
    } else {
      //check to see if it has already been archived
      httpHelpers.urlStatus(req.url, (status) => {
        if (status === 'archived') {
          httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url), data => {
            res.writeHead(200, httpHelpers.headers);
            res.end(data);
          });
        }
        if (status === 'queued') {
          httpHelpers.serveAssets(res, path.join(__dirname, 'public/loading.html'), data => {
            res.writeHead(303, httpHelpers.headers);
            res.end(data);
          });
        }
        if (status === 'notFound') {
          res.writeHead(404, httpHelpers.headers);
          res.end();
        }
      });
    }
  } else if (req.method === 'POST' ) {
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
      
      httpHelpers.urlStatus(url, (status) => {
        if (status === 'archived') {
          console.log('ARCHIVED FILE POSTED');
          httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites, url), data => {
            res.writeHead(302, httpHelpers.headers);
            res.end(data);
          });
        }
        if (status === 'queued') {
          console.log('queued FILE POSTED');
          httpHelpers.serveAssets(res, path.join(__dirname, 'public/loading.html'), data => {
            res.writeHead(303, httpHelpers.headers);
            res.end(data);
          });
        }
        if (status === 'notFound') {
          console.log('ADDING URL TO LIST', url);

          archive.addUrlToList(url, () => {
            res.writeHead(302, httpHelpers.headers);
            httpHelpers.serveAssets(res, path.join(__dirname, 'public/loading.html'), data => {
              res.end(data);
            });
          });
        }
      });
    });
  }
};
