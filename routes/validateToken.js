var express = require('express');;

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to register a user (POST http://localhost:8080/api/register)
apiRoutes.get('/areyougood', function(req, res) {

console.log('checking');

userid = req.decoded.sub;
console.log('user id : ' + userid);
res.status(200).send({success : true});
  });

module.exports = apiRoutes;
