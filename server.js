// =======================
// get the packages we need ============
// ======================
const https = require('https');
const fs = require('fs');
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
//var User   = require('./app/models/user'); // get our mongoose model
//var User   = require('./models/registeruser'); // get our mongoose model 

// Routes variables
var authenticate = require('./routes/authenticate');
var register = require('./routes/registeruser');
var updateUserPref = require('./routes/updateuserpreference');
var getRoutes = require('./routes/getRoute');
var changePassword = require('./routes/changepassword');
var resetPasswordFlag = require('./routes/resetflag');

const options = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem')
//    key: fs.readFileSync('/home/pi/.getssl/ddns.net/ddns.net.key'),
//    cert: fs.readFileSync('/home/pi/.getssl/ddns.net/ddns.net.csr')
//  key: '/home/pi/.getssl/ddns.net/ddns.net.key',
//  cert: '/home/pi/.getssl/ddns.net/ddns.net.csr' 
};
   
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 6666; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/.well-known/acme-challenge',express.static('./.well-known/acme-challenge'));

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================

// basic route

app.get('/.well-known/acme-challenge/*', function(req, res) {
	var filePath = '.' + req.url;
	console.log('filepath : ' + filePath);
	fs.readFile(filePath, function(error, content) {
	if(!error) {
		res.status(200);
            	res.end(content, 'utf-8');
	} else {
		console.log(error);
	}
});
});

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------

// get an instance of the router for api routes

var apiRoutes = express.Router(); 

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// Register api, to create a user
apiRoutes.post('/register', register);

// Route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', authenticate);

//apiRoutes.post('/adminauth', authenticateAdmin)
apiRoutes.post('/changepassword', changePassword);

apiRoutes.post('/resetflag', resetPasswordFlag);

// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(req.headers['x-access-token']);
  console.log(req.headers);

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
    console.log('Error: ' + err);
 
    if (err) {
        return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/t-s-users', function(req, res) {
  User.find({}, function(err, USER) {
    console.log(req.decoded);
console.log('user id : ' + req.decoded.sub);
    res.json(USER);
  });
});   

// Test the token
var validation = require('./routes/validateToken');
apiRoutes.get('/areyougood', validation);


// Get all schools
var allschools = require('./routes/allschools');
apiRoutes.get('/allschools', allschools);
apiRoutes.get('/schoolsversion', allschools);

// Get all routes of a school
var schoolWithRoutes = require('./routes/allschoolroutes');
apiRoutes.get('/allschoolroutes', schoolWithRoutes);

// Add/Update User's schools and stop preferences
var updatedPrefs = require('./routes/updateuserpreference');
apiRoutes.post('/adduserschool',updatedPrefs);

// get school routes
var schoolroute = require('./routes/getRoute');
apiRoutes.get('/schoolroute',schoolroute);

// get schools stops
var routestops = require('./routes/getStops');
apiRoutes.get('/routestops',routestops);


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// =======================
// =======================

app.on('connection', function (sock) {
console.log('trying connections');  
console.log(sock.remoteAddress);
  // Put your logic for what to do next based on that remote address here
});

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (sock) {
console.log('this is test connection'); 
 console.log(sock.remoteAddress);
  // Put your logic for what to do next based on that remote address here
});

// =======================
// start the server ======
// =======================
app.listen(port);

//https.createServer(options, app).listen(8888);

console.log('Magic happens at http://localhost:' + port);
