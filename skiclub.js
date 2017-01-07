var request = require('request');
var cheerio = require('cheerio');
var json2csv = require('json2csv');

function readPage(country, resort, name, callback){
	
	var url = "http://www.skiclub.co.uk/skiclub/snowreports/historical/snowreport.aspx/"+resort,
	tableSelector = "div.snow-reports__table table"
	
	request(url, function (error, response, html) {
		
	  if (!error && response.statusCode == 200) {
		  
		var $ = cheerio.load(html),
		table = $('table.mini-historic');
		
		var data = [], headers = [], selectedYear = parseInt($('select[name="year"] option[selected="selected"]').attr("value"), 10);
		
		// handle headers
		table.find('thead tr th:not(.first)').each(function(idx, el){
			var el = $(el);
			var span = parseInt(el.attr('colspan'), 10);
			for(var i=0;i<span;i++){
				headers.push({ monthName: el.text() });
			}
			
		});
		
		table.find('tbody tr.week td:not(.week)').each(function(idx, el){
			var el = $(el);
			headers[idx].weeknum = parseInt(el.text(), 10);
		});
						
		// handle rows
		var upperCells = table.find('tbody tr.red td:not(.week)'),
		lowerCells = table.find('tbody tr.blue td:not(.week)');
		
		var data = [];
		
		headers.forEach(function(header, idx){
			
			var month = parseMonth(header.monthName);
			var year = selectedYear + (month > 6 ? 0 : 1);
			
			var date = year + "-" + month + "-" + (header.weeknum * 7 - 6);
			
			data.push({
					
					country: country,
					resort: resort,
					name: name,
					year: year,
					month: month,
					week: header.weeknum,
					date: date,
					lower: parseInt($(lowerCells[idx]).text(), 10),
					upper: parseInt($(upperCells[idx]).text(), 10)
					
				})
			
		});
		
		
		callback(data);
	  
	  }
	  else {
		  console.error("Error!");
		  console.error(url);
		  console.error(response.statusCode);
		  console.error(error);
		  
		  callback(false);
	  }
	});
}

function parseMonth(m){
	return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m) + 1;
}

function convertPage(country, resort, name, callback){
		
	readPage(country, resort, name, function(data){
		
		if(!data){
			callback(false);
			return;
		}
		
		callback(data);
		
	});
	
}

//convertPage('usa', 'durango-mountain-resort', function(csv){
	
//	console.log(csv);
	
//});

//function doResort(country, resort, next)

var i = 0, csv = [];

function step(){

	var curr = resorts[i];
	convertPage(curr.country, curr.resort, curr.name, function(data){
		
		if(data)
			csv.push.apply(csv, data);

		i++;
		
		if(i>= resorts.length){
			finish(csv);
		}
		else {
			step();
		}
		
	});
	
}

function finish(data){
	
	var result = json2csv({ data: data });
	
	console.log(result);
}





var resorts = [
  {
    "country": "Andorra",
    "resort": "Arcalis-Vallnord",
    "name": "Arcalis - Vallnord"
  },
  {
    "country": "Andorra",
    "resort": "El-Tarter-Grandvalira",
    "name": "El Tarter - Grandvalira"
  },
  {
    "country": "Andorra",
    "resort": "Pal-Arinsal-Vallnord",
    "name": "Pal/Arinsal - Vallnord"
  },
  {
    "country": "Andorra",
    "resort": "Pas-de-la-Casa-Grandvalira",
    "name": "Pas de la Casa - Grandvalira"
  },
  {
    "country": "Andorra",
    "resort": "Soldeu-Grandvalira",
    "name": "Soldeu - Grandvalira"
  },
  {
    "country": "Austria",
    "resort": "Alpbach",
    "name": "Alpbach"
  },
  {
    "country": "Austria",
    "resort": "Axamer-Lizum",
    "name": "Axamer Lizum"
  },
  {
    "country": "Austria",
    "resort": "Bad-Hofgastein",
    "name": "Bad Hofgastein"
  },
  {
    "country": "Austria",
    "resort": "Bad-Kleinkirchheim",
    "name": "Bad Kleinkirchheim"
  },
  {
    "country": "Austria",
    "resort": "Badgastein",
    "name": "Badgastein"
  },
  {
    "country": "Austria",
    "resort": "Brand",
    "name": "Brand"
  },
  {
    "country": "Austria",
    "resort": "Damuls-Mellau",
    "name": "Damuls/Mellau"
  },
  {
    "country": "Austria",
    "resort": "Dorfgastein-Grossarl",
    "name": "Dorfgastein/Grossarl"
  },
  {
    "country": "Austria",
    "resort": "Ellmau",
    "name": "Ellmau"
  },
  {
    "country": "Austria",
    "resort": "Fieberbrunn",
    "name": "Fieberbrunn"
  },
  {
    "country": "Austria",
    "resort": "Filzmoos",
    "name": "Filzmoos"
  },
  {
    "country": "Austria",
    "resort": "Finkenberg",
    "name": "Finkenberg"
  },
  {
    "country": "Austria",
    "resort": "Flachau",
    "name": "Flachau"
  },
  {
    "country": "Austria",
    "resort": "Fugen",
    "name": "Fugen"
  },
  {
    "country": "Austria",
    "resort": "Galtur",
    "name": "Galtur"
  },
  {
    "country": "Austria",
    "resort": "Gargellen",
    "name": "Gargellen"
  },
  {
    "country": "Austria",
    "resort": "Hintertux",
    "name": "Hintertux"
  },
  {
    "country": "Austria",
    "resort": "Hopfgarten",
    "name": "Hopfgarten"
  },
  {
    "country": "Austria",
    "resort": "Igls",
    "name": "Igls"
  },
  {
    "country": "Austria",
    "resort": "Ischgl",
    "name": "Ischgl"
  },
  {
    "country": "Austria",
    "resort": "Kaprun",
    "name": "Kaprun"
  },
  {
    "country": "Austria",
    "resort": "Kaunertal",
    "name": "Kaunertal"
  },
  {
    "country": "Austria",
    "resort": "Kirchberg",
    "name": "Kirchberg"
  },
  {
    "country": "Austria",
    "resort": "Kitzbuhel",
    "name": "Kitzbuhel"
  },
  {
    "country": "Austria",
    "resort": "Kuhtai",
    "name": "Kuhtai"
  },
  {
    "country": "Austria",
    "resort": "Lech",
    "name": "Lech"
  },
  {
    "country": "Austria",
    "resort": "Loferer-Alm",
    "name": "Loferer Alm"
  },
  {
    "country": "Austria",
    "resort": "Maria-Alm",
    "name": "Maria Alm"
  },
  {
    "country": "Austria",
    "resort": "Mayrhofen",
    "name": "Mayrhofen"
  },
  {
    "country": "Austria",
    "resort": "Neustift-Stubai",
    "name": "Neustift/Stubai"
  },
  {
    "country": "Austria",
    "resort": "Niederau",
    "name": "Niederau"
  },
  {
    "country": "Austria",
    "resort": "Obergurgl",
    "name": "Obergurgl"
  },
  {
    "country": "Austria",
    "resort": "Obertauern",
    "name": "Obertauern"
  },
  {
    "country": "Austria",
    "resort": "Pitztal",
    "name": "Pitztal"
  },
  {
    "country": "Austria",
    "resort": "Rauris",
    "name": "Rauris"
  },
  {
    "country": "Austria",
    "resort": "Saalbach-Hinterglemm",
    "name": "Saalbach Hinterglemm"
  },
  {
    "country": "Austria",
    "resort": "Scheffau",
    "name": "Scheffau"
  },
  {
    "country": "Austria",
    "resort": "Schladming",
    "name": "Schladming"
  },
  {
    "country": "Austria",
    "resort": "Seefeld",
    "name": "Seefeld"
  },
  {
    "country": "Austria",
    "resort": "Serfaus-Fiss-Ladis",
    "name": "Serfaus/Fiss/Ladis"
  },
  {
    "country": "Austria",
    "resort": "Silvretta-Montafon",
    "name": "Silvretta Montafon"
  },
  {
    "country": "Austria",
    "resort": "Solden",
    "name": "Solden"
  },
  {
    "country": "Austria",
    "resort": "Soll",
    "name": "Soll"
  },
  {
    "country": "Austria",
    "resort": "St-Anton",
    "name": "St Anton"
  },
  {
    "country": "Austria",
    "resort": "St-Christoph",
    "name": "St Christoph"
  },
  {
    "country": "Austria",
    "resort": "St-Johann-in-Tirol",
    "name": "St Johann in Tirol"
  },
  {
    "country": "Austria",
    "resort": "St-Wolfgang",
    "name": "St Wolfgang"
  },
  {
    "country": "Austria",
    "resort": "Wagrain",
    "name": "Wagrain"
  },
  {
    "country": "Austria",
    "resort": "Waidring",
    "name": "Waidring"
  },
  {
    "country": "Austria",
    "resort": "Warth-Schrocken",
    "name": "Warth Schrocken"
  },
  {
    "country": "Austria",
    "resort": "Westendorf",
    "name": "Westendorf"
  },
  {
    "country": "Austria",
    "resort": "Wildschonau",
    "name": "Wildschonau"
  },
  {
    "country": "Austria",
    "resort": "Zauchensee",
    "name": "Zauchensee"
  },
  {
    "country": "Austria",
    "resort": "Zell-am-See",
    "name": "Zell am See"
  },
  {
    "country": "Austria",
    "resort": "Zell-am-Ziller",
    "name": "Zell am Ziller"
  },
  {
    "country": "Austria",
    "resort": "Zurs",
    "name": "Zurs"
  },
  {
    "country": "Bulgaria",
    "resort": "Bansko",
    "name": "Bansko"
  },
  {
    "country": "Bulgaria",
    "resort": "Borovets",
    "name": "Borovets"
  },
  {
    "country": "Bulgaria",
    "resort": "Pamporovo",
    "name": "Pamporovo"
  },
  {
    "country": "Canada",
    "resort": "Banff-Lake-Louise",
    "name": "Banff - Lake Louise"
  },
  {
    "country": "Canada",
    "resort": "Banff-Mount-Norquay",
    "name": "Banff - Mount Norquay"
  },
  {
    "country": "Canada",
    "resort": "Banff-Sunshine-Village",
    "name": "Banff - Sunshine Village"
  },
  {
    "country": "Canada",
    "resort": "Big-White",
    "name": "Big White"
  },
  {
    "country": "Canada",
    "resort": "Chilcotin-Mountain-Range-TLH-Heliskiing",
    "name": "Chilcotin Mountain Range - TLH Heliskiing"
  },
  {
    "country": "Canada",
    "resort": "Fernie",
    "name": "Fernie"
  },
  {
    "country": "Canada",
    "resort": "Kicking-Horse",
    "name": "Kicking Horse"
  },
  {
    "country": "Canada",
    "resort": "Kimberley",
    "name": "Kimberley"
  },
  {
    "country": "Canada",
    "resort": "Marmot-Basin",
    "name": "Marmot Basin"
  },
  {
    "country": "Canada",
    "resort": "Mont-Sainte-Anne",
    "name": "Mont Sainte Anne"
  },
  {
    "country": "Canada",
    "resort": "Panorama",
    "name": "Panorama"
  },
  {
    "country": "Canada",
    "resort": "Red-Mountain",
    "name": "Red Mountain"
  },
  {
    "country": "Canada",
    "resort": "Revelstoke",
    "name": "Revelstoke"
  },
  {
    "country": "Canada",
    "resort": "Silver-Star",
    "name": "Silver Star"
  },
  {
    "country": "Canada",
    "resort": "Skeena-Mountains-Last-Frontier-Heliskiing",
    "name": "Skeena Mountains - Last Frontier Heliskiing"
  },
  {
    "country": "Canada",
    "resort": "Sun-Peaks",
    "name": "Sun Peaks"
  },
  {
    "country": "Canada",
    "resort": "Tremblant",
    "name": "Tremblant"
  },
  {
    "country": "Canada",
    "resort": "Whistler",
    "name": "Whistler"
  },
  {
    "country": "Czech Republic",
    "resort": "Spindleruv-Mlyn",
    "name": "Spindleruv Mlyn"
  },
  {
    "country": "Finland",
    "resort": "Levi",
    "name": "Levi"
  },
  {
    "country": "Finland",
    "resort": "Ruka",
    "name": "Ruka"
  },
  {
    "country": "Finland",
    "resort": "Yllas",
    "name": "Yllas"
  },
  {
    "country": "France",
    "resort": "Alpe-dHuez",
    "name": "Alpe d'Huez"
  },
  {
    "country": "France",
    "resort": "Argentiere",
    "name": "Argentiere"
  },
  {
    "country": "France",
    "resort": "Avoriaz",
    "name": "Avoriaz"
  },
  {
    "country": "France",
    "resort": "Bareges-La-Mongie",
    "name": "Bareges/La Mongie"
  },
  {
    "country": "France",
    "resort": "Bonneval-sur-Arc",
    "name": "Bonneval sur Arc"
  },
  {
    "country": "France",
    "resort": "Cauterets",
    "name": "Cauterets"
  },
  {
    "country": "France",
    "resort": "Chamonix",
    "name": "Chamonix"
  },
  {
    "country": "France",
    "resort": "Champagny",
    "name": "Champagny"
  },
  {
    "country": "France",
    "resort": "Chamrousse",
    "name": "Chamrousse"
  },
  {
    "country": "France",
    "resort": "Chatel",
    "name": "Chatel"
  },
  {
    "country": "France",
    "resort": "Courchevel",
    "name": "Courchevel"
  },
  {
    "country": "France",
    "resort": "Flaine",
    "name": "Flaine"
  },
  {
    "country": "France",
    "resort": "Font-Romeu",
    "name": "Font Romeu"
  },
  {
    "country": "France",
    "resort": "Foux-dAllos",
    "name": "Foux d'Allos"
  },
  {
    "country": "France",
    "resort": "Isola-2000",
    "name": "Isola 2000"
  },
  {
    "country": "France",
    "resort": "La-Clusaz",
    "name": "La Clusaz"
  },
  {
    "country": "France",
    "resort": "La-Grave",
    "name": "La Grave"
  },
  {
    "country": "France",
    "resort": "La-Plagne",
    "name": "La Plagne"
  },
  {
    "country": "France",
    "resort": "La-Rosiere",
    "name": "La Rosiere"
  },
  {
    "country": "France",
    "resort": "La-Tania",
    "name": "La Tania"
  },
  {
    "country": "France",
    "resort": "La-Toussuire",
    "name": "La Toussuire"
  },
  {
    "country": "France",
    "resort": "Le-Corbier",
    "name": "Le Corbier"
  },
  {
    "country": "France",
    "resort": "Le-Grand-Bornand",
    "name": "Le Grand Bornand"
  },
  {
    "country": "France",
    "resort": "Les-Arcs",
    "name": "Les Arcs"
  },
  {
    "country": "France",
    "resort": "Les-Carroz",
    "name": "Les Carroz"
  },
  {
    "country": "France",
    "resort": "Les-Contamines",
    "name": "Les Contamines"
  },
  {
    "country": "France",
    "resort": "Les-Deux-Alpes",
    "name": "Les Deux Alpes"
  },
  {
    "country": "France",
    "resort": "Les-Gets",
    "name": "Les Gets"
  },
  {
    "country": "France",
    "resort": "Les-Houches",
    "name": "Les Houches"
  },
  {
    "country": "France",
    "resort": "Les-Menuires",
    "name": "Les Menuires"
  },
  {
    "country": "France",
    "resort": "Les-Orres",
    "name": "Les Orres"
  },
  {
    "country": "France",
    "resort": "Les-Saisies",
    "name": "Les Saisies"
  },
  {
    "country": "France",
    "resort": "Megeve",
    "name": "Megeve"
  },
  {
    "country": "France",
    "resort": "Meribel",
    "name": "Meribel"
  },
  {
    "country": "France",
    "resort": "Montalbert",
    "name": "Montalbert"
  },
  {
    "country": "France",
    "resort": "Montchavin-Les-Coches",
    "name": "Montchavin/Les Coches"
  },
  {
    "country": "France",
    "resort": "Montgenevre",
    "name": "Montgenevre"
  },
  {
    "country": "France",
    "resort": "Morillon",
    "name": "Morillon"
  },
  {
    "country": "France",
    "resort": "Morzine",
    "name": "Morzine"
  },
  {
    "country": "France",
    "resort": "Notre-Dame-de-Bellecombe",
    "name": "Notre Dame de Bellecombe"
  },
  {
    "country": "France",
    "resort": "Orcieres",
    "name": "Orcieres"
  },
  {
    "country": "France",
    "resort": "Peisey-Vallandry",
    "name": "Peisey/Vallandry"
  },
  {
    "country": "France",
    "resort": "Pra-Loup",
    "name": "Pra Loup"
  },
  {
    "country": "France",
    "resort": "Puy-St-Vincent",
    "name": "Puy St Vincent"
  },
  {
    "country": "France",
    "resort": "Risoul",
    "name": "Risoul"
  },
  {
    "country": "France",
    "resort": "Sainte-Foy",
    "name": "Sainte Foy"
  },
  {
    "country": "France",
    "resort": "Samoens",
    "name": "Samoens"
  },
  {
    "country": "France",
    "resort": "Serre-Chevalier",
    "name": "Serre Chevalier"
  },
  {
    "country": "France",
    "resort": "St-Gervais",
    "name": "St Gervais"
  },
  {
    "country": "France",
    "resort": "St-Martin-de-Belleville",
    "name": "St Martin de Belleville"
  },
  {
    "country": "France",
    "resort": "Tignes",
    "name": "Tignes"
  },
  {
    "country": "France",
    "resort": "Val-Cenis",
    "name": "Val Cenis"
  },
  {
    "country": "France",
    "resort": "Val-dIsere",
    "name": "Val d'Isere"
  },
  {
    "country": "France",
    "resort": "Val-Thorens",
    "name": "Val Thorens"
  },
  {
    "country": "France",
    "resort": "Valfrejus",
    "name": "Valfrejus"
  },
  {
    "country": "France",
    "resort": "Valloire",
    "name": "Valloire"
  },
  {
    "country": "France",
    "resort": "Vallorcine",
    "name": "Vallorcine"
  },
  {
    "country": "France",
    "resort": "Valmorel",
    "name": "Valmorel"
  },
  {
    "country": "France",
    "resort": "Vars",
    "name": "Vars"
  },
  {
    "country": "France",
    "resort": "Vaujany",
    "name": "Vaujany"
  },
  {
    "country": "France",
    "resort": "Villard-de-Lans",
    "name": "Villard de Lans"
  },
  {
    "country": "Germany",
    "resort": "Berchtesgaden",
    "name": "Berchtesgaden"
  },
  {
    "country": "Germany",
    "resort": "Feldberg",
    "name": "Feldberg"
  },
  {
    "country": "Germany",
    "resort": "Garmisch-Partenkirchen",
    "name": "Garmisch Partenkirchen"
  },
  {
    "country": "Germany",
    "resort": "Lenggries",
    "name": "Lenggries"
  },
  {
    "country": "Germany",
    "resort": "Oberstdorf",
    "name": "Oberstdorf"
  },
  {
    "country": "Germany",
    "resort": "Reit-im-Winkl",
    "name": "Reit im Winkl"
  },
  {
    "country": "Germany",
    "resort": "Spitzingsee",
    "name": "Spitzingsee"
  },
  {
    "country": "Italy",
    "resort": "Alagna",
    "name": "Alagna"
  },
  {
    "country": "Italy",
    "resort": "Alta-Badia",
    "name": "Alta Badia"
  },
  {
    "country": "Italy",
    "resort": "Arabba",
    "name": "Arabba"
  },
  {
    "country": "Italy",
    "resort": "Bardonecchia",
    "name": "Bardonecchia"
  },
  {
    "country": "Italy",
    "resort": "Bormio",
    "name": "Bormio"
  },
  {
    "country": "Italy",
    "resort": "Campitello",
    "name": "Campitello"
  },
  {
    "country": "Italy",
    "resort": "Canazei",
    "name": "Canazei"
  },
  {
    "country": "Italy",
    "resort": "Cavalese",
    "name": "Cavalese"
  },
  {
    "country": "Italy",
    "resort": "Cervinia",
    "name": "Cervinia"
  },
  {
    "country": "Italy",
    "resort": "Cesana-Torinese",
    "name": "Cesana Torinese"
  },
  {
    "country": "Italy",
    "resort": "Champoluc",
    "name": "Champoluc"
  },
  {
    "country": "Italy",
    "resort": "Claviere",
    "name": "Claviere"
  },
  {
    "country": "Italy",
    "resort": "Cortina",
    "name": "Cortina"
  },
  {
    "country": "Italy",
    "resort": "Courmayeur",
    "name": "Courmayeur"
  },
  {
    "country": "Italy",
    "resort": "Gressoney-la-Trinite",
    "name": "Gressoney la Trinite"
  },
  {
    "country": "Italy",
    "resort": "Kronplatz",
    "name": "Kronplatz"
  },
  {
    "country": "Italy",
    "resort": "La-Thuile",
    "name": "La Thuile"
  },
  {
    "country": "Italy",
    "resort": "Livigno",
    "name": "Livigno"
  },
  {
    "country": "Italy",
    "resort": "Macugnaga",
    "name": "Macugnaga"
  },
  {
    "country": "Italy",
    "resort": "Madesimo",
    "name": "Madesimo"
  },
  {
    "country": "Italy",
    "resort": "Madonna-di-Campiglio",
    "name": "Madonna di Campiglio"
  },
  {
    "country": "Italy",
    "resort": "Passo-Tonale",
    "name": "Passo Tonale"
  },
  {
    "country": "Italy",
    "resort": "Pila",
    "name": "Pila"
  },
  {
    "country": "Italy",
    "resort": "Santa-Caterina",
    "name": "Santa Caterina"
  },
  {
    "country": "Italy",
    "resort": "Sauze-dOulx",
    "name": "Sauze d'Oulx"
  },
  {
    "country": "Italy",
    "resort": "Selva-Gardena",
    "name": "Selva Gardena"
  },
  {
    "country": "Italy",
    "resort": "Sestriere",
    "name": "Sestriere"
  },
  {
    "country": "Italy",
    "resort": "Val-Senales",
    "name": "Val Senales"
  },
  {
    "country": "Japan",
    "resort": "Hakuba-Happo-one",
    "name": "Hakuba/Happo-one"
  },
  {
    "country": "Japan",
    "resort": "Niseko",
    "name": "Niseko"
  },
  {
    "country": "Japan",
    "resort": "Rusutsu",
    "name": "Rusutsu"
  },
  {
    "country": "Norway",
    "resort": "Geilo",
    "name": "Geilo"
  },
  {
    "country": "Norway",
    "resort": "Hemsedal",
    "name": "Hemsedal"
  },
  {
    "country": "Norway",
    "resort": "Lillehammer",
    "name": "Lillehammer"
  },
  {
    "country": "Norway",
    "resort": "Oppdal",
    "name": "Oppdal"
  },
  {
    "country": "Norway",
    "resort": "Trysil",
    "name": "Trysil"
  },
  {
    "country": "Norway",
    "resort": "Voss",
    "name": "Voss"
  },
  {
    "country": "Romania",
    "resort": "Poiana-Brasov",
    "name": "Poiana Brasov"
  },
  {
    "country": "Russia",
    "resort": "Sochi-Rosa-Khutor",
    "name": "Sochi - Rosa Khutor"
  },
  {
    "country": "Scotland",
    "resort": "Cairngorm-Mountain",
    "name": "Cairngorm Mountain"
  },
  {
    "country": "Scotland",
    "resort": "Glencoe",
    "name": "Glencoe"
  },
  {
    "country": "Scotland",
    "resort": "Glenshee",
    "name": "Glenshee"
  },
  {
    "country": "Scotland",
    "resort": "Lecht",
    "name": "Lecht"
  },
  {
    "country": "Scotland",
    "resort": "Nevis-Range",
    "name": "Nevis Range"
  },
  {
    "country": "Slovakia",
    "resort": "Jasna",
    "name": "Jasna"
  },
  {
    "country": "Slovenia",
    "resort": "Kranjska-Gora",
    "name": "Kranjska Gora"
  },
  {
    "country": "Spain",
    "resort": "Baqueira-Beret",
    "name": "Baqueira/Beret"
  },
  {
    "country": "Spain",
    "resort": "Formigal",
    "name": "Formigal"
  },
  {
    "country": "Spain",
    "resort": "La-Molina",
    "name": "La Molina"
  },
  {
    "country": "Spain",
    "resort": "Sierra-Nevada",
    "name": "Sierra Nevada"
  },
  {
    "country": "Sweden",
    "resort": "Are",
    "name": "Are"
  },
  {
    "country": "Sweden",
    "resort": "Salen",
    "name": "Salen"
  },
  {
    "country": "Switzerland",
    "resort": "Adelboden-Lenk",
    "name": "Adelboden/Lenk"
  },
  {
    "country": "Switzerland",
    "resort": "Andermatt",
    "name": "Andermatt"
  },
  {
    "country": "Switzerland",
    "resort": "Anzere",
    "name": "Anzere"
  },
  {
    "country": "Switzerland",
    "resort": "Arosa",
    "name": "Arosa"
  },
  {
    "country": "Switzerland",
    "resort": "Champery",
    "name": "Champery"
  },
  {
    "country": "Switzerland",
    "resort": "Crans-Montana",
    "name": "Crans Montana"
  },
  {
    "country": "Switzerland",
    "resort": "Davos",
    "name": "Davos"
  },
  {
    "country": "Switzerland",
    "resort": "Engelberg",
    "name": "Engelberg"
  },
  {
    "country": "Switzerland",
    "resort": "Flims-Laax",
    "name": "Flims/Laax"
  },
  {
    "country": "Switzerland",
    "resort": "Grimentz",
    "name": "Grimentz"
  },
  {
    "country": "Switzerland",
    "resort": "Grindelwald",
    "name": "Grindelwald"
  },
  {
    "country": "Switzerland",
    "resort": "Gstaad",
    "name": "Gstaad"
  },
  {
    "country": "Switzerland",
    "resort": "Klosters",
    "name": "Klosters"
  },
  {
    "country": "Switzerland",
    "resort": "Lenzerheide",
    "name": "Lenzerheide"
  },
  {
    "country": "Switzerland",
    "resort": "Les-Diablerets",
    "name": "Les Diablerets"
  },
  {
    "country": "Switzerland",
    "resort": "Leysin-Les-Mosses",
    "name": "Leysin/Les Mosses"
  },
  {
    "country": "Switzerland",
    "resort": "Murren",
    "name": "Murren"
  },
  {
    "country": "Switzerland",
    "resort": "Nendaz",
    "name": "Nendaz"
  },
  {
    "country": "Switzerland",
    "resort": "Pontresina",
    "name": "Pontresina"
  },
  {
    "country": "Switzerland",
    "resort": "Saas-Fee",
    "name": "Saas Fee"
  },
  {
    "country": "Switzerland",
    "resort": "Samnaun",
    "name": "Samnaun"
  },
  {
    "country": "Switzerland",
    "resort": "St-Moritz",
    "name": "St Moritz"
  },
  {
    "country": "Switzerland",
    "resort": "Verbier",
    "name": "Verbier"
  },
  {
    "country": "Switzerland",
    "resort": "Villars",
    "name": "Villars"
  },
  {
    "country": "Switzerland",
    "resort": "Wengen",
    "name": "Wengen"
  },
  {
    "country": "Switzerland",
    "resort": "Zermatt",
    "name": "Zermatt"
  },
  {
    "country": "Switzerland",
    "resort": "Zinal",
    "name": "Zinal"
  },
  {
    "country": "USA",
    "resort": "Alta",
    "name": "Alta"
  },
  {
    "country": "USA",
    "resort": "Alyeska",
    "name": "Alyeska"
  },
  {
    "country": "USA",
    "resort": "Arapahoe-Basin",
    "name": "Arapahoe Basin"
  },
  {
    "country": "USA",
    "resort": "Aspen",
    "name": "Aspen"
  },
  {
    "country": "USA",
    "resort": "Attitash-Bear-Peak",
    "name": "Attitash Bear Peak"
  },
  {
    "country": "USA",
    "resort": "Beaver-Creek",
    "name": "Beaver Creek"
  },
  {
    "country": "USA",
    "resort": "Big-Sky",
    "name": "Big Sky"
  },
  {
    "country": "USA",
    "resort": "Breckenridge",
    "name": "Breckenridge"
  },
  {
    "country": "USA",
    "resort": "Copper-Mountain",
    "name": "Copper Mountain"
  },
  {
    "country": "USA",
    "resort": "Crested-Butte",
    "name": "Crested Butte"
  },
  {
    "country": "USA",
    "resort": "Deer-Valley",
    "name": "Deer Valley"
  },
  {
    "country": "USA",
    "resort": "Heavenly",
    "name": "Heavenly"
  },
  {
    "country": "USA",
    "resort": "Jackson-Hole",
    "name": "Jackson Hole"
  },
  {
    "country": "USA",
    "resort": "Keystone",
    "name": "Keystone"
  },
  {
    "country": "USA",
    "resort": "Killington",
    "name": "Killington"
  },
  {
    "country": "USA",
    "resort": "Loveland",
    "name": "Loveland"
  },
  {
    "country": "USA",
    "resort": "Mammoth",
    "name": "Mammoth"
  },
  {
    "country": "USA",
    "resort": "Mount-Snow",
    "name": "Mount Snow"
  },
  {
    "country": "USA",
    "resort": "Park-City",
    "name": "Park City"
  },
  {
    "country": "USA",
    "resort": "Purgatory-Resort",
    "name": "Purgatory Resort"
  },
  {
    "country": "USA",
    "resort": "Smugglers-Notch",
    "name": "Smugglers' Notch"
  },
  {
    "country": "USA",
    "resort": "Snowbasin",
    "name": "Snowbasin"
  },
  {
    "country": "USA",
    "resort": "Snowbird",
    "name": "Snowbird"
  },
  {
    "country": "USA",
    "resort": "Solitude",
    "name": "Solitude"
  },
  {
    "country": "USA",
    "resort": "Squaw-Valley",
    "name": "Squaw Valley"
  },
  {
    "country": "USA",
    "resort": "Steamboat",
    "name": "Steamboat"
  },
  {
    "country": "USA",
    "resort": "Stowe",
    "name": "Stowe"
  },
  {
    "country": "USA",
    "resort": "Sugarbush",
    "name": "Sugarbush"
  },
  {
    "country": "USA",
    "resort": "Sunday-River",
    "name": "Sunday River"
  },
  {
    "country": "USA",
    "resort": "Taos",
    "name": "Taos"
  },
  {
    "country": "USA",
    "resort": "Telluride",
    "name": "Telluride"
  },
  {
    "country": "USA",
    "resort": "Timberline",
    "name": "Timberline"
  },
  {
    "country": "USA",
    "resort": "Vail",
    "name": "Vail"
  },
  {
    "country": "USA",
    "resort": "Winter-Park",
    "name": "Winter Park"
  }
];

step();
