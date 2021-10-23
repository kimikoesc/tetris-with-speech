export const stage_width = 12;
export const stage_height = 20;

export const createStage = () => 
    Array.from(Array(stage_height), () => 
        Array(stage_width).fill([0, 'clear'])
)

export const checkCollision = (player, stage, {x: moveX, y: moveY}) => {
    for (let y = 0; y < player.tetromino.length; y += 1) {
        for (let x = 0; x < player.tetromino[y].length; x += 1) {
            
            if (player.tetromino[y][x] !== 0) {
                if (
                // check that move is still inside of the game area's height (y)
                !stage[y + player.position.y + moveY] || 
                // check that our move is inside the game area's width (x)
                !stage[y + player.position.y + moveY][x + player.position.x + moveX] ||
                // check that the cell we're moving to isn't set to clear
                stage[y + player.position.y + moveY][x + player.position.x + moveX][1] !== 'clear'
                ) {
                    return true;
                }
            }
        }
    }
};