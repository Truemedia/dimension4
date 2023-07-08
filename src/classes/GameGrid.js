import PixelGrid from './PixelGrid'
import ViewportGrid from './ViewportGrid'
import WorldGrid from './WorldGrid'

const DEFAULTS = {
    tilePixelSize: 16,
    bindings: []
}

export default class GameGrid {
    constructor(mixedOptions, spawn = null) {
        let options = this.options(mixedOptions)

        this.options = Object.assign({}, DEFAULTS, options)
        let {tilePixelSize} = this.options
        let [viewportTileCount] = this.options.viewportTiles
        let [worldMin, worldMax] = this.options.worldTiles

        this.pixelGrid = new PixelGrid({min: 0, max: (tilePixelSize * viewportTileCount)})
        this.viewportGrid = new ViewportGrid({min: 0, max: viewportTileCount})
        this.worldGrid = new WorldGrid({min: worldMin, max: worldMax})
        this.spawnWorldCoords = this.spawn(spawn)
    }

    get height() {
        return this.pixelGrid.maxY
    }

    get width() {
        return this.pixelGrid.maxX
    }

    get tileDimensions() {
        return Array(2).fill(this.options.tilePixelSize)
    }

    options(mixedOptions) {
        let options = {}

        switch (typeof mixedOptions) {
            case 'number':
                let size = mixedOptions
                options = {
                    viewportTiles: Array(2).fill(size),
                    worldTiles: [0, size]
                }
            break;
            case 'object':
                if (Array.isArray(mixedOptions)) {
                    // If nested array assumed first array is viewport, second array is world
                    if (mixedOptions.every( (iteration) => Array.isArray(iteration))) {
                        let [viewportTiles, worldTiles] = mixedOptions
                        options = {viewportTiles, worldTiles}
                    }
                } else {
                    options = mixedOptions
                }
            break;
        }

        return options
    }

    spawn(spawn) {
        let spawnWorldCoords = []

        if (spawn === null) {
            // Spawn in center if no spawn world coords provided
            spawnWorldCoords = this.worldGrid.centreCoords
        } else {
            spawnWorldCoords = spawn
        }

        return spawnWorldCoords
    }

    // Get world coordinates after center offset (top left)
    get worldCoordsAfterOffset() {
        let [x, y] = this.spawnWorldCoords

        return [
            x - this.viewportGrid.radiusX,
            y - this.viewportGrid.radiusY
        ]
    }

    // Convert number of tiles into number of pixels
    tileCountAsPixels(tileCount) {
        let {tilePixelSize} = this.options
        return tileCount * tilePixelSize
    }

    pixelCoordsFromViewportCoords(viewportCoords) {
        let [x, y] = viewportCoords

        return [
            this.tileCountAsPixels(x), this.tileCountAsPixels(y)
        ]
    }

    withinViewport(worldCoords) {
        let [x, y] = worldCoords

        let [worldVisibleMinX, worldVisibleMinY] = this.worldCoordsAfterOffset
        let [worldVisibleMaxX, worldVisibleMaxY] = [
            worldVisibleMinX + (this.viewportGrid.radiusX * 2),
            worldVisibleMinY + (this.viewportGrid.radiusY * 2)
        ]

        return (
            (x >= worldVisibleMinX && x <= worldVisibleMaxX)
            && (y >= worldVisibleMinY && y <= worldVisibleMaxY)
        )
    }

    viewportCoordsFromWorldCoords(worldCoords) {
        console.log('wc', worldCoords)
        let {x, y} = worldCoords

        let [worldX, worldY] = this.worldCoordsAfterOffset
 
        return [
            x - worldX,
            y - worldY
        ]
    }
}