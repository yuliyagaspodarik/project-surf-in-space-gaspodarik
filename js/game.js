var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var cometaSize = 30;
var spriteSize = 100;

var fon = new Image();
fon.src = './img/fon.png';

var cometaImg = new Image();
cometaImg.src = './img/2.png';

var spriteImg = new Image();
spriteImg.src = './img/sprite.png';

var comets = [];
var timer = 0;
var sprite = {
  size: spriteSize,
  mouseX: 200,
  mouseY: 200
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
  if (timer % 10 === 0) {
    comets.push({
      size: cometaSize,
      posX: Math.floor(Math.random() * 400),
      posY: -cometaSize,
      speedX: Math.floor(Math.random() * 4) - 1,
      speedY: Math.floor(Math.random() * 4) + 1
    });
  }
  /*setInterval(() => {comets.push({
      size: cometaSize,
      posX: Math.floor(Math.random() * 400),
      posY: -cometaSize,
      speedX: Math.floor(Math.random() * 4) - 1,
      speedY: Math.floor(Math.random() * 4) + 1
    })}, 5000);*/
  for (var i = 0; i < comets.length; i++) {
    comets[i].posX += comets[i].speedX;
    comets[i].posY += comets[i].speedY;
    if (comets[i].posY > canvas.height) {
      comets.splice(i, 1);
    }
    if (comets[i].posX >= canvas.width - comets[i].size || comets[i].posX < 0) {
      comets[i].speedX = -comets[i].speedX;
    }
  }
}

function render() {
  context.drawImage(fon, 0, 0, canvas.width, canvas.height);
  context.drawImage(spriteImg, sprite.mouseX - spriteSize / 2, sprite.mouseY - spriteSize / 2, sprite.size, sprite.size);
  for (var i = 0; i < comets.length; i++) {
    context.drawImage(cometaImg, comets[i].posX, comets[i].posY, comets[i].size, comets[i].size);
  }
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