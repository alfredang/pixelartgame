class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 960;
        this.canvas.height = 640;
        this.assets = {};
        this.state = 'loading'; // loading, start, playing, gameover, victory
        this.input = new InputManager(this.canvas);
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.audio = new AudioManager();
        this.projectiles = [];
        this.effects = [];
        this.loadProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;

        this.loadAssets().then(() => {
            this.state = 'start';
            this.initGame();
        });

        this.loop();
    }

    async loadAssets() {
        const assetList = {
            // Player
            godot_bottom: 'assets/player/godot_bottom.png',
            godot_bottom_right: 'assets/player/godot_bottom_right.png',
            godot_right: 'assets/player/godot_right.png',
            godot_up: 'assets/player/godot_up.png',
            godot_up_right: 'assets/player/godot_up_right.png',
            hand_fire: 'assets/player/hand_fire.png',
            hand_fire_closed: 'assets/player/hand_fire_closed.png',
            hand_fire_point: 'assets/player/hand_fire_point.png',
            hand_ice: 'assets/player/hand_ice.png',
            hand_ice_open: 'assets/player/hand_ice_open.png',
            hand_ice_point: 'assets/player/hand_ice_point.png',
            hand_lightning: 'assets/player/hand_lightning.png',
            hand_lightning_closed: 'assets/player/hand_lightning_closed.png',
            hand_lightning_open: 'assets/player/hand_lightning_open.png',

            // Enemies
            sword_active: 'assets/enemies/sword/sword_active.png',
            sword_inactive: 'assets/enemies/sword/sword_inactive.png',
            shield_active: 'assets/enemies/shield/shield_active.png',
            shield_inactive: 'assets/enemies/shield/shield_inactive.png',

            // Spells
            fire: 'assets/spells/fire.png',
            fire_trail: 'assets/spells/fire_trail.png',
            ice: 'assets/spells/ice.png',
            ice_trail: 'assets/spells/ice_trail.png',
            lightning: 'assets/spells/lightning.png',
            lightning_trail: 'assets/spells/lightning_trail.png',

            // Pickups
            pickup_gem: 'assets/pickups/pickup_gem.png',
            pickup_health: 'assets/pickups/pickup_health.png',
            pickup_heart_pink: 'assets/pickups/pickup_heart_pink.png',
            pickup_heart_darkpink: 'assets/pickups/pickup_heart_darkpink.png',
            pickup_heart_teal: 'assets/pickups/pickup_heart_teal.png',
            pickup_fire: 'assets/pickups/pickup_fire.png',
            pickup_ice: 'assets/pickups/pickup_ice.png',
            pickup_lightning: 'assets/pickups/pickup_lightning.png',

            // Interface
            flame_icon: 'assets/interface/flame_icon.png',
            flame_background: 'assets/interface/flame_background.png',
            ice_icon: 'assets/interface/ice_icon.png',
            ice_background: 'assets/interface/ice_background.png',
            lightning_icon: 'assets/interface/lightning_icon.png',
            lightning_background: 'assets/interface/lightning_background.png',

            // Props
            statue_sword: 'assets/props/statue_sword.png',
            statue_hammer: 'assets/props/statue_hammer.png',
            statue_mace: 'assets/props/statue_mace.png',
            statue_robot: 'assets/props/statue_robot.png',
            statue_ruin: 'assets/props/statue_ruin.png',
            statue_gems: 'assets/props/statue_gems.png',
            pot_clay_1: 'assets/props/pot_clay_1.png',
            pot_clay_2: 'assets/props/pot_clay_2.png',
            pot_clay_3: 'assets/props/pot_clay_3.png',
            pot_clay_4: 'assets/props/pot_clay_4.png',
            pot_clay_stacked: 'assets/props/pot_clay_stacked.png',
            pot_clay_gems: 'assets/props/pot_clay_gems.png',
            pot_stone_1: 'assets/props/pot_stone_1.png',
            pot_stone_2: 'assets/props/pot_stone_2.png',
            pot_stone_3: 'assets/props/pot_stone_3.png',
            pot_stone_4: 'assets/props/pot_stone_4.png',
            pot_stone_stacked: 'assets/props/pot_stone_stacked.png',
            books_1: 'assets/props/books_1.png',
            books_2: 'assets/props/books_2.png',
            books_3: 'assets/props/books_3.png',
            books_4: 'assets/props/books_4.png',
            book_large: 'assets/props/book_large.png',
            book_medium: 'assets/props/book_medium.png',
            book_small: 'assets/props/book_small.png',
            book_tiny: 'assets/props/book_tiny.png',
            table_medium: 'assets/props/table_medium.png',
            table_small: 'assets/props/table_small.png',
            table_large_left: 'assets/props/table_large_left.png',
            table_large_right: 'assets/props/table_large_right.png',
            table_large_pots: 'assets/props/table_large_pots.png',
            rocks_gems: 'assets/props/rocks_gems.png',
            rocks_shield: 'assets/props/rocks_shield.png',
            rocks_sword: 'assets/props/rocks_sword.png',
            grass_rock_1: 'assets/props/grass_rock_1.png',
            grass_rock_2: 'assets/props/grass_rock_2.png',
            grass_rock_3: 'assets/props/grass_rock_3.png',
            grass_rock_4: 'assets/props/grass_rock_4.png',
            grass_wall_1: 'assets/props/grass_wall_1.png',
            grass_wall_2: 'assets/props/grass_wall_2.png',

            // Background
            island_1: 'assets/background/island_1.png',
            island_2: 'assets/background/island_2.png',
            island_3: 'assets/background/island_3.png',
            far_island_1: 'assets/background/far_island_1.png',
            far_island_2: 'assets/background/far_island_2.png',
            far_island_3: 'assets/background/far_island_3.png',
            cloud_a: 'assets/background/cloud_a.png',
            cloud_b: 'assets/background/cloud_b.png',
            cloud_c: 'assets/background/cloud_c.png',
            cloud_d: 'assets/background/cloud_d.png',
        };

        // Add gem prop variants
        const gemColors = ['blue', 'green', 'red', 'silver', 'yellow', 'mixed'];
        for (const color of gemColors) {
            for (let i = 1; i <= 5; i++) {
                assetList[`gems_${color}_${i}`] = `assets/props/gems_${color}_${i}.png`;
            }
        }

        this.totalAssets = Object.keys(assetList).length;
        this.loadedAssets = 0;

        const promises = Object.entries(assetList).map(([key, path]) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.assets[key] = img;
                    this.loadedAssets++;
                    this.loadProgress = this.loadedAssets / this.totalAssets;
                    resolve();
                };
                img.onerror = () => {
                    this.loadedAssets++;
                    this.loadProgress = this.loadedAssets / this.totalAssets;
                    resolve();
                };
                img.src = path;
            });
        });

        await Promise.all(promises);
    }

    initGame() {
        this.level = new Level(this.assets);
        const startRoom = this.level.rooms[0];
        this.player = new Player(
            startRoom.x + startRoom.w / 2 - 21,
            startRoom.y + startRoom.h / 2 - 29,
            this.assets
        );
        this.player.enemiesDefeated = 0;
        this.projectiles = [];
        this.effects = [];
        this.ui = new UI(this.canvas, this.assets);
        this.prevSpell = this.player.currentSpell;
    }

    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        if (this.state === 'loading') return;

        if (this.state === 'start') {
            if (this.input.consumeClick()) {
                this.state = 'playing';
            }
            return;
        }

        if (this.state === 'gameover' || this.state === 'victory') {
            if (this.input.consumeClick()) {
                this.initGame();
                this.state = 'playing';
            }
            return;
        }

        // Playing state
        const prevX = this.player.x;
        const prevY = this.player.y;

        this.player.update(this.input, this.level.worldWidth, this.level.worldHeight);

        // Spell switch sound
        if (this.player.currentSpell !== this.prevSpell) {
            this.audio.playSelect(this.player.currentSpell);
            this.prevSpell = this.player.currentSpell;
        }

        // Collision with solid objects
        const solids = this.level.getSolidBounds();
        const pb = this.player.getBounds();
        for (const solid of solids) {
            if (this.rectsOverlap(pb, solid)) {
                this.player.x = prevX;
                this.player.y = prevY;
                break;
            }
        }

        // Casting spells
        const mouseAim = this.input.mouse.down;
        const keyboardShoot = this.input.isKeyDown(' ');
        if (mouseAim || keyboardShoot) {
            const castOffset = { x: -this.camera.x, y: -this.camera.y };
            const spell = this.player.castSpell(this.input.mouse.x, this.input.mouse.y, castOffset, mouseAim);
            if (spell) {
                this.projectiles.push(spell);
                this.audio.playShoot(spell.type);
            }
        }

        // Update projectiles
        for (const proj of this.projectiles) {
            proj.update();
            // Check collision with walls
            const pBounds = proj.getBounds();
            for (const wall of this.level.walls) {
                if (this.rectsOverlap(pBounds, wall)) {
                    proj.alive = false;
                    this.effects.push(new ParticleEffect(proj.x, proj.y,
                        proj.type === 'fire' ? '#ff6633' : proj.type === 'ice' ? '#33ccff' : '#ffff33', 6));
                    break;
                }
            }
        }

        // Update enemies
        for (const enemy of this.level.enemies) {
            enemy.update(this.player);

            // Enemy-player collision
            if (enemy.alive && enemy.active && this.player.alive) {
                const eb = enemy.getBounds();
                const plb = this.player.getBounds();
                if (this.rectsOverlap(eb, plb)) {
                    this.player.takeDamage(enemy.damage);
                    if (this.player.invincibleTimer === 60) {
                        // Just took damage this frame
                        this.audio.playPain();
                        this.camera.shake(8);
                    }
                    if (!this.player.alive) {
                        this.audio.playDeath();
                        this.state = 'gameover';
                    }
                }
            }

            // Projectile-enemy collision (distance-based for reliability)
            for (const proj of this.projectiles) {
                if (!proj.alive || !enemy.alive) continue;
                const ecx = enemy.x + enemy.width / 2;
                const ecy = enemy.y + enemy.height / 2;
                const dx = proj.x - ecx;
                const dy = proj.y - ecy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const hitRadius = (enemy.width + enemy.height) / 3 + 8;
                if (dist < hitRadius) {
                    const hit = enemy.takeDamage(proj.damage, proj);
                    if (hit) {
                        this.audio.playHit(proj.type);
                        this.effects.push(new ParticleEffect(proj.x, proj.y,
                            proj.type === 'fire' ? '#ff6633' : proj.type === 'ice' ? '#33ccff' : '#ffff33', 10));
                        this.camera.shake(4);
                        if (!enemy.alive) {
                            this.player.enemiesDefeated++;
                            this.level.pickups.push(new Pickup(enemy.x, enemy.y, 'gem', this.assets));
                            this.effects.push(new ParticleEffect(ecx, ecy, '#fff', 15));
                        }
                    } else {
                        this.effects.push(new ParticleEffect(proj.x, proj.y, '#8888ff', 5));
                    }
                    proj.alive = false;
                }
            }
        }

        // Update pickups
        for (const pickup of this.level.pickups) {
            pickup.update();
            if (!pickup.alive) continue;
            const pcx = pickup.x + pickup.width / 2;
            const pcy = pickup.y + pickup.height / 2;
            const plcx = this.player.x + this.player.width / 2;
            const plcy = this.player.y + this.player.height / 2;
            const pdist = Math.sqrt((pcx - plcx) ** 2 + (pcy - plcy) ** 2);
            if (pdist < 40) {
                pickup.alive = false;
                this.audio.playPickup(pickup.type);
                if (pickup.type === 'gem') {
                    this.player.gems++;
                } else if (pickup.type === 'health') {
                    this.player.heal(1);
                } else if (['fire', 'ice', 'lightning'].includes(pickup.type)) {
                    this.player.unlockSpell(pickup.type);
                    this.effects.push(new ParticleEffect(pickup.x, pickup.y,
                        pickup.type === 'fire' ? '#ff6633' : pickup.type === 'ice' ? '#33ccff' : '#ffff33', 20));
                }
            }
        }

        // Update effects
        for (const effect of this.effects) {
            effect.update();
        }

        // Clean up dead entities
        this.projectiles = this.projectiles.filter(p => p.alive);
        this.level.pickups = this.level.pickups.filter(p => p.alive);
        this.effects = this.effects.filter(e => e.alive);

        // Check victory
        if (this.level.enemies.every(e => !e.alive)) {
            this.state = 'victory';
        }

        // Update camera
        this.camera.follow(this.player, this.level.worldWidth, this.level.worldHeight);

        this.input.resetFrame();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === 'loading') {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = '#ff9944';
            ctx.font = '24px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2 - 20);
            const barW = 300;
            const barH = 12;
            const barX = (this.canvas.width - barW) / 2;
            const barY = this.canvas.height / 2 + 10;
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barW, barH);
            ctx.fillStyle = '#ff9944';
            ctx.fillRect(barX, barY, barW * this.loadProgress, barH);
            return;
        }

        if (this.state === 'start') {
            this.ui.drawStartScreen(ctx);
            return;
        }

        // Game rendering
        const offset = this.camera.getOffset();

        this.level.drawBackground(ctx, offset);
        this.level.drawWalls(ctx, offset);
        this.level.drawProps(ctx, offset);

        // Collect all drawable entities for y-sorting
        const entities = [];

        for (const pickup of this.level.pickups) {
            if (pickup.alive) entities.push({ y: pickup.y, draw: () => pickup.draw(ctx, offset) });
        }
        for (const enemy of this.level.enemies) {
            if (enemy.alive) entities.push({ y: enemy.y, draw: () => enemy.draw(ctx, offset) });
        }
        if (this.player.alive) {
            entities.push({ y: this.player.y, draw: () => this.player.draw(ctx, offset) });
        }

        entities.sort((a, b) => a.y - b.y);
        for (const entity of entities) {
            entity.draw();
        }

        for (const proj of this.projectiles) {
            proj.draw(ctx, offset);
        }

        for (const effect of this.effects) {
            effect.draw(ctx, offset);
        }

        this.ui.drawHUD(ctx, this.player);

        if (this.state === 'gameover') {
            this.ui.drawGameOver(ctx, this.player);
        } else if (this.state === 'victory') {
            this.ui.drawVictory(ctx, this.player);
        }
    }

    rectsOverlap(a, b) {
        const aw = a.w !== undefined ? a.w : a.width;
        const ah = a.h !== undefined ? a.h : a.height;
        const bw = b.w !== undefined ? b.w : b.width;
        const bh = b.h !== undefined ? b.h : b.height;
        return a.x < b.x + bw && a.x + aw > b.x &&
               a.y < b.y + bh && a.y + ah > b.y;
    }
}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
