class InputHandler {
    constructor(fighter1, fighter2) {
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.keys = {};

        // Flags para controle de cooldown
        this.canMoveFighter1 = true;
        this.canMoveFighter2 = true;

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
        // Movimento do Fighter 1 (somente se puder se mover)
        if (this.canMoveFighter1) {
            if (this.keys['KeyA']) this.fighter1.move(-1); // Move para a esquerda
            if (this.keys['KeyD']) this.fighter1.move(1);  // Move para a direita
            //if (this.keys['KeyW']) this.fighter1.jump();  // Pula

            if (this.keys['KeyF']) {
                this.fighter1.punch();
                this.applyCooldown('fighter1');
            }
        }

        // Movimento do Fighter 2 (somente se puder se mover)
        if (this.canMoveFighter2) {
            if (this.keys['ArrowLeft']) this.fighter2.move(-1); // Move para a esquerda
            if (this.keys['ArrowRight']) this.fighter2.move(1);  // Move para a direita
            //if (this.keys['ArrowUp']) this.fighter2.jump();     // Pula

            if (this.keys['Numpad0']) {
                this.fighter2.punch();
                this.applyCooldown('fighter2');
            }
        }
    }

    applyCooldown(fighter) {
        if (fighter === 'fighter1') {
            this.canMoveFighter1 = false;
            setTimeout(() => {
                this.canMoveFighter1 = true;
            }, 500);
        } else if (fighter === 'fighter2') {
            this.canMoveFighter2 = false;
            setTimeout(() => {
                this.canMoveFighter2 = true;
            }, 500);
        }
    }
}
