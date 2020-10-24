//score board
let currentScoreElement = document.getElementById('currentScore');
let bestScoreElement = document.getElementById('bestScore');
let score = bestScore = 0;
updateScore();

//snake pit
const snakePit = document.getElementById('snakePit');
const context = snakePit.getContext('2d');
document.addEventListener('keydown', onKeyPressed);
const snakePitColor = 'yellow';
let refreshRate = setInterval(render, 100);
let paused = false;
//grid
const gridSize = 20;
const tileSize = snakePit.width / gridSize;
//initial snake position
let x = gridSize/2;
let y = gridSize/2;
//initial velocity
let vx = 0;
let vy = 0;

//initalize snake
let snake = {
    initialSize: 3,
    body: [{ positionX: x, positionY: y }],
    size: 3,
    color: 'green'
};

//initialize apple
let apple = {
    position: generateApplePosition(),
    size: tileSize / 2,
    color: 'red'
};

function render() {
    //calculate position
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
    snake.body.push({ positionX: x, positionY: y });
    if (snake.body.length > snake.size) {
        snake.body.shift();
    }
    for (let i = 0; i < snake.body.length; i++) {
        context.fillRect(
            snake.body[i].positionX * tileSize +1,
            snake.body[i].positionY * tileSize +1,
            tileSize -1,
            tileSize -1);
        if (i != snake.body.length - 1
            && snake.body[i].positionX == snake.body[snake.body.length - 1].positionX
            && snake.body[i].positionY == snake.body[snake.body.length - 1].positionY) {
            snake.size = snake.initialSize;
            snake.body = snake.body.slice(snake.body.length - 1 - snake.initialSize);
            score = 0;
            updateScore();
        }
    }
}

function renderApple() {
    context.fillStyle = apple.color;
    context.beginPath();
    // context.arc(posx, posy, 50, 0, 2 * Math.PI);
    context.arc(
        apple.position.positionX * tileSize + tileSize / 2,
        apple.position.positionY * tileSize + tileSize / 2,
        apple.size,
        0,
        2 * Math.PI);
    context.fill();

}

function detectWallCollisions() {
    if ((x+1) * tileSize > snakePit.width) {
        x = 0;
    }
    if (x * tileSize < 0) {
        x = snakePit.width / tileSize;
    }
    if ((y+1) * tileSize > snakePit.height) {
        y = 0;
    }
    if (y * tileSize < 0) {
        y = snakePit.height / tileSize - 1;
    }
}

function eatApple() {
    const snakeLength = snake.body.length;
    if (snake.body[snakeLength - 1].positionX === apple.position.positionX
        && snake.body[snakeLength - 1].positionY === apple.position.positionY) {
        snake.size++;
        apple.position = generateApplePosition();
        score++;
        updateScore();
    }
}

function generateApplePosition() {
    let x = Math.random() * gridSize;
    let y = Math.random() * gridSize;
    return { positionX: Math.round(x), positionY: Math.round(y) }
}

function onKeyPressed(event) {
    switch (event.keyCode) {
        case 37:
            vx = -1;
            vy = 0;
            console.log('left');
            break;
        case 38:
            vx = 0;
            vy = -1;
            console.log('up');
            break;
        case 39:
            vx = 1;
            vy = 0;
            console.log('right');
            break;
        case 40:
            vx = 0;
            vy = 1;
            console.log('down');
            break;
        case 32:
            togglePause();
            break;
        default:
            console.log('other key');
            break;
    }
}

function togglePause() {
    if (paused == true) {
        refreshRate = setInterval(render, 100);
        paused = false;
    } else {
        clearInterval(refreshRate);
        paused = true;
    }
}

function updateScore(){
    if(score > bestScore){
        bestScore = score;
    }
    currentScoreElement.innerHTML = 'Score: ' + score + ' points';
    bestScoreElement.innerHTML = 'Your Best: ' + bestScore + ' points';
}
