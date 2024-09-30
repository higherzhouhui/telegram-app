import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Preloader extends Scene {

    private loadText: any;
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        const bgWidth = 600
        const bgHeight = 900
        this.add.image(width / 2, height / 2, 'dark').setScale(width / bgWidth, height / bgHeight);
        //  A simple progress bar. This is the outline of the bar.
        const barWidth = Math.max(width / 2, 280)
        this.add.rectangle(width / 2, height / 2, barWidth, 19).setStrokeStyle(1, 0xffffff);
        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(width / 2 - barWidth / 2 + 5, height / 2, 4, 14, 0xffffff);
        this.loadText = this.add.text(width / 2, height / 2 - 40, `${0}%`, { fontFamily: 'Arial', fontSize: 24, color: '#e3f2ed' }).setOrigin(0.5, 0.5);
        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = (barWidth * progress - 5);
            this.loadText.setText(`${Math.floor(progress * 100)}%`)
        });
    }

    preload() {
        this.load.image('cat', 'assets/common/cat.webp')

        this.load.setPath("assets/games/card-memory-game/");

        this.load.image("volume-icon", "ui/volume-icon.png");
        this.load.image("volume-icon_off", "ui/volume-icon_off.png");

        this.load.audio("theme-song", "audio/fat-caps-audionatix.mp3");
        this.load.audio("whoosh", "audio/whoosh.mp3");
        this.load.audio("card-flip", "audio/card-flip.mp3");
        this.load.audio("card-match", "audio/card-match.mp3");
        this.load.audio("card-mismatch", "audio/card-mismatch.mp3");
        this.load.audio("card-slide", "audio/card-slide.mp3");
        this.load.audio("victory", "audio/victory.mp3");
        this.load.image("background");
        this.load.image("card-back", "cards/card-back.png");
        this.load.image("card-0", "cards/card-0.png");
        this.load.image("card-1", "cards/card-1.png");
        this.load.image("card-2", "cards/card-2.png");
        this.load.image("card-3", "cards/card-3.png");
        this.load.image("card-4", "cards/card-4.png");
        this.load.image("card-5", "cards/card-5.png");

        this.load.image("heart", "ui/heart.png");
    }

    create() {

        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        if (this.sound.locked) {
            this.scene.start('MainMenu');
        }
        else {
            this.scene.start('MainMenu');
        }
    }
}
