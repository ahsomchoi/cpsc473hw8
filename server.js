var express = require("express"),
    http = require("http"),
    // import the mongoose library
    mongoose = require("mongoose"),
    Schema = mongoose.Schema;
    app = express();

app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

mongoose.connect('mongodb://localhost/url', function(err) {
    if (err) { console.log(err); }
});

var urlSchema = mongoose.Schema({
    lURL: String,
    sURL: String,
    count: Number
});

var url = mongoose.model("url", urlSchema);

http.createServer(app).listen(3000);



app.get("/gettopten", function(req, res) {
	var sortParams = {count:"desc"};
	url.find().sort(sortParams).limit(10).execFind(function(err, urls) {
		res.json(urls);
	});
});

//
app.post("/longurl", function (req, res) {

	var shortURL;
	var tempurl = req.body.longurl;
	
	url.count({}, function (err, count) {
		var newurl = new url({"lURL":tempurl,"sURL":count.toString(36),"count":0});
	    newurl.save(function(err,url) {
	    	if(err) return handleError(err);
	    	res.json({shorturl:url.sURL});
	    });
	});
    
  });

//short url is entered from the input box
app.post("/:shorturl", function(req, res) {

	url.findOne({"sURL":req.params.shorturl}, function (err, url) {
		if(err) 
			return handleError(err);
		res.json({longurl:url.lURL});
	});

});  

//short url is entered from the address bar
app.get("/:shorturl", function(req, res) {

	url.findOneAndUpdate({"sURL":req.params.shorturl}, {$inc:{count:1}}, function (err, url) {
		if(err) 
			return handleError(err);

		res.redirect(url.lURL);
	});

}); 

