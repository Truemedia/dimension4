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

    get canvas() {
        return document.querySelector('canvas')
    }

    plotTiles(tiles) {
        tiles.map(tile => this.plotTile(tile))
        this.two.add(this.stage)
    }

    plotTile(tile) {
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