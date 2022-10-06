const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php"; // указываем URL сервиса к которому будем обращаться
let records; // Переменная в которой будут массив с таблицей рекордов
let updatePassword; // Переменная в которой будем хранить пароль для блокирования строки на момент её изменения
const stringName = 'KOZHUROV_GAME_TABLEOFRECORDS'; // Указываем имя по которому будем обращаться к базе данных

// Описываем функию, которая будет считывать с сервера информацию о рекордах
function refreshTable() {
   $.ajax({
      url: ajaxHandlerScript,
      type: 'POST', dataType: 'json',
      data: { f: 'READ', n: stringName },
      cache: false,
      success: readReady,
      error: errorHandler
   }
   );
}
// Описываем функцию, которая будет вызываться в случае успешного ответа от сервера
function readReady(callresult) {
   if (callresult.error != undefined)
      console.log(callresult.error);
   else {
      records = [];
      if (callresult.result !== "") {
         // в массив ложим преобразованное JSON содержимое ответа от сервера
         records = JSON.parse(callresult.result);
         // вдруг кто-то сохранил мусор?
         if (!Array.isArray(records))
            records = [];
      }
      // После вызываем функицю, которая содержимое массива будет показывать пользователю
      showRecords();
   }
}
// Функция для отображения таблицы рекордов
function showRecords() {
   let str = ''; // строка для всех рекордов
   // Прохолим по массиву и достаем имя игрока и количество очков
   for (let i = 0; i < records.length; i++) {
      const record = records[i];
      str += (i + 1) + '. ' + escapeHTML(record.name) + ' : ' + record.score + ';' + '<br/>';
   }
   document.getElementById('records').innerHTML = str;
}
// Функция, которая защищает от ввода тегов
function escapeHTML(text) {
   if (!text)
      return text;
   text = text.toString()
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;")
      .split("'").join("&#039;");
   return text;
}

function changeTable() {
   updatePassword = Math.random(); // Получаем специальный пароль
   $.ajax({
      url: ajaxHandlerScript,
      type: 'POST', dataType: 'json',
      data: {
         f: 'LOCKGET', n: stringName,
         p: updatePassword
      },
      cache: false,
      success: lockGetReady,
      error: errorHandler
   }
   );
}
// Функция для чтения строки и её перезаписи
function lockGetReady(callresult) {
   // Событие ошибки
   if (callresult.error !== undefined)
      console.log(callresult.error);
   else {
      records = [];
      if (callresult.result != "") {
         records = JSON.parse(callresult.result);
         // вдруг кто-то сохранил мусор?
         if (!Array.isArray(records))
            records = [];
      }
      const playerName = document.getElementById('userName').value; // Находим имя игрока
      const playerScore = score; // Находим количество очков, которые он заработал
      // проверка, если набрано больше очков чем ранее, то перезаписываем результат, если нет, то ничего не делаем
      for (let i = 0; i < records.length; i++) {
         const record = records[i];
         if (record.name === playerName && record.score < playerScore) {
            records.splice(records.indexOf(record), 1)
         } else if (record.name === playerName && record.score >= playerScore) {
            return
         }
      }
      records.push({ name: playerName, score: playerScore }) // Имя и количество очков добавляем в массив
      // Отсортируем массив, чтобы отображать результат только 10 лучших игроков
      records.sort((x, y) => x.score - y.score).reverse();
      if (records.length > 10) {
         records = records.slice(0, 10)
      };

      showRecords(); // Обновляем таблицу
      // обновляем данные на сервере
      $.ajax({
         url: ajaxHandlerScript,
         type: 'POST', dataType: 'json',
         data: {
            f: 'UPDATE', n: stringName,
            v: JSON.stringify(records), p: updatePassword
         },
         cache: false,
         success: updateReady,
         error: errorHandler
      }
      );
   }
}

function updateReady(callresult) {
   if (callresult.error !== undefined) {
      console.log(callresult.error);
   }
}

function errorHandler(jqXHR, statusStr, errorStr) {
   console.log(statusStr + ' ' + errorStr);
}