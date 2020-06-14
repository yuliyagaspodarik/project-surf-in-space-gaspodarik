var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var cometSize = 30;
var spriteSize = 100;
var shotSize = 50;
var demonSize = 50;

context.font = '18px Arial';
context.fillStyle = 'purple';

var fon = new Image();
fon.src = './img/fon.png';

var comet = new Image();
comet.src = './img/comet.png';

var spriteImg = new Image();
spriteImg.src = './img/sprite.png';

var shot = new Image();
shot.src = './img/shot.png';

var explosion = new Image();
explosion.src = './img/explosion.png';

var demon = new Image();
demon.src = './img/demon.png';

var comets = [];
var shots = [];
var explosions = [];
var demons = [];
var timer = 0;
var score = 0;
var sprite = {
  size: spriteSize,
  mouseX: 300,
  mouseY: 500
};

canvas.addEventListener('mousemove', (event) => {
  sprite.mouseX = event.offsetX;
  sprite.mouseY = event.offsetY;
});

fon.onload = function () {
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
      posX: Math.floor(Math.random() * 600),
      posY: -cometSize,
      speedX: 0,//Math.floor(Math.random() * 4) - 1,
      speedY: Math.floor(Math.random() * 3) + 1,
      flag: 0,
      angle: 0,
      rotateAngle: Math.random() * 0.2 - 0.1
    });
  }
  /*setInterval(() => {comets.push({
      size: cometSize,
      posX: Math.floor(Math.random() * 400),
      posY: -cometSize,
      speedX: Math.floor(Math.random() * 4) - 1,
      speedY: Math.floor(Math.random() * 4) + 1
    })}, 5000);*/

  if (timer % 200 === 0) {
    demons.push({
      size: demonSize,
      posX: (canvas.width - demonSize) * Math.floor(Math.random() * 2),
      posY: -demonSize,
      speedX: 2,
      speedY: 2,
      flag: 0
    });
  }

  if (timer % 30 === 0) {
    shots.push({size: shotSize, posX: sprite.mouseX - 20, posY: sprite.mouseY - 70, speedX: 0, speedY: -5})
  }

  for (var n = 0; n < shots.length; n++) {
    shots[n].posY += shots[n].speedY;
    if (shots[n].posY < -50) shots.splice(n, 1);
  }

  for (var p = 0; p < demons.length; p++) {
    demons[p].posX += demons[p].speedX;
    demons[p].posY += demons[p].speedY;
    if (demons[p].posY > canvas.height) {
      demons.splice(p, 1);
    }
    if (demons[p].posX > canvas.width - demons[p].size || demons[p].posX < 0) {
      demons[p].speedX = -demons[p].speedX;
    }

    for (var h = 0; h < shots.length; h++) {
      if (Math.abs(demons[p].posX - shots[h].posX) < demonSize && Math.abs(demons[p].posY - shots[h].posY) < demonSize) {
        explosions.push({
          posX: demons[p].posX - demons[p].size / 2,
          posY: demons[p].posY - demons[p].size / 2,
          animX: 0,
          animY: 0
        });
        demons[p].flag = 1;
        score += 10;
        shots.splice(j, 1);
        break; //continue;
      }
    }
    if (demons[p].flag === 1) {
      demons.splice(p, 1);
    }
  }

  for (var i = 0; i < comets.length; i++) {
    comets[i].posX += comets[i].speedX;
    comets[i].posY += comets[i].speedY;
    comets[i].angle += comets[i].rotateAngle;

    if (comets[i].posY > canvas.height) {
      comets.splice(i, 1);
    }
    if (comets[i].posX >= canvas.width - comets[i].size || comets[i].posX < 0) {
      comets[i].speedX = -comets[i].speedX;
    }

    if (comets[i].posX + comets[i].size >= sprite.mouseX - spriteSize / 4 && comets[i].posX <= sprite.mouseX + spriteSize / 4 && comets[i].posY + comets[i].size >= sprite.mouseY - spriteSize / 4 && comets[i].posY <= sprite.mouseY + spriteSize / 4) {
      alert('GAME OVER');

      //cancelAnimateFrame(game);
     // window.location.reload();

    }

    for (var j = 0; j < shots.length; j++) {
      if (Math.abs(comets[i].posX - shots[j].posX) < cometSize && Math.abs(comets[i].posY - shots[j].posY) < cometSize) {
        explosions.push({
          posX: comets[i].posX - comets[i].size / 2,
          posY: comets[i].posY - comets[i].size / 2,
          animX: 0,
          animY: 0
        });
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
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(fon, 0, 0, canvas.width, canvas.height);
  context.drawImage(spriteImg, sprite.mouseX - spriteSize / 2, sprite.mouseY - spriteSize / 2, sprite.size, sprite.size);
  for (var i = 0; i < comets.length; i++) {
    //context.drawImage(comet, comets[i].posX, comets[i].posY, comets[i].size, comets[i].size);
    context.save();
    context.translate(comets[i].posX + comets[i].size / 2, comets[i].posY + comets[i].size / 2);
    context.rotate(comets[i].angle);
    context.drawImage(comet, -comets[i].size / 2, -comets[i].size / 2, comets[i].size, comets[i].size);
    context.restore();
  }
  for (i = 0; i < shots.length; i++) {
    context.drawImage(shot, shots[i].posX, shots[i].posY, shots[i].size, shots[i].size);
  }
  for (i = 0; i < explosions.length; i++) {
    context.drawImage(explosion, 96 * Math.floor(explosions[i].animX), 96 * Math.floor(explosions[i].animY), 96, 96, explosions[i].posX, explosions[i].posY, 100, 100);
  }
  for (i = 0; i < demons.length; i++) {
    context.drawImage(demon, demons[i].posX, demons[i].posY, demons[i].size, demons[i].size);
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

var cancelAnimateFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  function () {
    window.clearInterval(1000 / 60);
  };