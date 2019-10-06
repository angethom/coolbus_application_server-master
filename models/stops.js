
// get an instance of mongoose and mongoose.Schema
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 // set up a mongoose model and pass it using module.exports
 module.exports = mongoose.model('stops', new Schema({ 
 stopName: String,
 stopArea: String,
 arrivalAM: String,
 arrivalPM: String,
 latitude2: String,
 longitude: String
 },  {collection : 'stops'}));
