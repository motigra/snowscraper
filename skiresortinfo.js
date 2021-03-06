/* use list grabbed from skiresort.info austrian resorts index, to get extra info of each resort */

var request = require('request');
var cheerio = require('cheerio');
var json2csv = require('json2csv');



///////////

function transformResortName(name = ''){

    var ret = name;

    ret = ret.replace(/(\s[-,–]\s)|(\s)/ig, "-");
    ret = ret.replace(/\/|\.|\||\(|\)|\'/ig, "");
    ret = ret.replace(/ö/ig, "oe");
    ret = ret.replace(/ü/ig, "ue");
    ret = ret.replace(/ß/ig, "ss");

    return ret;

}

function doResort(name = ''){

    //console.info("start resort: %s", name);

    var url = "http://www.skiresort.info/ski-resort/" + transformResortName(name).toLowerCase() + "/";

    //console.log("url: %s" + url);

    return new Promise((resolve, reject) => {

        request(url, function (error, response, html) {
            
            if (!error && response.statusCode == 200) {

                var $ = cheerio.load(html);

                var resortData = {
                    name: name,
                };


                try {

                    $('.lift-count').each((idx, el) => {

                        var type = $(el).attr("title");
                        var count = $(el).find(".lift-amount").text();
                        resortData["lift_"+type.replace(/\s/ig, "_")] = count;

                    });

                }
                catch(err) {
                    console.error("Error: %s", url);
                }

                try {

                    var seasonText = $('div.detail-links div.description table.info-table tr:nth-child(1) td:nth-child(2)').text();
                    var r = /\d{4}-\d{2}-\d{2}/ig;
                    var m = seasonText.match(r);

                    resortData.season_open = m[0];
                    resortData.season_close = m[1];
                }
                catch(err) {
                    console.error("Error: %s", url);
                }

                resolve(resortData);

            }
            else {
                console.error("Error!");
                console.error(url);
                console.error(response.statusCode);
                console.error(error);
                reject(error);
            }
        });

    });

}

///////////////

var resorts = [
    "St. Anton/St. Christoph/Stuben/Lech/Zürs/Warth/Schröcken – Ski Arlberg",
    "SkiWelt Wilder Kaiser-Brixental",
    "Saalbach Hinterglemm Leogang Fieberbrunn (Skicircus)",
    "Ischgl/Samnaun – Silvretta Arena",
    "Serfaus-Fiss-Ladis",
    "Kitzbühel/Kirchberg – KitzSki",
    "Sölden",
    "Zillertal Arena – Zell am Ziller/Gerlos/Königsleiten/Hochkrimml",
    "Mayrhofen – Penken/Ahorn/Rastkogel/Eggalm",
    "Schladming – Planai/Hochwurzen/Hauser Kaibling/Reiteralm (4-Berge-Skischaukel)",
    "Flachau/Wagrain/Alpendorf – Snow Space Salzburg",
    "Silvretta Montafon",
    "Hochkönig – Maria Alm/Dienten/Mühlbach",
    "Obergurgl-Hochgurgl",
    "Nassfeld – Hermagor",
    "Bad Kleinkirchheim/St. Oswald",
    "Obertauern",
    "Ski Jewel Alpbachtal Wildschönau",
    "Bad Gastein/Bad Hofgastein – Schlossalm/Angertal/Stubnerkogel",
    "Kaltenbach – Hochzillertal/Hochfügen (SKi-optimal)",
    "Damüls Mellau",
    "Schmittenhöhe – Zell am See",
    "Nauders am Reschenpass – Bergkastel",
    "Großarltal/Dorfgastein",
    "Katschberg",
    "Wildkogel – Neukirchen/Bramberg",
    "Hintertux Glacier (Hintertuxer Gletscher)",
    "Brandnertal – Brand/Bürserberg",
    "Grossglockner Heiligenblut",
    "Dachstein West – Gosau/Russbach/Annaberg",
    "Grosseck/Speiereck – Mauterndorf/St. Michael",
    "Lofer – Loferer Alm (Almenwelt Lofer)",
    "Zauchensee/Flachauwinkl",
    "Tauplitz – Bad Mitterndorf",
    "Galtür – Silvapark",
    "St. Johann in Tirol/Oberndorf – Harschbichl",
    "Steinplatte/Winklmoosalm – Waidring/Reit im Winkl",
    "Turracher Höhe",
    "Kreischberg",
    "Gerlitzen",
    "Kitzsteinhorn – Kaprun",
    "Kühtai",
    "See",
    "Hinterstoder – Höss",
    "Hochzeiger – Jerzens",
    "Diedamskopf – Schoppernau",
    "Kappl",
    "Stubai Glacier (Stubaier Gletscher)",
    "Großglockner Resort Kals-Matrei",
    "Hochoetz – Oetz",
    "Berwang/Bichlbach/Rinnen",
    "Innerkrems – Kremsbrücke (Krems in Kärnten)",
    "Fellhorn/Kanzelwand – Oberstdorf/Riezlern",
    "Gaissau-Hintersee",
    "Loser – Altaussee",
    "Rauriser Hochalmbahnen – Rauris",
    "Axamer Lizum",
    "Riesneralm – Donnersbachwald",
    "Sonnenkopf – Klösterle",
    "Bergeralm – Steinach am Brenner",
    "Gargellen",
    "Flachauwinkl/Kleinarl (Shuttleberg)",
    "Klippitztörl",
    "Ehrwalder Alm – Ehrwald",
    "Lermoos – Grubigstein",
    "Werfenweng",
    "Christlum – Achenkirch",
    "Laterns – Gapfohl",
    "Golm",
    "Lachtal",
    "Ramsau am Dachstein – Rittisberg",
    "Goldeck – Spittal an der Drau",
    "Fanningberg",
    "Stuhleck – Spital am Semmering",
    "Markbachjoch/Lanerköpfl – Niederau",
    "Koralpe",
    "Wetterstein lifts (Wettersteinbahnen) – Ehrwald",
    "Glungezer – Tulfes",
    "Weißsee – Uttendorf",
    "Venet – Landeck/Zams/Fliess",
    "Wurzeralm – Spital am Pyhrn",
    "Schlick 2000 – Fulpmes",
    "Hochkössen (Unterberghorn) – Kössen",
    "Sillian – Thurntaler (Hochpustertal)",
    "Spieljoch – Fügen",
    "Zettersfeld – Lienz",
    "Kasberg – Grünau im Almtal",
    "Kaunertal Glacier (Kaunertaler Gletscher)",
    "Pitztal Glacier (Pitztaler Gletscher)",
    "Walmendingerhorn/Heuberg – Mittelberg/Hirschegg",
    "Hochrindl – Sirnitz",
    "Zugspitze",
    "Maiskogel – Kaprun",
    "Präbichl – Vordernberg",
    "Hochficht",
    "Buchensteinwand (Pillersee) – St. Ulrich am Pillersee/St. Jakob in Haus/Hochfilzen",
    "Ifen",
    "Hochkar – Göstling",
    "Ötscher – Lackenhof (Gaming)",
    "Bödele – Schwarzenberg",
    "Rifflsee",
    "Rosshütte – Seefeld",
    "Sportgastein",
    "Patscherkofel – Innsbruck-Igls",
    "Alberschwende – Brüggelekopf/Dresslerberg/Tannerberg",
    "Weinebene – Frantschach-Sankt Gertraud",
    "Moelltal Glacier (Mölltaler Gletscher)",
    "St. Jakob im Defereggental – Brunnalm",
    "Radstadt/Altenmarkt",
    "Arnoldstein – Dreiländereck",
    "Kitzbüheler Horn",
    "Muttereralmpark – Mutters/Götzens",
    "Hahnenkamm – Höfen/Reutte",
    "Hochstein – Lienz",
    "Forsteralm – Waidhofen an der Ybbs",
    "Unterberg – Pernitz",
    "Gemeindealpe – Mitterbach am Erlaufsee",
    "Planneralm – Donnersbach",
    "Vent",
    "Fageralm – Forstau",
    "Zauberberg Semmering",
    "Königsberg – Hollenstein an der Ybbs",
    "Nordkette – Innsbruck",
    "Petzen – Feistritz ob Bleiburg",
    "Mönichkirchen/Mariensee",
    "Rangger Köpfl – Oberperfuss",
    "Zahmer Kaiser – Walchsee",
    "Filzmoos",
    "Krinnenalpe – Nesselwängle",
    "Hirnkopf – Flattnitz (Glödnitz)",
    "Simonhöhe – St. Urban",
    "Ankogel – Mallnitz",
    "Annaberg",
    "Grebenzen – St. Lambrecht",
    "Obertilliach – Golzentipp",
    "Karkogel – Abtenau",
    "Karwendel Bergbahn (Zwölferkopf) – Pertisau",
    "Krippenstein – Obertraun",
    "Galsterberg – Pruggern",
    "Niederalpl – Mürzsteg (Neuburg an der Mürz)",
    "Heidialm Skipark – Falkert",
    "Sonnberglifts – Wald am Schoberpass",
    "Salzstiegl – Hirschegg",
    "Graukogel – Bad Gastein",
    "Rofan – Maurach",
    "Bürgeralpe – Mariazell",
    "Heutal – Unken",
    "Kelchsau",
    "Fendels",
    "Hochhäderich – Hittisau",
    "Rieseralm – Obdach",
    "Schattwald/Zöblen",
    "Jungholz",
    "Feuerkogel – Ebensee",
    "Schetteregg – Egg",
    "Kellerjoch – Schwaz",
    "Gerlosstein/Ramsberg – Hainzenberg",
    "Niedere – Andelsbuch/Bezau",
    "Emberger Alm – Berg im Drautal",
    "Schwabenbergarena – Turnau",
    "Schuttannen – Hohenems",
    "Hohentauern",
    "Biberwier – Marienberg",
    "Füssener Jöchle – Grän",
    "Hoch-Imst – Imst",
    "Bürgeralm – Aflenz",
    "Brunnalm/Hohe Veitsch – Veitsch (St. Barbara im Mürztal)",
    "Lammeralm – Langenwang",
    "Neunerköpfle – Tannheim",
    "Walmendingerhorn – Mittelberg",
    "Faschina (Fontanella)",
    "Hochmoos – Leutasch",
    "Zinkenlifte – Dürrnberg (Hallein)",
    "Postalm am Wolfgangsee",
    "Hochkeil am Hochkönig",
    "Aichelberglifts – Karlstift (Bad Großpertholz)",
    "Alpl – Krieglach",
    "Stoderzinken – Gröbming",
    "Salamander – Puchberg am Schneeberg",
    "Untersberg – Grödig",
    "Zwölferhorn – St. Gilgen",
    "Elfer – Neustift",
    "Kötschach-Mauthen",
    "Sonntag-Stein",
    "Raggal",
    "Monte Popolo – Eben im Pongau",
    "Naggler Alm – Techendorf (Weissensee)",
    "Gaaler Lifte – Gaal",
    "Seeberg – Seewiesen (Turnau)",
    "Hoislifts – Modriach (Edelschrott)",
    "Serles – Mieders",
    "Hochwechsellifts – Mönichwald",
    "Gschwandtkopf – Seefeld",
    "Dachstein Glacier (Dachsteingletscher)",
    "Hauereck – St. Kathrein am Hauenstein",
    "Kirchdorf",
    "Sternstein – Bad Leonfelden",
    "Jöchelspitze – Bach",
    "Bazora – Gurtis/Frastanz",
    "Hinterreit – Saalfelden am Steinernen Meer",
    "St. Martin im Tennengebirge",
    "Buchberg – Goldegg",
    "Hochbärneck – St. Anton an der Jeßnitz",
    "Paluda – Dalaas",
    "Kristberg – Silbertal",
    "Maiszinken – Lunz am See",
    "Hagenberglifte – Sulzberg",
    "Obdach",
    "Reither Kogel – Reith im Alpbachtal",
    "Tirolina (Haltjochlift) – Hinterthiersee",
    "Teichalm – Fladnitz",
    "Pölzl Lifte – Kindberg",
    "Hochlecken – Neukirchen (Altmünster)",
    "Josefsberg – Mitterbach am Erlaufsee",
    "Glasenberg – Maria Neustift",
    "Tonnerhütte – Mühlen",
    "Wachtberglifts – Weyregg am Attersee",
    "St. Jakob im Walde",
    "Arralifts – Harmanschlag (St. Martin)",
    "Weissbriach (Gitschtal)",
    "St. Oswald (Kartitsch)",
    "Niederthai (Umhausen)",
    "Göllerlifts – Gscheid (St. Aegyd am Neuwalde)",
    "Parfußwirtlifte – Trahütten (Deutschlandsberg)",
    "Kluglifte Hebalm – Rettenbach (Deutschlandsberg)",
    "Furtnerlifts – Rohr im Gebirge",
    "Turmkogel – Puchenstuben",
    "Hahnbaum – St. Johann im Pongau",
    "Eibisberg – Anger",
    "Muckenkogel – Lilienfeld",
    "Schneeberg-Hagerlifte – Mitterland (Thiersee)",
    "Raxalpe – Reichenau an der Rax",
    "Pfänder – Bregenz",
    "Feichtecklift Brandlucken – St. Kathrein am Offenegg",
    "Hochlitten – Riefensberg",
    "Kirchschlag bei Linz",
    "Holzmeisterlifts Sommeralm – St. Kathrein am Offenegg",
    "Schönfeld – Thomatal",
    "Rotecklift – Tobadill",
    "Gröllerkopf – Übersaxen",
    "Kaiserau – Admont",
    "Almblicklifts – Strallegg",
    "Embach – Hörndl",
    "Hirschegger Dorflifte",
    "Tockneralmlift Krakauebene – Krakauhintermühlen (Krakau)",
    "Viehberg – Sandl",
    "Heumöser – Ebnit (Dornbirn)",
    "Spechtenseelift – Pürgg (Stainach-Pürgg)",
    "Alpe Furx – Furx (Zwischenwasser)",
    "St. Corona am Wechsel",
    "Gföllberglift – Holzgau",
    "Patschalift – St. Kathrein am Offenegg",
    "Schnifisberg – Schnifis",
    "Silvretta Bielerhöhe – Partenen",
    "Prägraten am Großvenediger",
    "Pirstingerkogellift Sommeralm – Hohenau an der Raab (Passail)",
    "Schmolllifte – Steinhaus am Semmering",
    "Spitzeralm – Sankt Lorenzen bei Knittelfeld",
    "Wildentallift",
    "Oberau (Wildschönau)",
    "Bodental – Unterbergen (Ferlach)",
    "Nagelköpfl – Piesendorf",
    "Knittellifte – Elbigenalp",
    "Wildwiese – Miesenbach bei Birkfeld",
    "Krähenberg – Sibratsgfäll",
    "Karlift – Heiterwang",
    "Wenigzell",
    "Arabichl – Kirchberg am Wechsel",
    "Hittisberg – Hittisau",
    "Reith bei Kitzbühel",
    "St. Hemma – Edelschrott",
    "Feistritzsattel – Trattenbach",
    "Hausberglift – Waidring",
    "Lechnerberg",
    "Schneiderkopf – Buch",
    "Geigenbühel",
    "Kolsassberg",
    "Hüttegglift – Weerberg",
    "Lammertallift – Annaberg-Lungötz",
    "Grünberg – Obsteig",
    "Fischbach",
    "Stoaninger Alm – Schönau im Mühlkreis",
    "Tschardund – Nenzing",
    "Roggenboden",
    "Johnsbach (Admont)",
    "Gaberl/Plankogel – Salla (Maria Lankowitz)",
    "Oberwaldlifte – Faistenau",
    "Trins",
    "Archenstadel – Rinn",
    "Petersbründl – St. Michael im Lungau",
    "Lana Lift – Anras",
    "Kronberg – St. Georgen im Attergau",
    "Hansberg – St. Johann am Wimberg",
    "Kleinlobming",
    "Nussbaumerlifte – Hof bei Salzburg",
    "Lärchenhof – Erpfendorf",
    "Wiesinger Bühel – Wiesing",
    "Buchsteinlift – Reiflingviertel (St. Gallen)",
    "Birgitz",
    "Griminitzen (Kirchbach)",
    "Lessach",
    "Schwannerlift – Weerberg",
    "Siebenseelift – Wildalpen",
    "Liebenau",
    "Grunholzlift – Au",
    "Nocksteinlifte – Koppl",
    "Brandlift – Scharnitz",
    "Schorschi-Lifte – St. Georgen am Walde",
    "Obervellach",
    "Zlaim – Grundlsee",
    "Mathon",
    "Saualpe – Eberstein",
    "Raunigwiese – Kolbnitz (Reisseck)",
    "Steinberg am Rofan",
    "Konradshüttle – Vils",
    "Niedernsill",
    "Wiesenhofer – Miesenbach bei Birkfeld",
    "Boden (Pfafflar)",
    "Zederhaus",
    "St. Kathrein am Offenegg",
    "Bschlabs (Pfafflar)",
    "Astenberg – Wiesing",
    "Predigstuhl – Bad Goisern am Hallstättersee",
    "Eugendorf",
    "Birkenlift",
    "Millrütte – Götzis",
    "Thalgauberg – Thalgau",
    "Mönchdorf (Königswiesen)",
    "Fellachlift – Virgen",
    "Kesselmannlifte – Faistenau",
    "Kohleck (Waldzell)",
    "Schmiedhornlift – Wald (Faistenau)",
    "Brenneralm – Breitenfurt bei Wien",
    "Wildstättlift – Wattenberg",
    "Kaiserlindenlift – Gams bei Hieflau",
    "Waldskilift – Wald (Faistenau)",
    "Frauenstaffl – Ulrichsberg (Waidhofen an der Thaya)",
    "Trausmühle – Ottenschlag",
    "Baienberg – Reuthe",
    "Kirchdorflift – Doren",
    "Moosetallift – Leisach",
    "Schatzerlift – Kirchberg",
    "Navis",
    "Moosberglift – Weißenbach am Lech",
    "Astenlift – St. Veit im Pongau",
    "Kirchbach (Rappottenstein)",
    "Schleppe Alm – Klagenfurt am Wörthersee",
    "Mitteldorflift – Döllach (Großkirchheim)",
    "Stadtwaldlift – Rottenmann",
    "Schwoich",
    "Sonnenberglift – Gries im Sellrain",
    "Burglift – Stans",
    "Hohe Wand Wiese – Vienna (High Hills)",
    "Alfaierlift – Gschnitz",
    "Rossbachlift – Nassereith",
    "Hrastlift – Feistritz an der Gail",
    "Ahornlift",
    "Mühldorf",
    "Waldrastlift – Ehenbichl",
    "Eichfeldlift – Turnau",
    "Neuleutasch (Leutasch)",
    "Dellach im Drautal",
    "Katschwald (Obdach)",
    "Vögelsberg (Wattens)",
    "Mühlegglift – Hopfgarten in Defereggen",
    "Arnreit",
    "Gries (Längenfeld)",
    "Stanzach",
    "Baldramsdorf",
    "Aschaulift – Koppl",
    "Jauerling – Maria Laach am Jauerling",
    "Bachrain – Golling an der Salzach",
    "Gut Enghagen – Roßleithen",
    "Waldheimhütte – Sankt Anna am Lavantegg",
    "Braz (Innerbraz)",
    "Oswaldbauerlift – Krieglach",
    "Annerlbauerlifte – Krieglach",
    "Rettenbach (Bernstein)",
    "Försterkogel – Puchenstuben",
    "Königswiesen",
    "Brandlwiese – Kaumberg",
    "Kramsach",
    "Wimmerlifte – Purgstall bei Eggersdorf",
    "Sonnenlift – Praxmar",
    "Stockerfeldlift Mößna – St. Nikolai im Sölktal (Sölk)",
    "Krößbach",
    "Oberzeiring (Pölstal)",
    "Sonnenberglift – Milders",
    "Dorflift Sulzberg",
    "Tragöß-Sankt Katharein",
    "Hartmannsdorf",
    "Hammerbodenlift – Großreifling (Landl)",
    "Gaisrückleiten – Wiesen",
    "Lainach (Rangersdorf)",
    "Bruggen (Greifenburg)",
    "Zenitzen – Winklern",
    "Böglerlift – Alpbach",
    "Hütten – Bizau",
    "Lengau",
    "Zellenberg – Kukmirn",
    "Feichten",
    "Hinterfeld – Mösern (Telfs)",
    "Bungerloch – Tarrenz",
    "Rettenegg",
    "Gedersberg – Seiersberg",
    "Bad Häring",
    "Platzhaus-Leit'n – Stuhlfelden",
    "Vals",
    "Hallstatt",
    "Schnee-Erlebnisland Flattach",
    "Floitenlift – Ginzling",
    "Häselgehr",
    "Kaisers",
    "Bonka – Kirchbach (St. Andrä-Wördern)",
    "Langkampfen",
    "Berger Anger – Berg im Drautal",
    "Gramais",
    "Breitenwang",
    "Tauchnerfeld – Stall",
    "Dollwiese – Vienna",
    "Schneeerlebniswelt Seestadt Aspern – Vienna (dry slopes)",
    "Bichlalm"
];

///////////

var i=0, l=resorts.length,
 arr = [];

(function loop(i){

    doResort(resorts[i])
        .then((data) => {
            arr.push(data);
            if(i<l) {
                console.log("done with %d: %s", i, data.name);
                setTimeout(() => {
                    loop(i+1);
                }, 0);
            }
            else {
                console.log("done!");

                var result = json2csv({ data: arr });
                
                console.log(result);
            }
        }, (err) => {
            setTimeout(() => {
                loop(i+1);
            }, 0);
        });

})(i);
