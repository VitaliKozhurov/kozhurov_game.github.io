// Изображение для стрелки вправо
const imageArR = new Image;
imageArR.src = 'img/arrowRight.png';
// Изображение для стрелки влево
const imageArL = new Image;
imageArL.src = 'img/arrowLeft.png';
const imageTarget = new Image;
imageTarget.src = 'img/target.png';

// Звуки
const looseAudio = new Audio;
looseAudio.src = 'sound/loose.mp3';
looseAudio.volume = 0.5;
const shotAudio = new Audio;
shotAudio.src = 'sound/shot.mp3'
const hitAudio = new Audio;
hitAudio.src = 'sound/hit.mp3';
hitAudio.volume = 0.3;
const punchAudio = new Audio;
punchAudio.src = 'sound/punch.mp3';
punchAudio.volume = 0.5;
const destroyAudio = new Audio;
destroyAudio.src = 'sound/destroy.mp3';
destroyAudio.volume = 0.5;
const coinAudio = new Audio;
coinAudio.src = 'sound/coin.mp3';
coinAudio.volume = 0.5;
const mainAudio = new Audio;
mainAudio.loop = true;
mainAudio.src = 'sound/game.mp3';
mainAudio.volume = 0.2;
const winAudio = new Audio;
winAudio.src = 'sound/win.mp3';
winAudio.volume = 0.5;
function audioInit() {
   looseAudio.play();
   looseAudio.pause();
   shotAudio.play();
   shotAudio.pause();
   hitAudio.play();
   hitAudio.pause();
   punchAudio.play();
   punchAudio.pause();
   destroyAudio.play();
   destroyAudio.pause();
   coinAudio.play();
   coinAudio.pause();
   mainAudio.play();
   mainAudio.pause();
   winAudio.play();
   winAudio.pause();
   menuAudio.play();
   menuAudio.pause();
}
function audioLoose() {
   looseAudio.currentTime = 0;
   looseAudio.play();
}
function audioShot() {
   shotAudio.currentTime = 0;
   shotAudio.play();
}
function audioHit() {
   hitAudio.currentTime = 0;
   hitAudio.play();
}
function audioPunch() {
   punchAudio.currentTime = 0;
   punchAudio.play();
}
function audioDestroy() {
   destroyAudio.currentTime = 0;
   destroyAudio.play();
}
function audioCoin() {
   coinAudio.currentTime = 0;
   coinAudio.play();
}
function audioMain() {
   mainAudio.currentTime = 0;
   mainAudio.play();
}
function audioWin() {
   winAudio.currentTime = 0;
   winAudio.play();
}
/* audioInit() */