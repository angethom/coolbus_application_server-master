var mongoose = require('mongoose');  
var Schema = mongoose.Schema; 

module.exports = mongoose.model("routes", new Schema({

}, {collection : "locationcoordinates"}))
