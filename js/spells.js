class Projectile {
    constructor(x, y, angle, type, assets) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.type = type;
        this.assets = assets;
        this.alive = true;
        this.lifetime = 0;

        // Type-specific properties
        if (type === 'fire') {
            this.speed = 7;
            this.damage = 1;
            this.maxLifetime = 70;
            this.width = 30;
            this.height = 22;
            this.sprite = 'fire';
            this.trailSprite = 'fire_trail';
        } else if (type === 'ice') {
            this.speed = 8;
            this.damage = 3;
            this.maxLifetime = 50;
            this.width = 36;
            this.height = 28;
            this.sprite = 'ice';
            this.trailSprite = 'ice_trail';
        } else if (type === 'lightning') {
            this.speed = 11;
            this.damage = 2;
            this.maxLifetime = 40;
            this.width = 32;
            this.height = 24;
            this.sprite = 'lightning';
            this.trailSprite = 'lightning_trail';
        }

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.trail = [];
    }

    update() {
        if (!this.alive) return;

        // Store trail position
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > 8) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;
        this.lifetime++;

        if (this.lifetime >= this.maxLifetime) {
            this.alive = false;
        }

        // Fade trail
        for (let t of this.trail) {
            t.alpha -= 0.12;
        }
    }

    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    draw(ctx, offset) {
        if (!this.alive) return;

        // Draw trail
        const trailImg = this.assets[this.trailSprite];
        if (trailImg) {
            for (let t of this.trail) {
                if (t.alpha <= 0) continue;
                ctx.save();
                ctx.globalAlpha = Math.max(0, t.alpha);
                ctx.translate(t.x + offset.x, t.y + offset.y);
                ctx.rotate(this.angle);
                ctx.drawImage(trailImg, -6, -6, 12, 12);
                ctx.restore();
            }
        }

        // Draw projectile
        const img = this.assets[this.sprite];
        if (img) {
            ctx.save();
            ctx.translate(this.x + offset.x, this.y + offset.y);
            ctx.rotate(this.angle);
            ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else {
            // Fallback colored circle
            const colors = { fire: '#ff6633', ice: '#66ccff', lightning: '#ffff33' };
            ctx.fillStyle = colors[this.type] || '#fff';
            ctx.beginPath();
            ctx.arc(this.x + offset.x, this.y + offset.y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}

class ParticleEffect {
    constructor(x, y, color, count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 20 + Math.random() * 20,
                maxLife: 20 + Math.random() * 20,
                color,
                size: 2 + Math.random() * 4
            });
        }
        this.alive = true;
    }

    update() {
        let allDead = true;
        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.life--;
            if (p.life > 0) allDead = false;
        }
        if (allDead) this.alive = false;
    }

    draw(ctx, offset) {
        for (let p of this.particles) {
            if (p.life <= 0) continue;
            ctx.save();
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x + offset.x - p.size / 2, p.y + offset.y - p.size / 2, p.size, p.size);
            ctx.restore();
        }
    }
}
