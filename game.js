const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let blaid = { x: 150, y: 600, width: 40, height: 60, lane: 1 };
let copCars = [];
let sugars = [];
let score = 0;
let speed = 3;
let lastRooster = 0;

const lanes = [80, 150, 220];
const images = {};

function loadImage(name, src) {
  images[name] = new Image();
  images[name].src = src;
}

loadImage("blaid", "assets/blaid.png");
loadImage("cop", "assets/cop_car.png");
loadImage("sugar", "assets/sugar.png");

const music = new Audio("assets/music.mp3");
const rooster = new Audio("assets/rooster.mp3");
music.loop = true;
music.volume = 0.2;
music.play();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(images["blaid"], blaid.x, blaid.y, blaid.width, blaid.height);
  for (let car of copCars) {
    ctx.drawImage(images["cop"], car.x, car.y, car.width, car.height);
  }
  for (let sugar of sugars) {
    ctx.drawImage(images["sugar"], sugar.x, sugar.y, sugar.width, sugar.height);
  }
}

function update() {
  score += 1;
  document.getElementById("score").innerText = `Score: ${score} ft`;

  copCars.forEach(c => c.y += speed);
  sugars.forEach(s => s.y += speed);

  copCars = copCars.filter(c => c.y < 700);
  sugars = sugars.filter(s => s.y < 700);

  for (let c of copCars) {
    if (isColliding(blaid, c)) {
      gameOver();
      return;
    }
  }

  for (let i = 0; i < sugars.length; i++) {
    if (isColliding(blaid, sugars[i])) {
      speed += 1;
      sugars.splice(i, 1);
    }
  }

  if (score - lastRooster >= 500) {
    rooster.play();
    lastRooster = score;
  }

  draw();
}

function isColliding(a, b) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

function gameOver() {
  music.pause();
  window.location.href = "game_over.html";
}

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

function spawnObstacle() {
  const lane = Math.floor(Math.random() * 3);
  copCars.push({ x: lanes[lane], y: -60, width: 50, height: 60 });
}

function spawnSugar() {
  const lane = Math.floor(Math.random() * 3);
  sugars.push({ x: lanes[lane], y: -40, width: 30, height: 30 });
}

setInterval(spawnObstacle, 1200);
setInterval(spawnSugar, 2500);

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
}

function handleTouchMove(evt) {
  if (!xDown) return;
  let xUp = evt.touches[0].clientX;
  let xDiff = xDown - xUp;

  if (Math.abs(xDiff) > 30) {
    if (xDiff > 0 && blaid.lane > 0) {
      blaid.lane--;
    } else if (xDiff < 0 && blaid.lane < 2) {
      blaid.lane++;
    }
    blaid.x = lanes[blaid.lane];
    xDown = null;
  }
}

gameLoop();