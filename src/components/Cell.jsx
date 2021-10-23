import React from 'react';
import { StyledCell } from'./styles/style-cell';
import { allTetrominoes } from '../tetrominos';

function Cell({ type }) {
    return (
        <StyledCell type={'L'} color={ allTetrominoes['L'].color }>
            Cell
        </StyledCell>
    )
}

export default Cell;
