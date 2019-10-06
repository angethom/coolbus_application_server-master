var express = require('express');
var apiRoutes = express.Router();
var appUser   = require('../models/registeruser'); // get our mongoose model 
var adminUser = require('../models/adminusers');  

apiRoutes.post('/changepassword', function(req, res) {
	console.log('api: changepassword');
	var email = req.body.email;
	var oldPass = req.body.oldpassword;
	var newPass = req.body.password;
	var isAdmin = req.body.admin == 'true';
	
	console.log("email : " + email + " oldPass : " + oldPass + " newPass : " + newPass)
	if(!email || !oldPass || !newPass) {

		return res.status(400).json({
			success: false,
			message: "please check request parameters"
		});
	}

	var user = !isAdmin || isAdmin === false ? appUser : adminUser;
	var searchQuery = {"emailId": email ,"password": oldPass };
	console.log("search Query is" + searchQuery);
	user.findOne({emailId: email}, function(err, test) {
if(err) throw err;
	console.log("data in the table is " + test);
});

	user.findOne(searchQuery, function(err, selectedUser) {
		console.log("error is " + err);
		if(err) {
			throw err;
		}
		console.log("selected user is : " + selectedUser);
		if(!selectedUser) {
			console.log("User doesn't exist");
			return res.status(401).json({
				success: false,
				message: "Username or password is wrong"
			});
		}
	
		var updateQuery = isAdmin ? {"$set":{"password" : newPass , "changePassword":false }} :
			{"$set":{"password" : newPass  }};
		console.log("search query " + searchQuery + " update query : " + updateQuery);
		updatePassword(searchQuery, updateQuery, function(updateErr, updatedUser) {
		if(updateErr) {
				console.log("updateErr :" + updateErr);
				throw updateErr;
			} else {
				console.log("updated User is : " + updatedUser.changePassword);
				if(updatedUser) {
					return res.status(200).json({
						success: true,
						message: "Password changed successfully"
					});
				}
			}
		});
	});

	var updatePassword = function(searchQuery, updateQuery, next) {
		user.update(searchQuery, updateQuery, function(err, user) {
			next(err, user);
		});
	}
});

module.exports = apiRoutes;

