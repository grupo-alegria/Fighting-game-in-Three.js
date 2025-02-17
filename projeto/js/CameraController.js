class CameraController {
    constructor(camera, fighter1, fighter2) {
        this.camera = camera;
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        console.log('fui instanciado')
        this.update()
    }

    update() {
        const pos1 = this.fighter1.mesh.position;
        const pos2 = this.fighter2.mesh.position;
        const midPoint = new THREE.Vector3((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2, 0);
        this.camera.position.set(midPoint.x, midPoint.y + 5,  200);
        console.log(Math.abs(pos1.x - pos2.x)   )
        //this.camera.position.set(midPoint.x, midPoint.y + 5, 200);
        this.camera.lookAt(midPoint);
        setInterval(() => {
            this.update()
            console.log('fui updatato')
        }, 2000);
    }
}