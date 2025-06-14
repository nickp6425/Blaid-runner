
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let x = 50;
let y = 200;
let vy = 0;
let gravity = 0.5;
let gameOver = false;

const chickenImg = new Image();
chickenImg.src = 'chicken.png';

const carImg = new Image();
carImg.src = 'car.png';

function drawBlaid() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(x, y, 40, 40);
}

function drawChicken() {
  ctx.drawImage(chickenImg, 600, 220, 60, 60);
}

function drawCar() {
  ctx.drawImage(carImg, 400, 230, 80, 40);
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBlaid();
  drawChicken();
  drawCar();

  y += vy;
  vy += gravity;

  if (y > canvas.height - 40) {
    y = canvas.height - 40;
    vy = 0;
  }

  if (x + 40 > 400 && x < 480 && y + 40 > 230) {
    gameOver = true;
    showGameOver();
  }

  requestAnimationFrame(update);
}

function showGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "30px Comic Sans MS";
  ctx.fillText("You got swarmed by roosters!", 180, 200);
}

canvas.addEventListener('click', () => {
  if (!gameOver) vy = -10;
});

update();
