//set up score board
let currentScoreElement = document.getElementById('currentScore');
let bestScoreElement = document.getElementById('bestScore');
let score = bestScore = 0;
updateScore();

//set up snake pit
const snakePit = document.getElementById('snakePit');
const context = snakePit.getContext('2d');
document.addEventListener('keydown', onKeyPressed);
const snakePitColor = 'yellow';
const gridSize = 20;
const tileSize = snakePit.width / gridSize;
//gameplay variables
let level = 1;
let refreshRate = setInterval(render, 100 / level);
let gameStarted = false;
let gameEnded = false;
let gamePaused = false;
let keysLocked = false;

//initial snake position
let x = gridSize / 2;
let y = gridSize / 2;
//initial snake speed
let vx = 0;
let vy = 0;

//initalize snake
let snake = initializeSnake();
//initialize apple
let apple = generateApple();

function render() {
    //calculate next snake position
    x = x + vx;
    y = y + vy;

    renderSnakePit();
    detectWallCollisions();
    renderSnake();
    renderApple();
    eatApple()
}

function renderSnakePit() {
    context.fillStyle = snakePitColor;
    context.fillRect(0, 0, snakePit.width, snakePit.height);
}

function renderSnake() {
    context.fillStyle = snake.color;
    //update head position
    snake.body.push({ positionX: x, positionY: y });
    if (snake.body.length > snake.size) {
        snake.body.shift();
    }

    //detect body colisions and render snake
    const snakeHeadIndex = snake.body.length - 1;
    for (let i = 0; i < snake.body.length; i++) {
        if (gameStarted && !gamePaused
            && i != snakeHeadIndex
            && snake.body[i].positionX == snake.body[snakeHeadIndex].positionX
            && snake.body[i].positionY == snake.body[snakeHeadIndex].positionY) {

            gameOver();
            break;
        }
        context.fillRect(
            snake.body[i].positionX * tileSize + 1,
            snake.body[i].positionY * tileSize + 1,
            tileSize - 1,
            tileSize - 1);
    }
}

function renderApple() {
    context.fillStyle = apple.color;
    context.beginPath();
    context.arc(
        apple.position.positionX * tileSize + tileSize / 2,
        apple.position.positionY * tileSize + tileSize / 2,
        apple.size,
        0,
        2 * Math.PI);
    context.fill();
}

function detectWallCollisions() {
    if ((x + 1) * tileSize > snakePit.width) {
        x = 0;
    }
    if (x * tileSize < 0) {
        x = snakePit.width / tileSize;
    }
    if ((y + 1) * tileSize > snakePit.height) {
        y = 0;
    }
    if (y * tileSize < 0) {
        y = snakePit.height / tileSize - 1;
    }
}

function eatApple() {
    const snakeHeadIndex = snake.body.length - 1;
    if (snake.body[snakeHeadIndex].positionX === apple.position.positionX
        && snake.body[snakeHeadIndex].positionY === apple.position.positionY) {
        snake.size++;
        apple = generateApple();
        score++;
        updateScore();
        levelUp();
    }
}

function initializeSnake() {
    return {
        body: [{ positionX: x, positionY: y }],
        size: 3,
        color: 'green'
    };
}

function generateApple() {
    let x = Math.random() * (gridSize - 1);
    let y = Math.random() * (gridSize - 1);
    let position = { positionX: Math.round(x), positionY: Math.round(y) };

    //prevent apple from falling on top of snake's body
    while (snake.body.some((it) => it.positionX == position.positionX && it.positionY == position.positionY) == true) {
        x = Math.random() * (gridSize - 1);
        y = Math.random() * (gridSize - 1);
        position = { positionX: Math.round(x), positionY: Math.round(y) };
        console.log("ups");
    }

    return {
        position,
        size: tileSize / 2,
        color: 'red'
    };
}

function onKeyPressed(event) {
    if (gameEnded || keysLocked) {
        return;
    }
    keysLocked = true;
    switch (event.keyCode) {
        case 37://left
            if (vx == 1) {//prevent reversing
                break;
            }
            gameStarted = true;
            vx = -1;
            vy = 0;
            break;
        case 38://up
            if (vy == 1) {
                break;
            }
            gameStarted = true;
            vx = 0;
            vy = -1;
            break;
        case 39://right
            if (vx == -1) {
                break;
            }
            gameStarted = true;
            vx = 1;
            vy = 0;
            break;
        case 40://down
            if (vy == -1) {
                break;
            }
            gameStarted = true;
            vx = 0;
            vy = 1;
            break;
        case 32://space
            if (gameStarted) {
                togglePause();
            }
            break;
        default:
            break;
    }
    keysLocked = false;
}

function togglePause() {
    if (!gameStarted) {
        return;
    }
    if (gamePaused) {
        refreshRate = setInterval(render, 100 / level);
        gamePaused = false;
    } else {
        clearInterval(refreshRate);
        gamePaused = true;
        renderPauseBanner();
    }
}

function renderPauseBanner() {
    const text = 'Paused'
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.font = '50px monospace';
    context.fillText(text, snakePit.width / 2, snakePit.height / 2);
}

function updateScore() {
    if (score > bestScore) {
        bestScore = score;
    }
    currentScoreElement.innerHTML = 'Score: ' + score + ' points';
    bestScoreElement.innerHTML = 'Your Best: ' + bestScore + ' points';
}

function levelUp() {
    level += 0.05;
    clearInterval(refreshRate);
    refreshRate = setInterval(render, 100 / level);
}

function gameOver() {
    clearInterval(refreshRate);
    gameEnded = true;
    gameStarted = false;
    vx = vy = 0;
    x = y = 10;
    level = 1;
    score = 0;
    snake = initializeSnake();
    apple = generateApple();
    renderSnakePit();
    renderGameOverBanner();
    setTimeout(function () {
        updateScore();
        gameEnded = false;
        refreshRate = setInterval(render, 100 / level);
    }, 2000)
}

function renderGameOverBanner() {
    const text = 'Game Over';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.font = '50px monospace';
    context.fillText(text, snakePit.width / 2, snakePit.height / 2);
}
