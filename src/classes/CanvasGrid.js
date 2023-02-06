import GameGrid from './GameGrid'
import Two from 'two.js'
import {ZUI} from 'two.js/extras/jsm/zui'

export default class CanvasGrid extends GameGrid
{
    constructor(options, spawnWorldCoords) {
        super(options, spawnWorldCoords)

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
    }

    // bindEvents() {

    // }

    get canvas() {
        return document.querySelector('canvas')
    }

    // Plot base tiles that fills out a radius
    plotBaseTiles(tile) {
        let {minX, minY, maxX, maxY} = this.worldGrid
        
        for (let x = minX; x < maxX; x++) {
            for (let y = minY; y < maxY; y++) {
                this.plotTile(
                    Object.assign({}, tile, {worldX: x, worldY: y})
                )
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
        let border = true

        let {worldX, worldY} = tile
        let {tileDimensions} = this
        let pixelCoords = this.pixelCoordsFromViewportCoords(
            this.viewportCoordsFromWorldCoords([worldX, worldY])
        )
        
        if (Object.keys(tile).includes('shape')) {
            this.drawShape(tile.shape, pixelCoords, tileDimensions)
        } else {
            this.drawImage(tile.img, pixelCoords, tileDimensions)
        }
        
        if (border) {
            this.drawBorder(pixelCoords, tileDimensions)
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
}