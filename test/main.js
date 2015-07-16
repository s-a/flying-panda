var util = require('util');
var should = require('should');
var fs = require('fs');
var path = require('path');
var events = require('events');
var request = require('supertest');  

var coverageMode = fs.existsSync("./../lib-cov/index.js");
var Application;

try {
	Application = require("./../lib-cov/index.js");
} catch(e){
	Application = require("./../lib/index.js");
}

if (coverageMode){
	console.log("coverage mode...", coverageMode);
}

/*
if (process.env.TRAVIS && process.env.NODE_ENV === "test" && process.env.COVERAGE === "1" ){
} else {
}
*/

var testData = null;

before(function() {
	testData = {
		name: "John",
		lastSeen: new Date().getTime()
	};

	it('should throw dir not found.', function(){
		(function(){
			Application({port : 3001, dir : "adfadsf"});
		}).should.throw();
	});

	new Application({port : 3001, dir : "."});
});


describe('server startup', function(){

	it('should return index.html', function(done){
		var body = {};
		request("http://localhost:" + 3001 + "/")
			.get('index.html')
			//.send(body)
			.expect('Content-Type', /text-html/)
			.expect(200); //Status code
			done();
	});

	it('should return post data', function(done){
		request("http://localhost:" + 3001 )
			.post('/api/foo/bar/unicorn')
			.set('Accept', 'application/json')
      		.expect('Content-Type', /json/)
			.send(testData)
			.expect(200) //Status code
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				res.body.should.have.property('name');
				res.body.should.have.property('lastSeen');
				res.body.name.should.equal(testData.name);
				res.body.lastSeen.should.equal(testData.lastSeen);
				done();
			});
	});

	it('should return get data', function(done){
		request("http://localhost:" + 3001 )
			.get('/api/foo/bar/unicorn?name=' + testData.name + "&lastSeen=" + testData.lastSeen)
			.set('Accept', 'application/json')
      		.expect('Content-Type', /json/)
			.expect(200) //Status code
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				res.body.should.have.property('name');
				res.body.should.have.property('lastSeen');
				res.body.name.should.equal(testData.name);
				res.body.lastSeen.should.equal(testData.lastSeen.toString());
				done();
			});
	});
});