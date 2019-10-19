const ANG_ACC=50;

var game = new Phaser.Game(1300, 500, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    // game.load.image('space', 'assets/ship.png');
    game.load.image('bullet', 'assets/bullet11.png');
    // game.load.image('ship', 'assets/ship.png');
    game.load.image('garb', 'assets/garb.png');
    game.load.image('ship', 'assets/quadcopter.png');
    // game.load.image('boat', 'assets/boat.png');
    game.load.image('boat', 'assets/platform.png');

    game.load.image('bin', 'assets/bin.png');

}

var sprite;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;


var garb;
var bins = [];

function create() {

    //  This will run in Canvas mode, so let's gain a little speed and display
    // game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    game.stage.backgroundColor = '#1366a9';

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
    var boat = game.add.sprite(600, 300, 'boat');
    boat.anchor.set(.5, .5)

    var bin_names = ["A", "B", "C", "D", "E"];
    
    for (s in bin_names) {
	var str = bin_names[s]

	const R = 80

	var angle = s/(bin_names.length)*2*3.14
	var x = R *Math.cos(angle) + boat.x
	var y = R * Math.sin(angle) + boat.y

	var bin = game.add.sprite(x, y, 'bin');

	bins.push(bin)
    }


    garbs = []
    
    for (i = 0; i < 10; i++) {
	var min_x = 50;
	var max_x = 600;
	
	var min_y = 50;
	var max_y = 500;
	
	x = (max_x - min_x)*Math.random() + min_x
	y = (max_y - min_y)*Math.random() + min_y
	
	foo = game.add.sprite(x, y, 'garb');
	foo.anchor.set(.5, .5)

	foo.scale.set(.5, .5)
	
	garbs.push(foo)
    
	// game.add.sprite(100, 200, 'ship');
	// game.add.sprite(200, 150, 'ship');

	// game.add.tween(foo.scale).from({x: 0, y: 0}, 1000, Phaser.Easing.Linear.None, true)
    }

    for (g in garbs) {
	game.add.tween(garbs[g].scale).from({x: 0, y: 0}, 1000, Phaser.Easing.Linear.None, true)
    }


    garb = garbs[0]
    
    //  Our player ship
    sprite = game.add.sprite(300, 300, 'ship');
    sprite.anchor.set(0.5);

    //  and its physics settings
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    // enable for garb
    // game.physics.enable(garb, Phaser.Physics.ARCADE);
    // garb.body.immovable=true

    game.physics.enable([sprite, garb], Phaser.Physics.ARCADE);

    // garb.body.immovable=true
    // garb.body.moves=false

    sprite.body.drag.set(100);
    sprite.body.maxVelocity.set(200);

    //  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    sprite.body.angularDrag = 100

    sprite.body.setCircle(50, 0, 0) 
  

    sprite.status = "IDLE"
    sprite.garb = null
}

function distance(sprite1, sprite2) {
    return Math.sqrt((sprite1.x - sprite2.x)**2+(sprite1.y - sprite2.y)**2)
}

function update() {

    // game.physics.arcade.collide(sprite, garb, function() { console.log('hit')}, null, this);

    
    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    } else if (cursors.down.isDown) {
	game.physics.arcade.accelerationFromRotation(sprite.rotation, -200, sprite.body.acceleration);
    } else {
        sprite.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        sprite.body.angularAcceleration = -ANG_ACC;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularAcceleration = ANG_ACC;
    }
    else
    {
        sprite.body.angularAcceleration = 0;
    }

    const LEAVE_RADIOUS=50
    const PICK_RADIOUS=30
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
	
	if (sprite.garb) {
	    for (var b in bins) {
		var bin = bins[b]
		
		const PLACE_RADIOUS = 40;

		if (distance(bin, sprite.garb) < PLACE_RADIOUS) { // drone is on bin
		    sprite.garb.destroy();
		}
	    }
	}
	
	if (sprite.status == "PICK")
	    sprite.status = "LEAVING"
    }

    if (sprite.status == "LEAVING") {
	d = Math.sqrt((sprite.x - sprite.garb.x)**2+(sprite.y - sprite.garb.y)**2)

	if (d > LEAVE_RADIOUS) {
	    sprite.status = "IDLE"
	    sprite.garb = null
	}
    }
    
    screenWrap(sprite);

    // bullets.forEachExists(screenWrap, this);

    for (var g in garbs) {
	d = Math.sqrt((sprite.x - garbs[g].x)**2+(sprite.y - garbs[g].y)**2)

	if (sprite.status == "IDLE" && (d < PICK_RADIOUS)) {
	    sprite.garb = garbs[g]
	    sprite.status = "PICK"
	}
    }

    if (sprite.status == "PICK" && sprite.garb) {
	sprite.garb.x = sprite.x
	sprite.garb.y = sprite.y
    }
}


function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = sprite.rotation;
            game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
        }
    }

}

function screenWrap (sprite) {

    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }

}

function render() {

    game.debug.bodyInfo(sprite, 32, 32)
    // game.debug.bodyInfo(garb, 32, 32)
    game.debug.body(sprite);
    game.debug.body(garb);
}
