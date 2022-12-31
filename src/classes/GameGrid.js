import PixelGrid from './PixelGrid'
import ViewportGrid from './ViewportGrid'
import WorldGrid from './WorldGrid'

export default class GameGrid {
    constructor(options, spawnWorldCoords) {
        this.options = options

        let {tilePixelSize} = this.options
        let [viewportTileCount] = this.options.viewportTiles
        let [worldMin, worldMax] = this.options.worldTiles

        this.pixelGrid = new PixelGrid({min: 0, max: (tilePixelSize * viewportTileCount)})
        this.viewportGrid = new ViewportGrid({min: 0, max: viewportTileCount})
        this.worldGrid = new WorldGrid({min: worldMin, max: worldMax})
        this.spawnWorldCoords = spawnWorldCoords
    }

    // Get world coordinates after center offset (top left)
    get worldCoordsAfterOffset() {
        let [x, y] = this.spawnWorldCoords

        return [
            x - this.viewportGrid.radiusX,
            y - this.viewportGrid.radiusY
        ]
    }

    pixelCoordsFromViewportCoords(viewportCoords) {
        let [x, y] = viewportCoords
        let {tilePixelSize} = this.options

        return [tilePixelSize * x, tilePixelSize * y]
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
        let [x, y] = worldCoords

        let [worldX, worldY] = this.worldCoordsAfterOffset

        return [
            x - worldX,
            y - worldY
        ]
    }
}