var express = require('express');
// get an instance of the router for api routes
 var apiRoutes = express.Router();
 var config = require('../config');
 //var User   = require('../models/registeruser'); // get our mongoose model
 var adminUser = require('../models/adminusers');
 var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
 apiRoutes.post('/adminauth', function(req, res) {

 console.log('api: adminauth');
 var email = req.body.email;
 var pass = req.body.password;

 if(email == null || pass == null) {
 res.json({ success: false, message: 'Authentication failed.'});
 return;
 }

 console.log('request for email :' + email + 'password : ' + pass);
   // find the user
     adminUser.findOne({
         emailId: email
           }, function(err, user) {
               if (err) throw err;
               if (!user) {
                   console.log('User does not exist');
                   res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
               } else if (user) {
                   console.log('User Exist with Name : ' + user.name + 'email : ' + user.emailId + 'password : ' + user.password);
                   // check if password matches
		   if (user.changePassword) {
			res.status(200).send({success:true, changePassword:true});
		   } else if (user.password != pass) {
                       	res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
                   } else {
                       // if user is found and password is right
                       // create a token 
                       // create a claim, just for test.           
                       var claims = {
                           sub:user._id,
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
               }
           });
 });
module.exports = apiRoutes;                     
