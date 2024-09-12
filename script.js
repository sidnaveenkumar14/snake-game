const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = canvas.width / gridSize;


let direction = { x: 0, y: 0 }; 
let gameOver = false;
let score = 0; 

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.next = null;
    }
}

class LinkedList {
    constructor(x, y) {
        this.head = new Node(x, y);
        this.tail = this.head;
    }

    addToFront(x, y) {
        const newNode = new Node(x, y);
        newNode.next = this.head;
        this.head = newNode;
    }

    removeFromEnd() {
        let current = this.head;
        while (current.next && current.next !== this.tail) {
            current = current.next;
        }
        this.tail = current;
        current.next = null;
    }

    checkCollision() {
        let current = this.head.next;
        while (current) {
            if (this.head.x === current.x && this.head.y === current.y) {
                return true;
            }
            current = current.next;
        }
        return false;
    }

    draw() {
        let current = this.head;
        ctx.fillStyle = "green";
        while (current) {
            ctx.fillRect(current.x * gridSize, current.y * gridSize, gridSize, gridSize);
            current = current.next;
        }
    }
}

let snake = new LinkedList(10, 10);
snake.addToFront(10, 11);
snake.addToFront(10, 12);

let food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20); 
}

function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Press any key to restart", canvas.width / 4.5, canvas.height / 1.8);
    ctx.fillText("Final Score: " + score, canvas.width / 3, canvas.height / 1.6);
}

function restartGame() {
    gameOver = false;
    score = 0; 
    direction = { x: 0, y: 0 };
    snake = new LinkedList(10, 10); 
    snake.addToFront(10, 11);
    snake.addToFront(10, 12);
    food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
}


function update() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    if (direction.x === 0 && direction.y === 0) return;

    const newX = snake.head.x + direction.x;
    const newY = snake.head.y + direction.y;

    if (newX < 0 || newY < 0 || newX >= canvasSize || newY >= canvasSize || snake.checkCollision()) {
        gameOver = true;
        return;
    }

    snake.addToFront(newX, newY);

    if (newX === food.x && newY === food.y) {
        score += 10; 
        food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
    } else {
        snake.removeFromEnd();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.draw();
    drawFood();
    drawScore(); 
}

window.addEventListener("keydown", (e) => {
    if (gameOver) {
        restartGame(); 
    } else {
        switch (e.code) {
            case "ArrowUp":
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case "ArrowDown":
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case "ArrowRight":
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
        }
    }
});

setInterval(update, 100);
