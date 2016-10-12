ddg = require('ddg');

options = {
	"useragent": "My duckduckgo app",
	"no_redirects": "1",
	"no_html": "0",
}

ddg.query('duckduckgo', options, function(err, data) {
	console.log(data.AbstractText);
});