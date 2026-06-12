import React, { useEffect, useRef, useState } from 'react';
import AITank from './AITank';
import * as draw from "./Draw"
import '../../assets/styles/TankBattle.css';
import tankMoveSound from '../../assets/sound/tank-battle/tank_move_sound_effect.mp3';
import tankShotSound from '../../assets/sound/tank-battle/tank_shot.mp3';
import shot from '../../assets/sound/tank-battle/gunshot.mp3'

const NUMBER_AI_TANK = 5

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
    const aiTanksRef = useRef([])

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
            { x: 200, y: 150, width: 80, height: 40, HP: 1000, MAX_HP: 1000 },
            { x: 600, y: 150, width: 60, height: 60, HP: 1000, MAX_HP: 1000 },
            { x: 100, y: 400, width: 100, height: 50, HP: 1000, MAX_HP: 1000 },
            { x: 600, y: 420, width: 80, height: 80, HP: 1000, MAX_HP: 1000 },
            { x: 350, y: 300, width: 50, height: 100, HP: 1000, MAX_HP: 1000 },
        ],
        keys: {},
        canvasWidth: 800,
        canvasHeight: 600,
        bulletSpeed: 30,
        bulletLife: 200,
        explosions: [],
        reloadDuration: 100,
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

    // Trong useEffect khởi tạo AI:
    useEffect(() => {
        const AIs = []
        const randomHexColor = () => {
            const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            return `#${randomHex}`;
        };

        for (let i = 0; i < NUMBER_AI_TANK; i++) {
            const ai = new AITank({
                color: randomHexColor(),
                x: Math.floor(Math.random() * gameRef.current.canvasWidth) + 100,
                y: Math.floor(Math.random() * gameRef.current.canvasHeight) + 100,
                angle: Math.floor(Math.random() * 2 * Math.PI),
            })
            AIs.push(ai)
        }
        aiTanksRef.current = AIs  // gán vào ref, không dùng setState
    }, [])

    const spawnExplosion = (x, y, damage) => {
        const shards = Array.from({ length: 8 }, () => ({
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            r: Math.random() * 3 + 1,
            alpha: Math.random() * 0.6 + 0.4,
        }));
        gameRef.current.explosions.push({ x, y, radius: 30, life: 20, maxLife: 20, alpha: 1, shards, damage });
    };

    const checkCollision = (x, y, width, height, obstacle) => {
        return (
            x - width / 2 < obstacle.x + obstacle.width &&
            x + width / 2 > obstacle.x &&
            y - height / 2 < obstacle.y + obstacle.height &&
            y + height / 2 > obstacle.y
        );
    };

    // Update game state
    useEffect(() => {
        const gameLoop = () => {
            const game = gameRef.current;
            const tank = game.tank;
            const aiTanks = aiTanksRef.current
            const keys = game.keys;
            const countBefore = game.obstacles.length;
            game.obstacles = game.obstacles.filter(({ HP }) => HP > 0);
            const destroyed = countBefore - game.obstacles.length;
            for (let i = 0; i < destroyed; i++) {
                draw.spawnRandomObstacle(game);
            }

            // ── AI TANK UPDATE ────────────────────────────────────────────────
            const currentTime = Date.now();
            for (let i = 0; i < aiTanks.length; i++) {
                aiTanks[i].run(
                    game,
                    game.obstacles,
                    currentTime,
                    game.canvasWidth,
                    game.canvasHeight,
                    checkCollision,
                    spawnExplosion, true)
            }

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
            const now = Date.now();
            const reloadRemaining = Math.max(0, game.reloadDuration - (now - game.lastShotTime));
            game.reloadRemaining = reloadRemaining;

            if (keys[' '] && now - game.lastShotTime >= game.reloadDuration) {
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
                    smokeTrail: [],
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
                    shotAudioRef.current.currentTime = 0;
                    shotAudioRef.current.play().catch(() => { });
                }

                game.lastShotTime = now;
                game.shotAudioPlaying = true;
            }


            game.bullets = game.bullets.filter((bullet) => {
                bullet.x += bullet.vx;
                bullet.y += bullet.vy;
                bullet.life--;

                draw.updateBulletSmoke(bullet);

                // kiểm tra va chạm với obstacle
                for (let i = 0; i < game.obstacles.length; i++) {
                    const obs = game.obstacles[i]
                    if (
                        bullet.x >= obs.x && bullet.x <= obs.x + obs.width &&
                        bullet.y >= obs.y && bullet.y <= obs.y + obs.height
                    ) {
                        spawnExplosion(bullet.x, bullet.y, 5);
                        if (game.obstacles[i].HP > 0) { game.obstacles[i].HP -= 5 }
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
                draw.drawGrid(ctx, game.canvasWidth, game.canvasHeight);
                game.obstacles.forEach((obstacle) => draw.drawObstacle(ctx, obstacle));
                game.tracerParticles.forEach((tracer) => draw.drawTracer(ctx, tracer));
                game.muzzleFlashes.forEach((flash) => draw.drawMuzzleFlash(ctx, flash));
                game.bullets.forEach((bullet) => {
                    draw.drawBulletSmoke(ctx, bullet);  // khói trước
                    draw.drawBullet(ctx, bullet);       // đạn sau
                });
                game.explosions.forEach((exp) => draw.drawExplosion(ctx, exp));
                draw.drawTank(ctx, tank);
                aiTanks.forEach((aiTank) => {
                    draw.drawAITank(ctx, aiTank.stat);
                    aiTank.bullets.forEach((bullet) => {
                        draw.drawBulletSmoke(ctx, bullet);
                        draw.drawBullet(ctx, bullet);
                    });
                });

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
                    src={shot}
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
