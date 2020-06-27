game.sprite = {
  game,
  spriteSize: 100,
  //size: this.spriteSize,
  mouseX: 300,//посмотреть размеры
  mouseY: 300,//
  speedX: 5,
  speedY: 5,
  shotSize: 50,
  shots: [],
  create() {
    this.createShot();
  },
  createShot() {
    if (this.game.timer % 20 === 0) {
      this.shots.push({size: this.shotSize, posX: this.mouseX - 20, posY: this.mouseY - 70, speedX: 0, speedY: -5})
    }
  },
  update() {
    this.updateShot();
  },
  updateShot() {
    this.shots.forEach((shot, i, a) => {
      shot.posY += shot.speedY;
      //this.game.board.shotDownEntity(this.game.board.demons, i, shot);
      //this.game.board.shotDownEntity(this.game.board.comets, i, shot);
      if (shot.posY < -50) this.shots.splice(i, 1);
    });
  },
 /* spriteOnMouseMove(event) {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
  },*/
  spriteOnTouchMove(event) {
    event.preventDefault();
    this.mouseX = event.touches[0].clientX;
    this.mouseY = event.touches[0].clientY;
  },
  moveDown() {
    this.mouseY += this.speedY;
    if (this.mouseY + this.spriteSize / 2 >= game.canvas.height) {
      this.mouseY = game.canvas.height - this.spriteSize / 2;
    }
  },
  moveUp() {
    this.mouseY -= this.speedY;
    if (this.mouseY - this.spriteSize / 2 < 0) {
      this.mouseY = this.spriteSize / 2;
    }
  },
  moveLeft() {
    this.mouseX -= this.speedX;
    if (this.mouseX - this.spriteSize / 2 < 0) {
      this.mouseX = this.spriteSize / 2;
    }
  },
  moveRight() {
    this.mouseX += this.speedX;
    if (this.mouseX + this.spriteSize / 2 >= game.canvas.width) {
      this.mouseX = game.canvas.width - this.spriteSize / 2;
    }
  },
  spriteOnKeydown(event) {
    switch (event.code) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
    }
  },
  render() {
    this.game.context.drawImage(this.game.sprites.spriteImg, this.mouseX - this.spriteSize / 2, this.mouseY - this.spriteSize / 2, this.spriteSize, this.spriteSize);
    this.shots.forEach(shot => this.game.context.drawImage(this.game.sprites.shotImg, shot.posX, shot.posY, shot.size, shot.size));
  },

};



