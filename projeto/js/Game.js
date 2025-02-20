class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.createBackground(); // Cria o fundo
        this.createGround(); // Cria o chão antes dos lutadores
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
        // Carrega a textura do chão
        const textureLoader = new THREE.TextureLoader();
        const groundTexture = textureLoader.load('./assets/scenario/rock_texture2.png');

        // Ajusta a repetição da textura
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(15, 15); // Define quantas vezes a textura se repete no chão

        // Cria a geometria do chão
        const groundGeometry = new THREE.BoxGeometry(window.innerWidth * 6, 10, window.innerHeight);

        // Cria o material com a textura aplicada
        const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });

        // Cria o mesh do chão
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);

        // Posiciona o chão
        this.ground.position.set(0, -1400, 0);

        // Adiciona o chão à cena
        this.scene.add(this.ground);
    }

    createBackground() {
        // Ajusta a largura para ser igual à largura da tela
        const backgroundGeometry = new THREE.BoxGeometry(window.innerWidth * 7, window.innerHeight * 7, 1);

        // Cria o elemento de vídeo
        let textureVid = document.createElement("video");
        textureVid.src = './assets/scenario/background2.mp4'; // Transforme o GIF em um arquivo MP4
        textureVid.loop = true;
        textureVid.load(); // Carrega o vídeo (sem iniciar ainda)

        // Cria a textura de vídeo
        let videoTexture = new THREE.VideoTexture(textureVid);
        videoTexture.format = THREE.RGBFormat;
        videoTexture.minFilter = THREE.NearestFilter;
        videoTexture.maxFilter = THREE.NearestFilter;
        videoTexture.generateMipmaps = false;

        // Cria o material com a textura de vídeo
        const backgroundMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            side: THREE.BackSide // O fundo deve ser visível de dentro
        });

        // Cria o plano de fundo
        this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

        // Coloca o fundo atrás da cena, ligeiramente acima do chão para não cobri-lo
        this.background.position.set(0, 900, -500);

        // Adiciona o fundo à cena
        this.scene.add(this.background);

        // Adiciona um evento de clique para iniciar a reprodução do vídeo
        window.addEventListener('keydown', () => {
            textureVid.play().catch(error => {
                console.error('Erro ao reproduzir o vídeo:', error);
            });
        });
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

        this.fighter1 = new Fighter(this.scene, fighter1Sprites, { x: -100, y: 0, z: 0 }, 700, 1000, 'fighter1');
        this.fighter2 = new Fighter(this.scene, fighter2Sprites, { x: 100, y: 0, z: 0 }, 700, 1000, 'fighter2');

        // Define os oponentes após a criação
        this.fighter1.setOpponent(this.fighter2);
        this.fighter2.setOpponent(this.fighter1);

        // Vira os lutadores na direção do adversário
        this.fighter1.faceOpponent();
        this.fighter2.faceOpponent();

        // Depois de criar os fighters (fighter1 e fighter2)
        this.fighter1.updateHealthDisplay();
        this.fighter2.updateHealthDisplay();

        // Inverta a ordem do P2 se necessário
        document.querySelector('#player2-health .life-container').style.flexDirection = 'row-reverse';
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
        this.staticMesh.position.set(0, 0, 100); // Ajuste conforme necessário
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

        // // Vira os lutadores na direção do adversário
        this.fighter1.faceOpponent();
        this.fighter2.faceOpponent();

        // Atualiza a câmera
        if (this.camera_controller) {
            this.camera_controller.update(deltaTime);
        }

        // Renderiza a cena
        this.renderer.render(this.scene, this.camera);
    }
}