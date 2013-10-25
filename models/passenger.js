var Person = require('./person');

function Passenger(name, age, weight, destination) {
	this.destination = destination;
	Person.call(this, name, age, weight);
	//Person.apply(this, [name, age, weight]);
}
Passenger.prototype = new Person();

module.exports = Passenger;