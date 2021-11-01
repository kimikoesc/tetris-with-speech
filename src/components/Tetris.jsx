import React, { useState, useEffect } from 'react';

// Tensorflow Speech Commands Model
import * as speech from "@tensorflow-models/speech-commands";

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
import VoiceCommand from './VoiceCommand';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [player, updatePlayerPosition, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    // For speech commands
    const [model, setModel] = useState(null);
    const [labels, setLabels] = useState(null);

    // My Own Trained Library
    const URL = "https://teachablemachine.withgoogle.com/models/djToJU1TI/"

    const loadModel = async () => {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speech.create(
            'BROWSER_FFT', 
            undefined, 
            checkpointURL,
            metadataURL
            );
            
        await recognizer.ensureModelLoaded();

        setModel(recognizer);
        setLabels(recognizer.wordLabels());
    };

    useEffect(() => {
        loadModel()
    }, []);

    // Gets the most accurate word
    function argMax(arr) { 
        return arr.map((x, i) => [x, i]).reduce((r,a) => (a[0] > r[0] ? a:r))[1];
    }

    // Listens to command
    const recognizeCommands = async () => {
       model.listen(result => {
            // Assign most accurate word to command
            let command = labels[argMax(Object.values(result.scores))];
            console.log(command);
            movebyVoice(command);

        }, { includeSpectrogram: true, 
            probabilityThreshold: 0.75, 
            invokeCallbackOnNoiseAndUnknown: true,
            }) // Additional Parameters
    }

    const movebyVoice = act => {
        if (act === "Left") {
            movePlayer(-1);
        } else if (act === "Right") {
            movePlayer(1); 
        } else if (act === "Drop") {
            dropPlayer();
        } else if (act === "Rotate") {
            playerRotate(stage, 1);
        }
    }

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
        setScore(0);
        setRows(0);
        setLevel(0);
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
            } else if (keyCode === 39) { // Right
                movePlayer(1); 
            } else if (keyCode === 40) { // Down
                dropPlayer();
            } else if (keyCode === 38) { // Rotate
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
                        <Display text={`Score: ${score}`}/>
                        <Display text={`Rows Cleared: ${rows}`}/>
                        <Display text={`Level: ${level}`}/>
                    </div>
                    )}
                    <StartButton callback={startGame}/>
                    <VoiceCommand callback={recognizeCommands}/>
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris
