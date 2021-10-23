import React, { useState, useEffect } from 'react';

// Tensorflow Speech Commands Model
import * as tf from "@tensorflow/tfjs";
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
    const [action, setAction] = useState(null);
    const [labels, setLabels] = useState(null);

    const loadModel = async () => { // Loads the Speech Command Model
        const recognizer = await speech.create('BROWSER_FFT', 'directional4w');
        console.log("Model Loaded");
        await recognizer.ensureModelLoaded()
        console.log(recognizer.wordLabels()) 
        setModel(recognizer);
        setLabels(recognizer.wordLabels()); // ["left", "right", "down", "rotate"]
    };

    useEffect(() => {
        loadModel()
    }, []);


    function argMax(arr) {
        return arr.map((x, i) => [x, i]).reduce((r,a) => (a[0] > r[0] ? a:r))[1];
    }

    const recognizeCommands = async () => { // Listens to command
        // As soon as model is triggered, 
        console.log("Listening for commands..");
        // Model listens to our microphone to check if we are actually saying something
        model.listen(result => {
            console.log(result.spectrogram)
            setAction(labels[argMax(Object.values(result.scores))]) // Returns the most accurate result
            console.log(labels[argMax(Object.values(result.scores))]);
        }, { includeSpectrogram: true, probabilityThreshold: 0.7 }) // Additional Parameters
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
                        <Display text={`Score: ${score}`}/>
                        <Display text={`Rows Cleared: ${rows}`}/>
                        <Display text={`Level: ${level}`}/>
                    </div>
                    )}
                    <StartButton callback={startGame}/>
                    <VoiceCommand callback={recognizeCommands} action={action}/>
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris
