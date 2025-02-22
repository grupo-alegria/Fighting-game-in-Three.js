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
        this.createDragon();
        this.createBoxes();
        this.setupLightingAndShadows();
        // Configura o input handler
        this.inputHandler = new InputHandler(this.fighter1, this.fighter2);

        // Adiciona o efeito de estática
        //this.createStaticEffect();

        // Inicia o loop de animação
        this.clock = new THREE.Clock();
        this.animate();

        // Configura o controlador da câmera
        this.camera_controller = new CameraController(this.camera, this.fighter1, this.fighter2);
    }

    setupLightingAndShadows() {
        // Adiciona luz ambiente para iluminação suave
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        // Ativa sombras no dragão (deve ser chamado após o carregamento do modelo)
        if (this.dragon) {
            this.dragon.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }

        // Ativa sombras no chão
        if (this.ground) {
            this.ground.receiveShadow = true;
        }

        // Ativa sombras no renderizador
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    createDragon() {
        const loader = new THREE.GLTFLoader();
        loader.load('./assets/scenario/dragon/scene.gltf', (gltf) => {
            const dragon = gltf.scene;
            dragon.scale.set(30, 30, 30); // Ajuste a escala conforme necessário
            dragon.position.set(0, 300, -10); // Posiciona o dragão acima dos bonecos
            dragon.renderOrder = 1;

            this.scene.add(dragon); // Adiciona o dragão à cena
            this.dragon = dragon; // Salva o dragão como propriedade da classe para uso posterior
        });
    }

    createBoxes() {
        const loader = new THREE.GLTFLoader();

        loader.load('./assets/scenario/box/scene.gltf', (gltf) => {
            const box1 = gltf.scene.clone();
            const box2 = gltf.scene.clone();
            const box3 = gltf.scene.clone();
            const box4 = gltf.scene.clone();

            box1.scale.set(3, 3, 3);
            box2.scale.set(3, 3, 3);
            box3.scale.set(3, 3, 3);
            box4.scale.set(3, 3, 3);

            box1.position.set(-2050, -650, -100); // Posicionamento personalizado
            box1.renderOrder = 1;
            box2.position.set(-2050, -400, -100); // Posicionamento personalizado
            box2.renderOrder = 1;
    
            box3.position.set(2050, -650, -100); // Posicionamento personalizado
            box3.renderOrder = 1;
            box4.position.set(2050, -400, -100); // Posicionamento personalizado
            box4.renderOrder = 1;

            this.scene.add(box1);
            this.scene.add(box2);
            this.scene.add(box3);
            this.scene.add(box4);
        });
    
    }

    createGround() {
        // Ajusta a largura para ser igual à largura do fundo
        const groundGeometry = new THREE.BoxGeometry(window.innerWidth * 6, 10, window.innerHeight); // Largura igual ao fundo, altura 10, profundidade suficiente para cobrir a tela

        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Marrom, para representar o chão
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);

        // Posiciona o chão logo abaixo do fundo, sem sobrepor os lutadores
        this.ground.position.set(0, -1150, 0); // O valor -500 pode ser ajustado para garantir que o chão fique visível corretamente

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

    updateDragonMovement() {
        if (!this.dragon) return;

        const time = this.clock.getElapsedTime();
        const radius = 300; // Raio do círculo
        const speed = 1; // Velocidade do movimento

        // Posição atual do dragão no círculo
        const x = Math.sin(time * speed) * radius;
        const z = Math.cos(time * speed) * radius;
        const y = 200 + Math.sin(time * 2) * 50; // Movimento de subida/descida

        this.dragon.position.set(x, y, z);

        // Calcula a próxima posição para o dragão olhar
        const nextX = Math.sin((time + 0.1) * speed) * radius;
        const nextZ = Math.cos((time + 0.1) * speed) * radius;

        // Faz o dragão olhar na direção do movimento
        this.dragon.lookAt(new THREE.Vector3(nextX, y, nextZ));

        // Inverte a rotação para corrigir a orientação
        this.dragon.rotateY(Math.PI);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const deltaTime = this.clock.getDelta();

        this.updateDragonMovement();

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