class Pickup {
    constructor(x, y, type, assets) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.assets = assets;
        this.alive = true;
        this.bobTimer = Math.random() * Math.PI * 2;
        this.width = 27;
        this.height = 22;

        this.spriteMap = {
            'gem': 'pickup_gem',
            'health': 'pickup_heart_pink',
            'fire': 'pickup_fire',
            'ice': 'pickup_ice',
            'lightning': 'pickup_lightning'
        };
    }

    update() {
        this.bobTimer += 0.06;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    draw(ctx, offset) {
        if (!this.alive) return;

        const bob = Math.sin(this.bobTimer) * 4;
        const spriteKey = this.spriteMap[this.type];
        const img = this.assets[spriteKey];
        const drawX = this.x + offset.x;
        const drawY = this.y + offset.y + bob;

        // Glow effect
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(this.bobTimer * 2) * 0.15;
        const glowColors = {
            gem: '#44ff88',
            health: '#ff4488',
            fire: '#ff6633',
            ice: '#33ccff',
            lightning: '#ffff33'
        };
        ctx.fillStyle = glowColors[this.type] || '#fff';
        ctx.beginPath();
        ctx.arc(drawX + this.width / 2, drawY + this.height / 2, this.width * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (img) {
            ctx.drawImage(img, drawX, drawY, this.width, this.height);
        } else {
            ctx.fillStyle = glowColors[this.type] || '#fff';
            ctx.fillRect(drawX + 4, drawY + 4, this.width - 8, this.height - 8);
        }
    }
}
