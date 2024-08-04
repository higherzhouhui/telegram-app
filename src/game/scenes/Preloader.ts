import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Preloader extends Scene {

    private loadText: any;
    constructor() {
        super('Preloader');
    }

    init() {

    }

    preload() {
        // main
        this.load.setPath('assets/');
        this.load.image('tomato', 'tomato-32x32.webp')
        this.load.image('freezeBg', 'bg-time-CYBkBj7x.webp')
        this.load.image('boomBg', 'bg-penalty-DosdTnzw.webp')
        this.load.image('freeze', 'time-CffWGaET.gif')
        this.load.image('boom', 'penalty-vbtx_mmt.gif')
    }

    create() {
        EventBus.emit('current-scene-ready', this);

        this.scene.start('MainGame');
    }
}
