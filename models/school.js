// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('schools', new Schema({ 
name: String,
addressLine: String,
city: String,
contactNo1: String,
contactNo2: String,
website: String,
latitude:String,
longitude: String,
emailId: String,
},  {collection : 'schools'}));
