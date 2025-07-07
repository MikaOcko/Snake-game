// ------------ Variables/elements -----------
// Get references from to DOM elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Define game variables
const gridSize = 20; //length of colum/row
let snake = [{x:10, y:10}]; // position (10x10) where the snake start
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200; //in milliseconds
let gameStarted = false; // boolean to tell if the game has started or not

// ---------- Fonctions/logic ----------
// Testing draw function
// draw();

// Draw the game map, snake and food
function draw() {
    // reset the board (if you have already played)
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

// Set the position of the snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Draw the snake
function drawSnake() {
    if(gameStarted) {
        // Define snake looks
        snake.forEach((segment) => {
            const snakeElement = createGameElement("div", "snake"); // new div with a snake class
            setPosition(snakeElement, segment);
            board.appendChild(snakeElement);
        });
    }
}

// Draw food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement("div", "food"); // new div with a snake class
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Generate food to a random position
function generateFood() {
    const x = Math.floor((Math.random() * gridSize) + 1);
    const y = Math.floor((Math.random() * gridSize) + 1);
    return {x, y};
}

// Moving the snake
function move() {
    const head = { ...snake[0] }; // copy from the original object "snake" with index = 0
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // illusion of moving : rebuild and destroy = add head + cut the tail
    snake.unshift(head); // add a head/put it at the start to the "snake" array
    // snake.pop();

    if (head.x === food.x && head.y === food.y) {
        food = generateFood() // generate to a new location
        increaseSpeed();
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// Test moving
// setInterval(() => {
//   move(); // Move first
//   draw(); // Then draw again new position
// }, 200);

// Start game function
function startGame() {
    gameStarted = true; //keep track of the running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Key press event listener
function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ')
    ) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// Increase speed snake
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

// Check collision
function checkCollision() {
        const head = snake[0];
    // Check collision with the game board border
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    // Check collision with his own body
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// Reset game
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

// Update scores
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// Update high score
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}