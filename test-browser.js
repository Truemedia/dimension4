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
    console.log('test', grid.mouse.x, grid.mouse.y)
    if (grid.mouse.x !== null && grid.mouse.y !== null) {
        let [panX, panY] = [mouseX - grid.mouse.x, mouseY - grid.mouse.y]
        grid.zui.translateSurface(panX, panY)
    }

    grid.mouse.x = mouseX
    grid.mouse.y = mouseY
}

function onMouseDown() {
    canvas.addEventListener('mousemove', onMouseMove, false)
}

function onMouseUp() {
    canvas.removeEventListener('mousemove', onMouseMove, false)
}

let canvas = document.querySelector('#stage')
canvas.addEventListener('mouseenter', () => {
    canvas.addEventListener('mousedown', onMouseDown, false)
    canvas.addEventListener('mouseup', onMouseUp, false)
})
canvas.addEventListener('mouseleave', () => {
    canvas.removeEventListener('mousedown', onMouseDown, false)
    canvas.removeEventListener('mouseup', onMouseUp, false)
    canvas.removeEventListener('mousemove', onMouseMove, false)

    grid.mouse.x = null
    grid.mouse.y = null
})