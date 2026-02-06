class Level {
    constructor(assets) {
        this.assets = assets;
        this.worldWidth = 2400;
        this.worldHeight = 1800;
        this.props = [];
        this.enemies = [];
        this.pickups = [];
        this.floorTiles = [];
        this.walls = [];
        this.currentRoom = 0;
        this.rooms = [];
        this.generateLevel();
    }

    generateLevel() {
        this.props = [];
        this.enemies = [];
        this.pickups = [];
        this.walls = [];

        // Generate room layout
        this.generateRooms();

        // Player spawn point (center of room 0)
        const r0 = this.rooms[0];
        this.playerSpawnX = r0.x + r0.w / 2;
        this.playerSpawnY = r0.y + r0.h / 2;

        this.generateProps();
        this.generateEnemies();
        this.generatePickups();
    }

    // Check if a position is too close to the player spawn
    isTooCloseToSpawn(x, y, w, h, minDist) {
        const cx = x + (w || 0) / 2;
        const cy = y + (h || 0) / 2;
        const dx = cx - this.playerSpawnX;
        const dy = cy - this.playerSpawnY;
        return Math.sqrt(dx * dx + dy * dy) < minDist;
    }

    generateRooms() {
        // Create 4 connected rooms in a 2x2 grid
        const roomW = 1100;
        const roomH = 850;
        const wallThickness = 40;

        this.rooms = [
            { x: 50, y: 50, w: roomW, h: roomH },
            { x: roomW + 150, y: 50, w: roomW, h: roomH },
            { x: 50, y: roomH + 150, w: roomW, h: roomH },
            { x: roomW + 150, y: roomH + 150, w: roomW, h: roomH },
        ];

        // Create walls around each room with doorways
        for (const room of this.rooms) {
            const doorSize = 120;
            const midX = room.x + room.w / 2 - doorSize / 2;
            const midY = room.y + room.h / 2 - doorSize / 2;

            // Top wall (with door gap in center)
            this.walls.push({ x: room.x, y: room.y, w: room.w / 2 - doorSize / 2, h: wallThickness });
            this.walls.push({ x: midX + doorSize, y: room.y, w: room.w / 2 - doorSize / 2, h: wallThickness });
            // Bottom wall
            this.walls.push({ x: room.x, y: room.y + room.h - wallThickness, w: room.w / 2 - doorSize / 2, h: wallThickness });
            this.walls.push({ x: midX + doorSize, y: room.y + room.h - wallThickness, w: room.w / 2 - doorSize / 2, h: wallThickness });
            // Left wall
            this.walls.push({ x: room.x, y: room.y, w: wallThickness, h: room.h / 2 - doorSize / 2 });
            this.walls.push({ x: room.x, y: midY + doorSize, w: wallThickness, h: room.h / 2 - doorSize / 2 });
            // Right wall
            this.walls.push({ x: room.x + room.w - wallThickness, y: room.y, w: wallThickness, h: room.h / 2 - doorSize / 2 });
            this.walls.push({ x: room.x + room.w - wallThickness, y: midY + doorSize, w: wallThickness, h: room.h / 2 - doorSize / 2 });
        }
    }

    generateProps() {
        const propTypes = [
            { name: 'statue_sword', w: 80, h: 80, solid: true },
            { name: 'statue_hammer', w: 80, h: 80, solid: true },
            { name: 'statue_mace', w: 80, h: 80, solid: true },
            { name: 'statue_robot', w: 80, h: 80, solid: true },
            { name: 'statue_ruin', w: 80, h: 80, solid: true },
            { name: 'pot_clay_1', w: 36, h: 36, solid: true },
            { name: 'pot_clay_2', w: 36, h: 36, solid: true },
            { name: 'pot_stone_1', w: 36, h: 36, solid: true },
            { name: 'pot_stone_2', w: 36, h: 36, solid: true },
            { name: 'pot_clay_stacked', w: 40, h: 50, solid: true },
            { name: 'books_1', w: 40, h: 30, solid: false },
            { name: 'books_2', w: 40, h: 30, solid: false },
            { name: 'books_3', w: 40, h: 30, solid: false },
            { name: 'table_medium', w: 80, h: 60, solid: true },
            { name: 'table_small', w: 60, h: 45, solid: true },
            { name: 'rocks_gems', w: 60, h: 50, solid: true },
            { name: 'rocks_shield', w: 60, h: 50, solid: true },
            { name: 'rocks_sword', w: 60, h: 50, solid: true },
            { name: 'grass_rock_1', w: 50, h: 40, solid: false },
            { name: 'grass_rock_2', w: 50, h: 40, solid: false },
        ];

        // Place props in each room (avoid player spawn in room 0)
        for (let ri = 0; ri < this.rooms.length; ri++) {
            const room = this.rooms[ri];
            const numProps = 8 + Math.floor(Math.random() * 6);
            for (let i = 0; i < numProps; i++) {
                const propType = propTypes[Math.floor(Math.random() * propTypes.length)];
                const margin = 80;
                let x, y, attempts = 0;
                do {
                    x = room.x + margin + Math.random() * (room.w - margin * 2 - propType.w);
                    y = room.y + margin + Math.random() * (room.h - margin * 2 - propType.h);
                    attempts++;
                } while (ri === 0 && propType.solid && attempts < 20 &&
                         this.isTooCloseToSpawn(x, y, propType.w, propType.h, 150));

                this.props.push({
                    x, y,
                    w: propType.w,
                    h: propType.h,
                    sprite: propType.name,
                    solid: propType.solid
                });
            }
        }

        // Place gem decorations scattered around
        const gemColors = ['blue', 'green', 'red', 'silver', 'yellow'];
        for (const room of this.rooms) {
            const numGems = 3 + Math.floor(Math.random() * 4);
            for (let i = 0; i < numGems; i++) {
                const color = gemColors[Math.floor(Math.random() * gemColors.length)];
                const variant = 1 + Math.floor(Math.random() * 5);
                const x = room.x + 60 + Math.random() * (room.w - 120);
                const y = room.y + 60 + Math.random() * (room.h - 120);
                this.props.push({
                    x, y,
                    w: 30, h: 25,
                    sprite: `gems_${color}_${variant}`,
                    solid: false
                });
            }
        }
    }

    generateEnemies() {
        // Room 0: 2 swords (starting room, easier)
        this.spawnEnemiesInRoom(0, [
            { type: 'sword', count: 2 },
        ]);

        // Room 1: 2 swords + 1 shield
        this.spawnEnemiesInRoom(1, [
            { type: 'sword', count: 2 },
            { type: 'shield', count: 1 },
        ]);

        // Room 2: 1 sword + 2 shields
        this.spawnEnemiesInRoom(2, [
            { type: 'sword', count: 1 },
            { type: 'shield', count: 2 },
        ]);

        // Room 3: 3 swords + 2 shields (hardest)
        this.spawnEnemiesInRoom(3, [
            { type: 'sword', count: 3 },
            { type: 'shield', count: 2 },
        ]);
    }

    spawnEnemiesInRoom(roomIndex, spawns) {
        const room = this.rooms[roomIndex];
        for (const spawn of spawns) {
            for (let i = 0; i < spawn.count; i++) {
                const margin = 120;
                let x, y, attempts = 0;
                do {
                    x = room.x + margin + Math.random() * (room.w - margin * 2);
                    y = room.y + margin + Math.random() * (room.h - margin * 2);
                    attempts++;
                } while (roomIndex === 0 && attempts < 30 &&
                         this.isTooCloseToSpawn(x, y, 60, 40, 250));
                this.enemies.push(new Enemy(x, y, spawn.type, this.assets));
            }
        }
    }

    generatePickups() {
        // Gems in every room
        for (const room of this.rooms) {
            const numGems = 3 + Math.floor(Math.random() * 3);
            for (let i = 0; i < numGems; i++) {
                const margin = 80;
                const x = room.x + margin + Math.random() * (room.w - margin * 2);
                const y = room.y + margin + Math.random() * (room.h - margin * 2);
                this.pickups.push(new Pickup(x, y, 'gem', this.assets));
            }
        }

        // Health pickups (1-2 per room)
        for (const room of this.rooms) {
            const numHealth = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < numHealth; i++) {
                const margin = 80;
                const x = room.x + margin + Math.random() * (room.w - margin * 2);
                const y = room.y + margin + Math.random() * (room.h - margin * 2);
                this.pickups.push(new Pickup(x, y, 'health', this.assets));
            }
        }

        // Spell pickups - one ice in room 1, one lightning in room 2
        const room1 = this.rooms[1];
        this.pickups.push(new Pickup(
            room1.x + room1.w / 2, room1.y + room1.h / 2, 'ice', this.assets
        ));

        const room2 = this.rooms[2];
        this.pickups.push(new Pickup(
            room2.x + room2.w / 2, room2.y + room2.h / 2, 'lightning', this.assets
        ));
    }

    getSolidBounds() {
        const solids = [];
        for (const wall of this.walls) {
            solids.push(wall);
        }
        for (const prop of this.props) {
            if (prop.solid) {
                solids.push({ x: prop.x, y: prop.y, w: prop.w, h: prop.h });
            }
        }
        return solids;
    }

    drawBackground(ctx, offset) {
        // Draw stone floor
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(offset.x, offset.y, this.worldWidth, this.worldHeight);

        // Draw room floors
        for (const room of this.rooms) {
            // Room floor
            ctx.fillStyle = '#3a3a4e';
            ctx.fillRect(room.x + offset.x, room.y + offset.y, room.w, room.h);

            // Floor tile pattern
            ctx.strokeStyle = '#33334a';
            ctx.lineWidth = 1;
            const tileSize = 48;
            for (let tx = room.x; tx < room.x + room.w; tx += tileSize) {
                for (let ty = room.y; ty < room.y + room.h; ty += tileSize) {
                    ctx.strokeRect(tx + offset.x, ty + offset.y, tileSize, tileSize);
                }
            }

            // Room border highlight
            ctx.strokeStyle = '#555570';
            ctx.lineWidth = 2;
            ctx.strokeRect(room.x + offset.x, room.y + offset.y, room.w, room.h);
        }
    }

    drawWalls(ctx, offset) {
        for (const wall of this.walls) {
            // Wall body
            ctx.fillStyle = '#555570';
            ctx.fillRect(wall.x + offset.x, wall.y + offset.y, wall.w, wall.h);

            // Wall top highlight
            ctx.fillStyle = '#666688';
            ctx.fillRect(wall.x + offset.x, wall.y + offset.y, wall.w, 4);

            // Wall texture lines
            ctx.fillStyle = '#4a4a64';
            const brickH = 16;
            for (let by = wall.y + brickH; by < wall.y + wall.h; by += brickH) {
                ctx.fillRect(wall.x + offset.x, by + offset.y, wall.w, 1);
            }
        }
    }

    drawProps(ctx, offset) {
        // Sort by y position for depth
        const sorted = [...this.props].sort((a, b) => a.y - b.y);
        for (const prop of sorted) {
            const img = this.assets[prop.sprite];
            if (img) {
                ctx.drawImage(img, prop.x + offset.x, prop.y + offset.y, prop.w, prop.h);
            } else {
                // Fallback
                ctx.fillStyle = prop.solid ? '#6a5a4a' : '#4a5a4a';
                ctx.fillRect(prop.x + offset.x, prop.y + offset.y, prop.w, prop.h);
            }
        }
    }
}
