var express = require("express");
var databasehelper = require("./databaseaccessor");
var apiRoutes = express.Router();


apiRoutes.get('/allschoolroutes', function(req, res) {
	var userid = req.decoded.sub;
	var isAdmin = req.decoded.admin == true;

	console.log("Decoded token : " + req.decoded.admin);
	console.log("isAdmin: " + isAdmin);
	
	if(!isAdmin) {
		return res.status(401).json({
			success:false,
			message:"no permission to access the resource"
		});
	}

	var school = function(id, schoolName, schoolAddress) {
		this.id = id;
		this.schoolName = schoolName;
		this.schoolAddress = schoolAddress;
	}

	databasehelper.getAdminSchool(userid, function(err, dbSchool) {
		console.log("The admin school is " + dbSchool);
		if(err) {
			throw err;
			return res.status(500).json({
				success:false,
				message: "Error getting the school information"
			});
		}
		var adminSchool = new school(dbSchool._id, dbSchool.name, dbSchool.addressLine);
		adminSchool.location = dbSchool.latitude + "," + dbSchool.longitude;
		
		var routeIds = dbSchool.routes;
		
		databasehelper.getSchoolRoutesWithStop(routeIds, function(err, routes) {
			if(err) {
				throw err;
				return res.status(500).json({
					success:false,
					message: "Error getting routes information"
				});
			}
			adminSchool.routes = routes;
			return res.status(200).send(adminSchool);
		});
		//return res.status(200).send(adminSchool);
	});
});

module.exports = apiRoutes;
