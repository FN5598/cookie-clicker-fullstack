import React from 'react';
import Wavify from 'react-wavify'

export function Wave({ fill = "#6c63ff", paused = false, height = 1, amplitude = 30, speed = 0.2, points = 3 }) {
    return (
        <Wavify
            fill={fill}
            paused={paused}
            options={{
                height,
                amplitude,
                speed,
                points,
            }}
        />
    );
}