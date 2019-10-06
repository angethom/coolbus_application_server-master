var express = require('express');;

// get an instance of the router for api routes
var apiRoutes = express.Router(); 
var config = require('../config');
var User   = require('../models/registeruser'); // get our mongoose model

// route to register a user (POST http://localhost:8080/api/register)
apiRoutes.post('/register', function(req, res) {

var name = req.body.name;
var phone = req.body.phone;
var email = req.body.email;
var pass = req.body.password;
var deviceId = req.body.deviceId;

console.log('Register');
if(name == null || phone == null || email == null || pass == null || deviceId == null){
 res.status(400).json({ success: false, message: 'incomplete request' });
return;
}
console.log(name + " " + email );
var newuser = new User ({
name: name,
phone: phone,
emailId: email,
password: pass,
deviceId: deviceId,
timestamp: new Date(),
accountCreatedOn: new Date()
});

User.findOne({emailId:email}, function(err, user) {
if(err) throw err;

if(!user) {
 // save the user
  newuser.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.status(200).json({ success: true });
});
} else if(user) {
	if(user.phone == phone) {
	res.status(401).json({ success: false, message: 'User exist with same name and phone number.' });
	} else if(user.emailId == email) {
	res.status(401).json({ success: false, message: 'User exist with same name and email address.' });
	}
}}); 
});

module.exports = apiRoutes;


//app.get('/setup', function(req, res) {

  // create a sample user
//  var nick = new User({
//    name: 'Nick Cerminara',
//    password: 'password',
//    admin: true
//  });

  // save the sample user
//  nick.save(function(err) {
//    if (err) throw err;
//
//    console.log('User saved successfully');
//    res.json({ success: true });
//  });
//});
