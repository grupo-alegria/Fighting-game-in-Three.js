class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.createGround(); // Cria o chão antes dos lutadores
        this.createFighters();
        this.inputHandler = new InputHandler(this.fighter1, this.fighter2);

        this.clock = new THREE.Clock();
        this.animate();
        camera_controller = new CameraController(this.camera, this.fighter1, this.fighter2);
    }

    createGround() {
        const groundGeometry = new THREE.BoxGeometry(2000, 20, 300); // Largura, altura, profundidade
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Marrom
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);

        this.ground.position.set(0, -520, 0); // Posição abaixo dos lutadores
        this.scene.add(this.ground);
    }

    createFighters() {
        const fighter1Sprites = [
            './assets/sprites/fighter1rl.png',
            './assets/sprites/fighter1rr.png',
            './assets/sprites/fighter1lr.png',
            './assets/sprites/fighter1ll.png',
            './assets/sprites/fighter1punchr.png',
            './assets/sprites/fighter1punchl.png',
        ];
        const fighter2Sprites = [
            './assets/sprites/fighter2rl.png',
            './assets/sprites/fighter2rr.png',
            './assets/sprites/fighter2lr.png',
            './assets/sprites/fighter2ll.png',
            './assets/sprites/fighter2punchr.png',
            './assets/sprites/fighter2punchl.png',
        ];

        this.fighter1 = new Fighter(this.scene, fighter1Sprites, { x: -100, y: 0, z: 0 }, 500, 1000);
        this.fighter2 = new Fighter(this.scene, fighter2Sprites, { x: 100, y: 0, z: 0 }, 500, 1000);

        // Define os oponentes após a criação
        this.fighter1.setOpponent(this.fighter2);
        this.fighter2.setOpponent(this.fighter1);

        this.fighter1.faceOpponent();
        this.fighter2.faceOpponent();
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
