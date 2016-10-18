/**
 * Created by Weizguy on 10/17/2016.
 * Prototype to show proof of adding a foreground
 * ie. added Deathstar moving across screen
 */

// declaration of game engine
    // this is where you can change the board size
var game = new Phaser.Game(600, 900, Phaser.AUTO, 'game');

//  The core game loop
var StarWarsGame = function () {

    this.background = null;
    this.foreground = null;

    this.player = null;
    this.cursors = null;
    this.speed = 300;
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
    },

    // Create the background
    create: function () {

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        // this is where you set the speed of the scroll (and the direction)
        this.background.autoScroll(0, 60);

        // the image is set super wide to not show up over and over again
        this.foreground = this.add.tileSprite(0, 0, 1600, 250, 'foreground');
        // here it is set to scroll left
        this.foreground.autoScroll(-20, 0);
        // position the player on the game field
        this.player = this.add.sprite(265, 600, 'player');

        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;

        //  Cursor keys to fly
        this.cursors = this.input.keyboard.createCursorKeys();
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

    }


};
    //start the game
    game.state.add('Game', StarWarsGame, true);
