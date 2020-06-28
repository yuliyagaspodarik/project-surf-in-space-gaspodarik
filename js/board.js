'use strict';

game.board = {
  game,
  cometSize: 40,
  demonSize: 80,
  comets: [],
  explosions: [],
  demons: [],
  random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  },
  create() {
    this.createComet();
    this.createDemon();
  },
  createComet() {
    if (this.game.timer % 20 === 0) {
      this.comets.push({
        size: this.random(20, 40),
        posX: this.random(0, this.game.canvas.width),
        posY: -this.cometSize,
        speedX: 0,
        speedY: this.random(1, 3),
        flag: 0,
        angle: 0,
        rotateAngle: Math.random() * 0.2 - 0.1
      });
    }
  },
  createDemon() {
    if (this.game.timer % 200 === 0) {
      this.demons.push({
        size: this.demonSize,
        posX: (this.game.canvas.width - this.demonSize) * this.random(0, 1),
        posY: -this.demonSize,
        speedX: 4,
        speedY: 2,
        flag: 0
      });
    }
  },
  updateComet() {
    this.comets.forEach((comet, i, a) => {
      comet.posX += comet.speedX;
      comet.posY += comet.speedY;
      comet.angle += comet.rotateAngle;

      if (comet.posX >= this.game.canvas.width - comet.size || comet.posX < 0) {
        comet.speedX = -comet.speedX;
      }
      if (comet.posY > this.game.canvas.height) {
        this.comets.splice(i, 1);
      }
      if (comet.posX + comet.size >= this.game.sprite.mouseX - this.game.sprite.spriteSize / 4 && comet.posX <= this.game.sprite.mouseX + this.game.sprite.spriteSize / 4 && comet.posY + comet.size >= this.game.sprite.mouseY - this.game.sprite.spriteSize / 4 && comet.posY <= this.game.sprite.mouseY + this.game.sprite.spriteSize / 4) {
        this.game.stop();
      }
      this.game.sprite.shots.forEach((shot, j, b) => {
        if (Math.abs(comet.posX - shot.posX) < comet.size && Math.abs(comet.posY - shot.posY) < comet.size) {
          this.explosions.push({
            posX: comet.posX - comet.size / 2,
            posY: comet.posY - comet.size / 2,
            animX: 0,
            animY: 0
          });
          comet.flag = 1;
          ++this.game.score;
          this.game.sprite.shots.splice(j, 1);
        }
      })
    });
  },
  updateDemon() {
    this.demons.forEach((demon, i, a) => {
      demon.posX += demon.speedX;
      demon.posY += demon.speedY;

      if (demon.posX > this.game.canvas.width - demon.size || demon.posX < 0) {
        demon.speedX = -demon.speedX;
      }
      if (demon.posY > this.game.canvas.height) {
        this.demons.splice(i, 1);
      }
      if (demon.posX + demon.size >= this.game.sprite.mouseX - this.game.sprite.spriteSize / 4 && demon.posX <= this.game.sprite.mouseX + this.game.sprite.spriteSize / 4 && demon.posY + demon.size >= this.game.sprite.mouseY - this.game.sprite.spriteSize / 4 && demon.posY <= this.game.sprite.mouseY + this.game.sprite.spriteSize / 4) {
        this.game.stop();
      }
      this.game.sprite.shots.forEach((shot, j, b) => {
        if (Math.abs(demon.posX - shot.posX) < demon.size && Math.abs(demon.posY - shot.posY) < demon.size) {
          this.explosions.push({
            posX: demon.posX - demon.size / 2,
            posY: demon.posY - demon.size / 2,
            animX: 0,
            animY: 0
          });
          demon.flag = 1;
          this.game.score += 10;
          this.game.sprite.shots.splice(j, 1);
        }
      });
    });
  },
  update() {
    this.updateComet();
    this.updateDemon();
    this.interaction();
    if (this.isSpriteShotDown(this.demons) || this.isSpriteShotDown(this.comets)) {
      this.game.stop();
    }
  },
  interaction() {
    this.createExplosion();
    this.removeEntity(this.demons);
    this.removeEntity(this.comets);
  },
  createExplosion() {
    this.explosions.forEach((explosion, i, a) => {
      explosion.animX += 0.1;
      if (explosion.animX > 5) {
        explosion.animY++;
        explosion = 0;
      }
      if (explosion.animY > 4) {
        this.explosions.splice(i, 1);
      }
    });
  },
  isSpriteShotDown(entity) {
    return entity.posX + entity.size >= this.game.sprite.mouseX - this.game.spriteSize / 4 && entity.posX <= this.game.sprite.mouseX + this.game.spriteSize / 4 && entity.posY + entity.size >= this.game.sprite.mouseY - this.game.spriteSize / 4 && entity.posY <= this.game.sprite.mouseY + this.game.spriteSize / 4;
  },
  removeEntity(entity) {
    entity.forEach((ent, j, a) => {
      if (ent.flag === 1) entity.splice(j, 1);
    })
  },
  render() {
    this.comets.forEach(comet => {
      this.game.context.save();
      this.game.context.translate(comet.posX + comet.size / 2, comet.posY + comet.size / 2);
      this.game.context.rotate(comet.angle);
      this.game.context.drawImage(this.game.sprites.cometImg, -comet.size / 2, -comet.size / 2, comet.size, comet.size);
      this.game.context.restore();
    });
    this.explosions.forEach(explosion => this.game.context.drawImage(this.game.sprites.explosionImg, 96 * Math.floor(explosion.animX), 96 * Math.floor(explosion.animY), 96, 96, explosion.posX, explosion.posY, 100, 100));
    this.demons.forEach(demon => this.game.context.drawImage(this.game.sprites.demonImg, demon.posX, demon.posY, demon.size, demon.size));
  }
};




