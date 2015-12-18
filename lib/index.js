#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var meta = require("./../package.json");
var express = require('express');
var port = 3000;
var dir = process.cwd();
var util = require('util');

program
  .version(meta.version)
  .option('-p, --port <n>', 'Port')
  .option('-d, --dir <s>', 'Web Root Directory')
  .parse(process.argv);


if (program.port) {
	port = parseInt(program.port);
}

if (program.dir) {
	if (fs.existsSync(path.join(process.cwd(), program.dir))){
		dir = path.join(process.cwd(), program.dir);
	} else {
		dir = program.dir;
	}
}


var ServerApplication = function(setup, done) {
	this.config = setup;
	if (!fs.existsSync(setup.dir)){
		console.log(setup,fs.existsSync(setup.dir));
		throw ("directory not found");
	}
	this.app = express();
	this.app.use(express.static(dir));

	var bodyParser = require('body-parser');
	this.app.use( bodyParser.json() );        // to support JSON-encoded bodies
	this.app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
		extended: true
	}));

	this.app.post("/*", function(req, res/*, next*/){
		console.log("received:", util.inspect(req.body, { showHidden: true, depth: 10, colors: true }));
		res.json(req.body);
	});

	this.app.get("/*", function(req, res/*, next*/){
		console.log("received:", util.inspect(req.query, { showHidden: true, depth: 10, colors: true }));
		res.json(req.query);
	});

	console.log("Serving", dir, " at localhost:", port);
	this.app.listen(setup.port, done);
};

// if (process.argv[0].toLowerCase() === "node"){
	var server = new ServerApplication({dir:dir, port:port});
	console.log("Server running with:", util.inspect(server.config, { showHidden: true, depth: 10, colors: true }));
// }

module.exports = ServerApplication;