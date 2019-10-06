var express = require('express'); 
var apiRoutes = express.Router(); 
var adminUser = require('../models/adminusers'); 

apiRoutes.post('/resetflag', function(req,res) {
console.log('api: resetflag');
	var email = req.body.email;
	if(!email) {
		return res.status(400).json({
			success:false,
			message:"Please check request parameters"
		});
	}

	adminUser.findOne({emailId:email}, function(err, selectedUser) {
		if(err) {
			throw err;
		}
		console.log("selectedUser :" + selectedUser);
		if(!selectedUser){
			console.log("user doesn't exist");
			return res.status(401).json({
				success:false,
				message: "wrong username"
			});
		}

		selectedUser.changePassword = true;
		selectedUser.save(function(saveError){
			if(err) throw err;
			return res.status(200).json({
				success:true,
				message: "password flag has been reset"
			});
		});
	});
});

module.exports = apiRoutes;
