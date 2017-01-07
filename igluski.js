var request = require('request');
var cheerio = require('cheerio');
var json2csv = require('json2csv');

function readPage(country, resort, callback){
	
	var url = "http://www.igluski.com/ski-resorts/"+country.toLowerCase()+"/"+resort.toLowerCase()+"/snow-history",
	tableSelector = "div.snow-reports__table table"
	
	request(url, function (error, response, html) {
		
	  if (!error && response.statusCode == 200) {
		  
		var $ = cheerio.load(html),
		table = $(tableSelector);
		
		var data = [], headers = [];
		
		// handle headers
		$(table[0]).find("thead tr th").each(function(i, element){
			
			var text = $(element).text();
			headers.push(text);
		});
		

		
		//handle rows
		$(table[0]).find("tbody tr").each(function(i, element){
			
			var row = {};
			$(element).children("td").each(function(i, element){
				
				row[headers[i]] = $(element).text();
			});
			data.push(row);
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

function convertPage(country, resort, callback){
	
	var csv = [];
	
	readPage(country, resort, function(data){
		
		if(!data){
			callback(false);
			return;
		}
		
		data.forEach(function(monthData){
			
			var keys = Object.keys(monthData);
			
			var monthName = monthData[keys[0]];
			
			var month = parseMonth(monthName);
			
			var yearPos = month > 6 ? 0 : 1;
			
			for(var i=1;i<keys.length;i++){
				
				var year = keys[i].split('-')[yearPos];
				
				var date = year + "-" + month + "-1"; // new Date(year, month, 1);
				
				var val = monthData[keys[i]];
								
				if (val=='-')
					continue;
				
				var lower = val.split('/')[0].trim(), upper = val.split('/')[1].trim();
				
				csv.push({
					
					country: country,
					resort: resort,
					year: parseInt(year, 10),
					month: month,
					date: date,
					lower: parseInt(lower.replace("cm",""), 10),
					upper: parseInt(upper.replace("cm",""), 10)
					
				})
				
			}
			
		});
		
		callback(csv);
		
	});
	
}

//convertPage('usa', 'durango-mountain-resort', function(csv){
	
//	console.log(csv);
	
//});

//function doResort(country, resort, next)

var i = 0, csv = [];

function step(){

	var curr = resorts[i];
	convertPage(curr.country, curr.resort, function(data){
		
		if(data)
			csv.push.apply(csv, data);

		i++;
		
		if(i>=resorts.length){
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
{ country: "Andorra", resort: "La-Massana" },
{ country: "Andorra", resort: "Pas-de-la-Casa" },
{ country: "Andorra", resort: "Arinsal" },
{ country: "Andorra", resort: "Encamp" },
{ country: "Andorra", resort: "Pal" },
{ country: "Austria", resort: "Bad-Gastein" },
{ country: "Austria", resort: "Kaprun" },
{ country: "Austria", resort: "Zell-am-Ziller" },
{ country: "Austria", resort: "Zurs-am-Arlberg" },
{ country: "Austria", resort: "Alpbach" },
{ country: "Austria", resort: "Flachau" },
{ country: "Austria", resort: "Scheffau" },
{ country: "Austria", resort: "Obertauern" },
{ country: "Austria", resort: "Solden" },
{ country: "Austria", resort: "Ischgl" },
{ country: "Austria", resort: "Soll" },
{ country: "Austria", resort: "Lech" },
{ country: "Austria", resort: "Kuhtai" },
{ country: "Austria", resort: "Obergurgl" },
{ country: "Austria", resort: "Saalbach" },
{ country: "Austria", resort: "Neustift" },
{ country: "Austria", resort: "Bad-Hofgastein" },
{ country: "Austria", resort: "Kitzbuhel" },
{ country: "Austria", resort: "Igls" },
{ country: "Austria", resort: "Tschagguns-Montafon" },
{ country: "Austria", resort: "Mittersill---Kitzbuhel" },
{ country: "Austria", resort: "Axamer-Lizum" },
{ country: "Austria", resort: "Ellmau" },
{ country: "Austria", resort: "Mayrhofen" },
{ country: "Austria", resort: "St-Wolfgang" },
{ country: "Austria", resort: "Zell-am-See" },
{ country: "Austria", resort: "St-Johann-in-Tirol" },
{ country: "Austria", resort: "Kirchberg" },
{ country: "Austria", resort: "Westendorf" },
{ country: "Austria", resort: "Wildschonau" },
{ country: "Austria", resort: "Fugen" },
{ country: "Austria", resort: "Seefeld" },
{ country: "Austria", resort: "St-Anton" },
{ country: "Austria", resort: "Filzmoos" },
{ country: "Austria", resort: "Schladming" },
{ country: "Austria", resort: "Finkenberg" },
{ country: "Austria", resort: "St-Anton-Montafon" },
{ country: "Austria", resort: "Niederau-Oberau" },
{ country: "Austria", resort: "Galtur" },
{ country: "Bulgaria", resort: "Borovets" },
{ country: "Bulgaria", resort: "Bansko" },
{ country: "Bulgaria", resort: "Pamporovo" },
{ country: "Canada", resort: "Kimberley" },
{ country: "Canada", resort: "Lake-Louise" },
{ country: "Canada", resort: "Jasper" },
{ country: "Canada", resort: "Red-Mountain" },
{ country: "Canada", resort: "Whistler" },
{ country: "Canada", resort: "Kicking-Horse" },
{ country: "Canada", resort: "Panorama" },
{ country: "Canada", resort: "Sun-Peaks" },
{ country: "Canada", resort: "Banff" },
{ country: "Canada", resort: "Fernie" },
{ country: "Canada", resort: "Tremblant" },
{ country: "Canada", resort: "Sunshine-Village" },
{ country: "Canada", resort: "Big-White" },
{ country: "Canada", resort: "Mont-Sainte-Anne" },
{ country: "Finland", resort: "Saariselka" },
{ country: "Finland", resort: "Levi" },
{ country: "France", resort: "Les-Menuires" },
{ country: "France", resort: "La-Toussuire" },
{ country: "France", resort: "Villard-de-Lans" },
{ country: "France", resort: "Morzine" },
{ country: "France", resort: "Tignes-Le-Lavachet" },
{ country: "France", resort: "Meribel-Les-Allues" },
{ country: "France", resort: "La-Rosiere" },
{ country: "France", resort: "La-Plagne-1800" },
{ country: "France", resort: "Courchevel-Le-Praz" },
{ country: "France", resort: "Orcieres" },
{ country: "France", resort: "Meribel-Le-Raffort" },
{ country: "France", resort: "Tignes-Les-Boisses" },
{ country: "France", resort: "Plagne-Centre" },
{ country: "France", resort: "Tignes-Val-Claret" },
{ country: "France", resort: "Plagne-Montalbert" },
{ country: "France", resort: "Plagne-Soleil" },
{ country: "France", resort: "Tignes" },
{ country: "France", resort: "Serre-Chevalier" },
{ country: "France", resort: "Samoens" },
{ country: "France", resort: "La-Grave" },
{ country: "France", resort: "Les-Arcs-2000" },
{ country: "France", resort: "Montgenevre" },
{ country: "France", resort: "Les-Arc-Peisey-Vallandry" },
{ country: "France", resort: "Meribel-Nantgerel" },
{ country: "France", resort: "Les-Arcs-1600" },
{ country: "France", resort: "Meribel-Mottaret" },
{ country: "France", resort: "Plagne-Village" },
{ country: "France", resort: "Aime-La-Plagne" },
{ country: "France", resort: "Les-Coches" },
{ country: "France", resort: "Ardent" },
{ country: "France", resort: "Les-Prodains" },
{ country: "France", resort: "Courchevel-1650" },
{ country: "France", resort: "Belle-Plagne" },
{ country: "France", resort: "Courchevel-Village" },
{ country: "France", resort: "Flaine" },
{ country: "France", resort: "Puy-St-Vincent" },
{ country: "France", resort: "Les-Saisies" },
{ country: "France", resort: "Meribel" },
{ country: "France", resort: "Val-d-Isere" },
{ country: "France", resort: "La-Clusaz" },
{ country: "France", resort: "Vars" },
{ country: "France", resort: "Le-Corbier" },
{ country: "France", resort: "St-Gervais" },
{ country: "France", resort: "Montchavin" },
{ country: "France", resort: "Les-Carroz-d-Arraches" },
{ country: "France", resort: "Val-Cenis" },
{ country: "France", resort: "Les-Arcs" },
{ country: "France", resort: "Argentiere" },
{ country: "France", resort: "Val-Thorens" },
{ country: "France", resort: "Risoul" },
{ country: "France", resort: "Valmorel" },
{ country: "France", resort: "Plagne-Bellecote" },
{ country: "France", resort: "Sainte-Foy" },
{ country: "France", resort: "Meribel-Village" },
{ country: "France", resort: "Plagne-Champagny-en-Vanoise" },
{ country: "France", resort: "Valfrejus" },
{ country: "France", resort: "Notre-Dame" },
{ country: "France", resort: "Les-Orres" },
{ country: "France", resort: "Les-Arc-Peisey-Nancroix" },
{ country: "France", resort: "Courchevel-1850" },
{ country: "France", resort: "Chamonix" },
{ country: "France", resort: "Alpe-d-Huez" },
{ country: "France", resort: "Les-Deux-Alpes" },
{ country: "France", resort: "Les-Praz-De-Chamonix" },
{ country: "France", resort: "Chatel" },
{ country: "France", resort: "Courchevel" },
{ country: "France", resort: "La-Tania" },
{ country: "France", resort: "Vaujany" },
{ country: "France", resort: "Valloire-Valmeinier" },
{ country: "France", resort: "Les-Arcs-1950" },
{ country: "France", resort: "Tignes-Le-Lac" },
{ country: "France", resort: "Chamrousse" },
{ country: "France", resort: "La-Plagne" },
{ country: "France", resort: "Megeve" },
{ country: "France", resort: "Les-Gets" },
{ country: "France", resort: "Avoriaz" },
{ country: "France", resort: "Isola-2000" },
{ country: "France", resort: "Le-Grand-Bornand" },
{ country: "France", resort: "Les-Arcs-1800" },
{ country: "France", resort: "St-Martin-de-Belleville" },
{ country: "France", resort: "Les-Contamines" },
{ country: "Italy", resort: "Selva" },
{ country: "Italy", resort: "Livigno" },
{ country: "Italy", resort: "Champoluc" },
{ country: "Italy", resort: "Courmayeur" },
{ country: "Italy", resort: "Gressoney" },
{ country: "Italy", resort: "Canazei" },
{ country: "Italy", resort: "Cortina" },
{ country: "Italy", resort: "Sestriere" },
{ country: "Italy", resort: "Madonna-di-Campiglio" },
{ country: "Italy", resort: "Passo-Tonale" },
{ country: "Italy", resort: "Cavalese" },
{ country: "Italy", resort: "Madesimo" },
{ country: "Italy", resort: "Aosta" },
{ country: "Italy", resort: "Pila" },
{ country: "Italy", resort: "Bardonecchia" },
{ country: "Italy", resort: "Val-Di-Fassa" },
{ country: "Italy", resort: "Arabba" },
{ country: "Italy", resort: "Sauze-d-Oulx" },
{ country: "Italy", resort: "La-Thuile" },
{ country: "Italy", resort: "Cervinia" },
{ country: "Italy", resort: "Bormio" },
{ country: "Italy", resort: "Claviere" },
{ country: "Italy", resort: "Santa-Caterina" },
{ country: "Italy", resort: "Macugnaga" },
{ country: "Norway", resort: "Oppdal" },
{ country: "Norway", resort: "Geilo" },
{ country: "Norway", resort: "Hemsedal" },
{ country: "Norway", resort: "Lillehammer---Hafjell" },
{ country: "Norway", resort: "Trysil" },
{ country: "Romania", resort: "Poiana-Brasov" },
{ country: "Slovenia", resort: "Kranjska-Gora" },
{ country: "Spain", resort: "Sierra-Nevada" },
{ country: "Spain", resort: "Baqueira" },
{ country: "Spain", resort: "Formigal" },
{ country: "Sweden", resort: "?re" },
{ country: "Switzerland", resort: "Wengen" },
{ country: "Switzerland", resort: "Leysin" },
{ country: "Switzerland", resort: "Verbier" },
{ country: "Switzerland", resort: "Flims-Laax" },
{ country: "Switzerland", resort: "Gstaad" },
{ country: "Switzerland", resort: "Zermatt" },
{ country: "Switzerland", resort: "Lenzerheide" },
{ country: "Switzerland", resort: "Adelboden" },
{ country: "Switzerland", resort: "Les-Diablerets" },
{ country: "Switzerland", resort: "Nendaz" },
{ country: "Switzerland", resort: "Andermatt" },
{ country: "Switzerland", resort: "Klosters" },
{ country: "Switzerland", resort: "Crans-Montana" },
{ country: "Switzerland", resort: "St-Moritz" },
{ country: "Switzerland", resort: "Davos" },
{ country: "Switzerland", resort: "Engelberg" },
{ country: "Switzerland", resort: "Flims" },
{ country: "Switzerland", resort: "Grindelwald" },
{ country: "Switzerland", resort: "Arosa" },
{ country: "Switzerland", resort: "Villars" },
{ country: "Switzerland", resort: "Champery" },
{ country: "Switzerland", resort: "Zinal" },
{ country: "Switzerland", resort: "Saas-Fee" },
{ country: "Switzerland", resort: "Grimentz" },
{ country: "USA", resort: "Telluride" },
{ country: "USA", resort: "Winter-Park" },
{ country: "USA", resort: "The-Canyons" },
{ country: "USA", resort: "Keystone" },
{ country: "USA", resort: "Alta" },
{ country: "USA", resort: "Durango-Mountain-Resort" },
{ country: "USA", resort: "Deer-Valley" },
{ country: "USA", resort: "Squaw-Valley" },
{ country: "USA", resort: "Aspen" },
{ country: "USA", resort: "Taos" },
{ country: "USA", resort: "Vail" },
{ country: "USA", resort: "Big-Sky" },
{ country: "USA", resort: "Jackson-Hole" },
{ country: "USA", resort: "Copper-Mountain" },
{ country: "USA", resort: "Park-City" },
{ country: "USA", resort: "Beaver-Creek" },
{ country: "USA", resort: "Steamboat" },
{ country: "USA", resort: "Snowbird" },
{ country: "USA", resort: "Breckenridge" },
{ country: "USA", resort: "Killington" },
{ country: "USA", resort: "Stowe" },
{ country: "USA", resort: "Sunday-River" },
{ country: "USA", resort: "Crested-Butte" },
{ country: "USA", resort: "Mammoth" }
];

step();

/*
request('https://news.ycombinator.com', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    console.log(html);
  }
});
*/

/*
request('https://news.ycombinator.com', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('span.comhead').each(function(i, element){
      var a = $(this).prev();
      console.log(a.text());
    });
  }
});
*/

/*
request('https://news.ycombinator.com', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('span.comhead').each(function(i, element){
      var a = $(this).prev();
      var rank = a.parent().parent().text();
      var title = a.text();
      var url = a.attr('href');
      var subtext = a.parent().parent().next().children('.subtext').children();
      var points = $(subtext).eq(0).text();
      var username = $(subtext).eq(1).text();
      var comments = $(subtext).eq(2).text();
      // Our parsed meta data object
      var metadata = {
        rank: parseInt(rank),
        title: title,
        url: url,
        points: parseInt(points),
        username: username,
        comments: parseInt(comments)
      };
      console.log(metadata);
    });
  }
});
*/