let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// dino details
let dinoWidth = 88;
let dinoHeight = 98;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight,
};

// cactus details
let cactusArray = [];

let cactus1Width = 30;
let cactus2Width = 60;
let cactus3Width = 80;
let cactusHeight = 50;
let cactusX = boardWidth - cactus1Width;
let cactusY = 170;
let cactus1Img, cactus2Img, cactus3Img;

// physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;
let score = 0;
let gameStarted = false;  // Flag to control game start

// Track details
let trackWidth = 1500;
let trackHeight = 50;
let trackX = 0;
let trackY = boardHeight - trackHeight;

let trackImg = new Image();
trackImg.src = './img/track.png';

// Music control
let musicOn = false;
let music;

// Preload images
window.addEventListener("load", function () {
    // Board setup
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Dino image initialization
    dinoImg = new Image();
    dinoImg.src = "./img/cheetah-run1.png";

    // Preload cactus images
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";
    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";
    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    let running = true;

    // Dino running animation
    setInterval(() => {
        if (running) {
            dinoImg.src = './img/cheetah-run1.png';
        } else {
            dinoImg.src = './img/cheetah-run2.png';
        }
        running = !running;
    }, 150);

    // Music setup
    music = document.getElementsByClassName("music")[0];

    // Event listeners for buttons
    let startButton = document.querySelector('.start-game');
    startButton.addEventListener("click", startGame);

    let musicButton = document.querySelector('.music-btn');
    musicButton.addEventListener("click", toggleMusic);

});

// Start game function
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameOver = false;
        requestAnimationFrame(update);  // Start game loop
        setInterval(placeCactus, 1000);  // Place cacti at intervals
        document.addEventListener("keydown", moveDino);  // Allow dino to jump
    }
}

// Toggle music function
function toggleMusic() {
    if (musicOn) {
        music.pause();
    } else {
        music.play();
    }
    musicOn = !musicOn;
}

// Game update function
function update() {
    requestAnimationFrame(update);

    if (gameOver || !gameStarted) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Dino physics
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);  // Apply gravity
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Cactus physics
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Check for collision
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "";  // Clear the dino image
            return;
        }
    }

    // Track update
    trackX += velocityX;
    if (trackX <= -trackWidth) {
        trackX = 0;  // Loop track back to the beginning
    }
    context.drawImage(trackImg, trackX, trackY, trackWidth, trackHeight);
    context.drawImage(trackImg, trackX + trackWidth, trackY, trackWidth, trackHeight);  // Repeat the track

    // Score update
    context.fillStyle = "black";
    context.font = "20px courier";
    score += 0.2;
    context.fillText(parseInt(score), 10, 25);
}

// Place cactus function
function placeCactus() {
    if (gameOver) return;

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight,
    };

    let placeCactusChance = Math.random();
    if (placeCactusChance > 0.90) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
    } else if (placeCactusChance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
    } else {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
    }

    cactusArray.push(cactus);
    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

// Move dino on key press (jump)
function moveDino(e) {
    if (gameOver || !gameStarted) return;

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10;
        dinoImg.src = './img/cheetah-jump.png';
    }
}

// Detect collision
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}


