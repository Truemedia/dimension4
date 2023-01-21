const {CanvasGrid} = require('./bundle')

let grid = new CanvasGrid({
    tilePixelSize: 16,
    viewportTiles: [10, 10],
    worldTiles: [-200, 200]
}, [50, 50])

console.log(grid.pixelCoordsFromViewportCoords([2, 3]))
console.log(grid.viewportCoordsFromWorldCoords([52, 52]))
console.log(grid.withinViewport([54, 54]))
grid.plotTiles([6, 9])