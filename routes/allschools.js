var express = require('express');;

// get an instance of the router for api routes
var apiRoutes = express.Router();
var config = require('../config');
var schools = require('../models/school'); // get our mongoose model
var constants = require('../util/constants');

// route to register a user (POST http://localhost:8080/api/register)

apiRoutes.get('/schoolsversion', function(req,res) {
	console.log('getting schools version');
	var response = {};
	response[constants.VERSION] = 1;
	return res.status(constants.SUCCESS).json(response);
});

apiRoutes.get('/allschools', function(req, res) {

console.log('allschools');

userid = req.decoded.sub;
console.log('user id : ' + userid);
var version = 1;
var allSchools = function(version, schools) {
	this.version = version;
	this.schools = schools;
}

//find({},{SCHOOLNAME:1, ADDRESSLINE1:1, ADDRESSLINE2:1, SCHOOLCITY:1})
schools.find({},{
	name:1, 
	addressLine:1, 
	city:1, 
	latitude:1, 
	longitude:1, 
	contactNo1:1, 
	contactNo2:1, 
	website:1, 
	routes:1}, 
	function(err, schools) {
		if (err){ 
			return response.status(constants.SERVER_ERROR).send({error:err});
			//throw err;
		}
		
		var response = new allSchools(version, schools);
		//response.version = version;
		//response.schools = schools;
		console.log('user id : ' + req.decoded.sub);
		//schools.push(version:);
		//schools.version = version;
		res.status(constants.SUCCESS).send(response);
	});
});

module.exports = apiRoutes;
