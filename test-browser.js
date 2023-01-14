import {CanvasGrid} from './browser.js'

let grid = new CanvasGrid({
    tilePixelSize: 16,
    viewportTiles: [10, 10],
    worldTiles: [-200, 200]
}, [50, 50])

grid.plotTiles([
    {worldX: 45, worldY: 45, shape: 'rectangle'},
    {worldX: 54, worldY: 54, shape: 'rectangle'}
])