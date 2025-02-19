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
                if (this.direction == 'right') {
                    if (this.currentFrame == this.frames.rightLegForward) {
                        this.currentFrame = this.frames.rightLegBack;
                        break;
                    } else {
                        this.currentFrame = this.frames.rightLegForward;
                        break;
                    }
                } else { // Direção 'left'
                    if (this.currentFrame == this.frames.leftLegForward) {
                        this.currentFrame = this.frames.leftLegBack;
                        break;
                    } else {
                        this.currentFrame = this.frames.leftLegForward;
                        break;
                    }
                }
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
            if(this.direction == 'right'){
                return
            } else {
            this.direction = 'right';
            }
        } else {
            if(this.direction == 'left'){
                return
            } else {
            this.direction = 'left';
            }
        }
        this.setState(this.state); // Atualiza os frames com base na nova direção
    }

    move(direction) {
        const moveSpeed = 11; // Velocidade do movimento
        const frameSwapDelay = 150; // Tempo mínimo entre trocas de frame (ms)
    
        if (!this.lastMoveTime || Date.now() - this.lastMoveTime > frameSwapDelay) {
            this.lastMoveTime = Date.now(); // Atualiza o tempo da última troca de frame
    
            this.setState('moving');
        }
    
        this.mesh.position.x += direction * moveSpeed;
    }
    

    punch() {
        this.setState('punching');
    
        // Verifica se o oponente está perto o suficiente para ser atingido
        if (Math.abs(this.opponent.mesh.position.x - this.mesh.position.x) < 250) {
            const pushDirection = this.opponent.mesh.position.x > this.mesh.position.x ? 1 : -1;
    
            // Aplica o "salto" no oponente
            const jumpHeight = 50;  // Altura do salto
            const pushDistance = 200; // Distância que ele será empurrado para trás
            const jumpDuration = 100; // Tempo do salto (ms)
            const fallDuration = 200; // Tempo da queda (ms)
    
            // Eleva o oponente
            new TWEEN.Tween(this.opponent.mesh.position)
                .to({ x: this.opponent.mesh.position.x + pushDistance * pushDirection, y: this.opponent.mesh.position.y + jumpHeight }, jumpDuration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
    
            // Faz o oponente cair suavemente
            setTimeout(() => {
                new TWEEN.Tween(this.opponent.mesh.position)
                    .to({ y: this.position.y }, fallDuration)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .start();
            }, jumpDuration);
        }
    
        // Mantém o lutador no frame de soco por 0.5 segundos antes de voltar ao idle
        setTimeout(() => {
            this.setState('idle');
        }, 500);
    }
    
    

    update(deltaTime) {
        if (this.state === 'moving') {
            this.mesh.material.map = this.currentFrame;
            this.mesh.material.needsUpdate = true;
            setTimeout(() => {
                this.setState('idle');
            }, 200);
        }
        TWEEN.update();
    }
}