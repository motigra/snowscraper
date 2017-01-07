
const csv=require('csvtojson')
const _ = require('lodash')
const q = require('q')

const csvFilePath='data-fixed.csv'
const csvFilePath2='data2.csv'

var data=[], data2=[];

var waits = [];


var dfd1 = q.defer();
waits.push(dfd1.promise);

csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 
	data.push(jsonObj);
})
.on('done',(error)=>{
	dfd1.resolve();
})

var dfd2 = q.defer();
waits.push(dfd2.promise);

csv()
.fromFile(csvFilePath2)
.on('json',(jsonObj)=>{
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 
	data2.push(jsonObj);
})
.on('done',(error)=>{
	dfd2.resolve();
})

q.all(waits).then(checkResorts)

function checkResorts() {
	
	try{	
	console.log("1");
	var uniq1 = _.chain(data).map("name").uniq().value();
	console.log("2");
	var uniq2 = _.chain(data2).map("name").uniq().value();
	console.log("3");
	}
	catch(e){
		console.log(e);
	}
	
	console.log("4");
		
	console.log(uniq1.length);
	console.log(uniq2.length);
	
	console.log(_.difference(uniq1, uniq2));
	
}


function lgC(){
	
	console.log(data.length)
	console.log(data2.length)

	var c1 = _.chain(data).map("country").uniq().value(),
	c2 = _.chain(data2).map("country").uniq().value();
		
	var countries = {};
	
	c1.forEach(function(c){
		
		console.log(1);
		
		if(countries[c])
			countries[c].igluski = true
		else
			countries[c] = {igluski: true}
		
	});
	
	c2.forEach(function(c){
		
		if(countries[c])
			countries[c].skiclub = true
		else
			countries[c] = {skiclub: true}
		
	});

	console.log(countries);

}