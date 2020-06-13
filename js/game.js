var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var cometSize = 30;
var spriteSize = 100;
var shotSize = 50;

context.font = '18px Arial';
context.fillStyle = 'purple';

var fon = new Image();
fon.src = './img/fon.png';

var comet = new Image();
comet.src = './img/2.png';

var spriteImg = new Image();
spriteImg.src = './img/sprite.png';

var shot = new Image();
shot.src = './img/shot.png';

var explosion = new Image();
explosion.src = './img/explosion.png';

var comets = [];
var shots = [];
var explosions = [];
var timer = 0;
var score = 0;
var sprite = {
  size: spriteSize,
  mouseX: 200,
  mouseY: 200
};

canvas.addEventListener('mousemove', (event) => {
  sprite.mouseX = event.offsetX;
  sprite.mouseY = event.offsetY;
});

shot.onload = function () {
  game();
};

function game() {
  update();
  render();
  requestAnimateFrame(game);
}

function update() {
  timer++;
  if (timer % 20 === 0) {
    comets.push({
      size: cometSize,
      posX: Math.floor(Math.random() * 400),
      posY: -cometSize,
      speedX: Math.floor(Math.random() * 4) - 1,
      speedY: Math.floor(Math.random() * 4) + 1,
      flag: 0
    });
  }
  /*setInterval(() => {comets.push({
      size: cometSize,
      posX: Math.floor(Math.random() * 400),
      posY: -cometSize,
      speedX: Math.floor(Math.random() * 4) - 1,
      speedY: Math.floor(Math.random() * 4) + 1
    })}, 5000);*/

  if (timer % 30 === 0) {
    shots.push({size: shotSize, posX: sprite.mouseX - 20, posY: sprite.mouseY - 70, speedX: 0, speedY: -5})
  }

  for (var n = 0; n < shots.length; n++) {
    shots[n].posY += shots[n].speedY;
    if (shots[n].posY < -50) shots.splice(n, 1);
  }

  for (var i = 0; i < comets.length; i++) {
    comets[i].posX += comets[i].speedX;
    comets[i].posY += comets[i].speedY;
    if (comets[i].posY > canvas.height) {
      comets.splice(i, 1);
    }
    if (comets[i].posX >= canvas.width - comets[i].size || comets[i].posX < 0) {
      comets[i].speedX = -comets[i].speedX;
    }

    for (var j = 0; j < shots.length; j++) {
      if (Math.abs(comets[i].posX - shots[j].posX) < cometSize && Math.abs(comets[i].posY - shots[j].posY) < cometSize) {
        explosions.push({posX: comets[i].posX - comets[i].size / 2, posY: comets[i].posY - comets[i].size / 2, animX: 0, animY: 0});
        comets[i].flag = 1;
        score++;
        shots.splice(j, 1);
        break; //continue;
      }
    }
    if (comets[i].flag === 1) {
      comets.splice(i, 1);
    }
  }
   for (var m = 0; m < explosions.length; m++) {
     explosions[m].animX += 0.1;
     if (explosions[m].animX > 5) {
       explosions[m].animY++;
       explosions[m] = 0;
     }
     if (explosions[m].animY > 4) {
       explosions.splice(m, 1);
     }
   }

   //столкновение корабля с кометой - условие для cancelAF
}

function render() {
  context.drawImage(fon, 0, 0, canvas.width, canvas.height);
  context.drawImage(spriteImg, sprite.mouseX - spriteSize / 2, sprite.mouseY - spriteSize / 2, sprite.size, sprite.size);
  for (var i = 0; i < comets.length; i++) {
    context.drawImage(comet, comets[i].posX, comets[i].posY, comets[i].size, comets[i].size);
  }
  for (i = 0; i < shots.length; i++) {
    context.drawImage(shot, shots[i].posX, shots[i].posY, shots[i].size, shots[i].size);
  }
  for (i = 0; i < explosions.length; i++) {
    context.drawImage(explosion, 96 * Math.floor(explosions[i].animX), 96 * Math.floor(explosions[i].animY), 96, 96, explosions[i].posX, explosions[i].posY, 100, 100);
  }
  context.fillText('Score: ' + score, 20, 20);
}

var requestAnimateFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };