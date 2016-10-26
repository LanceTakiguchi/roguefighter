/**
 * Created by Weizguy on 10/18/2016.
 * Prototype to show proof of enemy movement
 * also added bullet sounds and explosion sounds
 */

// declaration of game engine
  // this is where you can change the board size
var game = new Phaser.Game(600, 900, Phaser.AUTO, 'C10_game', { preload: preload, create: create, update: update });

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
var explosions;
var explode;

function preload() {
  
  // add the images/audio to the game
  game.load.image('background', 'back.png');
  game.load.image('foreground', 'deathstar.png');
  game.load.image('xwing', 'xwing.png');
  game.load.image('tieFighter', 'tie.png');
  game.load.image('bullet', 'bullet0.png');
  game.load.spritesheet('kaboom', 'explode.png', 128, 128);
  game.load.audio('blaster', 'blaster.mp3');
  game.load.audio('explode', 'explosion.mp3');
  
}


function create() {
  
  background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
  // this is where you set the speed of the scroll (and the direction)
  background.autoScroll(0, 60);
  
  // the image is set super wide to not show up over and over again
  foreground = game.add.tileSprite(0, 0, 1600, 250, 'foreground');
  // here it is set to scroll left
  foreground.autoScroll(-20, 0);
  
  // create the tieFighter group
  tieFighters = game.add.group();
  tieFighters.enableBody = true;
  tieFighters.physicsBodyType = Phaser.Physics.ARCADE;
  tieFighters.createMultiple(50, 'tieFighter');
  tieFighters.setAll('anchor.x', 0.5);
  tieFighters.setAll('anchor.y', 0.5);
  tieFighters.setAll('scale.x', 0.5);
  tieFighters.setAll('scale.y', 0.5);
  tieFighters.setAll('angle', 180);
  tieFighters.setAll('outOfBoundsKill', false);
  tieFighters.setAll('checkWorldBounds', true);
  
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
  
  
  for (var i = 0; i < 20; i++)
  {
    var b = bullets.create(40, 0, 'bullet');
    b.name = 'bullet' + i;
    b.exists = false;
    b.visible = false;
    b.checkWorldBounds = true;
    b.events.onOutOfBounds.add(resetBullet, this);
  }
  
  // create the xwing
  xwing = game.add.sprite(250, 750, 'xwing');
  game.physics.enable(xwing, Phaser.Physics.ARCADE);
  xwing.body.collideWorldBounds = true;
  
  //  An explosion pool
  explosions = game.add.group();
  explosions.createMultiple(30, 'kaboom');
  explosions.forEach(setupExplosions, this);
  
  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
  
}

// add explosions
function setupExplosions (explode) {
  
  explode.animations.add('kaboom');
}


function update() {
  
  // add the collision handlers
  game.physics.arcade.collide(bullets, tieFighters, collisionHandler, null, this);
  game.physics.arcade.collide(xwing, tieFighters, enemyKillPlayer, null, this);
  
  // tieFighters.forEach(checkPos, this);
  
  // make the xwing controllable
  xwing.body.velocity.x = 0;
  xwing.body.velocity.y = 0;
  
  if (cursors.left.isDown)
  {
    xwing.body.velocity.x = -speed;
  }
  else if (cursors.right.isDown)
  {
    xwing.body.velocity.x = speed;
  }
  else if (cursors.up.isDown)
  {
    xwing.body.velocity.y = -speed;
  }
  else if (cursors.down.isDown)
  {
    xwing.body.velocity.y = speed;
  }
  
  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
  {
    fireBullet();
    
  }
}

function fireBullet () {
  
  if (game.time.now > bulletTime)
  {
    bullet = bullets.getFirstExists(false);
    
    if (bullet)
    {
      bullet.reset(xwing.x +  30, xwing.y - 5);
      bullet.body.velocity.y = -300;
      bulletTime = game.time.now + 150;
      game.blaster.play();
    }
  }
  
}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {
  
  bullet.kill();
  
}

// called if enemy and player collide
function enemyKillPlayer (player, enemy) {
  
  player.kill();
  enemy.kill();
  
  //  And create an explosion :)
  var explosion = explosions.getFirstExists(false);
  explosion.reset(player.body.x, player.body.y);
  explosion.play('kaboom', 30, false, true);
  game.explode.play();
  
  
  player.reset(250, 750);
}

//  Called if the bullet hits one of the enemies
function collisionHandler (bullet, enemy) {
  
  bullet.kill();
  enemy.kill();
  
  //  And create an explosion :)
  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x, enemy.body.y);
  explosion.play('kaboom', 30, false, true);
  game.explode.play();
}

function launchTieFighter() {
  var MIN_ENEMY_SPACING = 300;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 300;
  
  var enemy = tieFighters.getFirstExists(false);
  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
    enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.drag.x = 100;
  }
  enemy.update = function () {
    enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
  }
  
  
  //  Send another enemy soon
  //game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchTieFighter);
  game.time.events.add(1000, launchTieFighter);
  
  
}