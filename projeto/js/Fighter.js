class Fighter {
    constructor(scene, sprites, position, frameWidth, frameHeight) {
        this.scene = scene;
        this.sprites = {
            rightLegForward: sprites[0], // fighterrl.png
            rightLegBack: sprites[1],    // fighterrr.png
            leftLegForward: sprites[2],  // fighterlr.png
            leftLegBack: sprites[3],     // fighterll.png
            punchRight: sprites[4],     // fighterpunchr.png
            punchLeft: sprites[5],      // fighterpunchl.png
        };
        this.position = position;
        this.currentFrame = this.sprites.rightLegForward; // Frame inicial
        this.frames = {}; // Objeto de frames (Texturas)
        this.state = 'idle'; // Estado atual do lutador
        this.direction = 'right'; // Direção inicial do lutador
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.opponent = null; // Oponente inicialmente indefinido
        this.loadFrames();
        this.createMesh();
    }

    loadFrames() {
        const textureLoader = new THREE.TextureLoader();
        for (const key in this.sprites) {
            this.frames[key] = textureLoader.load(this.sprites[key]);
        }
    }

    createMesh() {
        const geometry = new THREE.PlaneGeometry(this.frameWidth, this.frameHeight);
        const material = new THREE.MeshBasicMaterial({
            map: this.frames.rightLegForward,
            transparent: true,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.mesh);
    }

    setState(newState) {
        this.state = newState;

        switch (this.state) {
            case 'idle':
                this.currentFrame = this.direction === 'right'
                    ? this.frames.rightLegForward
                    : this.frames.leftLegForward;
                break;

            case 'moving':
                this.currentFrame = this.direction === 'right'
                    ? (this.currentFrame === this.frames.rightLegForward
                        ? this.frames.rightLegBack
                        : this.frames.rightLegForward)
                    : (this.currentFrame === this.frames.leftLegForward
                        ? this.frames.leftLegBack
                        : this.frames.leftLegForward);
                break;

            case 'punching':
                this.currentFrame = this.direction === 'right'
                    ? this.frames.punchRight
                    : this.frames.punchLeft;
                setTimeout(() => {
                    this.setState('idle');
                }, 300); // Duração do golpe em milissegundos
                break;

            default:
                console.warn(`Estado desconhecido: ${newState}`);
                break;
        }

        this.mesh.material.map = this.currentFrame;
        this.mesh.material.needsUpdate = true;
    }

    setOpponent(opponent) {
        this.opponent = opponent; // Define o oponente após a criação
    }

    faceOpponent() {
        if (!this.opponent) {
            console.warn('Oponente não definido!');
            return;
        }

        if (this.opponent.mesh.position.x > this.mesh.position.x) {
            this.direction = 'right';
        } else {
            this.direction = 'left';
        }
        this.setState(this.state); // Atualiza os frames com base na nova direção
    }

    move(direction) {
        this.setState('moving');
        this.mesh.position.x += direction * 0.1;
    }

    punch() {
        this.setState('punching');
    }

    update(deltaTime) {
        if (this.state === 'moving') {
            this.mesh.material.map = this.currentFrame;
            this.mesh.material.needsUpdate = true;
        }
    }
}