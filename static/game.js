var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    // game.load.image('space', 'assets/ship.png');
    game.load.image('bullet', 'assets/bullet11.png');
    // game.load.image('ship', 'assets/ship.png');
    game.load.image('garb', 'assets/garb.png');
    game.load.image('ship', 'assets/quadcopter.png');

}

var sprite;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;

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


    //  Our player ship
    sprite = game.add.sprite(300, 300, 'ship');
    sprite.anchor.set(0.5);

    //  and its physics settings
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    sprite.body.drag.set(100);
    sprite.body.maxVelocity.set(200);

    //  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    sprite.body.angularDrag = 100

    


}

function update() {

    
    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    }
    else
    {
        sprite.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        sprite.body.angularAcceleration = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularAcceleration = 200;
    }
    else
    {
        sprite.body.angularAcceleration = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }

    screenWrap(sprite);

    bullets.forEachExists(screenWrap, this);

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
}
