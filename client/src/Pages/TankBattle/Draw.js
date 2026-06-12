export const spawnRandomObstacle = (game) => {
    const minW = 40, maxW = 100;
    const minH = 40, maxH = 100;
    const width = Math.floor(Math.random() * (maxW - minW + 1)) + minW;
    const height = Math.floor(Math.random() * (maxH - minH + 1)) + minH;
    const margin = 20;

    // Thử tối đa 20 lần để tìm vị trí không va chạm
    for (let attempt = 0; attempt < 20; attempt++) {
        const x = Math.floor(Math.random() * (game.canvasWidth - width - margin * 2)) + margin;
        const y = Math.floor(Math.random() * (game.canvasHeight - height - margin * 2)) + margin;

        // Kiểm tra không đè lên xe tăng
        const tank = game.tank;
        const overlapsTank =
            x < tank.x + tank.width / 2 + margin &&
            x + width > tank.x - tank.width / 2 - margin &&
            y < tank.y + tank.height / 2 + margin &&
            y + height > tank.y - tank.height / 2 - margin;

        // Kiểm tra không đè lên vật cản khác
        const overlapsOther = game.obstacles.some(obs =>
            x < obs.x + obs.width + margin &&
            x + width > obs.x - margin &&
            y < obs.y + obs.height + margin &&
            y + height > obs.y - margin
        );

        if (!overlapsTank && !overlapsOther) {
            const hp = Math.floor(Math.random() * 500 + 500); // HP ngẫu nhiên 500–1000
            game.obstacles.push({ x, y, width, height, HP: hp, MAX_HP: hp });
            return;
        }
    }
};


function lightenColor(hex, amt) {
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amt);
    const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amt);
    const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amt);
    return `rgb(${r},${g},${b})`;
}
function darkenColor(hex, amt) {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amt);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amt);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amt);
    return `rgb(${r},${g},${b})`;
}

function drawTankBase(ctx, x, y, angle, color, label) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const bodyW = 52, bodyH = 30, trackH = 10, trackPad = 4;

    // Xích xe — 2 bên
    [-1, 1].forEach(side => {
        const ty = side * (bodyH / 2 + trackPad);
        ctx.fillStyle = '#3a3028';
        ctx.beginPath();
        ctx.roundRect(-bodyW / 2 - 4, ty - trackH / 2, bodyW + 8, trackH, 4);
        ctx.fill();
        // Mắt xích
        ctx.fillStyle = '#5a4e40';
        for (let i = 0; i < bodyW + 8; i += 9)
            ctx.fillRect(-bodyW / 2 - 4 + i, ty - trackH / 2 + 1, 5, trackH - 2);
        ctx.strokeStyle = '#2a211a';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-bodyW / 2 - 4, ty - trackH / 2, bodyW + 8, trackH);
        // Bánh xe 2 đầu
        [-bodyW / 2 - 2, bodyW / 2 + 2].forEach(wx => {
            ctx.fillStyle = '#6a5a48';
            ctx.beginPath();
            ctx.arc(wx, ty, trackH / 2 - 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#3a2f26';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });
    });

    // Thân xe
    const bodyGrad = ctx.createLinearGradient(0, -bodyH / 2, 0, bodyH / 2);
    bodyGrad.addColorStop(0, lightenColor(color, 30));
    bodyGrad.addColorStop(0.5, color);
    bodyGrad.addColorStop(1, darkenColor(color, 25));
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, 3);
    ctx.fill();
    ctx.strokeStyle = darkenColor(color, 40);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Highlight mặt trên thân
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.roundRect(-bodyW / 2 + 2, -bodyH / 2 + 2, bodyW - 4, bodyH / 2 - 2, 2);
    ctx.fill();

    // Chi tiết thân
    ctx.fillStyle = darkenColor(color, 15);
    ctx.fillRect(-10, -bodyH / 2 + 4, 20, bodyH - 8);
    ctx.fillRect(-bodyW / 2 + 6, -2, bodyW - 12, 4);

    // Tháp pháo
    const turretGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 14);
    turretGrad.addColorStop(0, lightenColor(color, 20));
    turretGrad.addColorStop(1, darkenColor(color, 30));
    ctx.fillStyle = turretGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = darkenColor(color, 50);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Nòng pháo
    ctx.fillStyle = darkenColor(color, 35);
    ctx.beginPath();
    ctx.roundRect(8, -2.5, 34, 5, 2);
    ctx.fill();
    ctx.strokeStyle = darkenColor(color, 55);
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Bệ nòng
    ctx.fillStyle = darkenColor(color, 45);
    ctx.beginPath();
    ctx.roundRect(6, -3.5, 10, 7, 1);
    ctx.fill();

    // Đèn hướng
    ctx.fillStyle = '#e8c84a';
    ctx.beginPath();
    ctx.arc(-4, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b8941e';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();

    // Nhãn
    if (label) {
        ctx.save();
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = darkenColor(color, 40);
        ctx.fillText(label, x, y - 34);
        ctx.restore();
    }
}

export const drawTank = (ctx, tank) => {
    drawTankBase(ctx, tank.x, tank.y, tank.angle, '#4a7c3f', null);
};

export const drawAITank = (ctx, tank) => {
    drawTankBase(ctx, tank.x, tank.y, tank.angle, tank.color, 'AI');
};
// Draw tank
// export const drawTank = (ctx, tank) => {
//     ctx.save();
//     ctx.translate(tank.x, tank.y);
//     ctx.rotate(tank.angle);

//     // Tank body
//     ctx.fillStyle = '#2ECC71';
//     ctx.fillRect(-tank.height / 2, -tank.width / 2, tank.height, tank.width);

//     // Tank turret
//     ctx.fillStyle = '#27AE60';
//     ctx.beginPath();
//     ctx.arc(0, 0, 12, 0, Math.PI * 2);
//     ctx.fill();

//     // Tank barrel
//     ctx.strokeStyle = '#27AE60';
//     ctx.lineWidth = 4;
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     ctx.lineTo(35, 0);
//     ctx.stroke();

//     // Direction indicator
//     ctx.fillStyle = '#F39C12';
//     ctx.beginPath();
//     ctx.arc(tank.width + 5, 0, 3, 0, Math.PI * 2);
//     ctx.fill();

//     ctx.restore();
// };

// export const drawAITank = (ctx, tank) => {
//     ctx.save();
//     ctx.translate(tank.x, tank.y);
//     ctx.rotate(tank.angle);

//     // Thân xe — màu đỏ
//     ctx.fillStyle = tank.color;
//     ctx.fillRect(-tank.height / 2, -tank.width / 2, tank.height, tank.width);

//     // Tháp pháo
//     ctx.fillStyle = '#96281B';
//     ctx.beginPath();
//     ctx.arc(0, 0, 12, 0, Math.PI * 2);
//     ctx.fill();

//     // Nòng pháo
//     ctx.strokeStyle = '#96281B';
//     ctx.lineWidth = 4;
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     ctx.lineTo(35, 0);
//     ctx.stroke();

//     // Chỉ báo hướng
//     ctx.fillStyle = '#F1C40F';
//     ctx.beginPath();
//     ctx.arc(tank.width + 5, 0, 3, 0, Math.PI * 2);
//     ctx.fill();

//     ctx.restore();

//     // Nhãn "AI"
//     ctx.fillStyle = '#C0392B';
//     ctx.font = 'bold 11px monospace';
//     ctx.fillText('AI', tank.x - 7, tank.y - tank.height / 2 - 6);
// };

// Draw bullet
export const drawBullet = (ctx, bullet) => {
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

export const drawTracer = (ctx, tracer) => {
    ctx.strokeStyle = `rgba(241, 196, 15, ${tracer.alpha})`;
    ctx.lineWidth = tracer.width;
    ctx.beginPath();
    ctx.moveTo(tracer.x, tracer.y);
    ctx.lineTo(tracer.x + tracer.vx * 2, tracer.y + tracer.vy * 2);
    ctx.stroke();
};

export const drawMuzzleFlash = (ctx, flash) => {
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

export const drawObstacle = (ctx, obstacle) => {
    ctx.fillStyle = '#34495E';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    ctx.fillStyle = '#f8a2a2'
    ctx.fillRect(obstacle.x, obstacle.y - 10, obstacle.width, 5);

    ctx.fillStyle = '#fb0000'
    ctx.fillRect(obstacle.x, obstacle.y - 10,
        Math.max((obstacle.width * obstacle.HP), 0) / obstacle.MAX_HP, 5);
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.strokeRect(obstacle.x, obstacle.y - 10, obstacle.width, 5);

    // Add some texture
    ctx.fillStyle = 'rgba(44, 62, 80, 0.5)';
    for (let i = 0; i < obstacle.width; i += 10) {
        for (let j = 0; j < obstacle.height; j += 10) {
            ctx.fillRect(obstacle.x + i, obstacle.y + j, 5, 5);
        }
    }
};

// Draw grid background
export const drawGrid = (ctx, width, height) => {
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
export const drawExplosion = (ctx, exp) => {
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

    if (exp.damage) {
        ctx.save();
        ctx.globalAlpha = exp.alpha;
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = exp.damage > 1 ? '#FFD700' : '#FFFFFF';  // vàng nếu crit, trắng thường
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        const floatY = exp.y - 10 - (1 - exp.alpha) * 20;  // chữ bay lên theo thời gian
        ctx.strokeText(`${exp.damage}`, exp.x + 10, floatY);
        ctx.fillText(`${exp.damage}`, exp.x + 10, floatY);
        ctx.restore();
    }
};

// Cập nhật smoke trail — gọi trong game loop khi update bullets
export const updateBulletSmoke = (bullet) => {
    // Thêm particle khói tại vị trí hiện tại
    bullet.smokeTrail.push({
        x: bullet.x,
        y: bullet.y,
        alpha: 0.5,
        radius: 2,
        life: 18,
        maxLife: 18,
    });

    // Cập nhật và xóa particle cũ
    bullet.smokeTrail = bullet.smokeTrail.filter(p => {
        p.life--;
        p.alpha = (p.life / p.maxLife) * 0.45;
        p.radius += 0.3;   // khói nở dần
        p.x += (Math.random() - 0.5) * 0.4;  // drift nhẹ
        p.y += (Math.random() - 0.5) * 0.4;
        return p.life > 0;
    });
};

export const drawBulletSmoke = (ctx, bullet) => {
    bullet.smokeTrail.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#5f5f61';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}; 