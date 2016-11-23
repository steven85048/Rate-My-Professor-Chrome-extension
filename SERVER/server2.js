var express = require('express');
var app = express();

var fs = require('fs');
var https = require('https');
var request = require('request');
var cheerio = require('cheerio');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, University-Name, Professor-Name, User-HTML");
  next();
});

app.get('/test', function (req, res){
	console.log("TEST RECEIVED");
});


// GET DATA FROM LINK TO PROFESSOR PAGE

function getDataFromLink(url, response, callback){
	request("https://www.ratemyprofessors.com" + url, function (err, reqresponse, html) {
		if (error)
			return console.log("RMP Request Failed : " + error);
		
		if (reqresponse.statusCode != 200)
			return console.log("Invalid Status Code Returned: " + reqresponse.statusCode);
				
		var $ = cheerio.load(html);
	});
}

// GET LINKS FROM PROFESSOR NAME AND UNIVERSITY NAME

app.get('/receiveData', function(req, res){
	console.log("Receiving Data: ");
	
	var name = req.get("Professor-Name");
	var university = req.get("University-Name");
	
	console.log(name);
	console.log(university + "\n");
	
	var callback = function(resp, data){
		resp.writeHead(200, {"Content-Type": "text/plain"});
		resp.end(JSON.stringify(data));
	}
	
	var data = performRMPRequest(name, university, res, callback);
	
	
});

function performRMPRequest(professorName, aUniversity, response, callback){
	var query = professorName + " " + aUniversity;
	query = query.replace(/ /g, "+");
	
	var returned = false;
	request("http://www.ratemyprofessors.com/search.jsp?query=" + query, function(error, reqresponse, html) {
		if (error)
			return console.log("RMP Request Failed : " + error);
		
		if (reqresponse.statusCode != 200)
			return console.log("Invalid Status Code Returned: " + reqresponse.statusCode);
				
		var $ = cheerio.load(html);
		
		var totalList = $('li.PROFESSOR');
				
		totalList.each(function(i, element){
			var a = $(this).children('a');
			
			var aLink = $(this).children('a').attr('href');
			
			var span = a.children('span').eq(1);
			
			aName = span.children().eq(0).text();
			bUniversity = span.children().eq(1).text();
			
			var data = {
				link: aLink,
				name: aName,
				university: bUniversity
			};
						
			if (aName.toUpperCase().includes(professorName.toUpperCase())&& bUniversity.toUpperCase().includes(aUniversity.toUpperCase())){
				console.log(JSON.stringify(data));
				// prevent multiple responses
				if (!returned)
					callback(response, data);
				
				returned = true;
				return data;				
			}

		});
	});
	
	return null;
}

// initialize server

var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
	passphrase: "terry987"
};

console.log("App listening on 10.140.222.29:8000");
https.createServer(options, app).listen('8000', '10.140.222.34' );