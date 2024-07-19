import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame';
import MainMenu from '@/game/scenes/MainMenu';
import { useSelector } from 'react-redux';
import './index.scss'

function GameComp() {
  // The sprite can only be moved in the MainMenu Scene
  const userInfo = useSelector((state: any) => state.user.info);

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const [currentScene, setCurrentScene] = useState('preLoad')
  const changeScene = () => {

    if (phaserRef.current) {
      const scene = phaserRef.current.scene as MainMenu;

      if (scene) {
        if (currentScene == 'MainMenu') {
          console.log(22222)
        }
      }
    }
  }

  const moveSprite = () => {

    if (phaserRef.current) {

      const scene = phaserRef.current.scene as MainMenu;

      if (scene && scene.scene.key === 'MainMenu') {
        // Get the update logo position
        scene.moveLogo(({ x, y }) => {

          setSpritePosition({ x, y });

        });
      }
    }

  }

  const changeTotalScore = () => {

    if (phaserRef.current) {
      const scene = phaserRef.current.scene;
      if (scene) {
        if (currentScene == 'MainMenu') {
          let mainScene = scene as any
          mainScene.showTotal(userInfo)
        }

      }
    }
  }

  // Event emitted from the PhaserGame component
  const currentActiveScene = (scene: Phaser.Scene) => {

    setCurrentScene(scene.scene.key);

  }

  useEffect(() => {
    changeTotalScore()
  }, [phaserRef.current?.scene])

  return (
    <div>
      <PhaserGame ref={phaserRef} currentActiveScene={currentActiveScene} />
      {/* <div className='game-op'>
        <div>
          <button className="button" onClick={changeScene}>Change Scene</button>
        </div>
        <div>
          <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
        </div>
        <div className="spritePosition">Sprite Position:
          <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
        </div>
        <div>
          <button className="button" onClick={addSprite}>Add New Sprite</button>
        </div>
      </div> */}
    </div>
  )
}

export default GameComp
