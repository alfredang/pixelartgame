class InputManager {
    constructor(canvas) {
        this.keys = {};
        this.mouse = { x: 0, y: 0, clicked: false, down: false };
        this.canvas = canvas;

        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.mouse.clicked = true;
        });
        canvas.addEventListener('mouseup', (e) => {
            this.mouse.down = false;
        });
    }

    isKeyDown(key) {
        return !!this.keys[key.toLowerCase()];
    }

    consumeClick() {
        if (this.mouse.clicked) {
            this.mouse.clicked = false;
            return true;
        }
        return false;
    }

    resetFrame() {
        this.mouse.clicked = false;
    }
}
