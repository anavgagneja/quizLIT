var express = require('express');

var app = express();
app.use(express.bodyParser());

app.post("*", function(req, res) {
	res.end(JSON.stringify(req.files) + "\n");
});

app.listen(3000);