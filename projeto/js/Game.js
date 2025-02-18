class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Cria o chão
        this.createGround();

        // Cria os lutadores
        this.createFighters();

        // Configura o input handler
        this.inputHandler = new InputHandler(this.fighter1, this.fighter2);

        // Adiciona o efeito de estática
        this.createStaticEffect();

        // Inicia o loop de animação
        this.clock = new THREE.Clock();
        this.animate();

        // Configura o controlador da câmera
        this.camera_controller = new CameraController(this.camera, this.fighter1, this.fighter2);
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

        // Vira os lutadores na direção do adversário
        this.fighter1.faceOpponent();
        this.fighter2.faceOpponent();
    }

    createStaticEffect() {
        const staticShader = {
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
    
                float random(vec2 st) {
                    return fract(sin(dot(st.xy + time, vec2(12.9898, 78.233))) * 43758.5453);
                }
    
                void main() {
                    float noise = random(vUv + time);
                    if (noise > 0.995) { // Ajuste para maior densidade de pontos
                        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Branco
                    } else {
                        discard; // Mantém transparência sem precisar de alpha manual
                    }
                }
            `,
            uniforms: {
                time: { value: 0.0 },
            },
        };
    
        // Criar material do shader
        this.staticMaterial = new THREE.ShaderMaterial({
            vertexShader: staticShader.vertexShader,
            fragmentShader: staticShader.fragmentShader,
            uniforms: staticShader.uniforms,
            transparent: true, // Permitir transparência
        });
    
        // Criar um plano para exibir a estática
        const planeGeometry = new THREE.PlaneGeometry(10000, 10000); // Tamanho do efeito
        this.staticMesh = new THREE.Mesh(planeGeometry, this.staticMaterial);
    
        // Posicionar o plano na frente da câmera
        this.staticMesh.position.set(0, 0, 150); // Ajuste conforme necessário
        this.scene.add(this.staticMesh);
    }
    
    
    

    animate() {
        requestAnimationFrame(() => this.animate());
        const deltaTime = this.clock.getDelta();

        // Atualiza o tempo do shader de ruído
        if (this.staticMaterial) {
            this.staticMaterial.uniforms.time.value += deltaTime;
        }

        // Atualiza os lutadores
        this.fighter1.update(deltaTime);
        this.fighter2.update(deltaTime);

        // Vira os lutadores na direção do adversário
        this.fighter1.faceOpponent();
        this.fighter2.faceOpponent();

        // Atualiza a câmera
        if (this.camera_controller) {
            this.camera_controller.update();
        }

        // Renderiza a cena
        this.renderer.render(this.scene, this.camera);
    }
}