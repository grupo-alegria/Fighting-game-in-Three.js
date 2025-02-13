class InputHandler {
    constructor(fighter1, fighter2) {
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.keys = {};

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(event) {
        this.keys[event.code] = true;
        this.handleInput();
    }

    onKeyUp(event) {
        this.keys[event.code] = false;
    }

    handleInput() {
        if (this.keys['KeyA']) this.fighter1.move(-1);
        if (this.keys['KeyD']) this.fighter1.move(1);
        if (this.keys['KeyW']) this.fighter1.jump();
        if (this.keys['ArrowLeft']) this.fighter2.move(-1);
        if (this.keys['ArrowRight']) this.fighter2.move(1);
        if (this.keys['ArrowUp']) this.fighter2.jump();
    }
}