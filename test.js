const {GameGrid} = require('./bundle')

let grid = new GameGrid({
    tilePixelSize: 16,
    viewportTiles: [10, 10],
    worldTiles: [-200, 200]
}, [50, 50])

console.log(grid.pixelCoordsFromViewportCoords([2, 3]))
console.log(grid.viewportCoordsFromWorldCoords([52, 52]))
console.log(grid.withinViewport([54, 54]))