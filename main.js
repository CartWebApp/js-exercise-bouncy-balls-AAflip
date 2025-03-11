// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let balls = [];
let timer = 0;
let highScore = 0;
let loopOn = false;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

function Player(x, y, velX, velY, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = 'red';
  this.size = size;
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Player.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 1 * Math.PI, 0);
  ctx.fill();
}

let player = new Player(window.innerWidth / 2, window.innerHeight / 2, 0, 0, 15);

Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

Player.prototype.update = function () {
  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    const dx1 = this.x - player.x;
    const dy1 = this.y - player.y;
    const distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    if (distance1 < this.size + player.size) {playerDeath()}
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
        this.velX = -this.velX;
        this.velY = -this.velY;
        balls[j].velX = -balls[j].velX;
        balls[j].velY = -balls[j].velY;
      }
    }
  }
}

function createBalls(){
while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size
  );

  balls.push(ball);
}
}

function loop() {
  if(balls.length == 0){createBalls()}
  if(loopOn) {
    document.getElementById('menu').style.display = 'none';
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, width, height);
    player.draw();
    timer++;
    document.getElementById('timer').innerHTML = `<h2>Score: ${timer}</h2>`
    if(timer>highScore){highScore = timer}

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      player.update();
      balls[i].collisionDetect();
    }

    requestAnimationFrame(loop);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

document.addEventListener('keydown', (e) => {
  if (e.key == 'ArrowLeft') {
    player.velX = -0.5;
  }
  if (e.key == 'ArrowRight') {
    player.velX = 0.5;
  }
  if (e.key == 'ArrowUp') {
    player.velY = -0.5;
  }
  if (e.key == 'ArrowDown') {
    player.velY = 0.5;
  }
});

document.addEventListener('keyup', e => {
  if (e.key == 'ArrowLeft') {
    player.velX = 0;
  }
  if (e.key == 'ArrowRight') {
    player.velX = 0;
  }
  if (e.key == 'ArrowUp') {
    player.velY = 0;
  }
  if (e.key == 'ArrowDown') {
    player.velY = 0;
  }
});

function createGame() {
  document.getElementById('menu').innerHTML = `
  <h2 id='title'>Stupendus Bouncing Balls Game</h2>
  <button onclick='loopOn = true;loop();'>Play</button>
  <button onclick='window.close();'>Quit</button>`
}

function playerDeath() {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  balls = [];
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('menu').style.flexDirection = 'column';
  document.getElementById('menu').style.alignItems = 'center';
  document.getElementById('menu').innerHTML = `
  <h2>High Score: ${highScore}</h2>
  <h3>Round Score: ${timer}</h3>
  <button onclick='loopOn = true;timer=0;loop();'>Play Again</button>
  <button onclick='window.close();'>Quit</button>`;
  loopOn = false;
}

createGame();
// loop();