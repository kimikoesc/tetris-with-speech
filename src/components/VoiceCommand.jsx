import React from 'react';
import { StyledVoiceCommand } from './styles/style-voicecommand';

function VoiceCommand({callback}) {
    return (
        <StyledVoiceCommand onClick={callback}>
            Use Voice Commands
        </StyledVoiceCommand>
    )
}

export default VoiceCommand
