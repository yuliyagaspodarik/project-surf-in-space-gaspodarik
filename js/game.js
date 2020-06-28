'use strict';

let game = {
  AjaxHandlerScript: "https://fe.it-academy.by/AjaxStringStorage2.php",
  canvas: null,
  context: null,
  board: null,
  sprite: null,
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
    $('#main-page-button--play').hide();
    this.init();
    this.preload(() => {
      this.run();
    });
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
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.width > this.dimensions.max.width) {
      this.width = this.dimensions.max.width;
    }
    if (this.width < this.dimensions.min.width) {
      this.width = this.dimensions.min.width;
    }

    if (this.height > this.dimensions.max.height) {
      this.height = this.dimensions.max.height;
    }
    if (this.height < this.dimensions.min.height) {
      this.height = this.dimensions.min.height;
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;
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
    window.requestAnimationFrame(() => {
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
      this.context.fillText(`Score: ${this.score}`, 20, 20);//es6
    })
  },
  stop() {
    clearInterval(this.gameInterval);
    this.modal.modal();
  },
  modal: null,
};

$(window).resize(() => {
  game.canvas.width = window.innerWidth;
  game.canvas.height = window.innerHeight;
});
document.addEventListener('keydown', (event) => {
  game.sprite.spriteOnKeydown(event);
});



