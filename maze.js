const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
document.addEventListener('keydown', handleKey);


const tileSize = 40;
const maze = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,3,0,0,1], // 3 = checkpoint (kinetochore)
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,1,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,1,0,1,0,1,0,1,0,1],
  [1,0,0,1,0,4,0,1,0,1], // 4 = checkpoint (centrosome)
  [1,0,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,1,1,1,2,1] // 2 = goal
];

let chromie = { x: 1, y: 1 };
let atp = 105;
let timeLeft = 30;
let microtubules = [{ x: 5, y: 2, dir: 1 }]; // moving obstacle

const audioWall = new Audio('wall.mp3');
const audioGoal = new Audio('goal.mp3');
const audioCheckpoint = new Audio('checkpoint.mp3');

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      switch (maze[y][x]) {
        case 1: ctx.fillStyle = '#888'; break; // wall
        case 2: ctx.fillStyle = '#90ee90'; break; // goal
        case 3: ctx.fillStyle = '#add8e6'; break; // kinetochore
        case 4: ctx.fillStyle = '#ffcccb'; break; // centrosome
        default: ctx.fillStyle = '#fff'; break; // path
      }
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // Draw microtubules
  ctx.fillStyle = '#ff6347';
  microtubules.forEach(m => {
    ctx.fillRect(m.x * tileSize, m.y * tileSize, tileSize, tileSize);
  });

  // Draw Chromie
  ctx.fillStyle = '#ff69b4';
  ctx.beginPath();
  ctx.arc(chromie.x * tileSize + tileSize / 2, chromie.y * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
  ctx.fill();

  // Update status
  status.innerHTML = `⚡ ATP: ${atp} | ⏱️ Time: ${timeLeft}s`;
}

function moveChromie(dx, dy) {
    if (atp <= 0 || timeLeft <= 0) return;
  
    const newX = chromie.x + dx;
    const newY = chromie.y + dy;
  
    // Check for microtubule collision
    if (microtubules.some(m => m.x === newX && m.y === newY)) {
      status.innerHTML += `<br>🚫 Rogue microtubule blocked Chromie!`;
      audioWall.play();
      return;
    }
  
    const tile = maze[newY][newX];
    if (tile !== 1) {
  
      if (atp < 5) {
        gameOver("⚡ Chromie doesn’t have enough ATP to move!");
        return;
      }
      
      chromie.x = newX;
      chromie.y = newY;
      atp -= 5;
      
      if (timeLeft <= 0) return;
  
      drawMaze();
  
      if (tile === 2) {
        audioGoal.play();
        gameOver("🎉 Chromie reached the metaphase plate! You Win!");
        return;
      } else if (tile === 3 || tile === 4) {
        status.innerHTML += `<br>✅ Checkpoint reached: ${tile === 3 ? 'Kinetochore' : 'Centrosome'}`;
        audioCheckpoint.play();
        atp += 20;
      }
    } else {
      status.innerHTML += `<br>💥 Chromie hit a wall!`;
      audioWall.play();
    }
  }
  
  
  let timerId;

  function gameLoop() {
    if (timeLeft <= 0) {
      gameOver("⏳ Time’s up!");
      return;
    }
  
    if (atp <= 0) {
      gameOver("⚡ Chromie ran out of ATP!");
      return;
    }
  
    timeLeft--;
    updateMicrotubules();
    drawMaze();
  
    timerId = setTimeout(gameLoop, 1000);
  }
  

  function handleKey(e) {
    switch (e.key) {
      case 'ArrowUp': moveChromie(0, -1); break;
      case 'ArrowDown': moveChromie(0, 1); break;
      case 'ArrowLeft': moveChromie(-1, 0); break;
      case 'ArrowRight': moveChromie(1, 0); break;
    }
  }  
  
  
  function gameOver(message) {
    status.innerHTML += `<br><strong>🧨 Game Over!</strong> ${message}`;
    document.removeEventListener('keydown', handleKey);
    clearTimeout(timerId);
  }
  

function updateMicrotubules() {
  microtubules.forEach(m => {
    m.x += m.dir;
    if (maze[m.y][m.x] === 1 || m.x <= 0 || m.x >= maze[0].length - 1) {
      m.dir *= -1;
    }
  });
}

drawMaze();
gameLoop();
