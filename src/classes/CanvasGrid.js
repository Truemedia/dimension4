import GameGrid from './GameGrid'
import Two from 'two.js'
import {ZUI} from 'two.js/extras/jsm/zui'
import KeyController from 'keycon'

const DEFAULT_TEXT_STYLES = {
    family: 'proxima-nova, sans-serif',
    size: 4,
    leading: 50,
    weight: 900
}

export default class CanvasGrid extends GameGrid
{
    constructor(mixedOptions, spawnWorldCoords) {
        super(mixedOptions, spawnWorldCoords)

        let {height, width} = this

        this.two = new Two({
            domElement: this.canvas,
            height, width,
            fullscreen: false,
            autostart: true
        })
        this.stage = new Two.Group()
        this.zui = new ZUI(this.stage)
        this.zui.addLimits(0.06, 8);
        this.mouse = new Two.Vector(null, null)

        this.bindings()
    }

    // Pan viewport on axis (increment/decrement)
    panViewport(panX = 0, panY = 0) {
        this.zui.translateSurface(
            this.tileCountAsPixels(panX), this.tileCountAsPixels(panY)
        )
    }

    bindings() {
        this.keyboardBindings()
        this.mouseBindings()
    }

    keyboardBindings() {
        const keycon = new KeyController()

        const KEYBOARD_CONTROL_SCHEMES = {
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
        // Numbers of tiles to pan per button press
        const PAN_INCREMENT = 1
        // Whether you are controlling the tiles themselves or travelling through the tiles (inverted for natural movement by default)
        const INVERTED_CONTROLS = false
        const DEFAULT_CONTROL_SCHEMES = ['ARROWS', 'WASD']
        let controlSchemes = DEFAULT_CONTROL_SCHEMES

        // Bind control schemes
        Object.entries(KEYBOARD_CONTROL_SCHEMES).filter( ([schemeName, controls]) => {
            return controlSchemes.includes(schemeName)
        }).map( ([schemeName, controls]) => {
            keycon.keydown(controls['⬆️'], e => {
                this.panViewport(0, INVERTED_CONTROLS ? -PAN_INCREMENT : PAN_INCREMENT)
            });
            keycon.keydown(controls['⬅️'], e => {
                this.panViewport(INVERTED_CONTROLS ? -PAN_INCREMENT : PAN_INCREMENT, 0)
            });
            keycon.keydown(controls['➡️'], e => {
                this.panViewport(INVERTED_CONTROLS ? PAN_INCREMENT : -PAN_INCREMENT, 0)
            });
            keycon.keydown(controls['⬇️'], e => {
                this.panViewport(0, INVERTED_CONTROLS ? PAN_INCREMENT : -PAN_INCREMENT)
            });
        })
    }

    mouseBindings() {
        let onMouseDown = () => {
            this.canvas.addEventListener('mousemove', onMouseMove, false)
        }

        let onMouseUp = () => {
            this.canvas.removeEventListener('mousemove', onMouseMove, false)
        }

        let onMouseMove = (event) =>
        {
            var rect = this.canvas.getBoundingClientRect();
            let [mouseX, mouseY] = [event.clientX - rect.left, event.clientY - rect.top]
            if (this.mouse.x !== null && this.mouse.y !== null) {
                let [panX, panY] = [mouseX - this.mouse.x, mouseY - this.mouse.y]
                this.zui.translateSurface(panX, panY)
            }

            this.mouse.x = mouseX
            this.mouse.y = mouseY
        }

        this.canvas.addEventListener('mouseenter', () => {
            this.canvas.addEventListener('mousedown', onMouseDown, false)
            this.canvas.addEventListener('mouseup', onMouseUp, false)
        })
    }

    get canvas() {
        return document.querySelector('canvas')
    }

    // Plot base tiles that fills out a radius
    plotBaseTiles(tile) {
        let {minX, minY, maxX, maxY} = this.worldGrid
        
        for (let x = minX; x < maxX; x++) {
            for (let y = minY; y < maxY; y++) {
                tile.worldCoords = [x, y]
                this.plotTile(tile)
            }
        }
    }

    plotTiles(tiles) {
        tiles.map(tile => this.plotTile(tile))
    }
    
    refreshStage() {
        this.two.add(this.stage)
    }

    plotTile(tile) {
        let {worldCoords} = tile
        let {tileDimensions} = this
        let pixelCoords = this.pixelCoordsFromViewportCoords(
            this.viewportCoordsFromWorldCoords(worldCoords)
        )
        
        if (tile.isShape) {
            this.drawShape(tile.shape, pixelCoords, tileDimensions)
        } else if (tile.isImage) {
            this.drawImage(tile.img, pixelCoords, tileDimensions)
        }
        
        if (tile.hasBorder) {
            this.drawBorder(pixelCoords, tileDimensions)
        }
        if (tile.hasText) {
            // Use coords as default message if blank string
            let debugCoordsType = 'pixel'
            let debugCoords = null
            switch (debugCoordsType) {
                case 'pixel':
                    debugCoords = pixelCoords
                break;
                case 'world':
                    debugCoords = worldCoords
                break;
            }

            let message = (tile.text !== '') ? tile.text : debugCoords.join(', ')
            let centrePoint = this.options.tilePixelSize / 2
            this.drawText(message, pixelCoords, [centrePoint, centrePoint], tile.options?.textStyles)
        }
    }

    line(coordsStart, coordsEnd) {
        return new Two.Line(coordsStart, coordsEnd)
    }

    drawBorder(coords, dimensions) {
        let [x, y] = coords
        let [width, height] = dimensions

        let topLeft = coords
        let topRight = [x + width, y]
        let bottomRight = [x + width, y + height]
        let bottomLeft = [x, y + height]

        new Array(
            [topLeft, topRight],
            [topRight, bottomRight],
            [bottomRight, bottomLeft],
            [bottomLeft, topLeft]
        ).map( ([coordsStart, coordsEnd]) => {
            let line = new Two.Line(...coordsStart, ...coordsEnd)
            line.stroke = this.options.borderColor || '#ccc'
            this.stage.add(line)
        })
    }

    drawImage(img, coords, dimensions) {
        let [x, y] = coords
        let [width, height] = dimensions
        let centerX = x + (width / 2)
        let centerY = y + (height / 2)
        this.stage.add( new Two.Sprite(img, centerX, centerY) )
    }

    drawShape(shape, coords, dimensions) {
        let [x, y] = coords
        let [width, height] = dimensions
        let centerX = x + (width / 2)
        let centerY = y + (height / 2)

        switch (shape) {
            case 'rectangle':
                this.stage.add( new Two.Rectangle(centerX, centerY, ...dimensions) )
            break;
        }
    }
    
    drawText(message, coords, offsetCoords, textStyles) {
        let [x, y] = coords
        let [offsetX, offsetY] = offsetCoords
        x += offsetX
        y += offsetY

        this.stage.add( new Two.Text(message, ...[x, y], this.textStyles(textStyles)) )
    }

    textStyles(styles = {}) {
        return Object.assign({}, DEFAULT_TEXT_STYLES, styles)
    }
}