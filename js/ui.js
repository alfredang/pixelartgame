class UI {
    constructor(canvas, assets) {
        this.canvas = canvas;
        this.assets = assets;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    drawHUD(ctx, player) {
        const padding = 16;
        const heartSize = 28;
        const heartGap = 6;

        // Health hearts
        for (let i = 0; i < player.maxHealth; i++) {
            const x = padding + i * (heartSize + heartGap);
            const y = padding;
            const img = i < player.health
                ? this.assets['pickup_heart_pink']
                : this.assets['pickup_heart_darkpink'];

            if (img) {
                ctx.drawImage(img, x, y, heartSize, heartSize);
            } else {
                ctx.fillStyle = i < player.health ? '#ff4488' : '#663344';
                ctx.fillRect(x, y, heartSize, heartSize);
            }
        }

        // Gem counter
        const gemImg = this.assets['pickup_gem'];
        const gemX = padding;
        const gemY = padding + heartSize + 10;
        if (gemImg) {
            ctx.drawImage(gemImg, gemX, gemY, 24, 20);
        }
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`x ${player.gems}`, gemX + 28, gemY + 16);

        // Spell indicator
        const spellY = padding;
        const spellX = this.width - padding - 120;

        // Background panel
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(spellX - 8, spellY - 4, 128, 44, 6);
        ctx.fill();
        ctx.stroke();

        const spells = ['fire', 'ice', 'lightning'];
        const spellColors = { fire: '#ff6633', ice: '#33ccff', lightning: '#ffff33' };
        const spellIcons = { fire: 'flame_icon', ice: 'ice_icon', lightning: 'lightning_icon' };

        for (let i = 0; i < spells.length; i++) {
            const spell = spells[i];
            const sx = spellX + i * 40;
            const sy = spellY;
            const unlocked = player.unlockedSpells.includes(spell);
            const active = player.currentSpell === spell;

            if (active) {
                ctx.fillStyle = spellColors[spell];
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.roundRect(sx - 2, sy - 2, 38, 38, 4);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeStyle = spellColors[spell];
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(sx - 2, sy - 2, 38, 38, 4);
                ctx.stroke();
            }

            if (!unlocked) ctx.globalAlpha = 0.25;

            const icon = this.assets[spellIcons[spell]];
            if (icon) {
                ctx.drawImage(icon, sx + 2, sy + 2, 30, 30);
            } else {
                ctx.fillStyle = spellColors[spell];
                ctx.fillRect(sx + 8, sy + 8, 18, 18);
            }

            // Key number
            ctx.fillStyle = unlocked ? '#fff' : '#666';
            ctx.font = 'bold 10px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${i + 1}`, sx + 17, sy + 44);

            ctx.globalAlpha = 1;
        }
    }

    drawStartScreen(ctx) {
        // Dark overlay
        ctx.fillStyle = 'rgba(10, 10, 20, 0.92)';
        ctx.fillRect(0, 0, this.width, this.height);

        // Title
        ctx.fillStyle = '#ff9944';
        ctx.font = 'bold 48px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText("GODOT'S DUNGEON", this.width / 2, this.height / 2 - 80);

        // Subtitle
        ctx.fillStyle = '#aab';
        ctx.font = '18px "Courier New", monospace';
        ctx.fillText('A Pixel Art Adventure', this.width / 2, this.height / 2 - 40);

        // Instructions
        const instructions = [
            'WASD / Arrow Keys  -  Move',
            'Mouse Click  -  Cast Spell',
            '1 / 2 / 3  -  Switch Spells',
            'Collect gems, defeat enemies, survive!',
        ];
        ctx.fillStyle = '#889';
        ctx.font = '14px "Courier New", monospace';
        for (let i = 0; i < instructions.length; i++) {
            ctx.fillText(instructions[i], this.width / 2, this.height / 2 + 20 + i * 28);
        }

        // Blinking start prompt
        if (Math.floor(Date.now() / 600) % 2 === 0) {
            ctx.fillStyle = '#ff9944';
            ctx.font = 'bold 22px "Courier New", monospace';
            ctx.fillText('[ Click to Start ]', this.width / 2, this.height / 2 + 160);
        }
    }

    drawGameOver(ctx, player) {
        ctx.fillStyle = 'rgba(10, 5, 5, 0.88)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#e44';
        ctx.font = 'bold 48px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 40);

        ctx.fillStyle = '#aab';
        ctx.font = '20px "Courier New", monospace';
        ctx.fillText(`Gems collected: ${player.gems}`, this.width / 2, this.height / 2 + 20);

        const enemiesLeft = 0; // will be passed in
        ctx.fillText(`Enemies defeated: ${player.enemiesDefeated || 0}`, this.width / 2, this.height / 2 + 50);

        if (Math.floor(Date.now() / 600) % 2 === 0) {
            ctx.fillStyle = '#e44';
            ctx.font = 'bold 20px "Courier New", monospace';
            ctx.fillText('[ Click to Restart ]', this.width / 2, this.height / 2 + 110);
        }
    }

    drawVictory(ctx, player) {
        ctx.fillStyle = 'rgba(5, 10, 5, 0.88)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#4f4';
        ctx.font = 'bold 48px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', this.width / 2, this.height / 2 - 40);

        ctx.fillStyle = '#aab';
        ctx.font = '20px "Courier New", monospace';
        ctx.fillText(`Gems collected: ${player.gems}`, this.width / 2, this.height / 2 + 20);
        ctx.fillText('All enemies defeated!', this.width / 2, this.height / 2 + 50);

        if (Math.floor(Date.now() / 600) % 2 === 0) {
            ctx.fillStyle = '#4f4';
            ctx.font = 'bold 20px "Courier New", monospace';
            ctx.fillText('[ Click to Play Again ]', this.width / 2, this.height / 2 + 110);
        }
    }
}
