import { updateBulletSmoke } from "./Draw";


export default class AITank {
    constructor(init = {}) {
        this.stat = {
            x: init?.x || 100,
            y: init?.y || 100,
            angle: init?.angle || 0,
            speed: 0,
            width: 30,
            height: 50,
            maxSpeed: 5,
            acceleration: 0.3,
            friction: 0.92,
            rotationSpeed: 0.04,
            crit_chance: 0.4,
            crit_multiple: 2000,

            // AI state machine
            state: 'patrol',       // 'patrol' | 'chase_obstacle' | 'aim'
            targetObstacleIdx: -1, // index vật cản đang nhắm
            patrolAngle: Math.random() * Math.PI * 2,
            patrolTimer: 0,
            lastShotTime: 0,
            reloadDuration: 120,   // chậm hơn player
            stuckTimer: 0,
            prevX: 100,
            prevY: 100,
            color: init?.color || "#3029c1"
        }
        this.bullets = []
    }

    _getNearestObstacleIdx = (obstacles) => {
        let minDist = Infinity, idx = -1;
        obstacles.forEach((obs, i) => {
            const cx = obs.x + obs.width / 2;
            const cy = obs.y + obs.height / 2;
            const d = Math.hypot(cx - this.stat.x, cy - this.stat.y);
            if (d < minDist) { minDist = d; idx = i; }
        });
        return { idx, dist: minDist };
    };

    _AITankState = (obstacles) => {
        if (obstacles.length > 0) {
            const { idx, dist } = this._getNearestObstacleIdx(obstacles);
            this.stat.targetObstacleIdx = idx;

            if (dist > 250) {
                this.stat.state = 'chase_obstacle';
            } else {
                this.stat.state = 'aim';
            }
        } else {
            this.stat.state = 'patrol';
            this.stat.targetObstacleIdx = -1;
        }
    }

    _AITankAction = (obstacles, now, game) => {
        if (this.stat.state === 'patrol') {
            this.stat.patrolTimer--;
            if (this.stat.patrolTimer <= 0) {
                this.stat.patrolAngle = Math.random() * Math.PI * 2;
                this.stat.patrolTimer = 80 + Math.floor(Math.random() * 80);
            }
            const da = this.stat.patrolAngle - this.stat.angle;
            const daNorm = Math.atan2(Math.sin(da), Math.cos(da));
            this.stat.angle += Math.sign(daNorm) * Math.min(this.stat.rotationSpeed, Math.abs(daNorm));
            this.stat.speed = Math.min(this.stat.speed + this.stat.acceleration, this.stat.maxSpeed * 0.6);
        }

        // --- State: chase_obstacle (tiến về phía vật cản) ---
        if (this.stat.state === 'chase_obstacle') {
            const obs = obstacles[this.stat.targetObstacleIdx];
            const tx = obs.x + obs.width / 2;
            const ty = obs.y + obs.height / 2;
            const targetAngle = Math.atan2(ty - this.stat.y, tx - this.stat.x);
            const da = targetAngle - this.stat.angle;
            const daNorm = Math.atan2(Math.sin(da), Math.cos(da));
            this.stat.angle += Math.sign(daNorm) * Math.min(this.stat.rotationSpeed, Math.abs(daNorm));
            if (Math.abs(daNorm) < 0.4) {
                this.stat.speed = Math.min(this.stat.speed + this.stat.acceleration, this.stat.maxSpeed);
            } else {
                this.stat.speed *= this.stat.friction;
            }
        }

        // --- State: aim (đứng yên, ngắm và bắn) ---
        if (this.stat.state === 'aim') {
            const obs = obstacles[this.stat.targetObstacleIdx];
            const tx = obs.x + obs.width / 2;
            const ty = obs.y + obs.height / 2;
            const targetAngle = Math.atan2(ty - this.stat.y, tx - this.stat.x);
            const da = targetAngle - this.stat.angle;
            const daNorm = Math.atan2(Math.sin(da), Math.cos(da));
            this.stat.angle += Math.sign(daNorm) * Math.min(this.stat.rotationSpeed * 1.5, Math.abs(daNorm));
            this.stat.speed *= this.stat.friction; // phanh lại

            // Bắn khi ngắm thẳng
            if (Math.abs(daNorm) < 0.08 &&
                now - this.stat.lastShotTime >= this.stat.reloadDuration) {
                const bx = this.stat.x + Math.cos(this.stat.angle) * 30;
                const by = this.stat.y + Math.sin(this.stat.angle) * 30;
                const vx = Math.cos(this.stat.angle) * game.bulletSpeed;
                const vy = Math.sin(this.stat.angle) * game.bulletSpeed;
                this.bullets.push({ x: bx, y: by, vx, vy, life: game.bulletLife, smokeTrail: [] });
                game.muzzleFlashes.push({
                    x: bx, y: by, angle: this.stat.angle, alpha: 1, life: 8,
                });
                game.tracerParticles.push({
                    x: bx,
                    y: by,
                    vx,
                    vy,
                    alpha: 0.9,
                    width: 4,
                    life: 10,
                });
                this.stat.lastShotTime = now;
            }
        }
    }

    _solveStuckProblem = () => {
        // --- Chống kẹt: nếu không di chuyển được thì đổi hướng ---
        this.stat.stuckTimer++;
        if (this.stat.stuckTimer % 60 === 0) {
            if (Math.hypot(this.stat.x - this.stat.prevX, this.stat.y - this.stat.prevY) < 2) {
                this.stat.angle += (Math.random() - 0.5) * Math.PI; // quay ngẫu nhiên
                this.stat.speed = -this.stat.maxSpeed; // lùi
            }
            this.stat.prevX = this.stat.x;
            this.stat.prevY = this.stat.y;
        }
    }

    _AITankMove = (obstacles, width, height, checkCollision) => {
        // --- Di chuyển AI ---
        const aiNewX = this.stat.x + Math.cos(this.stat.angle) * this.stat.speed;
        const aiNewY = this.stat.y + Math.sin(this.stat.angle) * this.stat.speed;

        let aiCanMove = true;
        for (const obs of obstacles) {
            if (checkCollision(aiNewX, aiNewY, this.stat.width, this.stat.height, obs)) {
                aiCanMove = false; break;
            }
        }
        if (aiCanMove) {
            this.stat.x = aiNewX; this.stat.y = aiNewY;
        } else {
            this.stat.speed = 0;
            this.stat.angle += this.stat.rotationSpeed * 3;
        }
        this.stat.x = Math.max(this.stat.width / 2, Math.min(this.stat.x, width - this.stat.width / 2));
        this.stat.y = Math.max(this.stat.height / 2, Math.min(this.stat.y, height - this.stat.height / 2));
    }

    _updateBullets = (obstacles, width, height, spawnExplosion) => {
        this.bullets = this.bullets.filter((bullet) => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;

            updateBulletSmoke(bullet);

            for (let i = 0; i < obstacles.length; i++) {
                const obs = obstacles[i];
                if (bullet.x >= obs.x && bullet.x <= obs.x + obs.width &&
                    bullet.y >= obs.y && bullet.y <= obs.y + obs.height) {
                    if (obs?.HP > 0) {
                        const isCrit = Math.random() < this.stat.crit_chance
                        const damage = isCrit ? (1 + Math.floor(1 * this.stat.crit_multiple / 100)) : 1
                        obs.HP -= damage
                        spawnExplosion(bullet.x, bullet.y, damage);
                    } else {
                        spawnExplosion(bullet.x, bullet.y, 0);
                    }

                    return false;
                }
            }
            return bullet.life > 0 &&
                bullet.x > 0 && bullet.x < width &&
                bullet.y > 0 && bullet.y < height;
        });
    }

    run = (game, obstacles, now, width, height, checkCollision, spawnExplosion, solveStuck = false) => {
        this._AITankState(obstacles)
        this._AITankAction(obstacles, now, game)
        if (solveStuck) { this._solveStuckProblem() }
        this._AITankMove(obstacles, width, height, checkCollision)
        this._updateBullets(obstacles, width, height, spawnExplosion)
    }
}