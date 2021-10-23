import React, { useState } from 'react';

// Custom Hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { createStage } from '../gameHelpers';

// Style Components
import { StyledTetrisWrapper, StyledTetris } from './styles/style-tetris';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

function Tetris() {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPosition, resetPlayer] = usePlayer();
    const [stage, setStage] = useStage(player);

    console.log('re-render');

    const movePlayer = (dir) => {
        updatePlayerPosition({x: dir, y: 0});
    };

    const startGame = () => {
        setStage(createStage());
        resetPlayer();
    };

    const drop = () => {
        updatePlayerPosition({x: 0, y: 1, collided: false});
    };

    const dropPlayer = () => {
        drop()
    };

    const move = ({keyCode}) => {
        if(!gameOver) {
            if (keyCode === 37) { // Left
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1); // Right
            } else if (keyCode === 40) { // Down
                dropPlayer();
            };
        };
    };

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)}>
            <StyledTetris>
                <Stage stage={stage}/>
                <aside>
                    { gameOver ? (
                        <Display gameOver={gameOver} text="Game Over"/>
                    ) : (
                    <div>
                        <Display text="Score"/>
                        <Display text="Rows"/>
                        <Display text="Level"/>
                    </div>
                    )}
                    <StartButton onClick={startGame}/>
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris
