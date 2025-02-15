class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.createFighters();
        this.inputHandler = new InputHandler(this.fighter1, this.fighter2);

        this.clock = new THREE.Clock();
        this.animate();
    }

    createFighters() {
        const fighter1Sprites = [
            '../assets/sprites/fighter1rl.png',
            '../assets/sprites/fighter1rr.png',
            '../assets/sprites/fighter1lr.png',
            '../assets/sprites/fighter1ll.png',
            '../assets/sprites/fighter1punchr.png',
            '../assets/sprites/fighter1punchl.png',
        ];
        const fighter2Sprites = [
            '../assets/sprites/fighter2rl.png',
            '../assets/sprites/fighter2rr.png',
            '../assets/sprites/fighter2lr.png',
            '../assets/sprites/fighter2ll.png',
            '../assets/sprites/fighter2punchr.png',
            '../assets/sprites/fighter2punchl.png',
        ];

        this.fighter1 = new Fighter(this.scene, fighter1Sprites, { x: -2, y: 0, z: 0 }, 64, 128);
        this.fighter2 = new Fighter(this.scene, fighter2Sprites, { x: 2, y: 0, z: 0 }, 64, 128);

        // Define os oponentes após a criação
        this.fighter1.setOpponent(this.fighter2);
        this.fighter2.setOpponent(this.fighter1);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const deltaTime = this.clock.getDelta();

        // Atualiza os lutadores
        this.fighter1.update(deltaTime);
        this.fighter2.update(deltaTime);

        // Vira os lutadores na direção do adversário
        this.fighter1.faceOpponent();
        this.fighter2.faceOpponent();

        // Renderiza a cena
        this.renderer.render(this.scene, this.camera);
    }
}