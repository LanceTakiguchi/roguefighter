/**
 * Created by Weizguy on 10/17/2016.
 * Prototype to show proof of adding an enemy to the screen
 * ie. added two tie fighters to static positions
 */

// declaration of game engine
    // this is where you can change the board size
var game = new Phaser.Game(600, 900, Phaser.AUTO, 'game');


//  Create bullet used by the weapon class
var Bullet = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;

    this.body.gravity.set(gx, gy);

};

Bullet.prototype.update = function () {

    if (this.tracking)
    {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.scaleSpeed > 0)
    {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }

};


var Weapon = {};

////////////////////////////////////////////////////
//  A single bullet is fired in front of the XWing //
////////////////////////////////////////////////////

Weapon.SingleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet1'), true);
    }

    return this;

};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }
    // set bullet in relation to xwing
    var x = source.x + 38;
    var y = source.y + 0;

    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//  The core game loop
var StarWarsGame = function () {

    this.background = null;
    this.foreground = null;

    this.player = null;
    this.cursors = null;
    this.speed = 300;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;

    this.tieFighter = null;
};

// initialize the game
StarWarsGame.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    // preload the assets
    preload: function () {

        // this will be needed for any json activities for cross browser support
        this.load.crossOrigin = 'anonymous';
        // add the images to the game
        this.load.image('background', 'back.png');
        this.load.image('foreground', 'deathstar.png');
        this.load.image('player', 'xwing.png');
        this.load.image('tieFighter', 'tie.png');

        // future loop for adding power up bullets
        for (var i = 1; i <= 1; i++)
        {
            this.load.image('bullet' + i, 'bullet' + i + '.png');
        }
    },

    // Create everything
    create: function () {

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        // this is where you set the speed of the scroll (and the direction)
        this.background.autoScroll(0, 60);

        // the image is set super wide to not show up over and over again
        this.foreground = this.add.tileSprite(0, 0, 1600, 250, 'foreground');
        // here it is set to scroll left
        this.foreground.autoScroll(-20, 0);

        this.weapons.push(new Weapon.SingleBullet(this.game));

        this.currentWeapon = 0;

        // this is for if we add powerups
        for (var i = 1; i < this.weapons.length; i++)
        {
            this.weapons[i].visible = false;
        }
        // position the enemy on the game field
        this.tieFighter = this.add.sprite(200, 40, 'tieFighter');
        this.tieFighter = this.add.sprite(350, 160, 'tieFighter');

        this.physics.arcade.enable(this.tieFighter);

        this.tieFighter.body.collideWorldBounds = true;

        // position the player on the game field
        this.player = this.add.sprite(265, 600, 'player');

        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;

        //  Cursor keys to fly
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        changeKey.onDown.add(this.nextWeapon, this);
    },
    // more of a function for if we add more power up weapons
    nextWeapon: function () {

        //  Tidy-up the current weapon
        if (this.currentWeapon > 9)
        {
            this.weapons[this.currentWeapon].reset();
        }
        else
        {
            this.weapons[this.currentWeapon].visible = false;
            this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
            this.weapons[this.currentWeapon].setAll('exists', false);
        }

        //  Activate the new one
        this.currentWeapon++;

        if (this.currentWeapon === this.weapons.length)
        {
            this.currentWeapon = 0;
        }

        this.weapons[this.currentWeapon].visible = true;

        this.weaponName.text = this.weapons[this.currentWeapon].name;

    },

    // function added to work with player movement
    update: function () {

        this.player.body.velocity.set(0);

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -this.speed;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = this.speed;
        }

        if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -this.speed;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.velocity.y = this.speed;
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            this.weapons[this.currentWeapon].fire(this.player);
        }

    }


};
    //start the game
    game.state.add('Game', StarWarsGame, true);
