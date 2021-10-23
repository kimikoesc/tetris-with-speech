export const stage_width = 12;
export const stage_height = 20;

export const createStage = () => 
    Array.from(Array(stage_height), () => 
        Array(stage_width).fill([0, 'clear'])
)