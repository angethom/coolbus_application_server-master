// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
 module.exports = mongoose.model("routes", new Schema({ 
 routeMap: String,
 routeName: String,
 stops:[]
 },  {collection : "routes"}));
