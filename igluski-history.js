var grab = require('./grab.js');
var json2csv = require('json2csv');

var baseUrl = 'https://www.igluski.com';
var listPage = baseUrl + '/ski-resorts/austria';

grab(listPage)
.then(($) => {
    return $('.sidebar .list-style-three UL[role="navigation"] li a').map((idx, el) => {
        return {
            name: $(el).text(),
            url: $(el).attr('href')
        };
    }).toArray();
})
.then((resorts) => {

    var promises = resorts.map((r) => {
       
        return  grab(baseUrl + r.url + '/snow-history')
            .then(($) => {

                var matrix = [[]];

                var headers = $('.snow-reports__table table thead tr th')
                    .each((idx, el) => {
                        var t = $(el).text();
                        matrix[0].push(t && t.length ? t : "month");
                    });

                var data = $('.snow-reports__table table.snow-reports__forecast--desktop tbody tr')
                    .each((idx, el) => {

                        var arr = $(el).find('td').map((idx, el) => {
                            return $(el).text();
                        }).toArray();

                        if(arr.length)
                            matrix.push(arr);

                    });

                // transform matrix

                var a = [];

                for(var i=1;i<matrix[0].length;i++){
                    for(var j=1;j<matrix[i].length;j++){
                        var key = matrix[i][0] + "-" + matrix[0][j];
                        var val = matrix[i][j];
                        r[key.toLowerCase()] = val;
                        //r[key.toLowerCase()+"-lower"] = val == '-' ? null : val.split('/')[0].replace('cm ', '');
                        //r[key.toLowerCase()+"-upper"] = val == '-' ? null : val.split('/')[1].replace('cm', '').replace(' ', '');
                    }
                }

                return r;

            });

    });

    return Promise.all(promises);
})
.then((data) => {

    return data.reduce((last, current, idx, arr) => {

        Object.keys(current).filter((k) => {
            return /[a-z]{3}-\d{4}-\d{4}/.test(k);
        }).forEach((k) => {
            var val = current[k];
            last.push({
                name: current.name,
                month: parseKey(k),
                lower: val != '-' ? val.split('/')[0].replace('cm ', '') : null,
                upper: val != '-' ? val.split('/')[1].replace('cm', '').replace(' ', '') : null
            });
        })

        return last;

    }, []);

})
.then((data) => {
    
    console.log(json2csv({ data: data }));
})
.catch(console.error);

function parseKey(k){
    // jan-2016-2017-upper
    var parts = k.split('-');
    var month = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(parts[0]) + 1;
    var year = month <= 6 ? parts[2] : parts[1];
	return  [year, month, 1].join('-');
}