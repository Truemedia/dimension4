// Control schemes
export const DEFAULT_CONTROL_SCHEMES = {
    'WASD': {
        '⬆️': 'w',
        '⬅️': 'a',
        '➡️': 'd',
        '⬇️': 's'
    },
    'ARROWS': {
        '⬆️': 'up',
        '⬅️': 'left',
        '➡️': 'right',
        '⬇️': 'down'
    }
}
// Default control schemes
export const DEFAULT_ENABLED_CONTROL_SCHEMES = ['ARROWS', 'WASD']
// Whether you are controlling the tiles themselves or travelling through the tiles (inverted for natural movement by default)
export const DEFAULT_INVERTED_CONTROLS = false
// Numbers of tiles to pan per button press
export const DEFAULT_PAN_INCREMENT = 1