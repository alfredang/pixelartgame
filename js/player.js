class Player {
    constructor(x, y, assets) {
        this.x = x;
        this.y = y;
        this.width = 42;
        this.height = 58;
        this.speed = 3;
        this.health = 5;
        this.maxHealth = 5;
        this.gems = 0;
        this.invincibleTimer = 120; // spawn invincibility (2 seconds)
        this.assets = assets;
        this.direction = 'bottom';
        this.facingLeft = false;
        this.facingAngle = Math.PI / 2; // facing down initially
        this.currentSpell = 'fire';
        this.unlockedSpells = ['fire'];
        this.castCooldown = 0;
        this.alive = true;
        this.bobTimer = 0;

        this.dirSprites = {
            'bottom': 'godot_bottom',
            'right': 'godot_right',
            'up': 'godot_up',
            'bottom_right': 'godot_bottom_right',
            'up_right': 'godot_up_right'
        };

        this.handSprites = {
            'fire': 'hand_fire',
            'ice': 'hand_ice',
            'lightning': 'hand_lightning'
        };
    }

    update(input, worldWidth, worldHeight) {
        if (!this.alive) return;

        let dx = 0, dy = 0;
        if (input.isKeyDown('w') || input.isKeyDown('arrowup')) dy = -1;
        if (input.isKeyDown('s') || input.isKeyDown('arrowdown')) dy = 1;
        if (input.isKeyDown('a') || input.isKeyDown('arrowleft')) dx = -1;
        if (input.isKeyDown('d') || input.isKeyDown('arrowright')) dx = 1;

        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        if (dx !== 0 || dy !== 0) {
            this.bobTimer += 0.15;
            if (dx < 0) this.facingLeft = true;
            else if (dx > 0) this.facingLeft = false;

            // Update facing angle based on movement
            this.facingAngle = Math.atan2(dy, dx);

            const absDx = Math.abs(dx);
            if (dy > 0 && absDx > 0.3) this.direction = 'bottom_right';
            else if (dy > 0) this.direction = 'bottom';
            else if (dy < 0 && absDx > 0.3) this.direction = 'up_right';
            else if (dy < 0) this.direction = 'up';
            else this.direction = 'right';
        }

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        this.x = Math.max(0, Math.min(this.x, worldWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, worldHeight - this.height));

        if (input.isKeyDown('1') && this.unlockedSpells.includes('fire')) this.currentSpell = 'fire';
        if (input.isKeyDown('2') && this.unlockedSpells.includes('ice')) this.currentSpell = 'ice';
        if (input.isKeyDown('3') && this.unlockedSpells.includes('lightning')) this.currentSpell = 'lightning';

        if (this.castCooldown > 0) this.castCooldown--;
        if (this.invincibleTimer > 0) this.invincibleTimer--;
    }

    castSpell(mouseX, mouseY, cameraOffset, useMouseAim) {
        if (this.castCooldown > 0 || !this.alive) return null;

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        let angle;

        if (useMouseAim) {
            // Aim toward mouse cursor (world coords)
            const worldMouseX = mouseX - cameraOffset.x;
            const worldMouseY = mouseY - cameraOffset.y;
            angle = Math.atan2(worldMouseY - cy, worldMouseX - cx);
            // Also update facing direction to match aim
            this.facingAngle = angle;
            this.facingLeft = Math.cos(angle) < 0;
        } else {
            // Shoot in the direction player is facing
            angle = this.facingAngle;
        }

        let spell = null;
        if (this.currentSpell === 'fire') {
            this.castCooldown = 10;
            spell = new Projectile(cx, cy, angle, 'fire', this.assets);
        } else if (this.currentSpell === 'ice') {
            this.castCooldown = 25;
            spell = new Projectile(cx, cy, angle, 'ice', this.assets);
        } else if (this.currentSpell === 'lightning') {
            this.castCooldown = 15;
            spell = new Projectile(cx, cy, angle, 'lightning', this.assets);
        }
        return spell;
    }

    takeDamage(amount) {
        if (this.invincibleTimer > 0) return;
        this.health -= amount;
        this.invincibleTimer = 60;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    unlockSpell(type) {
        if (!this.unlockedSpells.includes(type)) {
            this.unlockedSpells.push(type);
            this.currentSpell = type;
        }
    }

    getBounds() {
        return {
            x: this.x + 6,
            y: this.y + 10,
            width: this.width - 12,
            height: this.height - 12
        };
    }

    draw(ctx, offset) {
        if (!this.alive) return;

        // Flicker when invincible
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 4) % 2 === 0) return;

        const spriteKey = this.dirSprites[this.direction];
        const img = this.assets[spriteKey];
        if (!img) return;

        const bob = Math.sin(this.bobTimer) * 2;
        const drawX = this.x + offset.x;
        const drawY = this.y + offset.y + bob;

        ctx.save();
        if (this.facingLeft) {
            ctx.translate(drawX + this.width, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(img, drawX, drawY, this.width, this.height);
        }
        ctx.restore();

        // Draw hand/weapon
        const handKey = this.handSprites[this.currentSpell];
        const handImg = this.assets[handKey];
        if (handImg) {
            const handSize = 20;
            const handOffX = this.facingLeft ? -8 : this.width - 12;
            ctx.save();
            if (this.facingLeft) {
                ctx.translate(this.x + offset.x + handOffX + handSize, drawY + this.height * 0.5);
                ctx.scale(-1, 1);
                ctx.drawImage(handImg, 0, 0, handSize, handSize);
            } else {
                ctx.drawImage(handImg, this.x + offset.x + handOffX, drawY + this.height * 0.5, handSize, handSize);
            }
            ctx.restore();
        }
    }
}
