import { getSubUserListReq } from "@/api/common";
import { EventBus } from "../EventBus";
import { endGameReq } from "@/api/game";

export default class MainGame extends Phaser.Scene {
    private emojis: any;
    private circle1: any;
    private circle2: any;
    private child1: any;
    private child2: any;
    private selectedEmoji: any;
    private matched: any;
    private score: any;
    private scoreText: any;
    private timer: any;
    private shakeTimer: any;
    private timerText: any;
    private width: number = 0;
    private height: number = 0;
    private totalScoreText: Phaser.GameObjects.Text | undefined;
    private totalScore: number = 0;
    private newTotalScore: number = 0;

    constructor() {
        super('MainGame');

        this.emojis;

        this.circle1;
        this.circle2;

        this.child1;
        this.child2;

        this.selectedEmoji = null;
        this.matched = false;

        this.score = 0;
        this.scoreText;

        this.timer;
        this.timerText;
        this.shakeTimer;
    }

    init ()
    {
        // Fadein camera
        this.cameras.main.fadeIn(500);
    }

    create() {
        const screen = document.getElementsByClassName('app')
        const width = screen[0].clientWidth
        const height = screen[0].clientHeight
        this.width = width
        this.height = height

        this.add.image(width / 2, height / 2, 'dark');
        
        this.circle1 = this.add.circle(0, 0, 36).setStrokeStyle(3, 0xf8960e);
        this.circle2 = this.add.circle(0, 0, 36).setStrokeStyle(3, 0x00ff00);

        this.circle1.setVisible(false);
        this.circle2.setVisible(false);

        //  Create a 4x4 grid aligned group to hold our sprites

        this.emojis = this.add.group({
            key: 'emojis',
            frameQuantity: 1,
            repeat: 15,
            gridAlign: {
                width: 4,
                height: 4,
                cellWidth: 80,
                cellHeight: 80,
                x: width / 2 - 160,
                y: height / 2 - 120,
                position: 0
            }
        });
        const fontStyle: any = {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#ffffff',
            fontStyle: 'bold',
            padding: 16,
            shadow: {
                color: '#000000',
                fill: true,
                offsetX: 2,
                offsetY: 2,
                blur: 4
            }
        };

        this.timerText = this.add.text(60, 60, '30:00', fontStyle).setOrigin(0.5, 0.5);
        this.scoreText = this.add.text(width - 80, 60, 'Found: 0', fontStyle).setOrigin(0.5, 0.5);

        let children = this.emojis.getChildren();

        children.forEach((child: any) => {

            child.setInteractive();

        });

        this.input.on('gameobjectdown', this.selectEmoji, this);
        this.input.once('pointerdown', this.start, this);

        this.arrangeGrid();

        EventBus.emit('current-scene-ready', this);
    }

    start() {
        this.score = 0;
        this.matched = false;

        this.timer = this.time.addEvent({ delay: 30000, callback: this.gameOver, callbackScope: this });
        this.shakeTimer = this.time.addEvent({ delay: 27000, callback: this.shake, callbackScope: this });

        this.sound.play('countdown', { delay: 27 });


    }
    
    volumeButton ()
    {
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


        volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {

            if (this.sound.volume === 0) {
                this.sound.setVolume(1);
                volumeIcon.setTexture("volume-icon");
                volumeIcon.setAlpha(1);
            } else {
                this.sound.setVolume(0);
                volumeIcon.setTexture("volume-icon_off");
                volumeIcon.setAlpha(.5)
            }
        });
    }


    shake() {
        this.cameras.main.shake(100, 0.01);
    }

    selectEmoji(pointer: any, emoji: any) {
        if (emoji.name && emoji.name.includes('volume')) {
            return
        }
        if (this.matched) {
            return;
        }

        //  Is this the first or second selection?
        if (!this.selectedEmoji) {
            //  Our first emoji
            this.circle1.setPosition(emoji.x, emoji.y);
            this.circle1.setVisible(true);

            this.selectedEmoji = emoji;
        }
        else if (emoji !== this.selectedEmoji) {
            //  Our second emoji

            //  Is it a match?
            if (emoji.frame.name === this.selectedEmoji.frame.name) {
                this.circle1.setStrokeStyle(3, 0x00ff00);
                this.circle2.setPosition(emoji.x, emoji.y);
                this.circle2.setVisible(true);

                this.tweens.add({
                    targets: [this.child1, this.child2],
                    scale: 1.4,
                    angle: '-=30',
                    yoyo: true,
                    ease: 'sine.inout',
                    duration: 200,
                    completeDelay: 200,
                    onComplete: () => this.newRound()
                });

                this.sound.play('match');
            }
            else {
                this.circle1.setPosition(emoji.x, emoji.y);
                this.circle1.setVisible(true);

                this.selectedEmoji = emoji;
            }
        }
    }

    newRound() {
        this.matched = false;

        this.score++;

        this.scoreText.setText('Found: ' + this.score);

        this.circle1.setStrokeStyle(3, 0xf8960e);

        this.circle1.setVisible(false);
        this.circle2.setVisible(false);

        //  Stagger tween them all out
        this.tweens.add({
            targets: this.emojis.getChildren(),
            scale: 0,
            ease: 'power2',
            duration: 600,
            delay: this.tweens.stagger(100, { grid: [4, 4], from: 'center' }),
            onComplete: () => this.arrangeGrid()
        });
    }

    arrangeGrid() {
        //  We need to make sure there is only one pair in the grid
        //  Let's create an array with all possible frames in it:

        let frames = Phaser.Utils.Array.NumberArray(1, 40);
        let selected = Phaser.Utils.Array.NumberArray(0, 15);
        let children = this.emojis.getChildren();

        //  Now we pick 16 random values, removing each one from the array so we can't pick it again
        //  and set those into the sprites

        for (let i = 0; i < 16; i++) {
            let frame = Phaser.Utils.Array.RemoveRandomElement(frames);

            children[i].setFrame('smile' + frame);
        }

        //  Finally, pick two random children and make them a pair:
        let index1 = Phaser.Utils.Array.RemoveRandomElement(selected) as any;
        let index2 = Phaser.Utils.Array.RemoveRandomElement(selected) as any;

        this.child1 = children[index1];
        this.child2 = children[index2];

        //  Set the frame to match
        this.child2.setFrame(this.child1.frame.name);

        console.log('Pair: ', index1, index2);

        //  Clear the currently selected emojis (if any)
        this.selectedEmoji = null;

        //  Stagger tween them all in
        this.tweens.add({
            targets: children,
            scale: { start: 0, from: 0, to: 1 },
            ease: 'bounce.out',
            duration: 600,
            delay: this.tweens.stagger(100, { grid: [4, 4], from: 'center' })
        });
    }

    update() {
        if (this.timer) {
            if (this.timer.getProgress() === 1) {
                this.timerText.setText('00:00');
            }
            else {
                const remaining = (30 - this.timer.getElapsedSeconds()).toPrecision(4);
                const pos = remaining.indexOf('.');

                let seconds = remaining.substring(0, pos);
                let ms = remaining.substr(pos + 1, 2);

                seconds = Phaser.Utils.String.Pad(seconds, 2, '0', 1);

                this.timerText.setText(seconds + ':' + ms);
            }
        }
        if (this.score && this.totalScoreText) {
            this.totalScore = this.totalScore + 3

            if (this.totalScore - this.newTotalScore > 30) {
                this.totalScoreText?.setText(`Score:${this.newTotalScore}`)
                this.score = 0
                this.totalScoreText = undefined
                this.input.once('pointerdown', () => {
                    this.scene.start('MainMenu');
                }, this);
            } else {
                this.totalScoreText?.setText(`Score:${Math.min(this.totalScore, this.newTotalScore)}`)
            }
        }
    }

    async gameOver() {
        //  Show them where the match actually was
        this.circle1.setStrokeStyle(4, 0xfc29a6).setPosition(this.child1.x, this.child1.y).setVisible(true);
        this.circle2.setStrokeStyle(4, 0xfc29a6).setPosition(this.child2.x, this.child2.y).setVisible(true);

        this.input.off('gameobjectdown', this.selectEmoji, this);

        this.registry.set('found', this.score);

        this.totalScore = this.registry.get('totalScore')
        const res: any = await endGameReq({found: this.score})
        if (res.code == 0) {
            const data = res.data
            this.registry.set('totalScore', data.score)
            this.registry.set('maxScore', data.game_max_score)
            this.newTotalScore = data.score
        } else {
            console.error(res.msg)
        }
        this.tweens.add({
            targets: [this.circle1, this.circle2],
            alpha: 0,
            yoyo: true,
            repeat: 2,
            duration: 250,
            ease: 'sine.inout',
            onComplete: () => {
                const fontStyle: any = {
                    fontFamily: 'Arial',
                    fontSize: 32,
                    color: '#ffffff',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    shadow: {
                        color: '#000000',
                        fill: true,
                        offsetX: 4,
                        offsetY: 5,
                        blur: 6
                    }
                };
                
                const gameOverText = this.add.text(this.width / 2, 0, 'Game Over', {
                    fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                }).setOrigin(0.5, 0.5).setDepth(100);


                this.tweens.add({
                    targets: gameOverText,
                    y: this.height / 2,
                    ease: 'bounce.out',
                    complete: () => {
                        this.totalScoreText =  this.add.text(this.width / 2, this.height / 2 - 200, `Score:${this.totalScore}`, {
                            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
                            stroke: '#000000', strokeThickness: 4,
                            align: 'center'
                        }).setOrigin(0.5, 0.5).setDepth(60);
                    }
                })
                if (!this.score) {
                    this.input.once('pointerdown', () => {
                        this.scene.start('MainMenu');
                    }, this);
                }
            }
        });
    }
}
