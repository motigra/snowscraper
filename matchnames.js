const util = require("./util");
const stringSimilarity = require('string-similarity');
const _ = require("lodash");
const q			= require('q');

var json1, json2, waits = [];

waits.push(util.csvToJson("data/igluski.csv").then(function(data){
	json1 = data;
})
.fail(function(err){
	console.error(err);
}));

waits.push(util.csvToJson("data/skiclub_uk.csv").then(function(data){
	json2 = data;
})
.fail(function(err){
	console.error(err);
}));


q.all(waits).then(function(){
	
	var resorts1 = _(json1)
		.map((row) => {
			return { country: row.country, resort: row.name };
		})
		.uniqWith(function(a, b){
			return a.country == b.country && a.resort == b.resort;
		})
		.value();
	
	var resorts2 = _(json2)
		.map((row) => {
			return { country: row.country, resort: row.name };
		})
		.uniqWith(function(a, b){
				return a.country == b.country && a.resort == b.resort;
		})
		.value();
		
		
	resorts1.forEach((r1) => {
		
		
		for(var i=0;i<resorts2.length;i++){
		
			var r2 = resorts2[i];
			
			if(r1.country != r2.country)
				continue;
			
			var similarity = stringSimilarity.compareTwoStrings(r1.resort, r2.resort);
			
			if(similarity < 0.5 || similarity == 1)
				continue;
			
			console.log("%s | %s | %d", r1.resort, r2.resort, similarity);
			
		}

		
	});	
		
	//var r1 = resorts1[0];

	for(var i=0;i<resorts2.length;i++){
		
		var r2 = resorts2[i];
		
		if(r1.country != r2.country)
			continue;
		
		var similarity = stringSimilarity.compareTwoStrings(r1.resort, r2.resort);
		
		if(similarity < 0.5)
			continue;
		
		console.log("%s / %s : %d", r1.resort, r2.resort, similarity);
		
	}
	

});