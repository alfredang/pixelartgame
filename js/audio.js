class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.4;
        this.loaded = false;

        this.soundList = {
            // Shooting
            shoot_fire: 'assets/audio/spells/shoot_fire.wav',
            shoot_ice: 'assets/audio/spells/shoot_ice.wav',
            shoot_lightning: 'assets/audio/spells/shoot_lightning.wav',

            // Hits
            hit_fire: 'assets/audio/spells/hit_fire.wav',
            hit_ice: 'assets/audio/spells/hit_ice.wav',
            hit_lightning: 'assets/audio/spells/hit_lightning.wav',

            // Player
            pain_01: 'assets/audio/player/pain_01.wav',
            pain_02: 'assets/audio/player/pain_02.wav',
            pain_03: 'assets/audio/player/pain_03.wav',
            death_01: 'assets/audio/player/death_01.wav',
            select_fire: 'assets/audio/player/select_fire.wav',
            select_ice: 'assets/audio/player/select_ice.wav',
            select_lightning: 'assets/audio/player/select_lightning.wav',

            // Pickups
            pickup_health: 'assets/audio/pickups/pickup_health.wav',
            pickup_fire: 'assets/audio/pickups/pickup_fire.wav',
            pickup_ice: 'assets/audio/pickups/pickup_ice.wav',
            pickup_lightning: 'assets/audio/pickups/pickup_lightning.wav',
        };

        this.loadAll();
    }

    loadAll() {
        for (const [key, path] of Object.entries(this.soundList)) {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.volume = this.volume;
            this.sounds[key] = audio;
        }
        this.loaded = true;
    }

    play(name, volumeScale) {
        if (!this.enabled || !this.sounds[name]) return;
        // Clone the audio so overlapping sounds work
        const sound = this.sounds[name].cloneNode();
        sound.volume = this.volume * (volumeScale || 1);
        sound.play().catch(() => {});
    }

    playRandom(prefix, count, volumeScale) {
        const index = 1 + Math.floor(Math.random() * count);
        const padded = index.toString().padStart(2, '0');
        this.play(`${prefix}_${padded}`, volumeScale);
    }

    playShoot(type) {
        this.play(`shoot_${type}`, 0.5);
    }

    playHit(type) {
        this.play(`hit_${type}`, 0.7);
    }

    playPain() {
        this.playRandom('pain', 3, 0.6);
    }

    playDeath() {
        this.play('death_01', 0.8);
    }

    playPickup(type) {
        if (type === 'gem' || type === 'health') {
            this.play('pickup_health', 0.5);
        } else {
            this.play(`pickup_${type}`, 0.7);
        }
    }

    playSelect(type) {
        this.play(`select_${type}`, 0.5);
    }
}
