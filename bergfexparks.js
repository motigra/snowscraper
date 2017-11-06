var grab = require('./grab.js');
var json2csv = require('json2csv');

var listURL = "https://www.bergfex.com/oesterreich/snow-parks/", resorts = [];

grab(listURL)
.then(($) => {

    $('.content table tbody:nth-child(2) tr').each((idx, el) => {

        var r = {
            resort: $(el).find('td:nth-child(3)').text(),
            name: $(el).find('td:nth-child(2) a').text(),
            size: $(el).find('td:nth-child(4)').text(),
            totalFeatures: $(el).find('td:nth-child(4)').data('value'),
            url: $(el).find('td:nth-child(2) a').attr('href')
        }

        resorts.push(r);

    });

    var promises = resorts.map((r) => {

        return grab("https://www.bergfex.com" + r.url)
            .then(($) => {

                r.parks = $('.dl-horizontal.dt-small').length;

                r.easy = $($('#sidebar .infobox-right div:nth-child(1) .dl-snowpark-facts dd.big')[1]).text();
                r.public = $($('#sidebar .infobox-right div:nth-child(1) .dl-snowpark-facts dd.big')[2]).text();
                r.pro = $($('#sidebar .infobox-right div:nth-child(1) .dl-snowpark-facts dd.big')[3]).text();

            });

    });

    return Promise.all(promises);

    // $('.dl-horizontal.dt-small').length

    

})
.then(() => {
    console.log(json2csv({ data: resorts }));
})
.catch((err) => {
    console.error("Error!");
    console.error(err);
})

