import GameGrid from './GameGrid'
import Two from 'two.js'
import {ZUI} from 'two.js/extras/jsm/zui'
import KeyController from 'keycon'
import {
    DEFAULT_CONTROL_SCHEMES, DEFAULT_ENABLED_CONTROL_SCHEMES, DEFAULT_INVERTED_CONTROLS, DEFAULT_PAN_INCREMENT
} from './../bindings/keyboard'

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

        let {bindings} = this.options
        if (bindings.length > 0) {
            this.bindings(bindings)
        }
    }

    // Pan viewport on axis (increment/decrement)
    panViewport(panX = 0, panY = 0) {
        this.zui.translateSurface(
            this.tileCountAsPixels(panX), this.tileCountAsPixels(panY)
        )
        this.canvas.dispatchEvent( new CustomEvent('pan', {
            detail: {panX, panY}
        }))
    }

    bindings(bindings = []) {
        if (bindings.includes('keyboard')) {
            this.keyboardBindings()
        }
        if (bindings.includes('mouse')) {
            this.mouseBindings()
        }
    }

    keyboardBindings() {
        const keycon = new KeyController()
        
        let controlSchemes = DEFAULT_ENABLED_CONTROL_SCHEMES
        let invertedControls = DEFAULT_INVERTED_CONTROLS
        let panIncrement = DEFAULT_PAN_INCREMENT

        // Bind control schemes
        Object.entries(DEFAULT_CONTROL_SCHEMES).filter( ([schemeName, controls]) => {
            return controlSchemes.includes(schemeName)
        }).map( ([schemeName, controls]) => {
            keycon.keydown(controls['⬆️'], e => {
                this.panViewport(0, invertedControls ? -panIncrement : panIncrement)
            });
            keycon.keydown(controls['⬅️'], e => {
                this.panViewport(invertedControls ? -panIncrement : panIncrement, 0)
            });
            keycon.keydown(controls['➡️'], e => {
                this.panViewport(invertedControls ? panIncrement : -panIncrement, 0)
            });
            keycon.keydown(controls['⬇️'], e => {
                this.panViewport(0, invertedControls ? panIncrement : -panIncrement)
            });
        })
    }

    mouseBindings() {
        let onMouseDown = () => {
            this.canvas.addEventListener('mousemove', onMouseMove, false)
        }

        let onMouseUp = () => {
            this.canvas.removeEventListener('mousemove', onMouseMove, false)

            this.mouse.x = null
            this.mouse.y = null
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

            this.mouse.x = null
            this.mouse.y = null
        })
        this.canvas.addEventListener('mouseleave', () => {
            this.canvas.removeEventListener('mousedown', onMouseDown, false)
            this.canvas.removeEventListener('mouseup', onMouseUp, false)
            this.canvas.removeEventListener('mousemove', onMouseMove, false)

            this.mouse.x = null
            this.mouse.y = null
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

        this.canvas.dispatchEvent( new CustomEvent('tile:plot', {
            detail: {tile}
        }))
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
        this.canvas.dispatchEvent( new CustomEvent('image:draw', {
            detail: {img, x, y, centerX, centerY}
        }))
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