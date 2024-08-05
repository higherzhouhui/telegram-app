import { EventBus } from "../EventBus";
export default class MainGame extends Phaser.Scene {
    private score: number = 0;
    private scoreText: any;
    private timer: any;
    private shakeTimer: any;
    private timerText: any;
    private width: number = 0;
    private height: number = 0;
    private autoCreateTimer: any;
    private images: any[] = [];
    private freeze: Boolean = false;
    private timerCount: number = 20;
    private fontStyle: any = {
        fontFamily: 'Arial',
        fontSize: 20,
        color: '#000000',
        fontStyle: 'bold',
    };
    constructor() {
        super('MainGame');

        this.score = 0;
        this.scoreText;
        this.timer = null;
        this.timerText;
        this.shakeTimer;
        this.freeze = false
    }

    init() {
        // Fadein camera
        this.cameras.main.fadeIn(500);
    }

    create() {
        const screen = document.getElementsByClassName('layout')
        const width = screen[0].clientWidth
        const height = screen[0].clientHeight
        this.width = width
        this.height = height
        const bgWidth = 1125
        const bgHeight = 2115
        this.add.image(width / 2, height / 2, 'dark').setScale(width / bgWidth, height / bgHeight)
        // 倒计时背景框
        const graphics = this.add.graphics({ x: 50, y: 50 }).setDepth(1000);
        graphics.fillStyle(0xffffff, 0.3);

        graphics.fillRoundedRect(0, 0, 70, 30, 12).setPosition(10, 5);

        graphics.fillStyle(0xff00ff, 1);

        // 倒计时和得分
        this.timerText = this.add.text(45, 20, `${this.timerCount}:00`, this.fontStyle).setOrigin(0.5, 0.5).setDepth(1000);
        this.scoreText = this.add.text(width - 30, 20, `${this.score}`, this.fontStyle).setOrigin(0.5, 0.5).setDepth(1000);
        this.add.image(width - 60, 20, 'tomato').setScale(0.7, 0.7).setDepth(1000)

        EventBus.emit('current-scene-ready', this);
        // 延时1秒后执行
        setTimeout(() => {
            this.start()
        }, 1000);
    }

    start() {
        this.score = 0;
        this.timer = this.time.addEvent({ delay: this.timerCount * 1000, callback: this.gameOver, callbackScope: this });
        this.autoCreateTimer = setInterval(() => {
            this.autoCreateIcon()
        }, 200);
    }

    reStart() {
        this.freeze = false
        this.timer = this.time.addEvent({ delay: this.timerCount * 1000, callback: this.gameOver, callbackScope: this });
        this.autoCreateTimer = setInterval(() => {
            this.autoCreateIcon()
        }, 200);
    }
    autoCreateIcon() {
        let type = 'tomato'
        let speed = Math.max(Math.random() * 3, 0.5)
        let iconWidth = Math.random() * 80 + 20
        let tomatoWidth = 32
        let random = Math.random()
        if (random < 0.95) {
            type = 'tomato'
        } else if (random < 0.98) {
            // 不让同屏出现两个冻结
            if (!this.images.filter(item => { return item.type == 'freeze' }).length) {
                type = 'freeze'
                iconWidth = 48
                speed = 2
            }
        } else {
            type = 'boom'
            iconWidth = 48
            speed = 2
        }

        let iconX = Math.random() * this.width
        if (iconX < iconWidth / 2) {
            iconX = iconWidth / 2 + 12
        }
        if (iconX > this.width - iconWidth / 2) {
            iconX = this.width - iconWidth / 2 - 12
        }
        let score = 1
        if (iconWidth > 50) {
            score = 3
        }
        if (iconWidth > 80) {
            score = 5
        }

        let icon = this.add.image(iconX, 0, type).setInteractive().setScale(0.3, 0.3).setDepth(10)
        if (type == 'tomato') {
            icon.setScale(iconWidth / tomatoWidth, iconWidth / tomatoWidth).setDepth(5)
        }

        this.images.push({
            icon: icon,
            speed: speed,
            maxY: this.height + 200,
            type: type,
        })
        icon.on('pointerdown', () => {
            if (type == 'boom') {
                this.shake()
                this.score = Math.max(this.score - 200, 0)
                this.scoreText.setText(this.score).setColor('#ffffff')
                const bgWidth = 1125
                const bgHeight = 2115
                const boomBgImg = this.add.image(this.width / 2, this.height / 2, `${type}Bg`).setScale(this.width / bgWidth, this.height / bgHeight);
                setTimeout(() => {
                    boomBgImg.destroy()
                    this.scoreText.setColor('#000000')
                }, 1000);
            }
            if (type == 'freeze') {
                this.freeze = true
                this.timerCount = Math.round((this.timer.delay - this.timer.elapsed) / 1000)
                this.time.removeEvent(this.timer)
                this.timer = null
                clearInterval(this.autoCreateTimer)
                const bgWidth = 1125
                const bgHeight = 2115
                const boomBgImg = this.add.image(this.width / 2, this.height / 2, `${type}Bg`).setScale(this.width / bgWidth, this.height / bgHeight);
                EventBus.emit('execTypeCmd', type)
                setTimeout(() => {
                    this.reStart()
                    boomBgImg.destroy()
                    EventBus.emit('execTypeCmd', '')
                }, 4000);
            }
            if (type == 'tomato') {
                const scoreTextTween = this.add.text(icon.x, icon.y, `+${score}`, { fontSize: 24, color: '#ffffff', stroke: '#000000', strokeThickness: 2, fontStyle: 'bold' }).setDepth(10)
                this.add.tween({
                    targets: scoreTextTween,
                    alpha: { from: 1, to: 0 },
                    ease: 'Linear',
                    duration: 1000,
                })
                this.score += score
                this.scoreText.setText(this.score)
                EventBus.emit('execBoom', { left: icon.x, top: icon.y, show: true })
                setTimeout(() => {
                    EventBus.emit('execBoom', { left: icon.x, top: icon.y, show: false })
                }, 300);
            }
            icon.destroy()
        })
    }

    shake() {
        this.cameras.main.shake(100, 0.01);
    }

    update() {
        if (this.timer) {
            if (this.timer.getProgress() === 1) {
                this.timerText.setText('00:00');
                this.timer = null
                clearInterval(this.autoCreateTimer)
            } else {
                const remaining = (this.timerCount - this.timer.getElapsedSeconds()).toPrecision(4);
                const pos = remaining.indexOf('.');

                let seconds = remaining.substring(0, pos);
                let ms = remaining.substr(pos + 1, 2);

                seconds = Phaser.Utils.String.Pad(seconds, 2, '0', 1);

                this.timerText.setText(seconds + ':' + ms);

                if (!this.freeze) {
                    this.images.map((item, index) => {
                        item.icon.y += item.speed
                        if (item.icon.y > item.maxY) {
                            this.images.splice(index, 1)
                        }
                        if (item.type !== 'tomato') {
                            item.icon.rotation += 0.01
                        }
                    })
                }
            }
        }
    }

    async gameOver() {
        this.time.removeEvent(this.timer)
        localStorage.setItem('currentScore', this.score)
        this.scene.start('GameOver')
    }
}
