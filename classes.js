/*======= КЛАССЫ =======*/
//  Класс игрового персонажа
class Hero {
   constructor() {
      this.posX = 50; // Определяем позицию персонажа по оси X
      this.posY = 50; // Определяем позицию персонажа по оси Y
      this.speedX = 0; // Определяем скорость персонажа при движении по оси X
      this.speedY = 1; // Определяем скорость персонажа при движении по оси Y
      this.accelY = 0.8 // Ускорение по оси Y
      this.height = playerH; // Высота персонажа
      this.width = playerW; // Ширина персонажа
      this.imageMR = new Image;  // Изображение при движении вправо
      this.imageMR.src = 'img/moveright.png';
      this.imageML = new Image;  // Изображение при движении влево
      this.imageML.src = 'img/moveleft.png';
      this.frameFirstLine = 3; // Данные для определения кадра изображения персонажа
      this.frameSecondLine = 0;
      this.currImage = this.imageMR; // Текущее изображение
      this.score = 0; // Количество очков
   }

   // Описываем метод, который создает игрока
   createHero() {
      context.drawImage(this.currImage, this.frameFirstLine * 280, this.frameSecondLine * 385, 280, this.frameSecondLine === 0 ? 385 : 335, this.posX, this.posY + 5, this.width, this.height)
   }
   // Метод, который запускает таймер для анимации игрока
   animation() {
      setInterval(() => {
         if (statePerson.moveRight) {
            this.frameFirstLine++;
            if (this.frameFirstLine > 4) {
               this.frameFirstLine = 0;
               if (this.frameSecondLine === 0) {
                  this.frameSecondLine = 1
               } else if (this.frameSecondLine === 1) {
                  this.frameSecondLine = 0;
               }
            }
         }
         if (statePerson.moveLeft) {
            this.frameFirstLine--;
            if (this.frameFirstLine < 0) {
               this.frameFirstLine = 4;
               if (this.frameSecondLine === 0) {
                  this.frameSecondLine = 1
               } else if (this.frameSecondLine === 1) {
                  this.frameSecondLine = 0;
               }
            }
         }
      }, 110)
   }
   // Описываем метод, который обновляет позицию игрока, в зависимости от текущеу скорости
   updatePosition() {
      this.posX += this.speedX;
      this.posY += this.speedY;
      // Условие, если позиция персонажа c учетом скорости по оси Y меньше высоты canvas, то к скорости прибавляем ускорение, иначе скорость равна нулю
      if (this.posY + this.height + this.speedY <= canvas.height) this.speedY += this.accelY;
      /* else this.speedY = 0; */
   }
   // Метод, который отрисовывает количество очков
   drawScore() {
      this.score = Math.round(scoreX / 30)
      context.font = `${16 + fontRatio}px Permanent Marker, cursive`;
      context.fillStyle = "#0095DD";
      context.fillText("Score: " + this.score, 3 * fontRatio, 3 * fontRatio);
   }
}

// Класс здоровья
class Health {
   constructor(i) {
      this.i = i;
      this.posX = heartW;
      this.posY = 1.5 * heartH;
      this.width = heartW;
      this.height = heartH;
      this.healthImg = new Image;
      this.healthImg.src = 'img/heart.png';
   }
   createHeart() {
      context.drawImage(this.healthImg, 10, 0, 490, 460, this.posX * this.i, this.posY, this.width, this.height)
   }
}

// Класс монет
class Coins {
   constructor(x, y) {
      this.posX = x;
      this.posY = y;
      this.width = coinS;
      this.height = coinS;
      this.coinImg = new Image;
      this.coinImg.src = 'img/coin.png';
   }
   createCoin() {
      context.drawImage(this.coinImg, 70, 30, 350, 455, this.posX, this.posY, this.width, this.height)
   }
}

// Класс врага
class Enemy {
   constructor(x, y) {
      this.posX = x; // Определяем позицию персонажа по оси X
      this.posY = y; // Определяем позицию персонажа по оси Y
      this.speedX = 0.7; // Определяем скорость персонажа при движении по оси X
      this.height = playerH; // Высота персонажа
      this.width = playerW; // Ширина персонажа
      this.frame = 0; // Текущий кадр
      this.imageEnemyMR = new Image; // Изображение для движения влево
      this.imageEnemyMR.src = 'img/enemy_right.png';
      this.imageEnemyML = new Image; // Изображение для движения вправо
      this.imageEnemyML.src = 'img/enemy_left.png';
      this.currImage = this.imageEnemyMR; // Текущее изображение
      this.shot = 0; // Переменная, которая будет хранить количество попаданий, чтобы определить когда его можно "уничтожить"
      this.destroyImg = new Image; // Изображение для анимации взрыва
      this.destroyImg.src = 'img/destroy.png';
      this.firstFrameLine = 0;
      this.secondFrameLine = 0;
      this.fireWidth = 2 * playerW; // Ширина изображения взрыва
      this.fireHeight = 2 * playerH; // Высота изображения взрыва
      this.destroyState = false; // Статус врага
      this.moveRight = true;
   }
   // Анимация движения врага через установку интервала
   animation() {
      // Запуск таймера для движения врага
      enemyTimer = setInterval(() => {
         if (!this.moveRight) {
            this.frame++;
            if (this.frame > 9) {
               this.frame = 0;
            }
         }
         if (this.moveRight) {
            this.frame--;
            if (this.frame < 0) {
               this.frame = 9;
            }
         }
      }, 110)
   }

   destroy() {
      this.firstFrameLine++;
      if (this.firstFrameLine > 7) {
         this.secondFrameLine++;
         this.firstFrameLine = 0
      }
      context.drawImage(this.destroyImg, this.firstFrameLine * 256, this.secondFrameLine * 256, 256, 256, this.posX - this.fireWidth, this.posY - 2 * this.fireHeight, 2 * this.fireWidth, 2 * this.fireHeight)
   }

   createEnemy() {
      context.drawImage(this.currImage, this.frame * 200 + 1, 0, 198, 300, this.posX, this.posY, this.width, this.height)
   }
   updatePosition() {
      this.posX += this.speedX;
   }
}
// Класс, который создает препятствия в виде шипов
class Spike {
   constructor(x, y) {
      this.posX = x;
      this.posY = y;
      this.width = spikeW;
      this.height = spikeH;
      this.coinImg = new Image;
      this.coinImg.src = 'img/ship.png';
   }
   createSpike() {
      context.drawImage(this.coinImg, 560, 1116, 110, 320, this.posX, this.posY, this.width, this.height)
   }
}

// Класс снарядов
class Bullets {
   constructor() {
      this.posX = player.posX + playerW / 2;
      this.posY = player.posY + playerH / 2;
      this.imageBall = new Image;
      this.imageBall.src = 'img/ball.png';
      this.width = heightScr / 30;
      this.height = heightScr / 30;
   }
   updateBulletR() {
      if (this.posX > widthScr) {
         bulletsR.shift()
      }
      this.posX += 7;
      context.drawImage(this.imageBall, 0, 0, 800, 800, this.posX, this.posY, this.width, this.height);
   }
   updateBulletL() {
      if (this.posX < 0) {
         bulletsL.shift()
      }
      if (statePerson.moveRight) {
         this.posX -= 7 - platformSpeed;
      }
      this.posX -= 7;
      context.drawImage(this.imageBall, 0, 0, 800, 800, this.posX, this.posY, heightScr / 30, heightScr / 30);
   }
}

//  Класс, который описвает платформы на игровом поле
class Platforms {
   constructor(x, y) {
      this.image = new Image;
      this.image.src = 'img/platform.png';
      this.posX = x;  // координата платформы по оси X
      this.posY = y;  // координата платформы по оси Y
      this.width = platformW;
      this.height = platformH;
      this.sW = 510;
      this.sH = 130;
      this.sX = 540;
      this.sY = 380;
   }
   // Описываем метод для создания платформы
   createPlatform() {
      context.drawImage(this.image, this.sX, this.sY, this.sW, this.sH, this.posX, this.posY, this.width, this.height)
   }
}

//  Класс, который описывает поверхность по которой будет перемещаться персонаж
class Ground {
   constructor(x, y) {
      this.image = new Image;
      this.image.src = 'img/platform.png';
      this.sW = 262;
      this.sH = 240;
      this.sX = 460;
      this.sY = 80;
      this.posX = x;  // координата платформы по оси X
      this.posY = y;  // координата платформы по оси Y
      this.width = groundW + 12; // Ширина платформ (+12 убираем зазор между платформами)
      this.height = groundH;
   }
   // Описываем метод для создания поверхности земли
   createGround() {
      context.drawImage(this.image, this.sX, this.sY, this.sW, this.sH, this.posX, this.posY, this.width, this.height)
   }
}

// класс для создания объекта финиш, конец игры
class Finish {
   constructor(x, y) {
      this.posX = x;
      this.posY = y;
      this.width = finishS;
      this.height = finishS;
      this.finishImg = new Image;
      this.finishImg.src = 'img/finish.png';
   }
   // Метод создания флага финиш
   createFinish() {
      context.drawImage(this.finishImg, 90, 0, 335, 515, this.posX, this.posY, this.width, this.height)
   }
}

//  Класс, который описывает другие изображения (фон)
class Figure {
   constructor() {
      this.image = new Image;
      this.image.src = 'img/background.jpg';
      this.posX = 0;
      this.posY = 0;
      this.width = widthScr;
      this.height = heightScr;
   }
   createBackground() {
      context.drawImage(this.image, this.posX, this.posY, this.width, this.height)
   }
}

// Класс для облаков
class Sky {
   constructor(picPosX, picPosY, x) {
      this.image = new Image;
      this.image.src = 'img/cloud.png';
      this.sX = picPosX;
      this.sY = picPosY;
      this.sW = 388;
      this.sH = 220;
      this.posX = x;
      this.posY = skyH;
      this.width = skyW;
      this.height = skyH;
   }
   createCloud() {
      context.drawImage(this.image, this.sX, this.sY, this.sW, this.sH, this.posX, this.posY, this.width, this.height)
   }
}

// Класс для создания TOUCH элементов
class TouchElem {
   constructor(image, posX, posY) {
      this.image = image;
      this.width = touchElW;
      this.height = touchElH;
      this.posX = posX;
      this.posY = posY;
   }
   createArrowEl() {
      context.drawImage(this.image, 65, 140, 390, 240, this.posX, this.posY, this.width, this.height)
   }
   createTarget() {
      context.drawImage(this.image, 0, 0, 512, 512, this.posX, this.posY, this.width, this.width)
   }
}