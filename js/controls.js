/**
 * Game logic built with Phaser engine
 */

// declaration of game engine
// this is where you can change the board size
var gameWidth = 600;
var gameHeight = 400;
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
var alive = false;
var blaster;
var bulletsR;
var bulletsL;
var bulletTimeL = 0;
var bulletTimeR = 0;
var bullet;
var bulletL;
var bulletR;

function preload() {
  // add the images/audio to the game
  game.load.image('background', 'assets/back.png');
  game.load.image('foreground', 'assets/deathstar.png');
  game.load.image('xwing', 'assets/xwing.png');
  game.load.image('bulletL', 'assets/bullet0.png');
  game.load.image('bulletR', 'assets/bullet0.png');
  game.load.audio('blaster', 'assets/blaster.mp3');
}

// Play game text and click event to start the game
function playGame() {
  // Play Game Text
  playGameText = game.add.text(" Click to Pilot");
  playGameText.anchor.set(.02);
  playGameText.font = 'Orbitron';
  playGameText.fontSize = 30;
  playGamegrd = playGameText.context.createLinearGradient(0, 0, 0, playGameText.canvas.height);
  playGamegrd.addColorStop(0, 'yellow');
  playGamegrd.addColorStop(1, 'orange');
  playGameText.fill = playGamegrd;
  playGameText.align = 'center';
  playGameText.stroke = '#000000';
  playGameText.strokeThickness = 2;
  playGameText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
  playGameText.inputEnabled = true;
  playGameText.events.onInputDown.add(restart, this);
  }

// Create the player, enemies, and bullets
function create() {
  background = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'background');
  // this is where you set the speed of the scroll (and the direction)
  background.autoScroll(0, 60);
  // setting up the DeathStar to scroll
  foreground = game.add.tileSprite(0, 0, gameWidth, 250, 'foreground');
  // here the foreground is set to scroll left
  foreground.autoScroll(-10, 0);
  
  // add the player
  xwing = game.add.group();
  xwing.enableBody = true;
  xwing.physicsBodyType = Phaser.Physics.ARCADE;
  
  // add left and right lasers for xwing
  bulletsR = game.add.group();
  bulletsR.enableBody = true;
  bulletsR.physicsBodyType = Phaser.Physics.ARCADE;
  bulletsR.createMultiple(30, 'bulletR');
  bulletsL = game.add.group();
  bulletsL.enableBody = true;
  bulletsL.physicsBodyType = Phaser.Physics.ARCADE;
  bulletsL.createMultiple(30, 'bulletR');
  
  // Add sounds
  game.blaster = game.add.audio('blaster');
  
  // create the bullets for both left and right for the xwing
  for (var i = 0; i < 200; i++) {
    var bL = bulletsL.create(40, 0, 'bulletL');
    var bR = bulletsR.create(40, 0, 'bulletR');
    bL.name = 'bulletL' + i;
    bL.exists = false;
    bL.visible = false;
    bL.checkWorldBounds = true;
    bL.events.onOutOfBounds.add(resetBullet, this);
    bR.name = 'bulletR' + i;
    bR.exists = false;
    bR.visible = false;
    bR.checkWorldBounds = true;
    bR.events.onOutOfBounds.add(resetBullet, this);
  }
  
  // create the xwing
  xwing = game.add.sprite(gameWidth / 2, gameHeight - 50, 'xwing');
  xwing.anchor.setTo(0.5, 0.5);
  game.physics.enable(xwing, Phaser.Physics.ARCADE);
  xwing.body.collideWorldBounds = true;
  
  // allow the use of the arrow keys for player movement
  cursors = game.input.keyboard.createCursorKeys();
  // set up use of the WASD keys for player movement
  wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D)
  };
  // set up the space bar and mouse button to allow firing the lasers
  game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
  // start the game
  playGame();
}

// Required
function render() {
  
}

// listener function for change states in game
function update() {
  
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
  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.activePointer.leftButton.isDown) {
    if (alive) {
      
      fireBulletL();
      fireBulletR();
    }
  }
  
  // Pause game play by keypress of the the P key
  window.onkeydown = function (event) {
    if (event.keyCode == 80) {
      game.paused = !game.paused;
    }
  }
}

// fire the bullet
function fireBulletL() {
  
  if (game.time.now > bulletTimeL) {
    bulletL = bulletsL.getFirstExists(false);
    
      bulletL.reset(xwing.x - 44, xwing.y - 40);
      bulletL.body.velocity.y = -500;
      bulletTimeL = game.time.now + 150;
      game.blaster.play();
  }
}
function fireBulletR() {
  
  if (game.time.now > bulletTimeR) {
    bulletR = bulletsR.getFirstExists(false);
    
      bulletR.reset(xwing.x + 20, xwing.y - 40);
      bulletR.body.velocity.y = -500;
      bulletTimeR = game.time.now + 150;
      game.blaster.play();
  }
}

//  Called if the bullet goes out of the screen
function resetBullet(bullet) {
  bullet.kill();
}

//Required to start the game
function restart() {
  xwing.revive();
  alive = true;
  playGameText.kill();
  
  wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D)
  };
}









