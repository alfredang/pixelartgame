# Godot's Dungeon

A top-down pixel art action dungeon crawler built with HTML5 Canvas and vanilla JavaScript.

**[Play the game live here!](https://alfredang.github.io/pixelartgame/)**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Canvas](https://img.shields.io/badge/Canvas-API-blue?style=flat)

## Gameplay

Control the Godot mascot through dungeon rooms, fight haunted weapons, collect gems, and cast elemental spells to defeat all enemies.

### Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move |
| Mouse Click | Cast spell toward cursor |
| 1 / 2 / 3 | Switch spell (Fire / Ice / Lightning) |

### Features

- **3 Elemental Spells** - Fire (rapid), Ice (powerful), Lightning (fast) - each with unique projectiles and sound effects
- **2 Enemy Types** - Haunted Swords charge at you; Haunted Shields block from their front (flank them!)
- **4 Dungeon Rooms** - Connected rooms with increasing difficulty
- **Collectibles** - Gems for score, hearts for health, spell pickups to unlock new abilities
- **Sound Effects** - Shooting, impact, pain, death, pickup, and spell switching sounds
- **Particle Effects** - Hit sparks, death explosions, spell trails

## Tech Stack

- **Rendering**: HTML5 Canvas 2D
- **Language**: Vanilla JavaScript (ES6 classes)
- **Audio**: Web Audio API
- **Assets**: Pixel art from [GDQuest Godot Tours 101](https://github.com/gdquest-demos/godot-tours-101-the-godot-editor)
- **Deployment**: GitHub Pages

## Project Structure

```
pixelartgame/
├── index.html          # Game entry point
├── css/style.css       # Canvas styling
├── js/
│   ├── game.js         # Main game loop & state management
│   ├── player.js       # Player movement, health, spells
│   ├── enemies.js      # Enemy AI (patrol, chase, charge, block)
│   ├── spells.js       # Projectile system & particle effects
│   ├── pickups.js      # Collectible items
│   ├── level.js        # Room generation, walls, props
│   ├── camera.js       # Viewport & screen shake
│   ├── input.js        # Keyboard & mouse input
│   ├── audio.js        # Sound effects manager
│   └── ui.js           # HUD, start/game over screens
└── assets/             # Pixel art sprites & audio
```

## Running Locally

```bash
# Any static file server works
python3 -m http.server 8080

# Then open http://localhost:8080
```

## Credits

- Pixel art assets by [GDQuest](https://www.gdquest.com/) from their [Godot Tours 101](https://github.com/gdquest-demos/godot-tours-101-the-godot-editor) project (MIT License)
