let game = {
  AjaxHandlerScript: "http://fe.it-academy.by/AjaxStringStorage2.php",
  canvas: null,
  context: null,
  board: null,
  sprite: null,
  spa: null,
  width: 0,
  height: 0,
  score: 0,
  timer: 0,
  dimensions: {
    max: {
      width: 1550,
      height: 750
    },
    min: {
      width: 300,
      height: 300
    }
  },
  sprites: {
    spriteImg: null,
    cometImg: null,
    demonImg: null,
    shotImg: null,
    explosionImg: null
  },
  records: [],
  initRecords() {
    $.ajax(this.AjaxHandlerScript, {
      type: 'POST',
      data: {
        f: 'READ',
        n: 'GASPODARIK_PROJECT_SURFINSPACE'
      },
      success: (response) => {
        this.records = (JSON.parse(response.result)).sort(sortScore);
        function sortScore(a, b) {
          return b.score - a.score;
        }
      },
      error: (jqXHR, StatusStr, ErrorStr) => {
        console.log(StatusStr + ' ' + ErrorStr);
        this.records = [
          {name: 'Maks', score: 256},
          {name: 'Alex', score: 541},
          {name: 'Serhio', score: 548},
          {name: 'Yuliya', score: 1087},
          {name: 'Milena', score: 718},
          {name: 'Sabina', score: 625},
          {name: 'Vlad', score: 512},
          {name: 'Victor', score: 336}
        ];
      }
    });
  },
  stars: [],
  createStars() {
    this.stars = new Array(300).fill().map(() => {
      return {radius: Math.random() * this.width, speed: Math.random() * 0.005, angle: Math.random() * Math.PI * 2};
    });
  },
  updateStars() {
    this.stars.forEach(star => star.angle += star.speed);
  },
  start() {
    this.init();
    this.preload(() => {
      this.run();
    });
    this.spa.renderNewState();
  },
  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;

    let onAssetLoad = () => {
      ++loaded;

      if (loaded >= required) {
        callback();
      }
    };

    this.preloadSprites(onAssetLoad);
  },
  preloadSprites(onAssetLoad) {
    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `./img/${key}.png`;
      this.sprites[key].addEventListener('load', onAssetLoad);
    }
  },
  init() {
    this.canvas = document.getElementById('game-board');
    this.context = this.canvas.getContext('2d');
    this.initDimensions();
    this.setTextFont();
    this.initRecords();
  },
  setTextFont() {
    this.context.font = '20px MuseoModerno';
    this.context.fillStyle = 'white';
  },
  initDimensions() {
   /* this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.width > this.dimensions.max.width) this.width = this.dimensions.max.width;
    if (this.width < this.dimensions.min.width) this.width = this.dimensions.min.width;

    if (this.height > this.dimensions.max.height) this.height = this.dimensions.max.height;
    if (this.height < this.dimensions.min.height) this.height = this.dimensions.min.height;

    this.width = this.canvas.width;
    this.height = this.canvas.height;*/
    let data = {
      maxWidth: game.dimensions.max.width,
      maxHeight: game.dimensions.max.height,
      minWidth: game.dimensions.min.width,
      minHeight: game.dimensions.min.height,
      realWidth: window.innerWidth,
      realHeight: window.innerHeight
    };

    if (data.realWidth / data.realHeight > data.maxWidth / data.maxHeight) {
      this.fitWidth(data);
    } else {
      this.fitHeight(data);
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },
  fitWidth(data) {
    this.height = Math.round(this.width * data.realHeight / data.realWidth);
    this.height = Math.min(this.height, data.maxHeight);
    this.height = Math.max(this.height, data.minHeight);
    this.width = Math.round(data.realWidth * this.height / data.realHeight);
    this.canvas.style.height = '100%';
  },
  fitHeight(data) {
    this.width = Math.round(data.realWidth * data.maxHeight / data.realHeight);
    this.width = Math.min(this.width, data.maxWidth);
    this.width = Math.max(this.width, data.minWidth);
    this.height = Math.round(this.width * data.realHeight / data.realWidth);
    this.canvas.style.height = '100%';
  },
  run() {
    this.create();
    this.gameInterval = setInterval(() => {
      this.update();
    }, 0);
  },
  create() {
    this.createStars();
    this.board.create();
    this.sprite.create();

    /*
    window.addEventListener('load', () => {
      this.start(); ////????
    })*/
    //$('#game-board').mousemove(this.sprite.spriteOnMouseMove);
    this.canvas.addEventListener('mousemove', (event) => {
      this.sprite.mouseX = event.offsetX;
      this.sprite.mouseY = event.offsetY;
    });
    this.canvas.addEventListener('touchmove', (event) => {
      this.sprite.spriteOnTouchMove(event);
    });

  },
  update() {
    this.timer++;
    this.board.create();
    this.sprite.create();
    this.updateStars();
    this.board.update();
    this.sprite.update();
    this.render();
  },
  render() {
    window.requestAnimationFrame(() => { /////requestAnimate
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = 'rgba(0, 0, 8, 0.8)';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.stars.forEach(star => {
        this.context.beginPath();
        this.context.arc(Math.cos(star.angle) * star.radius + this.canvas.width / 2, Math.sin(star.angle) * star.radius + this.canvas.height / 2, Math.random() * 3, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fillStyle = 'white';
        this.context.fill();
      });
      this.sprite.render();
      this.board.render();
      this.context.fillText('Score: ' + this.score, 20, 20);//es6
    })
  },
  stop() {
    clearInterval(this.gameInterval);
    this.modal.modal();
    //window.location.reload();
  },
  modal: null,
  /*onEntityShotDown(entity) {
    switch (entity) {
      case 'comets':
        this.game.onCometShotDown();
        break;
      case 'demons':
        this.game.onDemonShotDown();
        break;
    }
  },*/
  /*onCometShotDown() {
    ++this.game.score;
  },*/
  /*onDemonShotDown() {
    this.game.score += 10;
  }*/
};

$(window).resize(game.initDimensions);
//$('#game-board').mousemove(game.sprite.spriteOnMouseMove);
/*game.canvas.addEventListener('mousemove', game.spriteOnMouseMove);
game.canvas.addEventListener('touchmove', (event) => {
  game.sprite.spriteOnTouchMove(event);
});*/
document.addEventListener('keydown', (event) => {
  game.sprite.spriteOnKeydown(event);
});
window.addEventListener('load', () => {
  game.start();
});



/*
function canvasResize(event) {
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
}
*/
/*
function game() {
  update();
  render();
  requestAnimateFrame(game);
}
*/

//function update() {
  /*let pushcomets = () => {comets.push({
    size: cometSize,
    posX: Math.floor(Math.random() * 400),
    posY: -cometSize,
    speedX: Math.floor(Math.random() * 4) - 1,
    speedY: Math.floor(Math.random() * 4) + 1
  })};
  setInterval(pushcomets, 5000);*/
/*
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
}
*/
/*
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
}*/
/*
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
*/
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
