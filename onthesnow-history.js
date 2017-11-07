var grab = require('./grab.js');
var json2csv = require('json2csv');

var baseUrl = 'https://www.onthesnow.com';
var listUrl = baseUrl + '/austria/skireport.html';

var _ = require('lodash');

grab(listUrl)
.then(($) => {
    return $('.resScrollCol8 table tr td.rLeft.a:nth-child(1) div.name a').map((idx, el) => {
        return {
            name: $(el).text(),
            url: $(el).attr('href') // /styria/dachstein-gletscher/ski-resort.html
        };
    }).toArray();
})
.then((resorts) => {

    var c = 0;
    
    // All resorts
    var promises = resorts.map((r) => {

        //if(c > 10) return Promise.resolve([]);

        c++;

        var arr = [];

        // Last 5 years per resort
        
        var localp = new Promise((resolve, reject) => {

            (function loop(y) {

                grab(baseUrl + r.url.replace('ski-resort.html', 'historical-snowfall.html') + '?&v=list&y=' + y)
                .then(($) => {
                    return $('.resortList table tr:not(.listHeader)').map((idx, el) => {
                        var cells = $('td', el);
                        var date = parseKey($(cells[0]).text().replace(',','').replace(/\s+/g, ' ').toLowerCase());
                        var fall = $(cells[1]).text().replace(' in.', '');
                        return {
                            name: r.name,
                            date: date,
                            snowfall: fall
                        };
                    }).toArray();
                })
                .then((yearData) => {
                    arr.push(yearData);
                    if(y > 2015) setTimeout(() => { loop(y-1); }, 0);
                    else resolve(arr);
                })
                .catch((e) => {
                    reject(e);
                });

            })(2017);

        });

        /*
        var subPromises = [2017, 2016, 2015, 2014, 2013].map((y) => {

            // Each year's page
            return grab(baseUrl + r.url.replace('ski-resort.html', 'historical-snowfall.html') + '?&v=list&y=' + y)
            .then(($) => {

                return $('.resortList table tr:not(.listHeader)').map((idx, el) => {
                    var cells = $('td', el);
                    var date = parseKey($(cells[0]).text().replace(',','').replace(/\s+/g, ' ').toLowerCase());
                    var fall = $(cells[1]).text().replace(' in.', '');

                    return {
                        name: r.name,
                        date: date,
                        snowfall: fall
                    };
                }).toArray();

            })
            .catch((err) => {
                console.error("Failed to grab %s %s at %s", r.name, y, baseUrl + r.url.replace('ski-resort.html', 'historical-snowfall.html') + '?&v=list&y=' + y);
                console.error(err);    
            });
        })
        */

        // do something with subPromises
        return localp; //Promise.all(subPromises);
    });

    return Promise.all(promises);
})
.then((data) => {

    var flat = _.flattenDeep(data);
    
    console.log(json2csv({ data: flat }));
})
.catch(console.error);

        
      



function parseKey(k){
    // jan-2016-2017-upper
    var parts = k.split(' ');
    var month = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(parts[0]) + 1;
    var year = parts[2];
    var day = parts[1];
    return  [year, month, day].join('-');
}