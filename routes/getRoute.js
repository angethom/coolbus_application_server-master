var express = require('express');

// get an instance of the router for api routes
 var apiRoutes = express.Router();
 var config = require('../config');
 var Routes   = require('../models/routes'); // get our mongoose model
 var Stops = require('../models/stops');
 var databasehelper = require("./databaseaccessor");
//
// // route to register a user (POST http://localhost:8080/api/register)
 apiRoutes.get('/schoolroute', function(req, res) {

 var routes  = req.headers['routes'];
 console.log('schoolroute');
 if(routes== null){
  res.status(400).json({ success: false, message: 'incomplete request' });
  return;
  }
  var routeIdArray  = routes.split("|");     
   console.log("routeIds are : " + routeIdArray);

     function Stop (stopName, stopArea, arrivalAM, arrivalPM, latitude, longitude) {
           this.stopName = stopName;
           this.stopArea = stopArea;
           this.arrivalAM = arrivalAM
           this.arrivalPM = arrivalPM;
           this.latitude = latitude;
           this.longitude = longitude;
   };

   function Route(id, routeMap, routeName){
       this.id = id; 
       this.routeMap = routeMap;
        this.routeName = routeName;
       this.stops = [];
   };

	 
databasehelper.getSchoolRoutesWithStop(routeIdArray, function(err, routes) {
	console.log("Getting all school routes with stop");
	if(err) throw err;
	return res.status(200).send(routes);
});	 
	 

/*	 
var findStops = function(route, stops, next) {
 Stops.find({_id:{$in:stops}}, function(err, stopsList){
 if(err) {
 next(err, null);
 } else {
 // console.log(stopsList);
    route.stops = stopsList;
    next(null, route);
 }
 });
 };

     var routeList = [];
     var count = 0;
     Routes.find({_id:{$in:routeIdArray} }, function(err, routesList) {
//    console.log("db says this : " + routesList );  
         if(err) {
                res.status(400).send({status:false});
           } else {
               console.log("Length of routeList : " + routesList.length);
               for(var i =0; i < routesList.length; i++) {
                   var dbRoute = routesList[i];
                   var route = new Route(dbRoute._id, dbRoute.routeMap, dbRoute.routeName);
                   var stops = dbRoute.stops;

                   console.log("route is " + route + "stops ids are : " + stops);
                   findStops(route,stops, function(err, route) {
                   count ++;
                   if(!err) {
                       //route.stops = stopsList;
                       console.log("route after callback is : " + route);
                       routeList.push(route);
                   } else {
                      res.status(400).send({status:false});  
                   }
                    
                   if(count == routesList.length) {
                        res.status(200).send(routeList);
                   }
                   });
               }
               }
           });
*/
      });

module.exports = apiRoutes;
