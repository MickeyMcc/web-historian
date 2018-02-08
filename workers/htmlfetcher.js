// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

//every minute or so

//read list of urls
//iterate through them
  //get request to that url for it's html contents
  //write received data to new file in archives/sites
  //remove url from sites.txt

var downLoad = require('../helpers/archive-helpers.js')
var CronJob =require('cron').CronJob


exports.cron = new CronJob('* * * * *', function() {
  console.log('TTTRRRROOOOONNNN');
  downLoad.readListOfUrls((urls) => downLoad.downloadUrls(urls));
});
