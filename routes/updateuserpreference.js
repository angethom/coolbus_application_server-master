var express = require('express');;

// get an instance of the router for api routes
var apiRoutes = express.Router();
var config = require('../config');
var preferences = require('../models/userpreferences'); // get our mongoose model
var mongoose = require('mongoose');

// route to register a user (POST http://localhost:8080/api/register)
apiRoutes.post('/adduserschool', function(req, res) {

console.log('update user preferences');

userid = req.decoded.sub;
school = req.body.schoolId;
route = req.body.routeId;
stop = req.body.stopId;
var stopPrefId = req.body.preferenceId;
    
    console.log('user id : ' + userid);
//var prefid = new mongoose.Types.ObjectId(stopPrefId);
var userObjectId = new mongoose.Types.ObjectId(userid);
    
console.log("stop pref id is : " + stopPrefId + " school is :" + school + "route is :"  + route + " stop is :" + stop);

if(stopPrefId) {    
  var prefid = new mongoose.Types.ObjectId(stopPrefId);
    preferences.findOne({userId: userObjectId,"stops.prefId":prefid}, function(err, updates) {
   
        if(updates){
        console.log("updates : " + updates + " user id : " + updates.userId + " stop info " + updates.stops);
    
        if(!school || !route || !stop) {
            res.status(400).send({success:false, message:"incomplete request"});
        } else {
            preferences.update({"stops.prefId":prefid},
                {$set:{ "stops.$.schoolId": school, "stops.$.routeId": route, "stops.$.stopId":stop}}, 
                function(err, updated) {
                    if(err) {
                    response.status(400).send({success:false, message:err});
                    throw err;
                }
                console.log("Error is " + err);
                console.log("updated user is " + updated);    
                res.status(200).send({success:true, message:"User Preferences Updated"});
            });
        }   
    } else {
        res.status(400).send({success:false, message:"No such preference found"})
    }
    });
} else{
    preferences.update({userId:userid},
        {$addToSet:
            {"stops":
                { prefId:new mongoose.Types.ObjectId(), routeId:route,schoolId:school,stopId:stop }
            }
        },{upsert:true},
        function(err, update) { 
            if(err) {
                console.log("Error is : " + err );
                res.status(400).send({success:false, message:err});
            }else {
                res.status(200).send({success:true, message:''});
            }
        });
    }
});


//schools.find({},{name:1, addressLine:1, city:1, latitude:1, longitude:1, contactNo1:1, contactNo2:1, website:1, routes:1}, function(err, schools) {
//if (err){
//response.status(404).send({error:err});
//throw err;
//}
//console.log('user id : ' + req.decoded.sub);
//res.status(200).send(schools);
//  });

//});

module.exports = apiRoutes;       
