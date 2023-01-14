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
        let [pixelX, pixelY] = this.pixelCoordsFromViewportCoords(
            this.viewportCoordsFromWorldCoords([worldX, worldY])
        )
        
        if (Object.keys(tile).includes('shape')) {
            this.drawShape(tile.shape, [pixelX, pixelY], tileDimensions)
        } else {
            this.drawImage(tile.img, tileDimensions)
        }
        
    }

    drawImage(img, dimensions) {
        let ctx = this.canvas.getContext('2d')
        ctx.drawImage(img, ...dimensions)
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