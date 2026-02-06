class Enemy {
    constructor(x, y, type, assets) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.assets = assets;
        this.alive = true;
        this.active = false;
        this.activateTimer = 0;
        this.bobTimer = Math.random() * Math.PI * 2;
        this.hurtTimer = 0;

        if (type === 'sword') {
            this.width = 56;
            this.height = 36;
            this.health = 3;
            this.maxHealth = 3;
            this.speed = 2.5;
            this.damage = 1;
            this.detectionRange = 300;
            this.attackRange = 40;
            this.spriteActive = 'sword_active';
            this.spriteInactive = 'sword_inactive';
            this.chargeSpeed = 5;
            this.charging = false;
            this.chargeTimer = 0;
            this.chargeCooldown = 0;
            this.chargeAngle = 0;
        } else if (type === 'shield') {
            this.width = 50;
            this.height = 40;
            this.health = 5;
            this.maxHealth = 5;
            this.speed = 1.2;
            this.damage = 1;
            this.detectionRange = 250;
            this.attackRange = 35;
            this.spriteActive = 'shield_active';
            this.spriteInactive = 'shield_inactive';
            this.blockAngle = Math.random() * Math.PI * 2;
            this.targetBlockAngle = this.blockAngle;
            this.blockArc = Math.PI * 0.7;
            this.blockTurnSpeed = 0.03; // slow turn so player can flank
        }

        // Patrol
        this.patrolOriginX = x;
        this.patrolOriginY = y;
        this.patrolAngle = Math.random() * Math.PI * 2;
        this.patrolTimer = 0;
        this.facingLeft = false;
    }

    update(player) {
        if (!this.alive) return;

        this.bobTimer += 0.08;
        if (this.hurtTimer > 0) this.hurtTimer--;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.detectionRange && player.alive) {
            this.active = true;
            this.activateTimer = 60;
        } else if (this.activateTimer > 0) {
            this.activateTimer--;
            if (this.activateTimer <= 0) this.active = false;
        }

        if (this.active && player.alive) {
            this.chase(player, dx, dy, dist);
        } else {
            this.patrol();
        }
    }

    chase(player, dx, dy, dist) {
        if (this.type === 'sword') {
            this.chaseSword(player, dx, dy, dist);
        } else {
            this.chaseShield(player, dx, dy, dist);
        }
    }

    chaseSword(player, dx, dy, dist) {
        if (this.chargeCooldown > 0) this.chargeCooldown--;

        if (this.charging) {
            this.x += Math.cos(this.chargeAngle) * this.chargeSpeed;
            this.y += Math.sin(this.chargeAngle) * this.chargeSpeed;
            this.chargeTimer--;
            if (this.chargeTimer <= 0) {
                this.charging = false;
                this.chargeCooldown = 90;
            }
        } else if (dist < 120 && this.chargeCooldown <= 0) {
            this.charging = true;
            this.chargeAngle = Math.atan2(dy, dx);
            this.chargeTimer = 20;
        } else {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
            this.facingLeft = dx < 0;
        }
    }

    chaseShield(player, dx, dy, dist) {
        const angle = Math.atan2(dy, dx);
        // Shield slowly turns to face the player (can be flanked)
        this.targetBlockAngle = angle;
        let diff = this.targetBlockAngle - this.blockAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.blockAngle += diff * this.blockTurnSpeed;

        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
        this.facingLeft = dx < 0;
    }

    patrol() {
        this.patrolTimer++;
        if (this.patrolTimer > 120) {
            this.patrolAngle = Math.random() * Math.PI * 2;
            this.patrolTimer = 0;
        }
        const px = this.patrolOriginX + Math.cos(this.patrolAngle) * 60;
        const py = this.patrolOriginY + Math.sin(this.patrolAngle) * 60;
        const dx = px - this.x;
        const dy = py - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 2) {
            this.x += (dx / dist) * this.speed * 0.5;
            this.y += (dy / dist) * this.speed * 0.5;
            this.facingLeft = dx < 0;
        }
    }

    takeDamage(amount, projectile) {
        // Shield block check: block if projectile comes from the direction the shield faces
        if (this.type === 'shield' && projectile) {
            const incomingAngle = Math.atan2(projectile.vy, projectile.vx);
            // Shield blocks attacks coming from the direction it faces
            // blockAngle faces toward player; incoming projectile travels toward shield
            // Block if the projectile is heading roughly opposite to blockAngle
            let angleDiff = incomingAngle - (this.blockAngle + Math.PI);
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            if (Math.abs(angleDiff) < this.blockArc / 2) {
                return false; // Blocked
            }
        }

        this.health -= amount;
        this.hurtTimer = 12;
        if (this.health <= 0) {
            this.alive = false;
        }
        return true;
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

        const spriteKey = this.active ? this.spriteActive : this.spriteInactive;
        const img = this.assets[spriteKey];
        const bob = Math.sin(this.bobTimer) * 3;
        const drawX = this.x + offset.x;
        const drawY = this.y + offset.y + bob;

        const isHurt = this.hurtTimer > 0;

        ctx.save();
        if (isHurt) {
            ctx.filter = 'brightness(3) saturate(0)';
        }

        if (img) {
            if (this.facingLeft) {
                ctx.save();
                ctx.translate(drawX + this.width, drawY);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0, this.width, this.height);
                ctx.restore();
            } else {
                ctx.drawImage(img, drawX, drawY, this.width, this.height);
            }
        } else {
            ctx.fillStyle = this.type === 'sword' ? '#cc4444' : '#4444cc';
            ctx.fillRect(drawX, drawY, this.width, this.height);
        }
        ctx.restore();

        // Health bar (always show when active)
        if (this.active || this.health < this.maxHealth) {
            const barW = this.width;
            const barH = 5;
            const barX = drawX;
            const barY = drawY - 10;
            ctx.fillStyle = '#222';
            ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
            ctx.fillStyle = '#444';
            ctx.fillRect(barX, barY, barW, barH);
            ctx.fillStyle = this.health > this.maxHealth * 0.3 ? '#e44' : '#f22';
            ctx.fillRect(barX, barY, barW * (this.health / this.maxHealth), barH);
        }

        // Shield direction indicator
        if (this.type === 'shield' && this.active) {
            const cx = drawX + this.width / 2;
            const cy = drawY + this.height / 2;
            const shieldDist = this.width * 0.6;
            const sx = cx + Math.cos(this.blockAngle) * shieldDist;
            const sy = cy + Math.sin(this.blockAngle) * shieldDist;
            ctx.fillStyle = 'rgba(100, 150, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(sx, sy, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
