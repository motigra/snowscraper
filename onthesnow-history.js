var grab = require('./grab.js');
var json2csv = require('json2csv');

var baseUrl = 'https://www.onthesnow.com';
var listUrl = baseUrl + '/austria/skireport.html';

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
    
    // All resorts
    var promises = resorts.map((r) => {

        // Last 5 years per resort
        var subPromises = [2017, 2016, 2015, 2014, 2013].map((y) => {

            // Each year's page
            return grab(baseUrl + r.url.replace('ski-resort.html', 'historical-snowfall.html') + '?&v=list&y=' + y)
            .then(($) => {

                return $('.resortList table tr:not(.listHeader)').map((idx, el) => {
                    var cells = $('td', el);
                    var date = parseKey($(cells[0]).text().replace(',','').toLowerCase());
                    var fall = $(cells[1]).text().replace(' in.', '');
                }).toArray();

            });
        })

        // do something with subPromises
        return Promise.all(subPromises);
    });

    return Promise.all(promises);
})
.then((data) => {
    
    console.log(json2csv({ data: data }));
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