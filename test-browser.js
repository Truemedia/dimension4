import {CanvasGrid} from './browser.js'

let grid = new CanvasGrid({
    tilePixelSize: 16,
    viewportTiles: [10, 10],
    worldTiles: [-200, 200]
}, [50, 50])

grid.plotTiles([
    {worldX: 44, worldY: 44, img: 'Untitled.png'},
    {worldX: 45, worldY: 45, img: 'Untitled.png'},
    {worldX: 54, worldY: 54, shape: 'rectangle'}
])

function onMouseMove(event)
{
    var rect = canvas.getBoundingClientRect();
    let [mouseX, mouseY] = [event.clientX - rect.left, event.clientY - rect.top]
    if (grid.mouse.x !== 0 && grid.mouse.y !== 0) {
        let [panX, panY] = [mouseX - grid.mouse.x, mouseY - grid.mouse.y]
        grid.zui.translateSurface(panX, panY)
    }

    grid.mouse.x = mouseX
    grid.mouse.y = mouseY
}

let canvas = document.querySelector('#stage')
// mouse in
// mouse out
canvas.addEventListener('mousedown', (event) => {
    canvas.addEventListener('mousemove', onMouseMove, false)
})
canvas.addEventListener('mouseup', (event) => {
    canvas.removeEventListener('mousemove', onMouseMove, false)
})