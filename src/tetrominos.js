export const allTetrominoes = {
    0: { shape: [[0]], color: '0, 0, 0'},
    I: { 
        shape: [
            [0, "I", 0, 0],
            [0, "I", 0, 0],
            [0, "I", 0, 0],
            [0, "I", 0, 0],
        ], 
        color: '255,226,49'
    },
    J: { 
        shape: [
            [0, "J", 0],
            [0, "J", 0],
            ["J", "J", 0],
        ], 
        color: '255,210,125'
    },
    L: { 
        shape: [
            [0, "L", 0],
            [0, "L", 0],
            [0, "L", "L"],
        ], 
        color: '203,244,130'
    },
    O: { 
        shape: [
            ["O", "O"],
            ["O", "O"]
        ], 
        color: '255,173,177'
    },
    S: { 
        shape: [
            [0, "S", "S"],
            ["S", "S", 0],
            [0, 0, 0]
        ], 
        color: '212,142,193'
    },
    Z: { 
        shape: [
            ["Z", "Z", 0],
            [0, "Z", "Z"],
            [0, 0, 0]
        ], 
        color: '173,225,236'
    },
    T: { 
        shape: [
            [0, 0, 0],
            ['T', 'T', 'T'],
            [0, 'T', 0]
        ], 
        color: '116,89,196'
    }
};

export const randomTetromino = () => {
    const tetrominoes = 'IJLOSTZ';
    const randomTetromino = 
    tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    return allTetrominoes[randomTetromino];
}