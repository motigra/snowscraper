var request = require('request');
var cheerio = require('cheerio');

function grabPage(url){
    return new Promise((resolve, reject) => {
        request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                try {
                    var $ = cheerio.load(html);
                }
                catch (err) {
                    reject(err);
                }
                resolve($);
            }
            else {
                reject(error);
            }
        });
    });
}

module.exports = grabPage;

