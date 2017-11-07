const csv		= require('csvtojson');
const _			= require('lodash');
const q			= require('q');
const json2csv	= require('json2csv');

function transformCSV(originalFile, newFile, lineProcessor){
	
	var buffer = [], dfd = q.defer();
	
	csv()
		.fromFile(originalFile)
		.on('json',(jsonObj)=>{
			buffer.push(lineProcessor ? lineProcessor(jsonObj) : jsonObj);
		})
		.on('done',(error)=>{
			
			if(error){
				dfd.reject(error);
			}
			else {
				var csv = json2csv({ data: buffer });
				console.log(csv);
				dfd.resolve(buffer);
			}
			
		});
	
	return dfd.promise;
}

function csvToJson(fileName, lineProcessor){
	
	var buffer = [];

	return new Promise((resolve, rejecT) => {

		csv()
			.fromFile(fileName)
			.on('json',(jsonObj)=>{
				buffer.push(lineProcessor ? lineProcessor(jsonObj) : jsonObj);
			})
			.on('done',(error)=>{
				
				if(error){
					reject(error);
				}
				else {
					resolve(buffer);
				}
				
			});
	
	});
	
}

module.exports = { csvToJson, transformCSV };