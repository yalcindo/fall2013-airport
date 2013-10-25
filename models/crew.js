var Person = require('./person');

function Crew(name, age, weight, title) {
	this.title = title;

	// 2. Invoke the superclass's constructor
	Person.call(this, name, age, weight);
}

// 1. Set up the prototoype chain to the superclass
Crew.prototype = new Person();

module.exports = Crew;