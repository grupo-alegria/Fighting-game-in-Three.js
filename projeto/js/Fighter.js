class Fighter {
    constructor(scene, sprites, position, frameWidth, frameHeight, name) {
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
        this.lifes = 5;
        this.name = name
        this.loadFrames();
        this.createMesh();
    }

    loadFrames() {
        const textureLoader = new THREE.TextureLoader();
        for (const key in this.sprites) {
            this.frames[key] = textureLoader.load(this.sprites[key]);
        }
    }

    loseLife() {
        if (this.lifes > 0) {
            this.lifes -= 1;
            this.updateHealthDisplay();
            console.log(`Vida restante de ${this.name}: ${this.lifes}`);
        } else {
            console.log(`${this.name} está sem vidas!`);
        }
    }

    updateHealthDisplay() {
        let playerElement;
        if (this.name === "fighter1") {
            playerElement = document.getElementById('player1-health');
        } else {
            playerElement = document.getElementById('player2-health');
        }

        if (!playerElement) {
            console.error("Elemento de vida não encontrado para:", this.name);
            return;
        }

        const livesContainer = playerElement.querySelector('.lives');
        if (!livesContainer) {
            console.error("Container de vidas não encontrado dentro de", playerElement);
            return;
        }

        // Limpa os ícones atuais
        livesContainer.innerHTML = '';

        // Adiciona novos ícones baseados na vida atual
        for (let i = 0; i < this.lifes; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            livesContainer.appendChild(lifeIcon);
        }

        // Verifica se o jogador perdeu todas as vidas
        if (this.lifes === 0) {
            this.showGameOverScreen();
        }
    }

    static updateScoreboard() {
        let scores = JSON.parse(localStorage.getItem("scores")) || { fighter1: 0, fighter2: 0 };
        document.getElementById("score-fighter1").textContent = scores.fighter1;
        document.getElementById("score-fighter2").textContent = scores.fighter2;
    }

    showGameOverScreen() {
        console.log("Game Over! Exibindo tela...");

        const gameOverSound = new Audio('./assets/sounds/game_over.mp3');

        gameOverSound.play().catch(error => {
            console.error('Erro ao reproduzir o som:', error);
        });

        // Identificar quem venceu
        const winner = this.name === "fighter1" ? "fighter2" : "fighter1";

        // Atualizar o placar de vitórias no localStorage
        let scores = JSON.parse(localStorage.getItem("scores")) || { fighter1: 0, fighter2: 0 };
        scores[winner] += 1;
        localStorage.setItem("scores", JSON.stringify(scores));

        // Evita múltiplas telas de game over
        if (document.getElementById('game-over-screen')) return;

        // Criar o container do overlay
        const overlay = document.createElement('div');
        overlay.id = 'game-over-screen';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';

        //Criar o placar
        // const scoreBoard = document.createElement('div');
        // scoreBoard.id = 'score-board';
        // scoreBoard.style.color = '#fff';
        // scoreBoard.style.padding = '5px';
        // scoreBoard.style.borderRadius = '10px';
        // scoreBoard.style.textAlign = 'center';

        // scoreBoard.innerHTML = `
        //     <h3 style="margin-top: 10px;">Winner: ${winner.toUpperCase()}! 🎉</h3>
        // `;

        // Criar o GIF de Game Over
        const gameOverImage = document.createElement('img');
        gameOverImage.src = './assets/scenario/game_over.gif';
        gameOverImage.alt = 'Game Over';
        gameOverImage.style.width = '500px';

        // Criar a imagem do botão de reset
        const resetButton = document.createElement('img');
        resetButton.src = './assets/scenario/restart-button.png';
        resetButton.alt = 'Restart Game';
        resetButton.style.width = '250px';
        resetButton.style.cursor = 'pointer';

        // Evento para recarregar a página ao clicar no botão
        resetButton.addEventListener('click', () => {
            location.reload();
        });

        // Adiciona os elementos ao overlay
        // overlay.appendChild(scoreBoard);
        overlay.appendChild(gameOverImage);
        overlay.appendChild(resetButton);

        // Adiciona o overlay ao body
        document.body.appendChild(overlay);
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
            if (this.direction == 'right') {
                return
            } else {
                this.direction = 'right';
            }
        } else {
            if (this.direction == 'left') {
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
        if (this.mesh.position.x > -1400 && this.mesh.position.x < 1400) {
            this.mesh.position.x += direction * moveSpeed;
        }
        else {
            if (this.mesh.position.x < -1400) {
                this.mesh.position.x = -1399
            }
            else {
                if (this.mesh.position.x > 1400) {
                    this.mesh.position.x = 1399
                }
            }
        }

    }


    punch() {
        this.setState('punching');


        // Verifica se o oponente está perto o suficiente para ser atingido
        if (Math.abs(this.opponent.mesh.position.x - this.mesh.position.x) < 250) {
            // Carregar o som de soco (uma vez) ou quando necessário
            const punchSound = new Audio('./assets/sounds/punch.mp3'); // Caminho para o arquivo de som

            // Toca o som do soco
            punchSound.play().catch(error => {
                console.error('Erro ao reproduzir o som:', error);
            });

            this.opponent.loseLife();

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
        else {
            // Carregar o som de soco (uma vez) ou quando necessário
            const punchSound = new Audio('./assets/sounds/miss.mp3'); // Caminho para o arquivo de som

            // Toca o som do soco
            punchSound.play().catch(error => {
                console.error('Erro ao reproduzir o som:', error);
            });
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