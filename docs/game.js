const ANG_ACC = 150;
const N_OBJECTS = 24;
// const N_OBJECTS = 4;

//                   0         1          2         3      4
const MATERIALS = ["paper", "plastic", "metal", "glass", "other"]
const WIND_EFFECT = 35
// const WIND_EFFECT = 0

var wind = {'direction': 1, 'intensity': 3}
var sprite;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;


var garb;
var bins = [];

var garbage_density = 20;


var game = new Phaser.Game(1300, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var images = [
    "cadborad133.png", "cardboard132.png", "cardboard154.png", "glass152.png", "glass153.png", "glass154.png",
    "glass155.png", "metal1.png", "metal2.png", "metal3.png", "metal4.png", "paper1.png", "paper2.png",
    "paper3.png", "paper4.png", "paper5.png", "plastic1.png", "plastic2.png", "plastic3.png", "plastic4.png",
    "trash1.png", "trash2.png", "trash3.png", "trash4.png"
]

var labels = [
    "paper", "paper", "paper", "glass", "glass", "glass", "glass", "metal", "metal", "metal", "metal", "paper", "paper",
    "paper", "paper", "paper", "plastic", "plastic", "plastic", "plastic", "plastic", "other", "other", "other", "other"
]

// wind-intensity=1&wind-direction=1&garbage-density=10

function onload() {
    var url = new URL(window.location.href);
    var wind_intensity = url.searchParams.get("wind-intensity");
    var wind_direction = url.searchParams.get("wind-direction");
    var g_density = url.searchParams.get("garbage-density");
    // console.log(wind_intensity, wind_direction, garbage_density);

    wind.direction=wind_direction;
    wind.intensity=wind_intensity;

    garbage_density= g_density;
}

function preload() {

    // game.load.image('space', 'assets/ship.png');
    game.load.image('bullet', 'assets/bullet11.png');
    // game.load.image('ship', 'assets/ship.png');
    // game.load.image('garb', 'assets/garb.png');
    game.load.spritesheet('garb', 'assets/montage.png', 128, 128, N_OBJECTS);
    game.load.image('ship', 'assets/quadcopter.png');
    // game.load.image('boat', 'assets/boat.png');
    game.load.image('boat', 'assets/platform.png');
    
    game.load.image('bin', 'assets/bin.png');
    // game.load.image('bar', 'assets/bar.jpg');
    game.load.image('bar', 'assets/bar_wood.png');
    game.load.image('wave', 'assets/wave.png');
    game.load.image('fog', 'assets/wave-1.png');

    game.load.image('corona', 'assets/blue.png');

    game.load.audio('bg_audio', 'assets/ethereal_ocean_feast.wav');
}


function create() {
    game.match = []
    
    //  This will run in Canvas mode, so let's gain a little speed and display
    // game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    game.stage.backgroundColor = '#1366a9';

    // floor = new Phaser.Rectangle(0, 550, 800, 50);
    tileSprite = game.add.tileSprite(0, 0, game.canvas.width, 50, 'bar');

    game.add.tileSprite(0, 50, game.canvas.width, game.canvas.height, 'wave');


    // Change healthbar here
    var healthbar = new HealthBar(this, {x: 160, y: 25, width: 150, height: 25,
					 bg: {color: "#ff0000"},
					 bar: {color: "#00ff00"}
					});
    
    var scoretxt = game.add.text(300, 15, "Score:", { font: "20px Raleway", fill: "#ffffff", align: "center" });
    game.add.text(10, 15, "Health:", { font: "20px Raleway", fill: "#ffffff", align: "center" });

    scoretxt.text = "Score: 0"
    
    //  We need arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // //  A spacey background
    // game.add.tileSprite(0, 0, game.width, game.height, 'space');

    //  Our ships bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    //  All 40 of them
    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    // Populate board
    boat = game.add.sprite(500, 100, 'boat');
    // boat.anchor.set(.5, .5)

    var binDict = {"paper": [527, 143], "plastic": [623,184], "metal": [635,282], "glass": [621,377], "other": [526,416]};
    // var bin_coord = [(482,94),(577,0),(591,237),(577,333),(484,372)];

    for (var key in binDict) {
        if (binDict.hasOwnProperty(key)) {
            // console.log(key, binDict[key][0], binDict[key][1]);
            var x = binDict[key][0] + 13
            var y = binDict[key][1] + 7
            var bin = game.add.sprite(x, y, 'bin');
	    bin.alpha = 0;
	    
	    bin.type = key;
            bins.push(bin)
        }
    }


    garbs = []
    
    for (i = 0; i < garbage_density; i++) {
	const PADDING = 30;
	var min_x = PADDING;
	var max_x = game.canvas.width - PADDING;
	
	var min_y = PADDING + 60;
	var max_y = game.canvas.height - PADDING;
	
	var is_on_platform = (x, y, boat) => (x >= (boat.x - PADDING)) && (x <= (boat.x + boat.width + PADDING)) && (y >= (boat.y - PADDING)) && (y <= (boat.y + boat.height + PADDING))
	do {
	    x = (max_x - min_x)*Math.random() + min_x
	    y = (max_y - min_y)*Math.random() + min_y
	} while (is_on_platform(x, y, boat))
	
    
    
	// console.log( x, boat.x, (boat.x + boat.width) )
	// console.log( x >= boat.x )

	var idx = parseInt(N_OBJECTS*Math.random());
	
	foo = game.add.sprite(x, y, 'garb', idx);
	foo.anchor.set(.5, .5)

	foo.scale.set(.5, .5)

	foo.type = labels[idx]
	foo.image = images[idx]
	
	garbs.push(foo)
    
	// game.add.sprite(100, 200, 'ship');
	// game.add.sprite(200, 150, 'ship');

	// game.add.tween(foo.scale).from({x: 0, y: 0}, 1000, Phaser.Easing.Linear.None, true)
    }

    for (g in garbs) {
        game.add.tween(garbs[g].scale).from({
            x: 0,
            y: 0
        }, 1000, Phaser.Easing.Linear.None, true)
    }

    //  Our player ship
    sprite = game.add.sprite(300, 300, 'ship');
    sprite.anchor.set(0.5);

    //  and its physics settings
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    // enable for garb
    // game.physics.enable(garb, Phaser.Physics.ARCADE);
    // garb.body.immovable=true

    game.physics.enable([sprite], Phaser.Physics.ARCADE);

    // garb.body.immovable=true
    // garb.body.moves=false

    sprite.body.drag.set(100)
    sprite.body.maxVelocity.set(wind.intensity*50+100);
    sprite.body.maxAngular = 300;
    sprite.body.gravity.set(wind.direction*wind.intensity*WIND_EFFECT, 0) // wind effect

    
    sprite.body.collideWorldBounds = true;

    //  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    

    sprite.body.angularDrag = 100

    sprite.body.setCircle(50, 0, 0)
    
    sprite.health = 100
    sprite.score = 0
    
    sprite.status = "IDLE"
    sprite.garb = null

    sprite.healthbar = healthbar;
    sprite.scoretxt = scoretxt;

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(on_spacebar_pressed, this)

    // particle effects

    console.log("wind intensity", wind.intensity)

    if (wind.intensity > 0) {
	if (wind.direction > 0) {
	    emitter = game.add.emitter(0, game.canvas.height/2, 100);
	    emitter.area = new Phaser.Rectangle(0, 50, 2, game.height - 50)
	} else {
	    emitter = game.add.emitter(game.width, game.canvas.height/2, 100);
	    emitter.area = new Phaser.Rectangle(game.width, 50, 2, game.height - 50)
	}
	emitter.makeParticles('corona');
    
	emitter.setXSpeed(wind.direction*wind.intensity*300)
	emitter.setYSpeed(0)
    
	emitter.gravity = 0;
	emitter.setAlpha(0.3, 0.8);
	emitter.setScale(0.1, .2, .1, .2, 0);

	//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
	//	The 5000 value is the lifespan of each particle before it's killed
	emitter.start(false, 5000, 500);
    }

    // add audio
    game.add.audio('bg_audio').loopFull();

    // add timer
    var spawn_time = 100 * 1/garbage_density
    console.log('spawn time', spawn_time)
    game.time.events.repeat(Phaser.Timer.SECOND * spawn_time, 10, spawn_garbage, this);
}


function spawn_garbage()
{

    const PADDING = 30;
    var min_x = PADDING;
    var max_x = game.canvas.width - PADDING;
	
    var min_y = PADDING + 60;
    var max_y = game.canvas.height - PADDING;
	
    var is_on_platform = (x, y, boat) => (x >= (boat.x - PADDING)) && (x <= (boat.x + boat.width + PADDING)) && (y >= (boat.y - PADDING)) && (y <= (boat.y + boat.height + PADDING))
    do {
	x = (max_x - min_x)*Math.random() + min_x
	y = (max_y - min_y)*Math.random() + min_y
    } while (is_on_platform(x, y, boat))
	
    
    var idx = parseInt(N_OBJECTS*Math.random());
	
    var garb = game.add.sprite(x, y, 'garb', idx);
    garb.anchor.set(.5, .5)

    garb.scale.set(.5, .5)

    garb.type = labels[idx]
    garb.image = images[idx]
	
    garbs.push(garb)
    
    game.add.tween(garb.scale).from({
        x: 0,
        y: 0
    }, 1000, Phaser.Easing.Linear.None, true)
}


function on_spacebar_pressed()
{
    if (!sprite.garb)
	return;
    
    const PLACE_RADIOUS = 40;
    
    for (var b in bins) {
        var bin = bins[b]

	if (distance(bin, sprite.garb) >= PLACE_RADIOUS)
	    continue;

	// leaving in one of the bins
	// console.log(sprite.garb.image, sprite.garb.type)
	
	if (sprite.garb.type === "?" || (sprite.garb.type == bin.type)) {
	    valid_bin(sprite, bin)
	} else {
	    invalid_bin(sprite, bin)
	}

	sprite.garb.destroy();
    }

    if (sprite.status == "PICK")
        sprite.status = "LEAVING"
}

function distance(sprite1, sprite2) {
    return Math.sqrt((sprite1.x - sprite2.x) ** 2 + (sprite1.y - sprite2.y) ** 2)
}

function valid_bin(sprite, bin) {
    sprite.score += 10
    sprite.scoretxt.text = "Score: " + sprite.score
    
    game.match.push({"id": sprite.garb.image, "label": bin.type});

    send_json(game.match, "/save")
}


function send_json(data, url)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
	if (xhr.readyState === 4 && xhr.status === 200) {
	    console.log('send::ok')
	}
    };
    xhr.send(JSON.stringify(data));
}

function invalid_bin(sprite, bin) {
    sprite.health -= 10
    sprite.healthbar.setPercent(sprite.health)

    if (sprite.health < 0)
	console.log('game over')
}

function update() {

    // game.physics.arcade.collide(sprite, garb, function() { console.log('hit')}, null, this);

    sprite.bringToTop()

    if (cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    } else if (cursors.down.isDown) {
        game.physics.arcade.accelerationFromRotation(sprite.rotation, -200, sprite.body.acceleration);
    } else {
        sprite.body.acceleration.set(0);
    }

    if (cursors.left.isDown) {
        sprite.body.angularAcceleration = -ANG_ACC;
    } else if (cursors.right.isDown) {
        sprite.body.angularAcceleration = ANG_ACC;
    } else {
        sprite.body.angularAcceleration = 0;
    }

    const LEAVE_RADIOUS = 50
    const PICK_RADIOUS = 30

    if (sprite.status == "LEAVING") {
        d = Math.sqrt((sprite.x - sprite.garb.x) ** 2 + (sprite.y - sprite.garb.y) ** 2)

        if (d > LEAVE_RADIOUS) {
            sprite.status = "IDLE"
            sprite.garb = null
        }
    }

    for (var g in garbs) {
        d = Math.sqrt((sprite.x - garbs[g].x) ** 2 + (sprite.y - garbs[g].y) ** 2)

	// pick garbage
        if (sprite.status == "IDLE" && (d < PICK_RADIOUS)) {
            sprite.garb = garbs[g]
            sprite.status = "PICK"

	    console.log(sprite.garb.type)
        }
    }

    if (sprite.status == "PICK" && sprite.garb) {
        sprite.garb.x = sprite.x
        sprite.garb.y = sprite.y
    }
}


// function fireBullet() {

//     if (game.time.now > bulletTime) {
//         bullet = bullets.getFirstExists(false);

//         if (bullet) {
//             bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
//             bullet.lifespan = 2000;
//             bullet.rotation = sprite.rotation;
//             game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
//             bulletTime = game.time.now + 50;
//         }
//     }

// }


// function screenWrap(sprite) {

//     if (sprite.x < 0) {
//         sprite.x = game.width;
//     } else if (sprite.x > game.width) {
//         sprite.x = 0;
//     }

//     if (sprite.y < 0) {
//         sprite.y = game.height;
//     } else if (sprite.y > game.height) {
//         sprite.y = 0;
//     }

// }

// function render() {

//     game.debug.bodyInfo(sprite, 32, 32)
//     // game.debug.bodyInfo(garb, 32, 32)
//     game.debug.body(sprite);
//     game.debug.body(garb);
// }
