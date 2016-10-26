/**
 * Created by Weizguy on 10/25/2016.
 * Prototype to for player health and shields
 */

// declaration of game engine
// this is where you can change the board size
//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea');
var gameWidth = 600;
var gameHeight = 800;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'gameArea', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

// declare all globals
var background = null;
var foreground = null;
var cursors = null;
var speed = 300;
var xwing;
var tieFighters;
var blaster;
var bullets;
var bulletTime = 0;
var bullet;
var tieBullet;
var enemyBullets;
var explosions;
var explode;
var playerDeath;
var playerShield;
var score = 0;
var highScore;
var numLives = 5;
var maxHealth = 120;
var playerHealth = maxHealth;

function preload() {

    // add the images/audio to the game
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.load.image('background', 'assets/back.png');
    game.load.image('foreground', 'assets/deathstar.png');
    game.load.image('xwing', 'assets/xwing.png');
    game.load.image('tieFighter', 'assets/tie.png');
    game.load.image('bullet', 'assets/bullet0.png');
    game.load.image('tieBullet', 'assets/enemyBullet0.png');
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    game.load.audio('blaster', 'assets/blaster.mp3');
    game.load.audio('explode', 'assets/explosion.mp3');
    game.load.image('shield0', 'assets/shield0.png');
    game.load.image('shield1', 'assets/shield1.png');
    game.load.image('shield2', 'assets/shield2.png');
    game.load.image('shield3', 'assets/shield3.png');
    game.load.image('lives', 'assets/lives.png');

}


function create() {

    background = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'background');
    // this is where you set the speed of the scroll (and the direction)
    background.autoScroll(0, 60);

    foreground = game.add.tileSprite(0, 0, gameWidth, 250, 'foreground');
    // here it is set to scroll left
    foreground.autoScroll(-10, 0);

    // create the tieFighter group
    tieFighters = game.add.group();
    tieFighters.enableBody = true;
    tieFighters.physicsBodyType = Phaser.Physics.ARCADE;
    tieFighters.createMultiple(10, 'tieFighter');
    tieFighters.setAll('anchor.x', 0.5);
    tieFighters.setAll('anchor.y', 0.5);
    tieFighters.setAll('scale.x', 0.5);
    tieFighters.setAll('scale.y', 0.5);
    tieFighters.setAll('angle', 180);
    tieFighters.setAll('outOfBoundsKill', true);
    tieFighters.setAll('checkWorldBounds', true);

    launchTieFighter();

    // tieFighter bullets
    tieFightersBullets = game.add.group();
    tieFightersBullets.enableBody = true;
    tieFightersBullets.physicsBodyType = Phaser.Physics.ARCADE;
    tieFightersBullets.createMultiple(30, 'tieBullet');
    tieFightersBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
    tieFightersBullets.setAll('alpha', 0.9);
    tieFightersBullets.setAll('anchor.x', 0.5);
    tieFightersBullets.setAll('anchor.y', 0.5);
    tieFightersBullets.setAll('outOfBoundsKill', true);
    tieFightersBullets.setAll('checkWorldBounds', true);
    tieFightersBullets.forEach(function (enemy) {
        enemy.body.setSize(20, 20);
        enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
        enemy.damageAmount = 20;
    });

    xwing = game.add.group();
    xwing.enableBody = true;
    xwing.physicsBodyType = Phaser.Physics.ARCADE;


    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    // Add sounds
    game.explode = game.add.audio('explode');
    game.blaster = game.add.audio('blaster');

    for (var i = 0; i < 20; i++) {
        var b = bullets.create(40, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    // create the xwing
    xwing = game.add.sprite(gameWidth / 2, gameHeight - 50, 'xwing');
    xwing.anchor.setTo(0.5, 0.5);
    game.physics.enable(xwing, Phaser.Physics.ARCADE);
    xwing.body.collideWorldBounds = true;

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupExplosions, this);


    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    playerShield = game.add.sprite(10, gameHeight - 50, 'shield0');

    // for (var i = 0; i < numLives; i++) {
    //     pLife = game.add.sprite(60 + (i * 30), gameHeight - 50, 'lives');
    // }
    life(numLives);
}

function shield(health) {

    var phealth = (health / maxHealth) * 100;

    playerShield.reset();
    if (phealth > 75) {
        playerShield.kill();
        playerShield = game.add.sprite(10, gameHeight - 50, 'shield0');
    } else if (phealth > 50 && phealth <= 75) {
        playerShield.kill();
        playerShield = game.add.sprite(10, gameHeight - 50, 'shield1');
    } else if (phealth > 25 && phealth <= 50) {
        playerShield.kill();
        playerShield = game.add.sprite(10, gameHeight - 50, 'shield2');
    } else if (phealth > 0 && phealth <= 25) {
        playerShield.kill();
        playerShield = game.add.sprite(10, gameHeight - 50, 'shield3');
    } else if (phealth <= 0) {
        playerShield.kill();
        pLife.kill();
        numLives -= 1;
        life(numLives);
        if (numLives > 0) {
            playerHealth = maxHealth;
            playerShield = game.add.sprite(10, gameHeight - 50, 'shield0');
            shield(playerHealth);
        } else
            console.log('GAME OVER!');
    }
}


function life(lives) {
    for (var i = 0; i < lives; i++) {
        pLife = game.add.sprite(60 + (i * 30), gameHeight - 50, 'lives');
    }
}

function render() {

}
// add explosions
function setupExplosions(explode) {

    explode.animations.add('kaboom');
}

function update() {

    // add the collision handlers
    game.physics.arcade.collide(bullets, tieFighters, playerKillsEnemy, null, this);
    game.physics.arcade.collide(xwing, tieFighters, enemyPlayerCollide, null, this);
    game.physics.arcade.collide(xwing, tieFightersBullets, enemyBulletKillPlayer, null, this);

    // make the xwing controllable
    xwing.body.velocity.x = 0;
    xwing.body.velocity.y = 0;

    if (cursors.left.isDown) {
        xwing.body.velocity.x = -speed;
    }
    else if (cursors.right.isDown) {
        xwing.body.velocity.x = speed;
    }
    else if (cursors.up.isDown) {
        xwing.body.velocity.y = -speed;
    }
    else if (cursors.down.isDown) {
        xwing.body.velocity.y = speed;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        fireBullet();
    }
}

// fire the bullet
function fireBullet() {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(xwing.x - 70, xwing.y - 0);
            bullet.reset(xwing.x - 7, xwing.y - 40);
            bullet.body.velocity.y = -300;
            bulletTime = game.time.now + 150;
            game.blaster.play();
        }
    }

}

//  Called if the bullet goes out of the screen
function resetBullet(bullet) {

    bullet.kill();
}

// called if enemy and player collide
function enemyPlayerCollide(player, enemy) {


    playerHealth -= 20;
    shield(playerHealth);
    enemy.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
        explosion.alpha = 0.7;
        explosion.play('kaboom', 30, false, true);
        game.explode.play();

}

// called if enemy bullet kills player
function enemyBulletKillPlayer(player, enemyBullet) {

    //player.kill();
    playerHealth -= 20;
    shield(playerHealth);
    enemyBullet.kill();


    if (playerHealth <= 0) {
        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);
        game.explode.play();
        player.reset(gameWidth / 2, gameHeight - 50);
        playerShield.kill();
    }
}

//  Called if the bullet hits one of the enemies
function playerKillsEnemy(bullet, enemy) {

    bullet.kill();
    enemy.kill();

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x, enemy.body.y);
    explosion.play('kaboom', 30, false, true);
    game.explode.play();
}

function launchTieFighter() {
    var min = 300;
    var max = 3000;

    var enemy = tieFighters.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = speed;
        enemy.body.drag.x = 100;

        //  Set up firing
        var bulletSpeed = 400;
        var firingDelay = 2000;
        enemy.enemyBullets = 1;
        enemy.lastShot = 0;
    }
    enemy.update = function () {
        enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

        //  Fire
        enemyBullet = tieFightersBullets.getFirstExists(false);
        if (enemyBullet &&
            this.alive &&
            this.enemyBullets &&
            this.y > game.width / 8 &&
            game.time.now > firingDelay + this.lastShot) {
            this.lastShot = game.time.now;
            this.enemyBullets--;
            enemyBullet.reset(this.x, this.y + this.height / 2);
            enemyBullet.damageAmount = this.damageAmount;
            var angle = game.physics.arcade.moveToObject(enemyBullet, xwing, bulletSpeed);
            enemyBullet.angle = game.math.radToDeg(angle);
        }
    };

    // Send another enemy soon
    game.time.events.add(game.rnd.integerInRange(min, max), launchTieFighter);
}

function restart() {
    //  Reset the enemies
    tieFighters.callAll('kill');
    game.time.events.remove(tieFighterLaunchTimer);
    game.time.events.add(1000, launchTieFighter);
    //advancedTie.callAll('kill');
    //advancedTieBullets.callAll('kill');
    // game.time.events.remove(advancedTieLaunchTimer);
    // starDestroyer.kill();
    // game.time.events.remove(starDestroyerLaunchTimer);

    // advancedTie.callAll('kill');
    // game.time.events.remove(advancedTieLaunchTimer);
    //  Revive the player
    // player.weaponLevel = 1;
    player.revive();
    player.health = 100;
    score = 0;

    //  Hide the text
    gameOver.visible = false;
    //  Reset pacing
    tieFighterSpacing = 1000;
    // advancedTieLaunched = false;
    // starDestroyerLaunched = false;
}