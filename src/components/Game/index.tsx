import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

type DiceProps = {
  sides: number;
  probabilities: number[]; // Probabilities for each side (normalized to sum to 1)
  onRoll: (result: number) => void;
};

const Dice: React.FC<DiceProps> = ({ sides, probabilities, onRoll }) => {
  const phaserContainer = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    if (!phaserContainer.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: phaserContainer.current,
      width: 100,
      height: 100,
      scene: {
        preload: function () {
          this.load.setPath('ass');

          // Load dice images or spritesheets
          // this.load.image('dice1', 'assets/d1.png');
          // this.load.image('dice2', 'assets/d2.png');
          // this.load.image('dice3', 'assets/d3.png');
          // this.load.image('dice4', 'assets/d4.png');
          // this.load.image('dice5', 'assets/d5.png');
          // this.load.image('dice6', 'assets/d6.png');
          // Load images or spritesheets for each dice side
        },
        create: function () {
          // const dice = this.add.sprite(50, 50, 'dice');

          // const rollDice = () => {
          //   const randomNumber = Math.floor(Math.random() * 6) + 1;
          //   setResult(randomNumber);

          //   setTimeout(() => {
          //     dice.setTexture(`dice${randomNumber}`);
          //   }, 2000);
          // };

          // dice.setInteractive();
          // dice.on('pointerdown', rollDice);
        },
        update: function () {
          // Handle animation or rolling logic
          // Example: this.dice.anims.play('roll');
          // Implement animation for rolling the dice
          // this.dice.anims.play('roll')
        }
      }
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  // Function to roll the dice based on probabilities
  const rollDice = () => {
    let rand = Math.random();
    let cumulativeProb = 0;
    let result = 0;

    for (let i = 0; i < sides; i++) {
      cumulativeProb += probabilities[i];
      if (rand < cumulativeProb) {
        result = i + 1; // Dice sides are usually 1-indexed
        break;
      }
    }

    onRoll(result);
  };

  return (
    <div>
      <div ref={phaserContainer}></div>
      <button onClick={rollDice}>Roll Dice</button>
    </div>
  );
};

export default Dice;