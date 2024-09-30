import { EventBus } from "../EventBus";
export default class MainMenu extends Phaser.Scene {
    private fontStyle: any = {
        fontFamily: 'Arial',
        fontSize: 34,
        color: '#ffffff',
        fontStyle: 'bold',
        padding: 16,
        align: 'center',
        lineHeight: 36,
    };

    constructor() {
        super('MainMenu');
    }

    create() {
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        const bgWidth = 600
        const bgHeight = 900
        let background = this.add.image(width / 2, height / 2, 'dark').setScale(width / bgWidth, height / bgHeight).setInteractive();
        this.tweens.add({
            targets: background,
            alpha: { from: 0, to: 1 },
            duration: 1000
        });
        this.volumeButton()
        const volume = localStorage.getItem('volume') || 1 as any
        this.sound.setVolume(volume);

        this.add.text(width / 2, height / 2 + 200, 'Selecting two identical expressions together\n can successfully eliminate them', { ...this.fontStyle, fontSize: 15, color: '#fff' }).setOrigin(0.5, 0.5);

        const titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2 - 100,
            "Memory Card Game\nClick to Play",
            { align: "center", strokeThickness: 4, fontSize: 32, fontStyle: "bold", color: "#8c7ae6" }
        )
            .setOrigin(.5)
            .setDepth(3)
            .setInteractive();
        // title tween like retro arcade
        this.add.tween({
            targets: titleText,
            duration: 800,
            ease: (value: any) => (value > .8),
            alpha: 0,
            repeat: -1,
            yoyo: true,
        });

        // Text Events
        titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
            titleText.setColor("#9c88ff");
            this.input.setDefaultCursor("pointer");
        });
        titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
            titleText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });
        titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.sound.play("whoosh", { volume: 1.3 });
            this.add.tween({
                targets: titleText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    if (!this.sound.get("theme-song")) {
                        this.sound.play("theme-song", { loop: true, volume: .5 });
                    }
                    this.scene.start('MainGame');
                }
            })
        });
        background.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.sound.play("whoosh", { volume: 1.3 });
            this.add.tween({
                targets: titleText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    if (!this.sound.get("theme-song")) {
                        this.sound.play("theme-song", { loop: true, volume: .5 });
                    }
                    this.scene.start('MainGame');
                }
            })
        });


        EventBus.emit('current-scene-ready', this);
    }


    volumeButton() {
        const volumeIcon = this.add.image(25, 30, "volume-icon").setName("volume-icon");
        volumeIcon.setInteractive();

        // Mouse enter
        volumeIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.input.setDefaultCursor("pointer");
        });
        // Mouse leave
        volumeIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
            console.log("Mouse leave");
            this.input.setDefaultCursor("default");
        });
        const volume = localStorage.getItem('volume') || 1 as any
        volumeIcon.setTexture(`${volume == 1 ? 'volume-icon' : 'volume-icon_off'}`)
        volumeIcon.setAlpha(volume == 1 ? 1 : 0.5);
        volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.sound.volume === 0) {
                this.sound.setVolume(1);
                localStorage.setItem('volume', '1')
                volumeIcon.setTexture("volume-icon");
                volumeIcon.setAlpha(1);
            } else {
                localStorage.setItem('volume', '0')
                this.sound.setVolume(0);
                volumeIcon.setTexture("volume-icon_off");
                volumeIcon.setAlpha(.5)
            }
        });
    }
}
