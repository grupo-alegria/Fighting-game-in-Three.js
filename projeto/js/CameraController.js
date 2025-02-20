class CameraController {
    constructor(camera, fighter1, fighter2) {
        this.camera = camera;
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.lastUpdateTime = 0; // Armazena o tempo da última atualização
        this.updateInterval = .15; // Intervalo de 2 segundos
    }

    update(deltaTime) {
        // Atualiza o tempo decorrido
        this.lastUpdateTime += deltaTime;

        // Verifica se 2 segundos se passaram
        if (this.lastUpdateTime >= this.updateInterval) {
            // Calcula o ponto médio entre os lutadores
            const pos1 = this.fighter1.mesh.position;
            const pos2 = this.fighter2.mesh.position;
            var midPoint = null;
            if ((pos1.x + pos2.x) / 2 <= -258.5){
                midPoint = new THREE.Vector3(-258.5, (pos1.y + pos2.y) / 2, 0);
            }
            else{
                if ((pos1.x + pos2.x) / 2 >= 258.5){
                    midPoint = new THREE.Vector3(258.5, (pos1.y + pos2.y) / 2, 0);
                }
                else{
                        midPoint = new THREE.Vector3((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2, 0);
                }
            }
            
            // Reposiciona a câmera
            this.camera.position.set(midPoint.x, midPoint.y + 5, 200);
            this.camera.lookAt(midPoint);

            // Reseta o contador de tempo
            this.lastUpdateTime = 0;
        }
    }
}