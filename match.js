const util = require("./util");
const stringSimilarity = require('string-similarity');
const _ = require("lodash");
var json2csv = require('json2csv');

var json1, json2, waits = [];

waits.push(util.csvToJson("data/austria-skiresort-info.csv").then(function(data){
	json1 = data.map((r) => {
        return r.name;
    });
    json1 = [...new Set(json1)]
})
.catch(function(err){
	console.error(err);
}));

waits.push(util.csvToJson("data/austria-igluski-history.csv").then(function(data){
	json2 = data.map((r) => {
        return r.name;
    });
    json2 = [...new Set(json2)]
})
.catch(function(err){
	console.error(err);
}));

Promise.all(waits).then(() => {

    var matches = [];

    json1.forEach((r1) => {
        var bestMatch = stringSimilarity.findBestMatch(r1, json2);
        if(bestMatch.bestMatch.rating > 0.5)
            matches.push({'skiresort-info' : r1, 'igluski-history' : bestMatch.bestMatch.target});
    });

    json2.forEach((r2) => {
        var bestMatch = stringSimilarity.findBestMatch(r2, json1);
        if(bestMatch.bestMatch.rating > 0.5)
            matches.push({ 'igluski-history' : r2, 'skiresort-info' : bestMatch.bestMatch.target});
    });

    return matches;

})
.then((matches) => {
    console.log(json2csv({ data: matches }));
})
.catch((err) => {
    console.error(err);
});