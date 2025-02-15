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
        // Movimento do Fighter 1
        if (this.keys['KeyA']) this.fighter1.move(-1); // Move para a esquerda
        if (this.keys['KeyD']) this.fighter1.move(1);  // Move para a direita
        //if (this.keys['KeyW']) this.fighter1.jump();  // Pula

        // Golpe do Fighter 1
        if (this.keys['KeyF']) this.fighter1.punch(); // Golpeia

        // Movimento do Fighter 2
        if (this.keys['ArrowLeft']) this.fighter2.move(-1); // Move para a esquerda
        if (this.keys['ArrowRight']) this.fighter2.move(1);  // Move para a direita
        //if (this.keys['ArrowUp']) this.fighter2.jump();     // Pula

        // Golpe do Fighter 2
        if (this.keys['Numpad0']) this.fighter2.punch(); // Golpeia
    }
}