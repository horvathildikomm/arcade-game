'use strict'
// This function converts block position to canvas pixels
const coordinatesToPixel = (x,y) => [x*101  + 0.5, y*83 -15];
// This function converts canvas pixels to block position
const pixelToCoordinates = (x,y) => [
  Math.floor(x/101 + 0.5),
   Math.floor(y/83 + 1),
 ];
// Enemies our player must avoid
var Enemy = function() {
    // Initialize position and speed
    this.restart();
    // Set image for enemy
    this.sprite = 'images/enemy-bug.png';
};
// This function (re-)initializes enemy position and speed
Enemy.prototype.restart = function (){
  // Generate random speed between 50-300
  this.speed = Math.random()*250 + 50;
  // Every enemy starts from -1st x block position
  // and between 1st and 3rd y block position
  const [x,y] = coordinatesToPixel(-1, 1+ Math.floor(Math.random()*3));
  // Enemy coordinates are stored in pixels!
  this.x = x;
  this.y = y;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    const [x,y] = pixelToCoordinates(this.x, this.y);
    if (x === 5){
      // Re initialize at the end of the map
      this.restart();
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
var Player = function(){
  // Initialize player position and score
  this.x = 2;
  this.y = 5;
  this.score = 0;
  this.sprite = 'images/char-boy.png';
};
Player.prototype.update = function() {
  // Collision check: filter enemies whose position is not the same
  // as the player's.
  const filteredEnemies = allEnemies
  .filter(enemy => {
    // Calcute block coordinates for the given enemy
    const [x,y] = pixelToCoordinates(enemy.x, enemy.y);
    // If enemy position is the same as the player position
    // then leave it in the array, otherwise drop it.
    if ((x === this.x) && (y === this.y)){
      return true;
    }
    else return false;
  });
  // If we have at last 1 colliding enemy with the player
  if(filteredEnemies.length > 0){
    // Reset player position
    this.y = 5;
    this.x = 2;
  }
};
Player.prototype.render = function() {
  // Map player's block postion to pixel coordinates
  const [x,y] = coordinatesToPixel(this.x, this.y);
  ctx.drawImage(Resources.get(this.sprite), x, y);
  // Draw the score on the top of the game.
  ctx.font = '48px serif';
  ctx.fillText("Score: " + String(this.score), 150, 48);
};
Player.prototype.handleInput = function(inputStr) {
  // Modify coordinates according to the keyboard input
  switch (inputStr) {
    case 'up':
      this.y = this.y - 1;
      break;
    case 'down':
      this.y = this.y + 1;
      break;
    case 'left':
      this.x = this.x - 1;
      break;
    case 'right':
      this.x = this.x + 1;
      break;
    default:
    break;
  }
  // Truncate player position, so it can not leave the map/canvas.
  this.x = Math.max(Math.min(this.x,4),0);
  this.y = Math.max(Math.min(this.y,5),0);
  // When the player reaches the water, reset the position
  // and add 100 to the score
  if(!this.y){
    this.y = 5;
    this.score +=100;
  };
};

// Create 5 new enemies
// found solution to map on empty array on stackoverflow
var allEnemies = Array.from(new Array(5)).map(i => new Enemy());
// Create player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
