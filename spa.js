window.addEventListener('hashchange', switchToStateFromURLHash)

let SPAState = {}; // Объект состояния страницы

const mainPageButton = document.getElementById('mainPage'); // Кнопка перехода в главное меню
const gamePageButton = document.getElementById('gamePage'); // Кнопка для начала игры
const rulesPageButton = document.getElementById('rulesPage'); // Кнопка просмотра правил игры
const scorePageButton = document.getElementById('scorePage'); // Кнопка просмотра таблицы рекордов

const mainDiv = document.getElementById('main'); // Див, где будет отображаться главное меню
const playDiv = document.getElementById('game'); // Див, где будет отображаться сама игра
const rulesDiv = document.getElementById('rules'); // Див, где будет отображаться правила игры
const scoreDiv = document.getElementById('records'); // Див, где будет отображаться таблица рекордов
const nameDiv = document.getElementById('div_name'); // Див в котором будет запрос на ввод имени
const infoDiv = document.getElementById('info'); // Див, который в котором будет выводится отладочная информация
let userName = document.getElementById('userName'); // Инпут для ввода имени игрока
const winDiv = document.getElementById('win'); // Див, который появляется после победы
const closeWin = document.getElementById('close_window'); // Для закрытия окна выйгрыша
const winInfo = document.getElementById('win_info'); // Информационное сообщение о победе
userName.addEventListener('touchstart', () => userName.focus());
let closeGame;
// Функция выбора состояния исходя из закладки страницы
function switchToStateFromURLHash() {
   const URLHash = window.location.hash; //Значение закладки
   const stateStr = URLHash.substr(1);  // Убираем из закладки хеш
   if (stateStr !== "") {
      SPAState = { pagename: stateStr };
   }
   else
      SPAState = { pagename: 'Main' }; // Иначе устанавливаем значение по-умолчанию (главная страница)
   switch (SPAState.pagename) {
      case 'Main':
         refreshTable();
         mainDiv.style.display = 'block';
         nameDiv.style.display = 'block';
         playDiv.style.display = 'none';
         rulesDiv.style.display = 'none';
         scoreDiv.style.display = 'none';
         if (gameIsStart) {
            closeGame = confirm('В случае ухода со страницы Вы прекратите игровой процесс')
            if (closeGame) {
               cancelAnimationFrame(anim);
               stopGame();
               gameIsStart = false;
            } else switchToState({ pagename: 'Game' });
         }
         break;
      case 'Game':
         mainDiv.style.display = 'none';
         nameDiv.style.display = 'none';
         playDiv.style.display = 'block';
         rulesDiv.style.display = 'none';
         scoreDiv.style.display = 'none';
         if (userName.value === '' && !gameIsStart) {
            switchToState({ pagename: 'Main' });
         }

         break;
      case 'Rules':
         mainDiv.style.display = 'block';
         nameDiv.style.display = 'none';
         playDiv.style.display = 'none';
         rulesDiv.style.display = 'block';
         scoreDiv.style.display = 'none';
         break;
      case 'Records':
         refreshTable(); // Обновляем таблицу рекордов
         mainDiv.style.display = 'block';
         nameDiv.style.display = 'none';
         playDiv.style.display = 'none';
         rulesDiv.style.display = 'none';
         scoreDiv.style.display = 'block';
         break;
   }
}
// Функция установки состояния (содержимого) закладки
function switchToState(newState) {
   let stateStr = newState.pagename;
   location.hash = stateStr;
}

// Главное меню
mainPageButton.onclick = function (EO) {
   switchToState({ pagename: 'Main' });
   EO.preventDefault();
}
mainPageButton.ontouchstart = function (EO) {
   switchToState({ pagename: 'Main' });
   EO.preventDefault();
}

// Начало игры
gamePageButton.onclick = function (EO) {
   EO.preventDefault();
   switchToState({ pagename: 'Game' })
   // Проверка на ввод данных имени игрока
   if (userName.value !== '' && !gameIsStart) {
      switchToState({ pagename: 'Game' });
      requestAnimationFrame(tick);
   } else {
      switchToState({ pagename: 'Main' });
      alert('Введите имя игрока!');
   }
}

gamePageButton.ontouchstart = function (EO) {
   // Проверка на ввод данных имени игрока
   if (userName.value !== '' && !gameIsStart) {
      switchToState({ pagename: 'Game' });
      requestAnimationFrame(tick);
   } else {
      // Возврат на главную и информационное сообщение
      switchToState({ pagename: 'Main' });
      alert('Введите имя игрока!');
   }
}

// Правила игры
rulesPageButton.onclick = function (EO) {
   switchToState({ pagename: 'Rules' });
   EO.preventDefault();
}

rulesPageButton.ontouchstart = function (EO) {
   switchToState({ pagename: 'Rules' });
   EO.preventDefault();
}

// Таблица рекордов
scorePageButton.onclick = function (EO) {
   switchToState({ pagename: 'Records' });
   EO.preventDefault();
}

scorePageButton.ontouchstart = function (EO) {
   switchToState({ pagename: 'Records' });
   EO.preventDefault();
}
// Предупреждение при перезагрузке страницы
window.onbeforeunload = (eo) => {
   eo = eo || window.Event;
   if (gameIsStart) {
      eo.returnValue = "В случае перезагрузки страницы прогресс игры будет утрачен!";
   }
}
// События, нажатия (касания) для закрытия окна, в случае победы
closeWin.addEventListener('click', () => {
   winDiv.style.display = 'none';
   winAudio.pause();
   switchToState({ pagename: 'Main' });
})

closeWin.addEventListener('touchstart', () => {
   winDiv.style.display = 'none';
   winAudio.pause();
   switchToState({ pagename: 'Main' });
})
switchToStateFromURLHash();

// Описываем поведение окна браузера при ресайзе, случай, когда ширина меньше высоты
if (document.body.offsetWidth < document.body.offsetHeight) {
   infoDiv.style.display = 'block';
   mainDiv.style.display = 'none';
   playDiv.style.display = 'none';
   rulesDiv.style.display = 'none';
   nameDiv.style.display = 'none';
   scoreDiv.style.display = 'none';
}
// Описываем поведение, в случае если ориентация устройства портретная, для удобства, необходимо только альбомная ориентация
window.addEventListener('resize', () => {
   if (document.body.offsetWidth < document.body.offsetHeight) {
      infoDiv.style.display = 'block';
      mainDiv.style.display = 'none';
      playDiv.style.display = 'none';
      rulesDiv.style.display = 'none';
      nameDiv.style.display = 'none';
      scoreDiv.style.display = 'none';
   }
   if (document.body.offsetWidth > document.body.offsetHeight) {
      infoDiv.style.display = 'none';
      if (gameIsStart) {
         playDiv.style.display = 'block';
      } else if (location.hash === '#Main') {
         mainDiv.style.display = 'block';
         nameDiv.style.display = 'block';
      } else if (location.hash === '#Rules') {
         mainDiv.style.display = 'block';
         rulesDiv.style.display = 'block';
      } else if (location.hash === '#Records') {
         mainDiv.style.display = 'block';
         scoreDiv.style.display = 'block';
      }
   }
})
