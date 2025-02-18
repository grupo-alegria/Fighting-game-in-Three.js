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
        this.inputHandler = new InputHandler(this.fighter1, this.fighter2);
    
        this.clock = new THREE.Clock();
        this.animate();
        camera_controller = new CameraController(this.camera, this.fighter1, this.fighter2);
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
        const backgroundGeometry = new THREE.BoxGeometry(window.innerWidth * 6, window.innerHeight * 6, 1);
    
        // Carrega a textura para o fundo
        const textureLoader = new THREE.TextureLoader();
        const backgroundTexture = textureLoader.load('./assets/scenario/background2.gif'); 
    
        // Cria o material com a textura
        const backgroundMaterial = new THREE.MeshBasicMaterial({
            map: backgroundTexture, 
            side: THREE.BackSide // O fundo deve ser visível de dentro
        });
    
        // Cria o plano de fundo
        this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    
        // Coloca o fundo atrás da cena, ligeiramente acima do chão para não cobri-lo
        this.background.position.set(0, 900, -500); 
    
        // Adiciona o fundo à cena
        this.scene.add(this.background);
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

        this.fighter1 = new Fighter(this.scene, fighter1Sprites, { x: -100, y: 0, z: 0 }, 700, 1000);
        this.fighter2 = new Fighter(this.scene, fighter2Sprites, { x: 100, y: 0, z: 0 }, 700, 1000);

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
