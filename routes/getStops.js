var express = require('express');;

// get an instance of the router for api routes
  var apiRoutes = express.Router();
  var config = require('../config');
  var Stops   = require('../models/stops'); // get our mongoose model
  //
  // route to register a user (POST http://localhost:8080/api/register)
   apiRoutes.get('/routestops', function(req, res) {

   var stops  = req.headers['stops'];
   console.log('stop routes');
   if(stops== null){
      res.status(400).json({ success: false, message: 'incomplete request' });
      return;
    }
    
    var stopsIdArray  = stops.split("|");
    Stops.find({_id:{$in:stopsIdArray} }, function(err, stopsList) {
    if(err) {
        res.status(4000).send({status:false});
    } else {
        res.status(200).send(stopsList);
    }
    });
   });
module.exports = apiRoutes;
