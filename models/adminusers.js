// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

// set up a mongoose model and pass it using module.exports
  module.exports = mongoose.model("adminUsers", new Schema({ 
      name: String,
      email: String,
      password: String,
      phone: String,
      schoolId: ObjectId,
      changePassword: Boolean
  },  {collection : "adminUsers"}));
