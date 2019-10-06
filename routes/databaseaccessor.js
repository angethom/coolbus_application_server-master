var adminUser = require("../models/adminusers");
var appUser = require("../models/registeruser");
var school = require("../models/school");
var route = require("../models/routes");
var stops = require("../models/stops");

module.exports = {

	getAdminSchool : function(adminId, callback) {
		adminUser.findOne({_id : adminId}, function(err, user) {
			if(err || !user) {
				console.log("error or no user found for the id : " + err );
				callback(err, null);
			} else {
				getSchool(user.schoolId, callback);
			}
		});
	},

	getSchoolRoutesWithStop : function(routeIdList, callback) {
		route.find({_id:{$in:routeIdList}}, function(err, routes) {
			console.log("routelist length : " + routeIdList.length + "and routes length : " + routes.length);
			for(var i =0 ; i < routes.length; i++) {
				console.log(routes[i]._id + " name " + routes[i].routeName);
			}
			if(err || !routes) {
				console.log("error or no routes with id's in the list found : " + err);
				callback(err, routes);
			} else {
				var count = 0;
				for(var i = 0; i < routes.length; i++) {
					getStops(routes[i], function(err, route) {
						count ++;
						if(err) {
							console.log("Error getting stops : " + err);
							callback(err, null);
						}
						console.log("count : "+ count+ " run : " + i + "route is : " + route + "routelist size : " + routes.length);
	//					routes[i] = route;
						//console.log("routes list is : " + routes);
						if( count == routes.length) {
							callback(err, routes);
						}
					});
				}
			}
		});
	}
};

var getSchool = function(schoolId, callback) {
	school.findOne({_id:schoolId}, function(err, school) {
		callback(err, JSON.parse(JSON.stringify(school))); 
//	callback(err, JSON.parse(school));
	});
}

var getStops = function(route, callback) {
	stops.find({_id:{$in:route.stops}}, function(err, stops) {
		if(err) {
			callback(err, null);
		}
		route.stops = stops;
		callback(err, route);
	});
}

var Route = function(id, routeMap, routeName){

}

function stop() {
}

