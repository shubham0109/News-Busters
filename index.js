var express = require('express');
var app = express();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var firebase = require("firebase");
var stringSimilarity = require('string-similarity');

app.listen('8080');
console.log("GO TO LOCALHOST:8080 AND CLICK THE BUTTON!");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDqGdXLLIkpKdXd8MIJpG_LxQklm5195pA",
    authDomain: "newsscrapper0109.firebaseapp.com",
    databaseURL: "https://newsscrapper0109.firebaseio.com",
    projectId: "newsscrapper0109",
    storageBucket: "newsscrapper0109.appspot.com",
    messagingSenderId: "833129302795"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

var headlines = [];
var links = [];

app.get('/', function(req,res) {

	headlines = [];
	links = [];
	
	res.render("index.ejs");

	url1 = 'http://indianexpress.com/';

	request(url1, function(error,response,html){
		
		if (!error){
			var $ = cheerio.load(html);
  			firebase.database().ref('newspaper/' + "IndianExpress").remove();
  			var ctr = 0;
			$('.top-news li').each(function(i){
				if (ctr < 5){
					var headline = $(this).text().trim();
					var link = $(this).find('a').attr('href');
					headlines.push(headline);
		  			links.push(link);
		  			
					writeUserData("IndianExpress", headline, link);
					//console.log(headline);
					//console.log(link);
					
		  			//console.log(headlines);
	  				ctr++;
	  			}
			});
			
		//	console.log(headlines);
		}


	});

	url2 = 'http://timesofindia.indiatimes.com/';

	request(url2, function(error,response,html){
		

		if (!error){
			var $ = cheerio.load(html);
			firebase.database().ref('newspaper/' + "TimesOfIndia").remove();
			var ctr = 0;
			$('.top-story li').each(function(i){
				if (ctr < 5){

					var headline = $(this).text().trim();
					var link = $(this).find('a').attr('href');
					headlines.push(headline);
		  			links.push(link);
		  			
					writeUserData("TimesOfIndia", headline, link)
					ctr++;
				//console.log(title);
				//console.log(link);
				}
			});
		//	console.log(headlines);

		}
		
	});

	url3 = 'http://www.thehindu.com/';

	request(url3, function(error,response,html){
		if (!error){
			var $ = cheerio.load(html);
			firebase.database().ref('newspaper/' + "TheHindu").remove();
			var ctr = 0;
			$('.justIn-story h3').each(function(i){
				if (ctr < 5){
				var headline = $(this).text().trim();
				var link = $(this).find('a').attr('href');
				headlines.push(headline);
		  		links.push(link);
				writeUserData("TheHindu", headline, link)
				//console.log(title);
				//console.log(link);
				ctr++;
				}
			});
			//			console.log(headlines);

		}
	});

	url4 = 'http://www.hindustantimes.com/';

	request(url4, function(error,response,html){
		if (!error){
			var $ = cheerio.load(html);
			firebase.database().ref('newspaper/' + "HindustanTimes").remove();
			var ctr = 0
			$('.breaking-news-area li').each(function(i){
				if (ctr < 5){
					var headline = $(this).text().trim();
					var link = $(this).find('a').attr('href');
					headlines.push(headline);
			  		links.push(link);
					writeUserData("HindustanTimes", headline, link)
					//console.log(title);
					//console.log(link);
					ctr++;
				}
			});
					//	console.log(headlines);

		}
	});

	url5 = 'http://www.deccanherald.com/';

	request(url5, function(error,response,html){
		if (!error){
			var $ = cheerio.load(html);
			var ctr = 0;
			firebase.database().ref('newspaper/' + "DeccanHerald").remove();

			$('.related_news li').each(function(i){
				if (ctr < 5){
					var headline = $(this).text().trim();
					var link = $(this).find('a').attr('href');
					headlines.push(headline);
			  		links.push(link);
					writeUserData("DeccanHerald", headline, link)
					//console.log(title);
				//console.log(link);
					ctr++;
				}
			});
		//				console.log(headlines);

		}
	});

	url6 = 'http://www.thestatesman.com/';

	request(url6, function(error,response,html){
		if (!error){
			var $ = cheerio.load(html);
			firebase.database().ref('newspaper/' + "TheStatesman").remove();
			var ctr = 0;

			$('.top-news-section-inner-inner li').each(function(i){
				if (ctr < 5){
					var headline = $(this).text().trim();
					var link = $(this).find('a').attr('href');
					headlines.push(headline);
			  		links.push(link);
					writeUserData("TheStatesman", headline, link)
					//console.log(title);
					//console.log(link);
					//fs.appendFileSync('newsfeed.txt', title + '\n' + link + '\n');
					ctr++;
				}
			});
		//	console.log(headlines);

		}


	});



	function writeUserData(name, headline, link) {
	  	firebase.database().ref('newspaper/' + name).push({
	    headline: headline,
	    link: link,
	  });
	  	
	}

	/*var ref = firebase.database().ref('newspaper/' + 'DeccanHerald');
	ref.on('value', gotData, errData);

	function gotData (data){
		var values = data.val();
		console.log(typeof values);
		Object.keys(values);
		//var keys = []
		//keys = Object.keys(values);
		/*console.log(keys);
		for (var i = 0; i < keys.length; i++){
			var k = keys[i];
			headlines.push(values[k].headline);
			links.push(values[k].link);
		}
		
	}

	function errData (err){
		console.log(err);
	}*/
	
	//console.log(headlines.length);
});

	

app.get('/sim', function(req,res) {

	var obj = [];

	for (var i = 0; i < headlines.length; i++){
		var headline = headlines[i];
		var link = links[i];
		var similarity = [];
		for (var j = 0; j < headlines.length; j++){
			similarity.push(stringSimilarity.compareTwoStrings(headlines[i], headlines[j]));
		}
		var newObj = new create(headline, link, similarity)
		obj.push(newObj);
	}

	function create(headline, link, similarity) {
	    this.headline = headline;
	    this.link = link;
	    this.similarity = similarity;
	}
//	console.log(obj);

	var similarityAvg = [];
	for (var i = 0; i < obj.length; i++){
		var tempObj = obj[i];
		var len = obj.length - 1;
		var sum = 0;
		var scores = tempObj.similarity;
		scores.sort(function(a,b){return b-a});

		for (var j = 0; j < 3; j++){
			if (scores[j] != 1){
				sum += scores[j];
			}
		}
		var avg = sum/2;
		similarityAvg.push(avg);
	}
	//console.log(similarityAvg);

	for (var i = 0; i < similarityAvg.length; i++){
		var points = similarityAvg[i];

		if (points >= 0.3){
	//		console.log(obj[i].headline);
		}
	}
	//console.log(headlines.length);
	//console.log(similarityAvg.length);
		res.render('sim.ejs',{
		headlines : headlines,
		links : links,
		similarityAvg : similarityAvg
	});
});


