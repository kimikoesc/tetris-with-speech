import React from 'react';
import { StyledDisplay } from './styles/style-display';
 
function Display({ gameOver, text }) {
    return (
        <StyledDisplay gameOver={gameOver}>{ text }</StyledDisplay>
    )
}

export default Display
