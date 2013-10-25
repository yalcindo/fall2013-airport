var counter = 0;

// Plane constructor
function Plane(name, seats, weightCapacity, fuelCapacity, fuelLevel) {
	this.id = counter++;
	this.name = name;
	this.seats = seats;
	this.weightCapacity = weightCapacity;
	this.fuelCapacity = fuelCapacity;
	this.fuelLevel = fuelLevel;

	this.passengers = [];
	this.crew = [];
}

module.exports = Plane;