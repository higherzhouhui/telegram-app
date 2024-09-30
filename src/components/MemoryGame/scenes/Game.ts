import { getSubUserListReq } from "@/api/common";
import { EventBus } from "../EventBus";
import { endGameReq } from "@/api/game";
import { createCard } from "../createCard";

export default class MainGame extends Phaser.Scene {
    private cardNames: any;
    private cards: any;
    private cardOpened: any;
    private canMove: any;
    private lives: any;
    private gridConfiguration: any;
    private scoreText: any;
    private width: any;
    private height: any;
    private score: any;

    private fontStyle: any = {
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
    constructor() {
        super('MainGame');
        this.cardNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5"];
        this.cards = [];
        this.cardOpened = undefined;
        // Can play the game
        this.canMove = false;

        // Game variables
        this.lives = 0;
        this.scoreText = ''
        // Grid configuration
        this.score = 0
    }

    init() {
        // Fadein camera
        this.lives = 10;
        this.volumeButton();
    }

    create() {
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        this.width = width
        this.height = height
        const bgWidth = 600
        const bgHeight = 900
        this.add.image(width / 2, height / 2, 'dark').setScale(width / bgWidth, height / bgHeight).setInteractive;

        this.gridConfiguration = {
            x: 84,
            y: 186,
            paddingX: 6,
            paddingY: 6
        }
        this.startGame();
        this.scoreText = this.add.text(width - 30, 30, `${this.score}`, { ...this.fontStyle, color: '#ff0000' }).setOrigin(0.5, 0.5);
        this.add.image(width - 65, 30, 'cat').setScale(0.04, 0.04).setDepth(1000)
        EventBus.emit('current-scene-ready', this);
    }
    restartGame() {
        this.cardOpened = undefined;
        this.cameras.main.fadeOut(200 * this.cards.length);
        this.cards.reverse().map((card: any, index: any) => {
            this.add.tween({
                targets: card.gameObject,
                duration: 500,
                y: 1000,
                delay: index * 100,
                onComplete: () => {
                    card.gameObject.destroy();
                }
            })
        });

        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.cards = [];
                this.canMove = false;
                this.scene.restart();
                this.sound.play("card-slide", { volume: 1.2 });
            }
        })
    }

    createGridCards() {
        // Phaser random array position
        const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames, ...this.cardNames]);

        return gridCardNames.map((name, index) => {
            const newCard = createCard({
                scene: this,
                x: (this.gridConfiguration.x + this.gridConfiguration.paddingX) * (index % 4) + (this.width - 84 * 4 + this.gridConfiguration.paddingX * 3) / 2 + 24,
                y: -1000,
                frontTexture: name,
                cardName: name
            });
            this.add.tween({
                targets: newCard.gameObject,
                duration: 800,
                delay: index * 100,
                onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
                y: this.gridConfiguration.y + (115 + this.gridConfiguration.paddingY) * Math.floor(index / 4)
            })
            return newCard;
        });
    }

    createHearts() {
        return Array.from(new Array(this.lives)).map((el, index) => {
            const heart = this.add.image(this.sys.game.scale.width + 1000, 85, "heart")
                .setScale(1.5)

            this.add.tween({
                targets: heart,
                ease: Phaser.Math.Easing.Expo.InOut,
                duration: 1000,
                delay: 1000 + index * 200,
                x: 60 + 30 * index // marginLeft + spaceBetween * index
            });
            return heart;
        });
    }


    volumeButton() {
        const volumeIcon = this.add.image(25, 30, "volume-icon").setName("volume-icon").setDepth(5);
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

    startGame() {
        this.score = 0
        // WinnerText and GameOverText
        const winnerText = this.add.text(this.sys.game.scale.width / 2, -1000, "YOU WIN",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
        ).setOrigin(.5)
            .setDepth(3)
            .setInteractive();

        const gameOverText = this.add.text(this.sys.game.scale.width / 2, -1000,
            "GAME OVER\nClick to restart",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#ff0000" }
        )
            .setName("gameOverText")
            .setDepth(3)
            .setOrigin(.5)
            .setInteractive();

        // Start lifes images
        const hearts = this.createHearts();

        // Create a grid of cards
        this.cards = this.createGridCards();

        // Start canMove
        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.canMove = true;
            }
        });

        // Game Logic
        this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: any) => {
            if (this.canMove) {
                const card = this.cards.find((card: any) => card.gameObject.hasFaceAt(pointer.x, pointer.y));
                if (card) {
                    this.input.setDefaultCursor("pointer");
                } else {
                    this.input.setDefaultCursor("default");
                }
            }
        });
        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: any) => {
            if (this.canMove && this.cards.length) {
                const card = this.cards.find((card: any) => card.gameObject.hasFaceAt(pointer.x, pointer.y));

                if (card) {
                    this.canMove = false;

                    // Detect if there is a card opened
                    if (this.cardOpened !== undefined) {
                        // If the card is the same that the opened not do anything
                        if (this.cardOpened.gameObject.x === card.gameObject.x && this.cardOpened.gameObject.y === card.gameObject.y) {
                            this.canMove = true;
                            return false;
                        }

                        card.flip(() => {
                            if (this.cardOpened.cardName === card.cardName) {
                                // ------- Match -------
                                this.sound.play("card-match");
                                // Destroy card selected and card opened from history
                                this.cardOpened.destroy();
                                card.destroy();

                                // remove card destroyed from array
                                this.cards = this.cards.filter((cardLocal: any) => cardLocal.cardName !== card.cardName);
                                // reset history card opened
                                this.cardOpened = undefined;
                                this.canMove = true;
                                this.score += 100
                                this.scoreText.setText(this.score);

                            } else {
                                // ------- No match -------
                                this.sound.play("card-mismatch");
                                this.cameras.main.shake(400, 0.005);
                                // remove life and heart
                                const lastHeart = hearts[hearts.length - 1];
                                this.add.tween({
                                    targets: lastHeart,
                                    ease: Phaser.Math.Easing.Expo.InOut,
                                    duration: 1000,
                                    y: - 1000,
                                    onComplete: () => {
                                        lastHeart.destroy();
                                        hearts.pop();
                                    }
                                });
                                this.lives -= 1;
                                // Flip last card selected and flip the card opened from history and reset history
                                card.flip();
                                this.cardOpened.flip(() => {
                                    this.cardOpened = undefined;
                                    this.canMove = true;

                                });
                            }

                            // Check if the game is over
                            if (this.lives === 0) {
                                // Show Game Over text
                                this.sound.play("whoosh", { volume: 1.3 });
                                this.gameOver('fail')
                                return
                                this.add.tween({
                                    targets: gameOverText,
                                    ease: Phaser.Math.Easing.Bounce.Out,
                                    y: this.sys.game.scale.height / 2,
                                });

                                this.canMove = false;
                            }

                            // Check if the game is won
                            if (this.cards.length === 0) {
                                this.sound.play("whoosh", { volume: 1.3 });
                                this.sound.play("victory");
                                this.score += 500
                                this.scoreText.setText(this.score);
                                this.gameOver('win')
                                // this.add.tween({
                                //     targets: winnerText,
                                //     ease: Phaser.Math.Easing.Bounce.Out,
                                //     y: this.sys.game.scale.height / 2,
                                // });
                                this.canMove = false;
                            }
                        });

                    } else if (this.cardOpened === undefined && this.lives > 0 && this.cards.length > 0) {
                        // If there is not a card opened save the card selected
                        card.flip(() => {
                            this.canMove = true;
                        });
                        this.cardOpened = card;
                    }
                }
            }

        });


        // Text events
        winnerText.on(Phaser.Input.Events.POINTER_OVER, () => {
            winnerText.setColor("#FF7F50");
            this.input.setDefaultCursor("pointer");
        });
        winnerText.on(Phaser.Input.Events.POINTER_OUT, () => {
            winnerText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });
        winnerText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.sound.play("whoosh", { volume: 1.3 });
            this.add.tween({
                targets: winnerText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    this.restartGame();
                }
            })
        });

        gameOverText.on(Phaser.Input.Events.POINTER_OVER, () => {
            gameOverText.setColor("#FF7F50");
            this.input.setDefaultCursor("pointer");
        });

        gameOverText.on(Phaser.Input.Events.POINTER_OUT, () => {
            gameOverText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });

        gameOverText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.add.tween({
                targets: gameOverText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    this.restartGame();
                }
            })
        });
    }

    async gameOver(result: string) {
        //  Show them where the match actually was
        this.time.removeAllEvents()
        setTimeout(() => {
            let s = this.score
            localStorage.setItem('currentScore', `${s}`)
            localStorage.setItem('result', `${result || 'fail'}`)
            this.scene.start('GameOver')
        }, 1000);
    }
}
