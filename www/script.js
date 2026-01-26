document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');

    // Game constants
    const GRID_SIZE = 20;
    const TILE_COUNT = canvas.width / GRID_SIZE;
    const GAME_SPEED = 100;

    // Game state
    let score = 0;
    let gameLoop = null;
    let isGameRunning = false;
    let isPaused = false;
    
    // Snake and Food
    let snake = [];
    let food = { x: 0, y: 0 };
    let dx = 0;
    let dy = 0;
    
    // Initialize game
    function initGame() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        score = 0;
        dx = 1;
        dy = 0;
        isPaused = false;
        scoreElement.textContent = score;
        spawnFood();
    }

    // Start game
    function startGame() {
        if (isGameRunning) return;
        
        initGame();
        isGameRunning = true;
        startBtn.textContent = 'Restart Game';
        startBtn.blur(); // Remove focus so spacebar doesn't trigger button
        
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, GAME_SPEED);
    }

    // Main game loop
    function gameStep() {
        if (isPaused) return;

        moveSnake();
        if (checkCollision()) {
            gameOver();
            return;
        }
        draw();
    }

    // Move snake
    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check if food eaten
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            spawnFood();
        } else {
            snake.pop();
        }
    }

    // Check collisions
    function checkCollision() {
        const head = snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
            return true;
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }

        return false;
    }

    // Spawn food
    function spawnFood() {
        food.x = Math.floor(Math.random() * TILE_COUNT);
        food.y = Math.floor(Math.random() * TILE_COUNT);

        // Make sure food doesn't spawn on snake
        snake.forEach(segment => {
            if (segment.x === food.x && segment.y === food.y) {
                spawnFood();
            }
        });
    }

    // Draw game
    function draw() {
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#2ecc71';
        snake.forEach((segment, index) => {
            // Make head a slightly different color
            if (index === 0) ctx.fillStyle = '#27ae60';
            else ctx.fillStyle = '#2ecc71';
            
            ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        });

        // Draw food
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

        // Draw pause text
        if (isPaused) {
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        }
    }

    // Game over
    function gameOver() {
        clearInterval(gameLoop);
        isGameRunning = false;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#e74c3c';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
        
        startBtn.textContent = 'Play Again';
    }

    // Input handling
    document.addEventListener('keydown', (e) => {
        // Prevent default scrolling for arrow keys and space
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }

        switch(e.code) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
            case 'Space':
                if (isGameRunning) {
                    isPaused = !isPaused;
                    if (!isPaused) draw(); // Redraw immediately to clear pause text
                    else draw(); // Redraw to show pause text
                } else {
                    startGame();
                }
                break;
        }
    });

    startBtn.addEventListener('click', startGame);

    // Initial draw
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press Start to Play', canvas.width / 2, canvas.height / 2);
});
