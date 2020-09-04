var levels = [
    {
 	"name": "Atlantic Ocean - Summer",
	"wind": {"intensity": 0, "direction": 1},
	"garbage": 10
    },

    {
	"name": "Indian Ocean - Summer",
	"wind": {"intensity": 0, "direction": -1},
	"garbage": 20
    },

    {
	"name": "Pacific Ocean - Summer",
	"wind": {"intensity": 1, "direction": 1},
	"garbage": 30
    },

    {
	"name": "Atlantic Ocean - Winter",
	"wind": {"intensity": 3, "direction": 1},
	"garbage": 10
    },
]


function onload()
{
    levels.forEach(function(level) {
	var button = document.createElement("a");
	button.setAttribute('class', "w3-button w3-teal")
	button.setAttribute('href',
			    "test.html?wind-intensity=" + level.wind.intensity +
			    "&wind-direction=" + level.wind.direction +
			    "&garbage-density=" + level.garbage)
	button.innerHTML = level.name
	document.getElementById("button-area").appendChild(button)
    });
}
