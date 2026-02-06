class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.shakeAmount = 0;
        this.shakeDecay = 0.9;
    }

    follow(target, worldWidth, worldHeight) {
        this.x = target.x + target.width / 2 - this.width / 2;
        this.y = target.y + target.height / 2 - this.height / 2;

        // Clamp to world bounds
        this.x = Math.max(0, Math.min(this.x, worldWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, worldHeight - this.height));
    }

    shake(amount) {
        this.shakeAmount = amount;
    }

    getOffset() {
        let ox = 0, oy = 0;
        if (this.shakeAmount > 0.5) {
            ox = (Math.random() - 0.5) * this.shakeAmount * 2;
            oy = (Math.random() - 0.5) * this.shakeAmount * 2;
            this.shakeAmount *= this.shakeDecay;
        } else {
            this.shakeAmount = 0;
        }
        return { x: -this.x + ox, y: -this.y + oy };
    }
}
