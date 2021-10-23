import { useState, useCallback } from "react";
import { checkCollision, stage_width } from "../gameHelpers";
import { allTetrominoes, randomTetromino } from "../tetrominos";

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        position: { x: 0, y: 0},
        tetromino: allTetrominoes[0].shape,
        collided: false
    });

    const rotate = (matrix, dir) => {
        // swap rows to cols
        const rotatedTetromino = matrix.map((_, index) => 
            matrix.map(col => col[index])
        );
        // reverse reach row to get a rotated matrix
        if (dir > 0) return rotatedTetromino.map(row => row.reverse())
        return rotatedTetromino.reverse();
    }

    const playerRotate = (stage, dir) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        const position = clonedPlayer.position.x;
        let offset = 1;

        while(checkCollision(clonedPlayer, stage, {x: 0, y: 0})) {
            clonedPlayer.position.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir)
                clonedPlayer.position.x = position;
                return;
            }
        }

        setPlayer(clonedPlayer);
    }

    const updatePlayerPosition = ({x, y, collided}) => {
        setPlayer(prev => ({
            ...prev,
            position: {x: (prev.position.x += x), y: (prev.position.y += y)},
            collided,
        }))
    };

    const resetPlayer = useCallback(() => {
        setPlayer({
            position: {x: stage_width / 2 - 2, y: 0},
            tetromino: randomTetromino().shape,
            collided: false
        })
    }, [])

    return [player, updatePlayerPosition, resetPlayer, playerRotate];
}