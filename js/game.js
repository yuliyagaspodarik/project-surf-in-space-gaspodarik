var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";

var cometSize = 40;
var spriteSize = 100;
var shotSize = 50;
var demonSize = 80;

context.font = '18px Arial';
context.fillStyle = 'purple';
var records = {};

$.ajax(AjaxHandlerScript, {
  type: 'POST',
  data: {
    f: 'READ',
    n: 'GASPODARIK_PROJECT_SURFINSPACE'
  },
  success: getRecords,
  error: errorHandler
});

function getRecords(data) {
  console.log(data);
  records = (JSON.parse(data.result)).sort(sortScore);
  console.log(records);

  function sortScore(a, b) {
    return b.score - a.score;
  }
}

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
var stars = new Array(300).fill().map(() => {
  return {r: Math.random() * canvas.width, s: Math.random() * 0.005, a: Math.random() * Math.PI * 2};
});
var timer = 0;
var score = 0;
var sprite = {
  size: spriteSize,
  mouseX: 300,
  mouseY: 500,
  speedX: 5,
  speedY: 5
};

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


canvas.addEventListener('mousemove', (event) => {
  sprite.mouseX = event.offsetX;
  sprite.mouseY = event.offsetY;
});
canvas.addEventListener('touchmove', (event) => {
  event.preventDefault();
  sprite.mouseX = event.touches[0].clientX;
  sprite.mouseY = event.touches[0].clientY;
});

document.addEventListener('keydown', move);

function move(event) {
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
}

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
  /*if (timer % 10 === 0) {
    stars.push({r: Math.random() * canvas.width, s: Math.random() * 0.01, a: Math.random() * Math.PI * 2});
  }*/
  stars.forEach(e => {e.a += e.s});

  if (timer % 20 === 0) {
    comets.push({
      size: Math.floor(Math.random() * 11) + 20,//cometSize,
      posX: Math.floor(Math.random() * canvas.width),
      posY: -cometSize,
      speedX: 0,//Math.floor(Math.random() * 4) - 1,
      speedY: Math.floor(Math.random() * 4) + 1,
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

  if (timer % 20 === 0) {
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
      setTimeout(() => {demons.splice(p, 1)}, 2000);
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


 context.fillStyle = 'rgba(0, 0, 8, 0.8)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  stars.forEach(e => {
    context.beginPath();
    context.arc(Math.cos(e.a) * e.r + canvas.width / 2, Math.sin(e.a) * e.r + canvas.height / 2, Math.random() * 3, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = 'white';
    context.fill();
  });
  //context.drawImage(fon, 0, 0, canvas.width, canvas.height);
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
  result.textContent = ' ' + score;


  modal.classList.add('open');
  backdrop.classList.add('open');

  if (modalYesButton) {
    modalYesButton.addEventListener('click', () => {
      records.unshift({name: document.getElementById('name').value, score: score});
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
            success: scoreReset,//???
            error: errorHandler
          });

          function scoreReset() {/////????
            score = null;
          }
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
