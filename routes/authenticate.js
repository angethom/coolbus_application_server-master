var express = require('express');;
// get an instance of the router for api routes
var apiRoutes = express.Router(); 
var config = require('../config');
var appUser   = require('../models/registeruser'); // get our mongoose model
var adminUser = require('../models/adminusers'); 
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
	console.log('api: authenticate');
	var email = req.body.email ? req.body.email : null;	
	var pass = req.body.password ? req.body.password.toString() : null; 
	var isAdmin =  req.body.admin == 'true';

	if(email == null || pass == null) {
		res.status(401).json({ 
			success: false, 
			message: 'Authentication failed.'});
		return;
	}
//	var checkUser = !isAdmin || isAdmin === false ? appUser : adminUser;
var checkUser;
	if(!isAdmin || isAdmin == false) {
		checkUser = appUser;
	} else if(isAdmin == true){
		checkUser = adminUser;
	}

	checkUser.findOne({emailId:email, password:pass}, function(err, test){
	if(err)
			throw err;
	console.log("data in the table :" + test);
	});

	console.log('user table '+ checkUser + 'request for email :' + email + 'password : ' + pass);
	// find the user
	checkUser.findOne({
		emailId: email,
		password: pass
	 }, function(err, theuser) {
		 if (err) throw err;
		 if (!theuser) {
			 console.log('User does not exist');
			 res.status(401).send({ 
				 success: false, 
				 message: 'Authentication failed. User name or password is wrong' });
			 return;
		 } else if (theuser) {
			 console.log('User Exist with user '+ theuser +' Name : ' + theuser.name + 
				 ' email : ' + theuser.emailId + ' password : ' + theuser.password);
			 console.log('email again : ' + theuser.emailId);
			 if (isAdmin === true && theuser.changePassword == true){
				 res.status(200).json({
					 success:true, 
					 changePassword:true, 
					 message: 'Please change the password'
				 });
				 return;
			 }
			// if user is found and password is right
			// create a claim, just for test.
			var claims = {
				sub:theuser._id, 
				admin:isAdmin, 
				iss:'https://mohitsachan.ddns.net', 
				permissions:''
			};
			 var token = jwt.sign(claims, req.app.get('superSecret'), {
				 expiresIn: 10080 // expires in 7 days
			 });

			 // return the information including token as JSON
			res.json({
				success: true,
				message: 'Enjoy your token!', 
				token: token
			});
		 }   
	 });
});

module.exports = apiRoutes;
