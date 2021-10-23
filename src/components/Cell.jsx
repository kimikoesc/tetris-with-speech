import React from 'react';
import { StyledCell } from'./styles/style-cell';
import { allTetrominoes } from '../tetrominos';

function Cell({ type }) {
    return (
        <StyledCell type={type} color={ allTetrominoes[type].color }/>
    )
}

export default Cell;
