import React, { useEffect, useRef, useState } from 'react';
import '../../assets/styles/TankBattle.css';
import tankMoveSound from '../../assets/sound/tank-battle/tank_move_sound_effect.mp3';
import tankShotSound from '../../assets/sound/tank-battle/tank_shot.mp3';


const TankBattle = () => {
    const canvasRef = useRef(null);
    const moveAudioRef = useRef(null);
    const shotAudioRef = useRef(null);
    const [gameState, setGameState] = useState({
        tank: {
            x: 500,
            y: 300,
            angle: 0,
            speed: 0,
            width: 30,
            height: 50,
        },
        bullets: [],
        keys: {},
        reloadTime: 0,
    });

    const gameRef = useRef({
        tank: {
            x: 500,
            y: 300,
            angle: 0,
            speed: 0,
            width: 30,
            height: 50,
            maxSpeed: 5,
            acceleration: 0.5,
            friction: 0.95,
            rotationSpeed: 0.05,
        },
        bullets: [],
        tracerParticles: [],
        muzzleFlashes: [],
        obstacles: [
            { x: 200, y: 150, width: 80, height: 40 },
            { x: 600, y: 150, width: 60, height: 60 },
            { x: 100, y: 400, width: 100, height: 50 },
            { x: 600, y: 420, width: 80, height: 80 },
            { x: 350, y: 300, width: 50, height: 100 },
        ],
        keys: {},
        canvasWidth: 800,
        canvasHeight: 600,
        bulletSpeed: 30,
        bulletLife: 200,
        explosions: [],
        reloadDuration: 1000,
        lastShotTime: 0,
        isMoving: false,
        shotAudioPlaying: false,
    });

    // Handle key down
    useEffect(() => {
        const handleKeyDown = (e) => {
            e.preventDefault()
            gameRef.current.keys[e.key] = true;
        };

        const handleKeyUp = (e) => {
            e.preventDefault()
            gameRef.current.keys[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Draw tank
    const drawTank = (ctx, tank) => {
        ctx.save();
        ctx.translate(tank.x, tank.y);
        ctx.rotate(tank.angle);

        // Tank body
        ctx.fillStyle = '#2ECC71';
        ctx.fillRect(-tank.height / 2, -tank.width / 2, tank.height, tank.width);

        // Tank turret
        ctx.fillStyle = '#27AE60';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Tank barrel
        ctx.strokeStyle = '#27AE60';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();

        // Direction indicator
        ctx.fillStyle = '#F39C12';
        ctx.beginPath();
        ctx.arc(tank.width + 5, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    };

    // Draw bullet
    const drawBullet = (ctx, bullet) => {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(Math.atan2(bullet.vy, bullet.vx)); // xoay theo hướng bay

        // Vỏ đạn (đồng)
        ctx.fillStyle = '#B8860B';
        ctx.beginPath();
        ctx.ellipse(-3, 0, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Thân đạn (chì xám)
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.moveTo(8, 0);        // đầu nhọn
        ctx.lineTo(2, -3);       // trên
        ctx.lineTo(-3, -3);      // thân trên
        ctx.lineTo(-3, 3);       // thân dưới
        ctx.lineTo(2, 3);        // dưới
        ctx.closePath();
        ctx.fill();

        // Điểm sáng phản chiếu
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath();
        ctx.ellipse(3, -1, 3, 1, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    };

    const drawTracer = (ctx, tracer) => {
        ctx.strokeStyle = `rgba(241, 196, 15, ${tracer.alpha})`;
        ctx.lineWidth = tracer.width;
        ctx.beginPath();
        ctx.moveTo(tracer.x, tracer.y);
        ctx.lineTo(tracer.x + tracer.vx * 2, tracer.y + tracer.vy * 2);
        ctx.stroke();
    };

    const drawMuzzleFlash = (ctx, flash) => {
        ctx.save();
        ctx.translate(flash.x, flash.y);
        ctx.rotate(flash.angle);
        ctx.fillStyle = `rgba(231, 76, 60, ${flash.alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10, -4);
        ctx.lineTo(18, 0);
        ctx.lineTo(10, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };

    const drawObstacle = (ctx, obstacle) => {
        ctx.fillStyle = '#34495E';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Add some texture
        ctx.fillStyle = 'rgba(44, 62, 80, 0.5)';
        for (let i = 0; i < obstacle.width; i += 10) {
            for (let j = 0; j < obstacle.height; j += 10) {
                ctx.fillRect(obstacle.x + i, obstacle.y + j, 5, 5);
            }
        }
    };

    const checkCollision = (x, y, width, height, obstacle) => {
        return (
            x - width / 2 < obstacle.x + obstacle.width &&
            x + width / 2 > obstacle.x &&
            y - height / 2 < obstacle.y + obstacle.height &&
            y + height / 2 > obstacle.y
        );
    };

    // Draw grid background
    const drawGrid = (ctx, width, height) => {
        ctx.fillStyle = '#ECF0F1';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#BDC3C7';
        ctx.lineWidth = 1;

        for (let i = 0; i < width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        for (let i = 0; i < height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    };

    // Draw explosion
    const drawExplosion = (ctx, exp) => {
        const progress = 1 - exp.life / exp.maxLife;
        const radius = exp.radius * (0.3 + progress * 0.7);

        const gradient = ctx.createRadialGradient(
            exp.x, exp.y, 0,
            exp.x, exp.y, radius
        );
        gradient.addColorStop(0, `rgba(255,255,200,${exp.alpha})`);
        gradient.addColorStop(0.3, `rgba(255,160, 20,${exp.alpha})`);
        gradient.addColorStop(0.7, `rgba(200, 40,  0,${exp.alpha * 0.8})`);
        gradient.addColorStop(1, `rgba( 40, 40, 40,0)`);

        ctx.beginPath();
        ctx.arc(exp.x, exp.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // các mảnh văng
        exp.shards.forEach(s => {
            ctx.save();
            ctx.globalAlpha = exp.alpha * s.alpha;
            ctx.fillStyle = '#E67E22';
            ctx.beginPath();
            ctx.arc(
                exp.x + s.dx * progress * exp.radius,
                exp.y + s.dy * progress * exp.radius,
                s.r * (1 - progress * 0.6), 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        });
    };


    // Update game state
    useEffect(() => {
        const gameLoop = () => {
            const game = gameRef.current;
            const tank = game.tank;
            const keys = game.keys;

            // Tank rotation
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
                tank.angle -= tank.rotationSpeed;
            }
            if (keys['ArrowRight'] || keys['d'] || keys['D']) {
                tank.angle += tank.rotationSpeed;
            }

            // Tank movement
            if (keys['ArrowUp'] || keys['w'] || keys['W']) {
                tank.speed = Math.min(tank.speed + tank.acceleration, tank.maxSpeed);
            } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
                tank.speed = Math.max(tank.speed - tank.acceleration, -tank.maxSpeed * 0.5);
            } else if (keys['q'] || keys['Q'] || keys['e'] || keys['E']) {
                tank.speed = Math.min(tank.speed + tank.acceleration, tank.maxSpeed * 0.3);
            } else {
                tank.speed *= tank.friction;
            }

            // Update tank position
            let newX = tank.x;
            let newY = tank.y;
            if (keys['q'] || keys['Q']) {
                newX += Math.cos(tank.angle - (Math.PI / 2)) * tank.speed;
                newY += Math.sin(tank.angle - (Math.PI / 2)) * tank.speed;
            } else if (keys['e'] || keys['E']) {
                newX += Math.cos(tank.angle + (Math.PI / 2)) * tank.speed;
                newY += Math.sin(tank.angle + (Math.PI / 2)) * tank.speed;
            }
            else if (keys['ArrowUp'] || keys['w'] || keys['W'] || keys['ArrowDown'] || keys['s'] || keys['S']) {
                newX += Math.cos(tank.angle) * tank.speed;
                newY += Math.sin(tank.angle) * tank.speed;
            }


            // Check collision with obstacles
            let canMove = true;
            for (let obstacle of game.obstacles) {
                if (checkCollision(newX, newY, tank.width, tank.height, obstacle)) {
                    canMove = false;
                    break;
                }
            }

            if (canMove) {
                tank.x = newX;
                tank.y = newY;
            } else {
                tank.speed = 0;
            }

            // Boundary checking
            tank.x = Math.max(tank.width / 2, Math.min(tank.x, game.canvasWidth - tank.width / 2));
            tank.y = Math.max(tank.height / 2, Math.min(tank.y, game.canvasHeight - tank.height / 2));

            // Audio management for movement
            const isMovingNow = Math.abs(tank.speed) > 1;
            if (isMovingNow && !game.isMoving) {
                if (moveAudioRef.current) {
                    moveAudioRef.current.currentTime = 0;
                    moveAudioRef.current.play().catch(() => { });
                    game.isMoving = true;
                }
            } else if (!isMovingNow && game.isMoving) {
                if (moveAudioRef.current) {
                    moveAudioRef.current.pause();
                    game.isMoving = false;
                }
            }

            // Restart movement sound if it ends and tank is still moving
            if (game.isMoving && moveAudioRef.current) {
                if (moveAudioRef.current.ended) {
                    moveAudioRef.current.currentTime = 1;
                    moveAudioRef.current.play().catch(() => { });
                }
            }

            // Shoot bullet
            const currentTime = Date.now();
            const reloadRemaining = Math.max(0, game.reloadDuration - (currentTime - game.lastShotTime));
            game.reloadRemaining = reloadRemaining;

            if (keys[' '] && currentTime - game.lastShotTime >= game.reloadDuration) {
                const bulletX = tank.x + Math.cos(tank.angle) * 30;
                const bulletY = tank.y + Math.sin(tank.angle) * 30;
                const vx = Math.cos(tank.angle) * game.bulletSpeed;
                const vy = Math.sin(tank.angle) * game.bulletSpeed;

                game.bullets.push({
                    x: bulletX,
                    y: bulletY,
                    vx,
                    vy,
                    life: game.bulletLife,
                });

                game.tracerParticles.push({
                    x: bulletX,
                    y: bulletY,
                    vx,
                    vy,
                    alpha: 0.9,
                    width: 4,
                    life: 10,
                });

                game.muzzleFlashes.push({
                    x: tank.x + Math.cos(tank.angle) * 30,
                    y: tank.y + Math.sin(tank.angle) * 30,
                    angle: tank.angle,
                    alpha: 1,
                    life: 8,
                });

                // Play shot sound from 1 second mark
                if (shotAudioRef.current) {
                    shotAudioRef.current.currentTime = 1;
                    shotAudioRef.current.play().catch(() => { });
                }

                game.lastShotTime = currentTime;
                game.shotAudioPlaying = true;
            }

            // Update bullets
            const spawnExplosion = (x, y) => {
                const shards = Array.from({ length: 8 }, () => ({
                    dx: (Math.random() - 0.5) * 2,
                    dy: (Math.random() - 0.5) * 2,
                    r: Math.random() * 3 + 1,
                    alpha: Math.random() * 0.6 + 0.4,
                }));
                game.explosions.push({ x, y, radius: 30, life: 20, maxLife: 20, alpha: 1, shards });
            };

            game.bullets = game.bullets.filter((bullet) => {
                bullet.x += bullet.vx;
                bullet.y += bullet.vy;
                bullet.life--;

                // kiểm tra va chạm với obstacle
                for (let obs of game.obstacles) {
                    if (
                        bullet.x >= obs.x && bullet.x <= obs.x + obs.width &&
                        bullet.y >= obs.y && bullet.y <= obs.y + obs.height
                    ) {
                        spawnExplosion(bullet.x, bullet.y);
                        return false;  // xóa đạn
                    }
                }

                return (
                    bullet.life > 0 &&
                    bullet.x > 0 && bullet.x < game.canvasWidth &&
                    bullet.y > 0 && bullet.y < game.canvasHeight
                );
            });

            // cập nhật và xóa explosion hết thời gian
            game.explosions = game.explosions.filter((exp) => {
                exp.life--;
                exp.alpha = Math.max(0, exp.life / exp.maxLife);
                return exp.life > 0;
            });

            // Update tracers
            game.tracerParticles = game.tracerParticles.filter((tracer) => {
                tracer.x += tracer.vx * 0.1;
                tracer.y += tracer.vy * 0.1;
                tracer.life--;
                tracer.alpha = Math.max(0, tracer.life / 10);
                tracer.width = Math.max(1, tracer.life * 0.3);
                return tracer.life > 0;
            });

            // Update muzzle flashes
            game.muzzleFlashes = game.muzzleFlashes.filter((flash) => {
                flash.life--;
                flash.alpha = Math.max(0, flash.life / 8);
                return flash.life > 0;
            });

            // Draw everything
            const canvas = canvasRef.current;
            const reloadSeconds = Math.max(0, Number((reloadRemaining / 1000).toFixed(1)));
            if (canvas) {
                const ctx = canvas.getContext('2d');
                drawGrid(ctx, game.canvasWidth, game.canvasHeight);
                game.obstacles.forEach((obstacle) => drawObstacle(ctx, obstacle));
                game.tracerParticles.forEach((tracer) => drawTracer(ctx, tracer));
                game.muzzleFlashes.forEach((flash) => drawMuzzleFlash(ctx, flash));
                game.bullets.forEach((bullet) => drawBullet(ctx, bullet));
                game.explosions.forEach((exp) => drawExplosion(ctx, exp));
                drawTank(ctx, tank);

                ctx.fillText(`Thời gian hồi nạp: ${reloadSeconds}s`, 20, 20);
            }

            setGameState({
                tank: { ...tank },
                bullets: [...game.bullets],
                keys: { ...keys },
                reloadTime: reloadSeconds,
            });
        };

        const interval = setInterval(gameLoop, 1000 / 60); // 60 FPS

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="tank-battle-container">
            <div className="tank-battle-header">
                <h1>🎮 Trò Chơi Xe Tăng Chiến</h1>
                <p className="tank-battle-subtitle">
                    Điều khiển xe tăng và tiêu diệt mục tiêu
                </p>
            </div>
            <div className="tank-battle-game">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="tank-battle-canvas"
                />
                <audio
                    ref={moveAudioRef}
                    src={tankMoveSound}
                    volume={0.3}
                    loop
                />
                <audio
                    ref={shotAudioRef}
                    src={tankShotSound}
                    volume={0.5}
                />
            </div>
            <div className="tank-battle-instructions">
                <div className="instructions-col">
                    <h3>📋 Hướng dẫn chơi:</h3>
                    <ul>
                        <li>
                            <kbd>↑</kbd> <kbd>↓</kbd> hoặc <kbd>W</kbd> <kbd>S</kbd> - Tiến/Lùi
                        </li>
                        <li>
                            <kbd>Q</kbd> <kbd>E</kbd> - Di
                            chuyển ngang
                        </li>
                        <li>
                            <kbd>←</kbd> <kbd>→</kbd> hoặc <kbd>A</kbd> <kbd>D</kbd> - Xoay
                        </li>
                        <li>
                            <kbd>SPACE</kbd> - Bắn đạn
                        </li>
                    </ul>
                </div>
                <div className="instructions-col">
                    <h3>⚙️ Thống kê:</h3>
                    <ul>
                        <li>Số đạn: {gameState.bullets.length}</li>
                        <li>Vị trí X: {Math.round(gameState.tank.x)}</li>
                        <li>Vị trí Y: {Math.round(gameState.tank.y)}</li>
                        <li>Góc: {Math.round((gameState.tank.angle * 180) / Math.PI)}°</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TankBattle;
