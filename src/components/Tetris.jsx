import React, { useState } from 'react';

// Custom Hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { createStage, checkCollision } from '../gameHelpers';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';

// Style Components
import { StyledTetrisWrapper, StyledTetris } from './styles/style-tetris';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

function Tetris() {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPosition, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    console.log('re-render');

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0})) {
            updatePlayerPosition({x: dir, y: 0})
        }
    };

    const startGame = () => {
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
    };

    const drop = () => {
        // Speed Level
        if(rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            setDropTime(1000 / (level + 1) + 200);
        }

        if (!checkCollision(player, stage, {x: 0, y: 1})) {
            updatePlayerPosition({x: 0, y: 1, collided: false});
        } else {
            if (player.position.y < 1) {
                console.log("Game Over")
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPosition({x: 0, y: 0, collided: true})
        }
    };

    const dropPlayer = () => {
        drop();
    };

    const move = ({keyCode}) => {
        if(!gameOver) {
            if (keyCode === 37) { // Left
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1); // Right
            } else if (keyCode === 40) { // Down
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
            }
        };
    };

    useInterval(() => {
        drop()
    }, dropTime);

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
                    <StartButton callback={startGame}/>
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris
