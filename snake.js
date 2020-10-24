const snakePit = document.getElementById('snakePit');
const context = snakePit.getContext('2d');
document.addEventListener('keydown', onKeyPressed);
setInterval(render, 100);

//initial snake head position
let x = 10;
let y = 10;

//initial velocity
let vx = 0;
let vy = 0;

//initial acceleration
let level = 1;

//grid
const gridSize = 20;
const tileSize = snakePit.width / gridSize;

//initalize snake
let snake = {
    body: [{ positionX: x, positionY: y }],
    size: 5,
    color: 'lime'
}



function render() {

    x = x + vx * level;
    y = y + vy * level;

    //teleport
    if (x * tileSize > snakePit.width) {
        x = 0;
    }
    if (x * tileSize < 0) {
        x = snakePit.width / tileSize;
    }
    if (y * tileSize > snakePit.height) {
        y = 0;
    }
    if (y * tileSize < 0) {
        y = snakePit.height / tileSize;
    }

    context.fillStyle = 'yellow';
    context.fillRect(0, 0, snakePit.width, snakePit.height);

    context.fillStyle = snake.color;

    context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);


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
        default:
            console.log('other key');
            break;
    }
}