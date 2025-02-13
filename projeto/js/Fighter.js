class Fighter {
    constructor(scene, spriteSheet, position) {
        this.scene = scene;
        this.spriteSheet = spriteSheet; // Textura com os frames do lutador
        this.position = position; // Posição inicial do lutador
        this.currentFrame = 0; // Frame atual da animação
        this.frames = []; // Array de frames (Texturas)
        this.state = 'idle'; // Estado atual do lutador (idle, attacking, jumping, etc.)
        this.loadFrames();
        this.createMesh();
    }

    loadFrames() {
        // Carregar os frames da sprite sheet
        // Exemplo: this.frames.push(new THREE.TextureLoader().load('assets/sprites/fighter1_idle.png'));
        // this.frames.push(new THREE.TextureLoader().load('assets/sprites/fighter1_attack.png'));
    }

    createMesh() {
        const geometry = new THREE.PlaneGeometry(1, 2); // Geometria 2D para o lutador
        const material = new THREE.MeshBasicMaterial({ map: this.frames[this.currentFrame], transparent: true });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        // Atualizar a animação do lutador
        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        this.mesh.material.map = this.frames[this.currentFrame];
        this.mesh.material.needsUpdate = true;
    }

    setState(newState) {
        this.state = newState;
        // Aqui você pode mudar o conjunto de frames dependendo do estado
        // Exemplo: if (newState === 'attacking') { this.frames = attackFrames; }
    }

    move(direction) {
        // Mover o lutador no eixo X
        this.mesh.position.x += direction * 0.1;
    }

    jump() {
        // Implementar lógica de pulo
    }
}