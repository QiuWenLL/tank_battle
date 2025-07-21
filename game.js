// 游戏类
class TankBattleGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // 初始化音效管理器
        this.soundManager = new SoundManager();
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemyCount = 5;
        
        // 游戏对象
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.obstacles = [];
        this.particles = []; // 粒子数组
        
        // 输入处理
        this.keys = {};
        
        this.initializeGame();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    initializeGame() {
        // 创建玩家坦克
        this.player = new Tank(100, 300, 0, 'player');
        
        // 创建敌方坦克
        this.createEnemies();
        
        // 创建障碍物
        this.createObstacles();
        
        // 清空子弹数组
        this.bullets = [];
        this.enemyBullets = [];
        this.particles = []; // 清空粒子数组
    }
    
    createEnemies() {
        this.enemies = [];
        for (let i = 0; i < this.enemyCount; i++) {
            let x, y;
            do {
                x = Math.random() * (this.width - 40) + 20;
                y = Math.random() * (this.height - 40) + 20;
            } while (this.getDistance(x, y, this.player.x, this.player.y) < 200);
            
            this.enemies.push(new Tank(x, y, Math.random() * Math.PI * 2, 'enemy'));
        }
    }
    
    createObstacles() {
        this.obstacles = [];
        const obstacleCount = 15;
        
        for (let i = 0; i < obstacleCount; i++) {
            let x = Math.random() * (this.width - 60) + 30;
            let y = Math.random() * (this.height - 60) + 30;
            
            // 确保障碍物不会挡住玩家起始位置
            if (this.getDistance(x, y, this.player.x, this.player.y) > 100) {
                this.obstacles.push(new Obstacle(x, y, 30, 30));
            }
        }
    }
    
    setupEventListeners() {
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'KeyP') {
                this.togglePause();
            }
            if (e.code === 'KeyR') {
                this.restartGame();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('soundToggleBtn').addEventListener('click', () => {
            this.toggleSound();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.initializeGame();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemyCount = 5;
        this.gameState = 'playing';
        this.initializeGame();
        this.updateUI();
        document.getElementById('gameOverScreen').classList.add('hidden');
    }
    
    toggleSound() {
        const isEnabled = this.soundManager.toggle();
        const btn = document.getElementById('soundToggleBtn');
        btn.textContent = isEnabled ? '🔊 音效' : '🔇 音效';
    }
    
    handleInput() {
        if (this.gameState !== 'playing') return;
        
        const now = Date.now();
        let isMoving = false;
        
        // 移动控制
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.player.moveForward(this.width, this.height, this.obstacles);
            isMoving = true;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.player.moveBackward(this.width, this.height, this.obstacles);
            isMoving = true;
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.turnLeft();
            isMoving = true;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.turnRight();
            isMoving = true;
        }
        
        // 移动时自动射击 - 使用玩家坦克自己的射击冷却时间
        if (isMoving && now - this.player.lastShot > this.player.shotCooldown) {
            const bullet = this.player.shoot();
            if (bullet) {
                this.bullets.push(bullet);
                this.soundManager.play('shoot'); // 播放射击音效
            }
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.handleInput();
        
        // 更新玩家
        this.player.update(this.width, this.height, this.obstacles);
        
        // 更新敌方坦克
        this.enemies.forEach((enemy, index) => {
            enemy.update(this.width, this.height, this.obstacles);
            enemy.aiUpdate(this.player, this.obstacles, this.width, this.height);
            
            // 敌方坦克射击
            if (Math.random() < 0.01) { // 1% 几率每帧射击
                const bullet = enemy.shoot();
                if (bullet) {
                    this.enemyBullets.push(bullet);
                    // 敌方坦克射击音效音量较小
                    if (Math.random() < 0.3) { // 30% 概率播放音效，避免太吵
                        this.soundManager.play('shoot');
                    }
                }
            }
        });
        
        // 更新子弹
        this.bullets = this.bullets.filter(bullet => {
            bullet.update();
            return bullet.x > 0 && bullet.x < this.width && 
                   bullet.y > 0 && bullet.y < this.height;
        });
        
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.update();
            return bullet.x > 0 && bullet.x < this.width && 
                   bullet.y > 0 && bullet.y < this.height;
        });
        
        // 更新粒子
        this.particles = this.particles.filter(particle => particle.update());
        
        // 碰撞检测
        this.checkCollisions();
        
        // 检查游戏状态
        this.checkGameState();
    }
    
    checkCollisions() {
        // 玩家子弹击中敌方坦克
        for (let bulletIndex = this.bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
            const bullet = this.bullets[bulletIndex];
            let bulletHit = false;
            
            // 检查是否击中敌方坦克
            for (let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
                const enemy = this.enemies[enemyIndex];
                if (this.checkBulletTankCollision(bullet, enemy)) {
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    this.score += 100;
                    this.soundManager.play('hit'); // 播放命中音效
                    bulletHit = true;
                    break;
                }
            }
            
            // 如果子弹没有击中坦克，检查是否击中障碍物
            if (!bulletHit) {
                for (let obstacleIndex = this.obstacles.length - 1; obstacleIndex >= 0; obstacleIndex--) {
                    const obstacle = this.obstacles[obstacleIndex];
                    if (this.checkBulletObstacleCollision(bullet, obstacle)) {
                        this.bullets.splice(bulletIndex, 1);
                        
                        // 创建粒子效果
                        this.createDebrisParticles(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2);
                        
                        this.obstacles.splice(obstacleIndex, 1); // 移除被击中的障碍物
                        this.score += 10; // 给击毁障碍物一些分数奖励
                        this.soundManager.play('break'); // 播放破碎音效
                        break;
                    }
                }
            }
        }
        
        // 敌方子弹击中玩家
        for (let bulletIndex = this.enemyBullets.length - 1; bulletIndex >= 0; bulletIndex--) {
            const bullet = this.enemyBullets[bulletIndex];
            let bulletHit = false;
            
            if (this.checkBulletTankCollision(bullet, this.player)) {
                this.enemyBullets.splice(bulletIndex, 1);
                this.lives--;
                // 重置玩家位置
                this.player.x = 100;
                this.player.y = 300;
                this.soundManager.play('hit'); // 播放命中音效
                bulletHit = true;
            }
            
            // 敌方子弹击中障碍物
            if (!bulletHit) {
                for (let obstacle of this.obstacles) {
                    if (this.checkBulletObstacleCollision(bullet, obstacle)) {
                        this.enemyBullets.splice(bulletIndex, 1);
                        break;
                    }
                }
            }
        }
    }
    
    checkBulletTankCollision(bullet, tank) {
        const distance = this.getDistance(bullet.x, bullet.y, tank.x, tank.y);
        return distance < tank.size / 2 + 5;
    }
    
    checkBulletObstacleCollision(bullet, obstacle) {
        return bullet.x > obstacle.x && bullet.x < obstacle.x + obstacle.width &&
               bullet.y > obstacle.y && bullet.y < obstacle.y + obstacle.height;
    }
    
    createDebrisParticles(x, y) {
        // 创建8-12个碎片粒子
        const particleCount = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(x, y));
        }
    }
    
    checkGameState() {
        // 检查是否所有敌方坦克被消灭
        if (this.enemies.length === 0) {
            console.log('关卡完成！进入下一关...');
            this.level++;
            this.enemyCount += 2;
            this.createEnemies();
            this.score += 500; // 完成关卡奖励
        }
        
        // 检查玩家是否死亡
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('gameOverScreen').classList.remove('hidden');
        }
        
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    draw() {
        // 清除画布
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制网格背景
        this.drawGrid();
        
        // 绘制障碍物
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        
        // 绘制坦克
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.draw(this.ctx));
        
        // 绘制粒子效果
        this.particles.forEach(particle => particle.draw(this.ctx));
        
        // 绘制游戏状态信息
        if (this.gameState === 'paused') {
            this.drawPauseScreen();
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        // 绘制垂直线
        for (let x = 0; x < this.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let y = 0; y < this.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.width / 2, this.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('按 P 键继续', this.width / 2, this.height / 2 + 50);
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 坦克类
class Tank {
    constructor(x, y, angle, type) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.type = type;
        this.size = 30;
        this.speed = 2;
        this.turnSpeed = 0.05;
        this.lastShot = 0;
        
        // 根据坦克类型设置不同的射击冷却时间
        if (type === 'player') {
            this.shotCooldown = 100; // 玩家坦克：100ms冷却时间
        } else {
            this.shotCooldown = 1000; // 敌方坦克：1000ms冷却时间 (10倍差距)
        }
        
        this.health = 1;
        
        // AI相关属性
        this.targetAngle = angle;
        this.lastDirectionChange = 0;
        this.directionChangeInterval = 2000;
    }
    
    moveForward(canvasWidth = 800, canvasHeight = 600, obstacles = []) {
        const newX = this.x + Math.cos(this.angle) * this.speed;
        const newY = this.y + Math.sin(this.angle) * this.speed;
        
        // 检查边界
        if (newX > this.size/2 && newX < canvasWidth - this.size/2 &&
            newY > this.size/2 && newY < canvasHeight - this.size/2) {
            
            // 检查障碍物碰撞
            let canMove = true;
            for (let obstacle of obstacles) {
                if (this.wouldCollideWithObstacle(newX, newY, obstacle)) {
                    canMove = false;
                    break;
                }
            }
            
            if (canMove) {
                this.x = newX;
                this.y = newY;
            }
        }
    }
    
    moveBackward(canvasWidth = 800, canvasHeight = 600, obstacles = []) {
        const newX = this.x - Math.cos(this.angle) * this.speed;
        const newY = this.y - Math.sin(this.angle) * this.speed;
        
        // 检查边界
        if (newX > this.size/2 && newX < canvasWidth - this.size/2 &&
            newY > this.size/2 && newY < canvasHeight - this.size/2) {
            
            // 检查障碍物碰撞
            let canMove = true;
            for (let obstacle of obstacles) {
                if (this.wouldCollideWithObstacle(newX, newY, obstacle)) {
                    canMove = false;
                    break;
                }
            }
            
            if (canMove) {
                this.x = newX;
                this.y = newY;
            }
        }
    }
    
    turnLeft() {
        this.angle -= this.turnSpeed;
    }
    
    turnRight() {
        this.angle += this.turnSpeed;
    }
    
    shoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shotCooldown) {
            this.lastShot = now;
            const bulletX = this.x + Math.cos(this.angle) * (this.size / 2 + 10);
            const bulletY = this.y + Math.sin(this.angle) * (this.size / 2 + 10);
            return new Bullet(bulletX, bulletY, this.angle, this.type === 'player' ? 'player' : 'enemy');
        }
        return null;
    }
    
    update(canvasWidth, canvasHeight, obstacles) {
        // 边界检测
        if (this.x < this.size/2) this.x = this.size/2;
        if (this.x > canvasWidth - this.size/2) this.x = canvasWidth - this.size/2;
        if (this.y < this.size/2) this.y = this.size/2;
        if (this.y > canvasHeight - this.size/2) this.y = canvasHeight - this.size/2;
    }
    
    wouldCollideWithObstacle(x, y, obstacle) {
        const halfSize = this.size / 2;
        return x + halfSize > obstacle.x && 
               x - halfSize < obstacle.x + obstacle.width &&
               y + halfSize > obstacle.y && 
               y - halfSize < obstacle.y + obstacle.height;
    }
    
    checkObstacleCollision(obstacle) {
        return this.wouldCollideWithObstacle(this.x, this.y, obstacle);
    }
    
    aiUpdate(player, obstacles, canvasWidth = 800, canvasHeight = 600) {
        if (this.type !== 'enemy') return;
        
        const now = Date.now();
        
        // 每隔一段时间改变方向
        if (now - this.lastDirectionChange > this.directionChangeInterval) {
            this.targetAngle = Math.random() * Math.PI * 2;
            this.lastDirectionChange = now;
            this.directionChangeInterval = 1000 + Math.random() * 3000;
        }
        
        // 转向目标角度
        let angleDiff = this.targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        if (Math.abs(angleDiff) > 0.1) {
            if (angleDiff > 0) {
                this.turnRight();
            } else {
                this.turnLeft();
            }
        }
        
        // 向前移动
        this.moveForward(canvasWidth, canvasHeight, obstacles);
        
        // 朝向玩家射击
        const playerAngle = Math.atan2(player.y - this.y, player.x - this.x);
        const distance = Math.sqrt((player.x - this.x) ** 2 + (player.y - this.y) ** 2);
        
        if (distance < 200 && Math.random() < 0.02) {
            this.angle = playerAngle;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // 绘制坦克主体
        if (this.type === 'player') {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#F44336';
        }
        
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        
        // 绘制坦克炮管
        ctx.fillStyle = '#333';
        ctx.fillRect(this.size/2 - 5, -3, 20, 6);
        
        // 绘制坦克方向指示器
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.size/2 - 10, -2, 8, 4);
        
        ctx.restore();
        
        // 绘制血条（如果是敌方坦克）
        if (this.type === 'enemy') {
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x - 15, this.y - 25, 30, 4);
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(this.x - 15, this.y - 25, 30 * this.health, 4);
        }
    }
}

// 子弹类
class Bullet {
    constructor(x, y, angle, owner) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.owner = owner;
        this.speed = 8;
        this.size = 4;
    }
    
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.owner === 'player' ? '#FFD700' : '#FF4444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 粒子类 - 用于障碍物被击毁的视觉效果
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8; // 随机水平速度
        this.vy = (Math.random() - 0.5) * 8; // 随机垂直速度
        this.life = 1.0; // 生命值
        this.decay = 0.02; // 衰减速度
        this.size = Math.random() * 4 + 2; // 随机大小
        this.color = `hsl(${30 + Math.random() * 30}, 70%, ${50 + Math.random() * 30}%)`; // 棕色系
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98; // 阻力
        this.vy *= 0.98;
        this.life -= this.decay;
        return this.life > 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 障碍物类
class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 添加纹理
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
        
        // 添加阴影效果
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new TankBattleGame();
});
