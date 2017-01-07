const util = require("./util");

util.transformCSV("data2.csv", null, perline);

function perline(row){
	var d = row.date;
	
	var bits = d.split("-");
	
	var year = bits[0];
	var month = bits[1].length == 2 ? bits[1] : "0" + bits[1];
	var day = bits[2].length == 2 ? bits[2] : "0" + bits[2];
	
	var date = year + "-" + month + "-" + day;
	
	row.date = date;
	
	return row;
}