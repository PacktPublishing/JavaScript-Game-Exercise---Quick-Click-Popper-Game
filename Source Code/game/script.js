const playArea = {};
const player = {};
let gameObj;
playArea.stats = document.querySelector(".stats");
playArea.main = document.querySelector(".main");
playArea.game = document.querySelector(".game");
playArea.btns = Array.from(document.querySelectorAll(".btn"));
playArea.page = Array.from(document.querySelectorAll(".page"));
document.addEventListener("DOMContentLoaded", getData);
playArea.btns.forEach(function (item) {
    item.addEventListener('click', handleBtn);
})

function getData() {
    playArea.main.classList.add("visible");
    fetch("https://api.myjson.com/bins/gungm").then(function (rep) {
        return rep.json();
    }).then(function (data) {
        gameObj = data.data;
        console.log(gameObj);
        buildBoard();
    })
}

function updateScore() {
    playArea.scorer.innerHTML = "Score: " + player.score + " Lives: " + player.items;
}

function buildBoard() {
    playArea.scorer = document.createElement("span");
    playArea.scorer.innerHTML = "Press Button to Start";
    playArea.stats.appendChild(playArea.scorer);
    let rows = 4;
    let cols = 4;
    let cnt = 0;
    playArea.game.style.width = cols * 100 + (cols * 2);
    playArea.game.style.margin = "auto";
    for (let y = 0; y < rows; y++) {
        let divMain = document.createElement("div");
        divMain.setAttribute("class", "row");
        divMain.style.width = cols * 100 + (cols * 2);
        for (let x = 0; x < cols; x++) {
            let div = document.createElement("div");
            div.setAttribute("class", "pop");
            cnt++;
            div.innerText = cnt;
            div.cnt = cnt;
            divMain.appendChild(div);
        }
        playArea.game.appendChild(divMain);
    }
}

function handleBtn(e) {
    if (e.target.classList.contains("newGame")) {
        startGame();
    }
}

function startGame() {
    player.score = 0;
    player.items = 3;
    playArea.main.classList.remove("visible");
    playArea.game.classList.add("visible");
    player.gameOver = false;
    startPop();
    updateScore();
}

function randomUp() {
    const pops = document.querySelectorAll(".pop");
    const idx = Math.floor(Math.random() * pops.length);
    if (pops[idx].cnt == playArea.last) {
        return randomUp();
    }
    playArea.last = pops[idx].cnt;
    return pops[idx];
}

function startPop() {
    let newPop = randomUp();
    newPop.classList.add("active");
    newPop.addEventListener("click", hitPop);
    const time = Math.round(Math.random() * (1500) + 750);
    const val = Math.floor(Math.random() * gameObj.length);
    newPop.old = newPop.innerText;
    newPop.v = gameObj[val].value;
    newPop.innerHTML = gameObj[val].icon + "<br>" + gameObj[val].value;
    playArea.inPlay = setTimeout(function () {
        newPop.classList.remove("active");
        newPop.removeEventListener("click", hitPop);
        newPop.innerText = newPop.old;
        if (newPop.v > 0) {
            player.items--;
            updateScore();
        }
        if (player.items <= 0) {
            gameOver();
        }
        if (!player.gameOver) {
            startPop();
        }
    }, time);
}

function gameOver() {
    player.gameOver = true;
    playArea.main.classList.add("visible");
    playArea.game.classList.remove("visible");
    document.querySelector(".newGame").innerText = "Try Again";
}

function hitPop(e) {
    console.log(e.target.cnt);
    console.log(e.target.v);
    let newPop = e.target;
    player.score = player.score + newPop.v;
    updateScore();
    newPop.classList.remove("active");
    newPop.removeEventListener("click", hitPop);
    newPop.innerText = newPop.old;
    clearTimeout(playArea.inPlay);
    if (!player.gameOver) {
        startPop();
    }
}