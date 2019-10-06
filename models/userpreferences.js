// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 ObjectId = Schema.ObjectId;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('userpreferences', 
    new Schema({
        userId:ObjectId,
        stops: [{
            prefId:ObjectId,
            schoolId: String,
            routeId: String,
	        stopId: String,
	        notificationTime: String 
	        }],
        timestamp: Date,
    },  {collection : 'userpreferences'}));
