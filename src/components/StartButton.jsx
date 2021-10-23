import React from 'react';
import { StyledStartButton } from './styles/style-startbutton';

function StartButton({ callback }) {
    return (
        <StyledStartButton onClick={callback}>
            Start Game
        </StyledStartButton>
    )
}

export default StartButton
