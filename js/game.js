


const canvas = document.getElementById('game-board');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";

const cometSize = 40;
const spriteSize = 100;
const shotSize = 50;
const demonSize = 80;

context.font = '18px Arial';
context.fillStyle = 'purple';
let records = [];

$.ajax(AjaxHandlerScript, {
  type: 'POST',
  data: {
    f: 'READ',
    n: 'GASPODARIK_PROJECT_SURFINSPACE'
  },
  success: (response) => {
    console.log(response);//////
    records = (JSON.parse(response.result)).sort(sortScore);
    console.log(records);///////
///// delete повтор
    function sortScore(a, b) {
      return b.score - a.score;
    }
  },
  error: (jqXHR, StatusStr, ErrorStr) => {
    console.log(StatusStr + ' ' + ErrorStr);
    records = [
      {name: 'Maks', score: 256},
      {name: 'Alex', score: 541},
      {name: 'Serhio', score: 548},
      {name: 'Yuliya', score: 1087},
      {name: 'Milena', score: 718},
      {name: 'Sabina', score: 625},
      {name: 'Vlad', score: 512},
      {name: 'Victor', score: 336}
    ];
    console.log(records);
  }
});

const fon = new Image();
fon.src = './img/fon.png';

const cometImg = new Image();
cometImg.src = './img/comet.png';

const spriteImg = new Image();
spriteImg.src = './img/sprite.png';

const shotImg = new Image();
shotImg.src = './img/shot.png';

const explosionImg = new Image();
explosionImg.src = './img/explosion.png';

const demonImg = new Image();
demonImg.src = './img/demon.png';

function random(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

let comets = [];
let shots = [];
let explosions = [];
let demons = [];
let stars = new Array(300).fill().map(() => {
  return {radius: Math.random() * canvas.width, speed: Math.random() * 0.005, angle: Math.random() * Math.PI * 2};
});
let timer = 0;
let score = 0;
let sprite = {
  size: spriteSize,
  mouseX: 300,
  mouseY: 500,
  speedX: 5,
  speedY: 5
};


function canvasResize (event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
$(window).resize(canvasResize);

function spriteMouseMove (event) {
  sprite.mouseX = event.offsetX;
  sprite.mouseY = event.offsetY;
}
$('#game-board').mousemove(spriteMouseMove);



canvas.addEventListener('touchmove', (event) => {
  event.preventDefault();
  sprite.mouseX = event.touches[0].clientX;
  sprite.mouseY = event.touches[0].clientY;
});

document.addEventListener('keydown', (event) => {
  function moveDown() {
    sprite.mouseY += sprite.speedY;
    if (sprite.mouseY + spriteSize / 2 >= canvas.height) {
      sprite.mouseY = canvas.height - spriteSize / 2;
    }
  }

  function moveUp() {
    sprite.mouseY -= sprite.speedY;
    if (sprite.mouseY - spriteSize / 2 < 0) {
      sprite.mouseY = spriteSize / 2;
    }
  }

  function moveLeft() {
    sprite.mouseX -= sprite.speedX;
    if (sprite.mouseX - spriteSize / 2 < 0) {
      sprite.mouseX = spriteSize / 2;
    }
  }

  function moveRight() {
    sprite.mouseX += sprite.speedX;
    if (sprite.mouseX + spriteSize / 2 >= canvas.width) {
      sprite.mouseX = canvas.width - spriteSize / 2;
    }
  }
  switch (event.code) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowUp':
      moveUp();
      break;
  }
  });


window.onload = function () {
  game();
};

function game() {
  update();
  render();
  requestAnimateFrame(game);
}


function update() {
  timer++;

  stars.forEach(star => star.angle += star.speed);

  if (timer % 20 === 0) {
    comets.push({
      size: random(20, 40),
      posX: random(0, canvas.width),
      posY: -cometSize,
      speedX: 0,
      speedY: random(1, 4),
      flag: 0,
      angle: 0,
      rotateAngle: Math.random() * 0.2 - 0.1
    });
  }
  /*let pushcomets = () => {comets.push({
    size: cometSize,
    posX: Math.floor(Math.random() * 400),
    posY: -cometSize,
    speedX: Math.floor(Math.random() * 4) - 1,
    speedY: Math.floor(Math.random() * 4) + 1
  })};
  setInterval(pushcomets, 5000);*/

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

  if (timer % 20 === 0) {
    shots.push({size: shotSize, posX: sprite.mouseX - 20, posY: sprite.mouseY - 70, speedX: 0, speedY: -5})
  }

  shots.forEach((shot, i, a) => {shot.posY += shot.speedY;
    if (shot.posY < -50) shots.splice(i, 1);});


  for (var p = 0; p < demons.length; p++) {
    demons[p].posX += demons[p].speedX;
    demons[p].posY += demons[p].speedY;
    if (demons[p].posY > canvas.height) {
      setTimeout(() => {
        demons.splice(p, 1)
      }, 2000);
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
      modal();
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
  explosions.forEach((explosion, i, a) => {
    explosion.animX += 0.1;
    if (explosion.animX > 5) {
      explosion.animY++;
      explosion = 0;
    }
    if (explosion.animY > 4) {
      explosions.splice(i, 1);
    }
  });

}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgba(0, 0, 8, 0.8)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    context.beginPath();
    context.arc(Math.cos(star.angle) * star.radius + canvas.width / 2, Math.sin(star.angle) * star.radius + canvas.height / 2, Math.random() * 3, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = 'white';
    context.fill();
  });
  context.drawImage(spriteImg, sprite.mouseX - spriteSize / 2, sprite.mouseY - spriteSize / 2, sprite.size, sprite.size);
  comets.forEach(comet => {
    context.save();
    context.translate(comet.posX + comet.size / 2, comet.posY + comet.size / 2);
    context.rotate(comet.angle);
    context.drawImage(cometImg, -comet.size / 2, -comet.size / 2, comet.size, comet.size);
    context.restore();
  });
  shots.forEach(shot => context.drawImage(shotImg, shot.posX, shot.posY, shot.size, shot.size));
  explosions.forEach(explosion => context.drawImage(explosionImg, 96 * Math.floor(explosion.animX), 96 * Math.floor(explosion.animY), 96, 96, explosion.posX, explosion.posY, 100, 100));
  demons.forEach(demon => context.drawImage(demonImg, demon.posX, demon.posY, demon.size, demon.size));
  context.fillText('Score: ' + score, 20, 20);
}

function sendResult() {
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

function modal() {
  document.getElementById('modal').style.display = 'block';
  var backdrop = document.querySelector('.backdrop');
  var modal = document.querySelector('.modal');
  var modalNoButton = document.querySelector('.modal__action--negative');
  var modalYesButton = document.querySelector('#save-result');
  var result = document.getElementById('result');
  result.textContent = `Your result: ${score}!`;
  modal.classList.add('open');
  backdrop.classList.add('open');

  if (modalYesButton) {
    modalYesButton.addEventListener('click', () => {
      records.push({name: document.getElementById('player-name').value, score: score});
      var password = '123';
      $.ajax({
        url: AjaxHandlerScript,
        type: 'POST',
        data: {
          f: 'LOCKGET',
          n: 'GASPODARIK_PROJECT_SURFINSPACE',
          p: password
        },
        cache: false,
        success: function () {
          $.ajax({
            url: AjaxHandlerScript,
            type: 'POST',
            data: {
              f: 'UPDATE',
              n: 'GASPODARIK_PROJECT_SURFINSPACE',
              p: password,
              v: JSON.stringify(records)
            },
            cache: false,
            success: (response) => {
              console.log(response)
            },//???
            error: errorHandler
          });
          /*function scoreReset() {
            score = null;
          }*/
        },
        error: errorHandler
      });

      closeModal();
    });
  }

  if (modalNoButton) {
    modalNoButton.addEventListener('click', closeModal);
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
    }
    backdrop.classList.remove('open');
  }
}

function errorHandler(jqXHR, StatusStr, ErrorStr) {
  alert(StatusStr + ' ' + ErrorStr);
}

/*
function insertResult() {
  $.ajax({
    url: AjaxHandlerScript,
    type: 'POST',
    data: {
      f: 'INSERT',
      n: this.address,
      v: JSON.stringify(this.storage)
    },
    cache: false,
    success: function (response) {
      console.log(response);
    },
    error: this.errorHandler
  });
}


$.ajax(AjaxHandlerScript, {
        type: 'POST',
        data: {
          f: 'READ',
          n: 'GASPODARIK_PROJECT_SURF_IN_SPACE'
        },
        success: records,
        error: errorHandler
      });

      function records(data) {
        recordsStr += JSON.parse(data.result);
console.log();
      }
      function errorHandler(jqXHR, StatusStr, ErrorStr) {
        alert(StatusStr + ' ' + ErrorStr);
      }
*/
