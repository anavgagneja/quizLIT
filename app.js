var express = require('express');

// var bodyParser = require('body-parser');

var multer = require('multer');

var upload = multer({ dest: 'uploads/' })

var app = express();

var convertedFile = null;

var username = "a622097f-ea26-4b08-a859-13e9cc3af854";
var password = "MR9giTPcSrGL";

var watson = require('watson-developer-cloud');
var fs = require('fs');

var Alchemy = require('alchemy-api');
var alchemy = new Alchemy('2459c001f13a01e1b1076c8434b5175aacc52b7a');

var document_conversion = watson.document_conversion({
  username: username,
  password: password,
  version: 'v1'
});

var ddg = require('ddg');

app.use(express.static(__dirname + '/html'));

// app.use(busboy());

// app.use(bodyParser.urlencoded({ extended: false }));

app.get("/upload", function(req, res){

	// ask express to serve up the HTML upload form
	res.sendFile('index.html', { root: __dirname + "/html" });

});

app.post('/upload', upload.single('pdfFile'), function (req, res, next) {
  
  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
  
  console.log(JSON.stringify(req.file.filename));
  var fileHandle = fs.createReadStream("uploads/" + req.file.filename);

  document_conversion.convert({
	'file': fileHandle,
	'conversion_target': document_conversion.conversion_target.NORMALIZED_TEXT
}, function onCompleteConvert(err, response) {
	
	if (err) {
		
		console.error(err);

	} else {
		
		convertedFile = (JSON.stringify(response, null, 2));
		
		// convertedFile = convertedFile.replace(/\s+/g, " ");

		convertedFile = convertedFile.replace(/(\/n)+/g, " ");

		alchemy.keywords(convertedFile, {
			/*'sentiment': 1*/
		}, function(err, response) {
			
			if(err) {
				throw error;
			}

			var results = response.keywords.filter(function(keyword){
				return (keyword.relevance > .30);
			});


			options = {
		        "useragent": "My duckduckgo app",
		        "no_redirects": "1",
		        "no_html": "0",
			}
			var resultsArr = new Array();
			for(var i = 0; i < results.length; i++) {
				ddg.query(results[i].text, options, function(err, data){
					if(err) {
						Console.log(err);
					}
    				resultsArr.push(data.AbstractText);
				});

			}


			results = JSON.stringify(results, null, 2);	

			fs = require('fs');
			fs.writeFile('results.txt', results, function (err) {
				  if (err) return console.log(err);
				    console.log('done');
				    });
			fs.writeFile('definitions.txt', resultsArr, function (err) {
				if (err) return console.log(err);
				    console.log('done');
				    });

				    
			var mv = require('mv');
			mv('./results.txt','./html/results.txt',function (err) {
				  if (err) return console.log(err);
				    console.log('done');
				    });
			mv('./definitions.txt','./html/results.txt',function (err) {
				  if (err) return console.log(err);
				    console.log('done');
				    });
			//fs.rename();
			//res.send(results);
			res.sendFile('results.html', { root: __dirname + "/html" });

		});

	}

});


})








// function keywords(req, res, output) {
// 	alchemyapi.keywords('text', demo_text, { 'sentiment':1 }, function(response) {
// 		var results = response.keywords;
// 		console.log(results);
// 	});
// }
/*
fs.readFile(req.files.fileUpload.path, function (err, data) {
	var newPath = "data/";
	fs.writeFile(newPath, data, function(err) {
		res.redirect("back");
	});
});

var upload = multer({dest: '/' });

app.post('/', upload.single('fileUpload'), function(req,res) {
     console.log(req);
     console.dir(req.files);
     console.log(req.files);
});
*/



 app.listen(3000, function () {
 	console.log('Example app listening on port 3000!');
 }); 
