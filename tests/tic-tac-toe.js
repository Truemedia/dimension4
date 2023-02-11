import {CanvasGrid, Tile} from './../browser.js'

let grid = new CanvasGrid(
    // [
    //     [4, 4], [0, 6]
    // ]
    {
        tilePixelSize: 64,
        viewportTiles: [4, 4],
        worldTiles: [0, 4],
        bindings: ['keyboard', 'mouse']
    },
)
grid.canvas.addEventListener('pan', (e) => {
    console.log(e)
})
grid.plotBaseTiles( new Tile(
    {shape: 'rectangle', border: false, text: '', textStyles: {size: 10}
}) )
grid.refreshStage()

// function onMouseMove(event)
// {
//     var rect = canvas.getBoundingClientRect();
//     let [mouseX, mouseY] = [event.clientX - rect.left, event.clientY - rect.top]
//     console.log('test', grid.mouse.x, grid.mouse.y)
//     if (grid.mouse.x !== null && grid.mouse.y !== null) {
//         let [panX, panY] = [mouseX - grid.mouse.x, mouseY - grid.mouse.y]
//         grid.zui.translateSurface(panX, panY)
//     }

//     grid.mouse.x = mouseX
//     grid.mouse.y = mouseY
// }

// function onMouseDown() {
//     canvas.addEventListener('mousemove', onMouseMove, false)
// }

// function onMouseUp() {
//     canvas.removeEventListener('mousemove', onMouseMove, false)
// }

// let canvas = document.querySelector('#stage')
// canvas.addEventListener('mouseenter', () => {
//     canvas.addEventListener('mousedown', onMouseDown, false)
//     canvas.addEventListener('mouseup', onMouseUp, false)
// })
// canvas.addEventListener('mouseleave', () => {
//     canvas.removeEventListener('mousedown', onMouseDown, false)
//     canvas.removeEventListener('mouseup', onMouseUp, false)
//     canvas.removeEventListener('mousemove', onMouseMove, false)

//     grid.mouse.x = null
//     grid.mouse.y = null
// })

const { createApp } = Vue
      
createApp({
    data() {
        return {
            x: 0,
            y: 0
        }
    },
    watch: {
        x(prevWorldX, nextWorldX) {
            let viewportDiff = (prevWorldX - nextWorldX)
            grid.panViewport(viewportDiff, 0)
        },
        y(prevWorldY, nextWorldY) {
            let viewportDiff = (prevWorldY - nextWorldY)
            grid.panViewport(0, viewportDiff)
        }
    }
}).mount('#app')