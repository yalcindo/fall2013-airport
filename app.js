
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , _ = require('underscore')
  , Airport = require('./models/airport.js')
  , Person = require('./models/person.js')
  , Passenger = require('./models/passenger.js')
  , Crew = require('./models/crew.js')
  , Plane = require('./models/plane.js')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var airports = {};

// setup the mock data
function setup() {

	airports = {
		den: new Airport('Denver', 'den'),
		lga: new Airport('New York', 'lga'),
		las: new Airport('Las Vegas', 'las'),
		lax: new Airport('Los Angeles', 'lax'),
		msp: new Airport('Minneapolis', 'msp')
	};

	// add den planes
	for(var i=0; i<3; i++) {
		var newPlane = new Plane('Boeing 747', 180, 10000, 5000, 5000);
		airports.den.planes.push(newPlane);
	}
	airports.den.planes.push(new Plane('Jess\'s Fighter Jet', 2, 3000, 2000, 2000));

	// create passengers going to msp
	for(var i=0; i<5; i++) {
		var newPassenger = new Passenger('Joe' + (i+1), 30+i, 160-i, airports.msp)
		airports.den.travelers.push(newPassenger);
	}

	// create passengers going to lga
	for(var i=0; i<10; i++) {
		var newPassenger = new Passenger('Bob' + (i+1), 30+i, 160-i, airports.lga)
		airports.den.travelers.push(newPassenger);
	}

	// add msp planes
	for(var i=0; i<5; i++) {
		var newPlane = new Plane('Boeing 747', 120, 8000, 5000, 5000);
		airports.msp.planes.push(newPlane);
	}
}


// req.body.___			POST form data
// req.query.___		GET query string
// req.params.___		URL pattern matching
app.get('/airport/:code', function(req, res) {
	var airportCode = req.params.code;
	var airport = airports[airportCode];

	if(airport) {

		// res.send('The airport city is ' + airport.city);
		// First argument: name of the view (jade file)
		// Second argument: view data (object)
		res.render('airport', {
			airports: airports,
			airport: airport
		});
	}
	else {
		res.send('The airport you entered is not valid.');
	}
})

app.post('/board', function(req, res) {

	// 1. get the airport object of the origin
	// 2. get the airport object of the destination
	var origin = airports[req.body.origin];
	var destination = airports[req.body.destination];

	// 3. get plane object with given id
	var plane = _.findWhere(origin.planes, { id: +req.body.plane })

	// 4. get the passengers at the origin
	var allPassengers = origin.travelers;

	// 5. of those passengers, get those going to the destination
	var destPassengers = _.where(allPassengers, { destination: destination })

	var passengersBoarded = 0;

	// 6. of those, get the number we have room for
	for(var i=0, len=destPassengers.length; i<len; i++) {
		var pass = destPassengers[i];
		var availableSeats = plane.seats - plane.passengers.length;
		// 7. check capacity
		if(availableSeats > 0) {
			// 8. push passengers onto plane
			plane.passengers.push(pass);

			// 9. remove passengers from airport
			var index = origin.travelers.indexOf(pass);
			origin.travelers.splice(index, 1);

			passengersBoarded++;
		}
		else {
			break;
		}
	}

	// 10. Take Off!

	res.send(passengersBoarded + ' passengers boarded to ' + destination.city + '!')
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  setup();
});
