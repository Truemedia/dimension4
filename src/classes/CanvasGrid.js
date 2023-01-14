import GameGrid from './GameGrid'

export default class CanvasGrid extends GameGrid
{
    get canvas() {
        return document.querySelector('canvas')
    }

    plotTiles(tiles) {
        tiles.map(tile => this.plotTile(tile))
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
        let ctx = this.canvas.getContext('2d')
        ctx.drawImage(img, ...coords, ...dimensions)
    }

    drawShape(shape, coords, dimensions) {
        let ctx = this.canvas.getContext('2d')
        switch (shape) {
            case 'rectangle':
                ctx.beginPath()
                ctx.rect(...coords, ...dimensions)
                ctx.stroke()
            break;
        }
    }
}