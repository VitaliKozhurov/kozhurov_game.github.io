/*===== Переменные ======*/
let gameIsStart = false;
let gameIsEnd = false;
let widthScr // В переменную кладем значенеи ширины отоброжаемой области
let heightScr // В переменную кладем значенеи высоты отоброжаемой области
if (document.body.offsetWidth > document.body.offsetHeight) {
   widthScr = document.body.offsetWidth;
   heightScr = document.body.offsetHeight;
} else {
   heightScr = document.body.offsetWidth;
   widthScr = document.body.offsetHeight;
}

const playerSpeedX = 8; // Скорость персонажа по оси X
const playerSpeedXMob = 4; // Скорость персонажа для мобильных устройств
const moveLeftLim = widthScr / 25; // Ограничение по движению влево для персонажа
const platformSpeed = 6; // Скорость движения платформы
const platformSpeedMob = 4; // Скорость движения платформы для моб. устройств
let progressX = 0; // Переменная, в которую будем записывать пройденную дистанцию персонажа, чтобы отслеживать конец игры
let scoreX = 0; // Переменная для очков
let score;
const progressStep = 3; // Шаг,как будет изменяться прогресс при движении персонажа
const skySpeed = 1; // Скорость движения облаков
const playerW = widthScr / 12; // Ширина персонажа
const playerH = heightScr / 4; // Высота персонажа
const spikeW = widthScr / 12; // Ширина шипов
const spikeH = heightScr / 3; // Высота шипов
const heartW = heightScr / 12; // Высота индикатора здоровья
const heartH = heightScr / 12; // Высота индикатора здоровья
const coinS = heightScr / 10; // Размер монеты
const finishS = heightScr / 6; // Размер финальной точки
const platformW = widthScr / 5;  // Ширина платформы
const platformH = heightScr / 10;  // Высота платформы
const groundW = widthScr / 8;  // Ширина поверхности земли
const groundH = widthScr / 9;  // Высота поверхности земли
const skyW = widthScr / 4;  // Ширина облаков
const skyH = heightScr / 6; //Высота облаков
const skyBW = widthScr * 0.66;  //Растояние между облаками
const limMoveRight = widthScr * 0.35; // Лимит по движению вправо
const bulletsR = []; // Массив для пуль, которые летят вправо
const bulletsL = []; // Массив для пуль, которые летят влево
const touchElH = heightScr / 6; // Высота тач элемента
const touchElW = widthScr / 10; //Ширина тач элемента
let enemyTimer // таймер для запуска анимации врага
let heroTimer // таймер для запуска анимации персонажа
const fontRatio = heightScr / 40; // Шрифт в зависимости от размера экрана
let startTime; // Время начала игры
let finishTime; // Время финиша игры
let anim // Идентификатор для анимации
// Создаем объект, который будет определять текущее состояние персонажа, в зависимости от значений, персонаж будут изменять свои координаты (т.е. двигаться)
const statePerson = {
   moveRight: false,
   moveLeft: false,
   moveUp: false,
   isRight: true,
   shot: false,
}
// Объект состояния врага
const stateEnemy = {
   moveRight: true,
   animation: false,
}

/*====== Работа с CANVAS =======*/
const canvas = document.getElementById('canvas'); // Находим тег canvas
canvas.width = widthScr;  // Определяем, ширину canvas равную ширине экрана
canvas.height = heightScr;  // Определяем, высоту canvas равную высоте экрана
const context = canvas.getContext('2d'); // Получаем контекст для дальнейшей работы с canvas

/*====== Создаем обьекты по описанным классам ======*/
let player;
let background;
let enemys; // Массив для объектов врагов
let platforms; // Массив, элементы которого будут объектами класса Platforms
let ground; // Переменная, будет содержать в себе массив, элементы которого будут объектами класса Ground
let skyImg;  // Создаем массив, для облаков класс Sky
let health; // Массив индикаторов здоровья
let coins; // Массива монет
let spikes; // Переменная, для хранения массива с шипами
let finishTarget; // Обьект, финишная точка игры
let arrowRight; // Стрелка управления вправо
let arrowLeft; // Стрелка управления влево
let target; // Элемент для выстрела

/*====== Функция, которая будет устанавливать исходное состояние и будет все возвращать к исходному состоянию игры при проигрыши =======*/
function setStateGame() {
   player = new Hero(); // Создаем объект класса Hero
   player.animation(); // Аннимация игрока
   background = new Figure(); //  Создаем  фон игры
   startTime = Date.now();
   gameIsEnd = false;
   audioMain(); // Запускаем основную мелодию игры
   // Создаем массивы для объектов
   enemys = [];
   platforms = [];
   ground = [];
   skyImg = [];
   health = [];
   coins = [];
   spikes = [];
   // Создаем поверхность земли и флаг финиш
   for (i = 0; i < 125; i++) {
      // Условие создания ям "смерти"
      if ((i >= 10 && i <= 16) || (i >= 18 && i <= 19) || (i >= 29 && i <= 35) || (i >= 42 && i <= 43) || (i >= 48 && i <= 53) || (i >= 62 && i <= 63) || (i >= 65 && i <= 72) || (i >= 84 && i <= 86)) {
         continue
      }
      if (i === 24 || i === 34 || i === 58 || i === 76 || i === 96) {
         spikes.push(new Spike((0.85 * i) * groundW - 10, heightScr - spikeH + 15 - groundH))
      }
      // Добаляем поверхность земли в наш массив
      ground.push(new Ground((0.85 * i) * groundW - 10, heightScr - groundH));
      // Выбираем точку в которой игра заканчивается и устанавливаем там флаг финиш
      if (i === 120) finishTarget = new Finish((0.85 * i) * groundW - 10, heightScr - finishS - groundH);
   }
   // платформы, монеты, облака, враги
   for (i = 0; i < 11; i++) {
      if (i % 2 === 0) {
         platforms.push(new Platforms((i + 1) * widthScr, heightScr / 2 - platformH));
         coins.push(new Coins((i + 1) * widthScr + platformW / 3, heightScr / 2 - platformH - coinS));
         platforms.push(new Platforms((i + 1) * widthScr + 2 * platformW, heightScr / 2 + 3 * platformH / 4))
         enemys.push(new Enemy(((i + 1) * widthScr + 2 * platformW + 20), heightScr / 2 + 3 * platformH / 4 - playerH))
      }

      if (i >= 0 && i <= 2) {
         skyImg.push(new Sky(i * 395, 0, i * skyBW))
      }
      if (i >= 3 && i <= 5) {
         skyImg.push(new Sky((i - 3) * 395, 220, i * skyBW))
      }
      if (i >= 6 && i <= 8) {
         skyImg.push(new Sky((i - 6) * 395, 440, i * skyBW))
      }
      if (i >= 9 && i <= 11) {
         skyImg.push(new Sky((i - 9) * 395, 660, i * skyBW))
      }
   }
   // элементы здоровья
   for (i = 0; i < 3; i++) {
      health.push(new Health(1.2 * i + 1))
   }
   // Объекты для сенсорного управления 
   arrowRight = new TouchElem(imageArR, widthScr - 1.5 * touchElW, heightScr - 2.5 * touchElH); // Стрелка управления вправо
   arrowLeft = new TouchElem(imageArL, 0.5 * touchElW, heightScr - 2.5 * touchElH); // Стрелка управления влево
   target = new TouchElem(imageTarget, widthScr - 3 * touchElW, heightScr - 1.5 * touchElH) // Элемент для выстрела
}
// Функция для запуска виброотклика
function vibro(longFlag) {
   // есть поддержка Vibration API?
   if (navigator.vibrate) {
      // вибрация 100мс
      if (!longFlag) {
         window.navigator.vibrate(100);
      }
      else {
         // вибрация 3 раза по 100мс с паузами 50мс
         window.navigator.vibrate([100, 50, 100, 50, 100]);
      }
   }
}

// Планируем запуск функции tick при смене кадра анимации
function tick() {
   if (!gameIsStart) {
      setStateGame(); // Устанавливаем всё в исходное состояние
      startGame(); // Активируем управление
      gameIsStart = true;
      gameIsEnd = false;
   }
   // Движение вправо + условие (если позиция персонажа достигает определленой координаты на экране, то он останавливается в этой точке)
   if (statePerson.moveRight && player.posX < limMoveRight) {
      (widthScr < 1000) ? player.posX += playerSpeedXMob : player.posX += playerSpeedX; // Для мобильных устройств скорость уменьшаем
   }
   // Движение влево
   if (statePerson.moveLeft && player.posX > moveLeftLim) {
      (widthScr < 1000) ? player.posX -= playerSpeedXMob : player.posX -= playerSpeedX;
   }

   // Эффект движения при перемещении персонажа, так если нажата кнопка движения платформа, облака, элементы поверхности земли начнут изменять свои координаты в обратную сторону (методом forEach устанавливаем правило условие для каждого элемента)
   if (statePerson.moveRight && player.posX > limMoveRight) {
      progressX += progressStep;
      scoreX += progressStep;
      platforms.forEach(platform => (widthScr < 1000) ? platform.posX -= platformSpeedMob : platform.posX -= platformSpeed);
      ground.forEach(elem => (widthScr < 1000) ? elem.posX -= platformSpeedMob : elem.posX -= platformSpeed);
      skyImg.forEach(elem => elem.posX -= skySpeed);
      enemys.forEach(enemy => (widthScr < 1000) ? enemy.posX -= platformSpeedMob : enemy.posX -= platformSpeed);
      coins.forEach(coin => (widthScr < 1000) ? coin.posX -= platformSpeedMob : coin.posX -= platformSpeed);
      spikes.forEach(spike => (widthScr < 1000) ? spike.posX -= platformSpeedMob : spike.posX -= platformSpeed);
      (widthScr < 1000) ? finishTarget.posX -= platformSpeedMob : finishTarget.posX -= platformSpeed;
   }
   else if (statePerson.moveLeft && player.posX < moveLeftLim && progressX > 0) {
      progressX -= progressStep;
      platforms.forEach(platform => (widthScr < 1000) ? platform.posX += platformSpeedMob : platform.posX += platformSpeed);
      ground.forEach(elem => (widthScr < 1000) ? elem.posX += platformSpeedMob : elem.posX += platformSpeed);
      skyImg.forEach(elem => elem.posX += skySpeed);
      enemys.forEach(enemy => (widthScr < 1000) ? enemy.posX += platformSpeedMob : enemy.posX += platformSpeed);
      coins.forEach(coin => (widthScr < 1000) ? coin.posX += platformSpeedMob : coin.posX += platformSpeed);
      spikes.forEach(spike => (widthScr < 1000) ? spike.posX += platformSpeedMob : spike.posX += platformSpeed);
      (widthScr < 1000) ? finishTarget.posX += platformSpeedMob : finishTarget.posX += platformSpeed;
   }

   // Реакция на столкновение с платформами (устанавливаем правило для кадой платформы)
   platforms.forEach(platform => {
      if (player.posY + player.height < platform.posY && player.posY + player.height + player.speedY >= platform.posY && player.posX + player.width - 20 >= platform.posX && player.posX + 20 <= platform.posX + platform.width) {
         player.speedY = 0;
      }
   })
   // Условие движения по поверхности (земле)
   ground.forEach(elem => {
      if (player.posY + player.height < elem.posY && player.posY + player.height + player.speedY >= elem.posY && player.posX + player.width - 20 >= elem.posX && player.posX + 20 <= elem.posX + elem.width) {
         player.speedY = 0;
      }
   });

   // Описываем условие как и где будет двигаться противник
   for (i = 0; i < enemys.length; i++) {
      if (enemys[i].posX + enemys[i].width >= platforms[2 * i + 1].posX + platforms[2 * i + 1].width) {
         enemys[i].speedX = -enemys[i].speedX;
         stateEnemy.moveRight = false;
         enemys[i].currImage = enemys[i].imageEnemyML;  // Смена картинки на другую, направление движения
         enemys[i].frame = 0;
      } else if (enemys[i].posX <= platforms[2 * i + 1].posX) {
         enemys[i].speedX = -enemys[i].speedX;
         stateEnemy.moveRight = true;
         enemys[i].currImage = enemys[i].imageEnemyMR;  // Смена картинки на другую, направление движения
         enemys[i].frame = 9;
      }
   }
   // Описываем  реакцию на столкновение с противником
   enemys.forEach(enemy => {
      if (player.posX + player.width / 2 > enemy.posX && player.posX < enemy.posX + enemy.width / 2 && player.posY + player.height > enemy.posY + enemy.height / 2 && player.posY < enemy.posY + enemy.height / 2) {
         // Если персонаж находится слева, то его отбрасывает влево
         if (player.posX < enemy.posX) {
            player.posX -= player.width;
         }
         // Если персонаж находится справа, то его отбрасывает вправо
         if (player.posX > enemy.posX) {
            player.posX += player.width;
         }
         audioPunch();
         vibro(false)
         player.posY -= player.width;
         health.pop()
      }
   })
   // Описываем реакцию, на столкновение с ледяным шипом
   spikes.forEach(spike => {
      if (player.posX + player.width / 2 > spike.posX && player.posX < spike.posX + spike.width / 2 && player.posY + player.height > spike.posY + spike.height / 2 && player.posY < spike.posY + spike.height / 2) {
         // Если персонаж находится слева, то его отбрасывает влево
         if (player.posX < spike.posX) {
            player.posX -= player.width;
         }
         // Если персонаж находится справа, то его отбрасывает вправо
         if (player.posX > spike.posX) {
            player.posX += player.width;
         }
         audioPunch();
         vibro(false)
         player.posY -= player.width;
         health.pop()
      }
   })
   // Описываем реакцию при столкновении с монетой
   coins.forEach(coin => {
      if (player.posX + player.width / 2 > coin.posX && player.posX < coin.posX + coin.width / 2 && player.posY + player.height > coin.height && player.posY < coin.posY + coin.height) {
         audioCoin();
         scoreX += 1800;
         coins.splice(coins.indexOf(coin), 1)
      }
   })

   // Движение вверх (прыжок)
   if (statePerson.moveUp && player.speedY === 0) {
      // Установили правило как высоко совершается прыжок в зависимости от экрана
      (heightScr < 600) ? player.speedY -= 18 : player.speedY -= 25;
   }

   // Перерисовываем холст при смене кадра анимации
   context.clearRect(0, 0, widthScr, heightScr);
   // Метод создает фоновое изображение
   background.createBackground();
   // Создаем облака
   skyImg.forEach(elem => elem.createCloud());
   // Вызываем метод, для обновления координат персонажа
   player.updatePosition();
   // Вызываем метод объекта, который отрисовывает платформу в координатах, которые мы определили ранее при описании класса
   platforms.forEach(platform => platform.createPlatform());
   spikes.forEach(spike => spike.createSpike()); // Отрисовка шипов
   // Вызываем метод, который отрисовывает поверхность земли
   ground.forEach(elem => elem.createGround());
   health.forEach(el => el.createHeart()); // Отрисовка здоровья
   coins.forEach(coin => coin.createCoin()); // Отрисовка монет
   player.drawScore(); // Отрисовка очков
   finishTarget.createFinish(); // Отрисовка флага финиш
   // Два массива пуль, для полета влево и для полета вправо
   if (bulletsR) {
      bulletsR.forEach(bullet => {
         bullet.updateBulletR()
         // Описываем поведение при попадании пули во врага
         enemys.forEach(enemy => {
            if (bullet.posX + bullet.width > enemy.posX + enemy.width / 4 && bullet.posX < enemy.posX + enemy.width && bullet.posY + bullet.height > enemy.posY && bullet.posY < enemy.posY + enemy.height) {
               audioHit(); // Звук при попадании в противника
               enemy.shot++; // Увеличиваем счетчик попаданий
               bulletsR.splice(bulletsR.indexOf(bullet), 1); // Удаляем из массива только тот элемент, который попал во врага
            }
         })
      })
   }
   if (bulletsL) {
      bulletsL.forEach(bullet => {
         bullet.updateBulletL()
         enemys.forEach(enemy => {
            if (bullet.posX < enemy.posX + enemy.width / 2 && bullet.posX + bullet.width > enemy.posX && bullet.posY + 2 * bullet.height > enemy.posY && bullet.posY < enemy.posY + enemy.height) {
               audioHit(); // Звук при попадании в противника
               enemy.shot++; // Увеличиваем счетчик попаданий
               bulletsL.splice(bulletsL.indexOf(bullet), 1); // Удаляем из массива только тот элемент, который попал во врага
            }
         })

      })
   }
   enemys.forEach(enemy => {
      enemy.createEnemy(); // Отрисовка врага
      enemy.updatePosition(); // Обновляем позицию
      // Условие по которому будет производиться запуск анимации и таймера
      if (Math.abs(enemy.posX - player.posX) < widthScr * 0.95 && !stateEnemy.animation) {
         enemy.animation();
         stateEnemy.animation = true;
      }
      // Условие остановки таймера
      if (Math.abs(player.posX - enemy.posX) > widthScr * 0.95 && Math.abs(player.posX - enemy.posX) < widthScr) {
         clearInterval(enemyTimer);
         stateEnemy.animation = false;
      }

      // Условие уничтожения противника, если в него попали больше двух раз, то запускаем анимацию взрыва и убираем противника
      if (enemy.shot > 2 && enemy.secondFrameLine < 8) {
         if (!enemy.destroyState) {
            audioDestroy();
            scoreX += 2100;
            clearInterval(enemyTimer);
         }
         enemy.destroy();
         enemy.destroyState = true;
         enemy.width = 0;
         enemy.height = 0;
         enemy.posY = heightScr;
      }
   })
   // Стрелки для сенсорного управления отрисовывваем в том случае, если устройство поддерживает тачскрин
   if ('ontouchstart' in window) {
      arrowRight.createArrowEl();
      arrowLeft.createArrowEl();
      target.createTarget();
   }

   // Вызываем метод объекта, который отрисовывает персонаж в координатах, которые мы определили ранее при описании класса
   player.createHero();

   // Событие выигрыша
   if (player.posX > finishTarget.posX && !gameIsEnd) {
      finishTime = Date.now();
      let diffTime = (finishTime - startTime) / 1000; // Время, за которое пройден уровень игры
      if (diffTime < 70) {
         scoreX += 300 * 34
      } else if (diffTime < 75) {
         scoreX += 300 * 30
      } else if (diffTime < 80) {
         scoreX += 300 * 26
      } else if (diffTime < 85) {
         scoreX += 300 * 22
      } else if (diffTime < 90) {
         scoreX += 300 * 18
      } else if (diffTime < 95) {
         scoreX += 300 * 14
      } else if (diffTime > 100) {
         scoreX += 300 * 10
      }
      player.drawScore()
      score = player.score;
      gameIsEnd = true;
      gameIsStart = false;
      scoreX = 0;
      changeTable();
      stopGame();
      audioWin();
      winDiv.style.display = 'flex';
      winInfo.textContent += `Количество очков, заработанных Вами: ${score}`;
   }
   /* console.log(enemys[1].frame) */
   // Событие проигрыша
   if (player.posY > canvas.height || health.length === 0) {
      audioLoose();
      vibro(true);
      score = player.score;
      changeTable();
      // При проигрыше устанавливаем персонаж в исходное состояние и запускаем функцию, которая обновит все элементы на странице
      progressX = 0;
      scoreX = 0;
      player.posX = 50;
      player.posY = 50;
      clearInterval(enemyTimer);
      setStateGame()
      // Чтобы при падении после проигрыша, позиция персонажа приняла исходный вариант
      player.currImage = player.imageMR
      player.frameFirstLine = 3;
      player.frameSecondLine = 0;
   }
   if (!gameIsEnd) {
      anim = requestAnimationFrame(tick);
   } else cancelAnimationFrame(anim)
}

//=======УПРАВЛЕНИЕ========//
function keyDown(eo) {
   eo = eo || window.Event;
   if ((eo.code === 'KeyD' || eo.code === 'ArrowRight')) {
      statePerson.moveRight = true;
      statePerson.isRight = true;
      statePerson.moveLeft = false;
      player.currImage = player.imageMR;
   }
   if ((eo.code === 'KeyA' || eo.code === 'ArrowLeft')) {
      statePerson.moveLeft = true;
      statePerson.moveRight = false;
      statePerson.isRight = false;
      player.currImage = player.imageML;
   }

   if (eo.code === 'KeyW' || eo.code === 'ArrowUp') {
      statePerson.moveUp = true;
   }
   if (eo.code === 'Space' && statePerson.isRight && !statePerson.shot) {
      audioShot();
      bulletsR.push(new Bullets);
      statePerson.shot = true;
   } else if (eo.code === 'Space' && !statePerson.isRight && !statePerson.shot) {
      audioShot();
      bulletsL.push(new Bullets);
      statePerson.shot = true;
   }
}
function keyUp(eo) {
   eo = eo || window.Event;
   if (eo.code === 'KeyD' || eo.code === 'ArrowRight') {
      statePerson.moveRight = false;
      player.frameFirstLine = 3;
      player.frameSecondLine = 0;
   }
   if (eo.code === 'KeyA' || eo.code === 'ArrowLeft') {
      statePerson.moveLeft = false;
      player.frameFirstLine = 1;
      player.frameSecondLine = 0;
   }
   if (eo.code === 'KeyW' || eo.code === 'Space' || eo.code === 'ArrowUp') {
      statePerson.moveUp = false;
   }
   if (eo.code === 'Space') {
      statePerson.shot = false;
   }
}
function touchDown(eo) {
   eo = eo || window.Event;
   eo.preventDefault();
   // Реализуем управление персонажа при касании экрана, если касание в область левой стрелки, то движение влево, и наоборот
   if (eo.touches[0].clientX > arrowRight.posX && eo.touches[0].clientX < arrowRight.posX + arrowRight.width && eo.touches[0].clientY > arrowRight.posY && eo.touches[0].clientY < arrowRight.posY + arrowRight.height) {
      statePerson.moveRight = true;
      statePerson.isRight = true;
      player.currImage = player.imageMR;
   }
   if (eo.touches[0].clientX > arrowLeft.posX && eo.touches[0].clientX < arrowLeft.posX + arrowLeft.width && eo.touches[0].clientY > arrowLeft.posY && eo.touches[0].clientY < arrowLeft.posY + arrowLeft.height) {
      statePerson.moveLeft = true;
      statePerson.isRight = false;
      player.currImage = player.imageML
   }
   // Реализация выстрела при нажатии на тач
   if (eo.touches[0].clientX > target.posX && eo.touches[0].clientX < target.posX + target.width && eo.touches[0].clientY > target.posY && eo.touches[0].clientY < target.posY + target.width && statePerson.isRight) {
      audioShot();
      bulletsR.push(new Bullets);
   }
   if (eo.touches[0].clientX > target.posX && eo.touches[0].clientX < target.posX + target.width && eo.touches[0].clientY > target.posY && eo.touches[0].clientY < target.posY + target.width && !statePerson.isRight) {
      audioShot();
      bulletsL.push(new Bullets);
   }
}
function touchUp(eo) {
   eo = eo || window.Event;
   eo.preventDefault();
   if (eo) {
      statePerson.moveRight = false;
      statePerson.moveLeft = false;
   }
   if (statePerson.isRight) {
      player.frameFirstLine = 3;
      player.frameSecondLine = 0;
   } else {
      player.frameFirstLine = 1;
      player.frameSecondLine = 0;
   }
}
function handleTouchStart(eo) {
   eo = eo || window.Event;
   eo.preventDefault();
   if (eo.touches.length !== 1) {
      yDown = eo.touches[1].clientY;
   } else yDown = eo.touches[0].clientY;
   document.addEventListener('touchmove', handleTouchMove, { passive: false });
}
function handleTouchMove(eo) {
   eo = eo || window.Event;
   eo.preventDefault();
   if (!yDown) {
      return;
   }
   if (eo.touches.length !== 1) {
      yUp = eo.touches[1].clientY;
   } else yUp = eo.touches[0].clientY;
   let yDiff = yDown - yUp; // Если положительное значение, то свайп вверх
   if (yDiff > 0) {
      statePerson.moveUp = true
   }
   yDown = null;
};
function handleTouchEnd(eo) {
   eo = eo || window.Event;
   eo.preventDefault();
   document.removeEventListener('touchmove', handleTouchMove);
   statePerson.moveUp = false;
   statePerson.moveRight = false;
}

// Функция, которая "активирует" управление, в зависимости от состояния игры
function startGame() {
   // Добавляем слушатель на события нажатия кнопок клавиатуры
   document.addEventListener('keydown', keyDown);
   // Добавляем слушатель на события отпускания кнопок клавиатуры
   document.addEventListener('keyup', keyUp);
   // Обработчики событий на прикосновения
   document.addEventListener('touchstart', touchDown, { passive: false });
   document.addEventListener('touchend', touchUp, { passive: false });
   // Свайп (прыжок для персонажа)
   document.addEventListener('touchstart', handleTouchStart, { passive: false });
   document.addEventListener('touchend', handleTouchEnd, { passive: false });

}

function stopGame() {
   mainAudio.pause();
   document.removeEventListener('keydown', keyDown);
   document.removeEventListener('keyup', keyUp);
   document.removeEventListener('touchstart', touchDown, { passive: false });
   document.removeEventListener('touchend', touchUp, { passive: false });
   document.removeEventListener('touchstart', handleTouchStart, { passive: false });
   document.removeEventListener('touchend', handleTouchEnd, { passive: false })
   statePerson.moveRight = false;
   statePerson.moveLeft = false;
   statePerson.moveUp = false;
   statePerson.isRight = true;
   statePerson.shot = false;
   player = null;
   platforms = null;
   ground = null;
   skyImg = null;
   enemys = null;
   coins = null;
   health = null;
   arrowRight = null;
   arrowLeft = null;
   target = null;
}
