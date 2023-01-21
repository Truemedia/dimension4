'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var two_js = require('two.js');

class Grid {
    constructor(options)
    {
        this.options = options;
    }

    get maxX() {
        return this.options.max
    }

    get maxY() {
        return this.options.max
    }

    get minX() {
        return this.options.min
    }

    get minY() {
        return this.options.min
    }

    midpoint(min, max) {
        return (min + max) / 2
    }

    get centreX() {
        let {minX, maxX} = this;
        return this.midpoint(minX, maxX)
    }

    get centreY() {
        let {minY, maxY} = this;
        return this.midpoint(minY, maxY)
    }

    get radiusX() {
        return this.maxX - this.centreX
    }

    get radiusY() {
        return this.maxY - this.centreY
    }

    isWithinGrid(coords) {
        
    }
}

class PixelGrid extends Grid {
    // constructor(width, height)
    // {
       
    // }
}

class ViewportGrid extends Grid {
    
}

class WorldGrid extends Grid {
    
}

class GameGrid {
    constructor(options, spawnWorldCoords) {
        this.options = options;

        let {tilePixelSize} = this.options;
        let [viewportTileCount] = this.options.viewportTiles;
        let [worldMin, worldMax] = this.options.worldTiles;

        this.pixelGrid = new PixelGrid({min: 0, max: (tilePixelSize * viewportTileCount)});
        this.viewportGrid = new ViewportGrid({min: 0, max: viewportTileCount});
        this.worldGrid = new WorldGrid({min: worldMin, max: worldMax});
        this.spawnWorldCoords = spawnWorldCoords;
    }

    get tileDimensions() {
        return Array(2).fill(this.options.tilePixelSize)
    }

    // Get world coordinates after center offset (top left)
    get worldCoordsAfterOffset() {
        let [x, y] = this.spawnWorldCoords;

        return [
            x - this.viewportGrid.radiusX,
            y - this.viewportGrid.radiusY
        ]
    }

    pixelCoordsFromViewportCoords(viewportCoords) {
        let [x, y] = viewportCoords;
        let {tilePixelSize} = this.options;

        return [tilePixelSize * x, tilePixelSize * y]
    }

    withinViewport(worldCoords) {
        let [x, y] = worldCoords;

        let [worldVisibleMinX, worldVisibleMinY] = this.worldCoordsAfterOffset;
        let [worldVisibleMaxX, worldVisibleMaxY] = [
            worldVisibleMinX + (this.viewportGrid.radiusX * 2),
            worldVisibleMinY + (this.viewportGrid.radiusY * 2)
        ];

        return (
            (x >= worldVisibleMinX && x <= worldVisibleMaxX)
            && (y >= worldVisibleMinY && y <= worldVisibleMaxY)
        )
    }

    viewportCoordsFromWorldCoords(worldCoords) {
        let [x, y] = worldCoords;

        let [worldX, worldY] = this.worldCoordsAfterOffset;

        return [
            x - worldX,
            y - worldY
        ]
    }
}

console.log('two', two_js.Two);

class CanvasGrid extends GameGrid
{
    get canvas() {
        return document.querySelector('canvas')
    }

    plotTiles(tiles) {
        tiles.map(tile => this.plotTile(tile));
    }

    plotTile(tile) {
        let {worldX, worldY} = tile;
        let {tileDimensions} = this;
        let pixelCoords = this.pixelCoordsFromViewportCoords(
            this.viewportCoordsFromWorldCoords([worldX, worldY])
        );
        
        if (Object.keys(tile).includes('shape')) {
            this.drawShape(tile.shape, pixelCoords, tileDimensions);
        } else {
            this.drawImage(tile.img, pixelCoords, tileDimensions);
        }
        
    }

    drawImage(img, coords, dimensions) {
        let ctx = this.canvas.getContext('2d');
        ctx.drawImage(img, ...coords, ...dimensions);
    }

    drawShape(shape, coords, dimensions) {
        let ctx = this.canvas.getContext('2d');
        switch (shape) {
            case 'rectangle':
                ctx.beginPath();
                ctx.rect(...coords, ...dimensions);
                ctx.stroke();
            break;
        }
    }
}

class TileMap
{

}

exports.CanvasGrid = CanvasGrid;
exports.GameGrid = GameGrid;
exports.TileMap = TileMap;
