class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.fighter1 = new Fighter(this.scene, 'fighter1', { x: -2, y: 0, z: 0 });
        this.fighter2 = new Fighter(this.scene, 'fighter2', { x: 2, y: 0, z: 0 });

        this.inputHandler = new InputHandler(this.fighter1, this.fighter2);
        this.cameraController = new CameraController(this.camera, this.fighter1, this.fighter2);

        this.clock = new THREE.Clock();
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const deltaTime = this.clock.getDelta();

        this.fighter1.update(deltaTime);
        this.fighter2.update(deltaTime);
        this.cameraController.update();

        this.renderer.render(this.scene, this.camera);
    }
}