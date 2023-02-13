import KeyController from 'keycon'

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

export default class Keyboard
{
    bindings(canvas, zui, tilePixelSize) {
        const keycon = new KeyController()
        
        let controlSchemes = DEFAULT_ENABLED_CONTROL_SCHEMES
        let invertedControls = DEFAULT_INVERTED_CONTROLS
        let panIncrement = DEFAULT_PAN_INCREMENT

        // Pan viewport on axis (increment/decrement)
        const panViewport = (panX = 0, panY = 0) => {
            zui.translateSurface(
                (tilePixelSize * panX), (tilePixelSize * panY)
            )
            canvas.dispatchEvent( new CustomEvent('grid:pan', {
                detail: {panX, panY}
            }))
        }

        // Bind control schemes
        Object.entries(DEFAULT_CONTROL_SCHEMES).filter( ([schemeName, controls]) => {
            return controlSchemes.includes(schemeName)
        }).map( ([schemeName, controls]) => {
            keycon.keydown(controls['⬆️'], e => {
                panViewport(0, invertedControls ? -panIncrement : panIncrement)
            });
            keycon.keydown(controls['⬅️'], e => {
                panViewport(invertedControls ? -panIncrement : panIncrement, 0)
            });
            keycon.keydown(controls['➡️'], e => {
                panViewport(invertedControls ? panIncrement : -panIncrement, 0)
            });
            keycon.keydown(controls['⬇️'], e => {
                panViewport(0, invertedControls ? panIncrement : -panIncrement)
            });
        })     
    }
}