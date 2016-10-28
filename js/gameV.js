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

// set up for use of Orbitron font
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Orbitron']
    }

};

// declare all globals
var background = null;
var foreground = null;
var cursors = null;
var speed = 300;
var xwing;
var alive = false;
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
var gameOver;
var gameOverText = '';
var playGameText = '';
var scoreText;
var highScoreText;
var score = 0;
var highScore;
var pLives;
var maxLives = 2;
var maxHealth = 120;
var playerHealth = maxHealth;
var numLives = maxLives;

function preload() {

    // add the images/audio to the game
    //game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
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
    // Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

}

// create the score text
function createText() {


    // Score Text
    scoreText = game.add.text(10, 10, "Score:\n" + score);
    scoreText.font = 'Orbitron';
    scoreText.fontSize = 20;
    scoregrd = scoreText.context.createLinearGradient(0, 0, 0, scoreText.canvas.height);
    scoregrd.addColorStop(0, 'yellow');
    scoregrd.addColorStop(1, 'orange');
    scoreText.fill = scoregrd;
    scoreText.align = 'left';
    scoreText.stroke = '#000000';
    scoreText.strokeThickness = 2;
    scoreText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    // High Score Text
    highScoreText = game.add.text(game.width - 150, 10, "High Score:\n" + highScore);
    highScoreText.font = 'Orbitron';
    highScoreText.fontSize = 20;
    highScoregrd = highScoreText.context.createLinearGradient(0, 0, 0, highScoreText.canvas.height);
    highScoregrd.addColorStop(0, 'yellow');
    highScoregrd.addColorStop(1, 'orange');
    highScoreText.fill = highScoregrd;
    highScoreText.align = 'right';
    highScoreText.stroke = '#000000';
    highScoreText.strokeThickness = 2;
    highScoreText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);


}

function play() {

    //game.paused = true;
    console.log('PLAY GAME');
    // Play Game Text
    playGameText = game.add.text(game.world.centerX, game.world.centerY, "PLAY GAME");
    playGameText.anchor.set(0.5);
    playGameText.font = 'Orbitron';
    playGameText.fontSize = 70;
    playGamegrd = playGameText.context.createLinearGradient(0, 0, 0, playGameText.canvas.height);
    playGamegrd.addColorStop(0, 'yellow');
    playGamegrd.addColorStop(1, 'orange');
    playGameText.fill = playGamegrd;
    playGameText.align = 'center';
    playGameText.stroke = '#000000';
    playGameText.strokeThickness = 2;
    playGameText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    playGameText.inputEnabled = true;
    xwing.kill();


    playGameText.events.onInputDown.add(restart, this);
}

function gameOver(){

    console.log('GAME OVER');
    // Game Over Text
    gameOverText = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!");
    gameOverText.anchor.set(0.5);
    gameOverText.font = 'Orbitron';
    gameOverText.fontSize = 70;
    gameOvergrd = gameOverText.context.createLinearGradient(0, 0, 0, gameOverText.canvas.height);
    gameOvergrd.addColorStop(0, 'yellow');
    gameOvergrd.addColorStop(1, 'orange');
    gameOverText.fill = gameOvergrd;
    gameOverText.align = 'center';
    gameOverText.stroke = '#000000';
    gameOverText.strokeThickness = 2;
    gameOverText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    gameOverText.inputEnabled = true;
    gameOverText.events.onInputDown.add(restart, this);
    xwing.kill();
    alive = false;

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

    launchTieFighter();

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

    //  Big explosion
    playerDeath = game.add.emitter(xwing.x, xwing.y);
    playerDeath.width = 50;
    playerDeath.height = 50;
    playerDeath.makeParticles('kaboom', [0,1,2,3,4,5,6,7], 10);
    playerDeath.setAlpha(0.9, 0, 800);
    playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

    cursors = game.input.keyboard.createCursorKeys();

    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    playerShield = game.add.sprite(10, gameHeight - 50, 'shield0');

    pLives = game.add.group();
    var pLife;
    for (var i = 0; i < numLives; i++) {
        pLife = pLives.create(60 + (i * 30), gameHeight - 50, 'lives', i);
    }

    play();
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
        pLives.removeAll();
        numLives -= 1;
        life(numLives);
        if (numLives > 0) {
            playerHealth = maxHealth;
            playerShield = game.add.sprite(10, gameHeight - 50, 'shield0');
            shield(playerHealth);
        } else if(numLives <= 0) {
            gameOver();
        }
    }
}


function life(lives) {

    for (var i = 0; i < numLives; i++) {
        pLife = pLives.create(60 + (i * 30), gameHeight - 50, 'lives', i);
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

    if (cursors.left.isDown || wasd.left.isDown) {
        xwing.body.velocity.x = -speed;
    }
    else if (cursors.right.isDown || wasd.right.isDown) {
        xwing.body.velocity.x = speed;
    }
    else if (cursors.up.isDown || wasd.up.isDown) {
        xwing.body.velocity.y = -speed;
    }
    else if (cursors.down.isDown || wasd.down.isDown) {
        xwing.body.velocity.y = speed;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.activePointer.isDown) {
        if(alive){
            fireBullet();
        }
    }

    window.onkeydown = function(event) {  if (event.keyCode == 80){       game.paused = !game.paused;   } }

}

// fire the bullet
function fireBullet() {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet && numLives > 0) {
            bullet.reset(xwing.x - 70, xwing.y - 0);
            bullet.reset(xwing.x - 7, xwing.y - 40);
            bullet.body.velocity.y = - 500;
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

    if(numLives > 0) {
        if (playerHealth > 0) {
            var explosion = explosions.getFirstExists(false);
            explosion.reset(enemy.body.x, enemy.body.y);
            explosion.alpha = 0.7;
            explosion.play('kaboom', 30, false, true);
            game.explode.play();
        } else {
            playerDeath.x = player.x;
            playerDeath.y = player.y;
            playerDeath.start(false, 1000, 10, 10);
            game.explode.play();
            playerShield.kill();
            xwing.reset(50, 50);
        }
    }

    if(numLives <= 0){
        xwing.kill();
    }

}

// called if enemy bullet kills player
function enemyBulletKillPlayer(player, enemyBullet) {

    //player.kill();
    playerHealth -= 20;
    shield(playerHealth);
    enemyBullet.kill();

if(numLives > 0) {
    if (playerHealth > 0) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x - 50, player.body.y - 50);
        explosion.alpha = 0.7;
        explosion.play('kaboom', 30, false, true);
        game.explode.play();
    } else {
        playerDeath.x = player.x;
        playerDeath.y = player.y;
        playerDeath.start(false, 1000, 10, 10);
        game.explode.play();
        playerShield.kill();
        xwing.reset(50, 50);
    }
}

    if(numLives <= 0){
        xwing.kill();
    }
}

//  Called if the bullet hits one of the enemies
function playerKillsEnemy(bullet, enemy) {

    bullet.kill();
    enemy.kill();

    score += 20;

    if(score >= highScore){
        highScore = score;
        updateScore(highScore);
    }

    scoreText.kill();
    highScoreText.kill();
    createText();

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
    tieFightersBullets.callAll('kill');
    game.time.events.remove(launchTieFighter);
    xwing.revive();
    alive = true;
    playerHealth = maxHealth;
    numLives = maxLives;
    score = 0;
    shield(playerHealth);
    life(numLives);
    scoreText.kill();
    createText();

    //  Hide the text
    playGameText.visible = false;
    gameOverText.visible = false;
}



// set the database reference
var firebaseRef = firebase;
//var game = null;
$(document).ready(function () {

// Initialize Firebase
    var config = {
        apiKey: "AIzaSyCjFyM0sI-Usm5UJTknhJkprxgPsEmVyUg",
        authDomain: "star-wars-1978.firebaseapp.com",
        databaseURL: "https://star-wars-1978.firebaseio.com",
        storageBucket: "star-wars-1978.appspot.com",
        messagingSenderId: "919373111684"
    };
    firebase.initializeApp(config);

    // check for anonymous login issues
    firebaseRef.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });

});

var db;
$(document).ready(function(){

    db = firebaseRef.database().ref('hiScore');
    db.on('value', update_score);

});

function updateScore(board){
    db.set({
        hiScore: board
    });
}

var state;
function update_score(score){
    console.log("NEW SCORE RECEIVED", score.val());
    state = score.val();
    highScore = state.hiScore;
}