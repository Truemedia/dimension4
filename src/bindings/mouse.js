import Point from './../classes/Point'

const DEFAULT_OPTIONS = {
    snapToGrid: true
}

export default class Mouse
{
    constructor(options = {})
    {
        this.options = Object.assign({}, DEFAULT_OPTIONS, options)
        this.draggingPoint = new Point
        this.hoverPoint = new Point
        this.clickPoint = new Point
        this.sustainPoint = new Point
        this.releasePoint = new Point
        // this.worldPoint = new Point
        this.spawnPoint = new Point
        if (Object.keys(this.options).includes('spawnWorldCoords')) {
            this.spawnPoint.coords = this.options.spawnWorldCoords
        }
    }

    updateDragging(mouseEvent, canvas, tilePixelSize) {
        let pixelCoords = this.coordsFromMouseEvent(mouseEvent)
        this.draggingPoint.coords = pixelCoords
        canvas.dispatchEvent( new CustomEvent('tile:drag', {
            detail: {
                pixelCoords,
                viewportCoords: this.viewportCoordsFromPixelCoords(pixelCoords, tilePixelSize)
            }
        }))
    }

    updateHover(mouseEvent, canvas, tilePixelSize, viewportOffset) {
        let pixelCoords = this.coordsFromMouseEvent(mouseEvent)
        let viewportCoords = this.viewportCoordsFromPixelCoords(pixelCoords, tilePixelSize)
        this.hoverPoint.coords = pixelCoords

        canvas.dispatchEvent( new CustomEvent('tile:hover', {
            detail: {
                pixelCoords,
                viewportCoords,
                worldCoords: this.worldPoint(viewportOffset, viewportCoords)
            }
        }))
    }

    updateClick(mouseEvent, canvas, tilePixelSize) {
        let pixelCoords = this.coordsFromMouseEvent(mouseEvent)
        this.clickPoint.coords = pixelCoords
        canvas.dispatchEvent( new CustomEvent('tile:click', {
            detail: {
                pixelCoords,
                viewportCoords: this.viewportCoordsFromPixelCoords(pixelCoords, tilePixelSize)
            }
        }))
    }

    // Initialise bindings to link to canvas element
    bindings(canvas, tilePixelSize, zui = null) {
        const onMouseDown = (mouseEvent) => {
            canvas.addEventListener('mousemove', onMouseDrag, false)

            let pixelCoords = this.coordsFromMouseEvent(mouseEvent)
            this.sustainPoint.coords = pixelCoords
        }

        const onMouseUp = (mouseEvent) => {
            canvas.removeEventListener('mousemove', onMouseDrag, false)

            let pixelCoords = this.coordsFromMouseEvent(mouseEvent)
            this.releasePoint.coords = pixelCoords
            this.draggingPoint.clearCoords()

            if (this.options.snapToGrid) {
                this.snapToViewport(zui, tilePixelSize)
            }
        }

        const onMouseDrag = (mouseEvent) =>
        {
            if (!this.draggingPoint.isCleared) {
                let [nextMouseX, nextMouseY] = this.coordsFromMouseEvent(mouseEvent)
                let [prevMouseX, prevMouseY] = this.draggingPoint.coords
                let [panX, panY] = [nextMouseX - prevMouseX, nextMouseY - prevMouseY]
                zui.translateSurface(panX, panY)
            }

            this.updateDragging(mouseEvent, canvas, tilePixelSize)
        }
        
        const onMouseMove = (mouseEvent) =>
        {
            let {position} = zui.surfaces[0].object
            let {x, y} = position
            let zuiTileOffset = this.viewportCoordsFromPixelCoords([x, y], tilePixelSize)
            this.updateHover(mouseEvent, canvas, tilePixelSize, zuiTileOffset)
        }
        
        canvas.addEventListener('mouseenter', (mouseEvent) => {
            canvas.addEventListener('mousedown', onMouseDown, false)
            canvas.addEventListener('mouseup', onMouseUp, false)
            canvas.addEventListener('mousemove', onMouseMove, false)
            
            let {position} = zui.surfaces[0].object
            let {x, y} = position
            let zuiTileOffset = this.viewportCoordsFromPixelCoords([x, y], tilePixelSize)
            this.updateHover(mouseEvent, canvas, tilePixelSize, zuiTileOffset)
        })
        canvas.addEventListener('mouseleave', () => {
            canvas.removeEventListener('mousedown', onMouseDown, false)
            canvas.removeEventListener('mouseup', onMouseUp, false)
            canvas.removeEventListener('mousemove', onMouseMove, false)
            canvas.removeEventListener('mousemove', onMouseDrag, false)

            this.hoverPoint.clearCoords()
            this.draggingPoint.clearCoords()
        })
        canvas.addEventListener('click', (mouseEvent) => {
            this.updateClick(mouseEvent, canvas, tilePixelSize)
        })
    }

    // Get pixel coordinates of mouse on canvas
    coordsFromMouseEvent(mouseEvent) {
        let {offsetX, offsetY} = mouseEvent
        return [offsetX, offsetY]
    }

    viewportCoordsFromPixelCoords(pixelCoords, tilePixelSize) {
        let [x, y] = pixelCoords
        return [
            Math.floor(x / tilePixelSize), Math.floor(y / tilePixelSize)
        ]
    }

    // Snap to viewport grid by offsetting from current coords
    snapToViewport(zui, tilePixelSize) {
        // Reset ZUI (0,0)
        let {position} = zui.surfaces[0].object
        let {x, y} = position
        zui.translateSurface(-x, -y)

        // Snap
        let [viewportX, viewportY] = [Math.round(x / tilePixelSize), Math.round(y / tilePixelSize)]
        let [snapX, snapY] = [
            (tilePixelSize * viewportX),
            (tilePixelSize * viewportY)
        ]
        zui.translateSurface(snapX, snapY)
    }

    // Get world point from ZUI and mouse position
    worldPoint(viewportZuiOffset, viewportCoords) {
        // Pixel
        // Viewport
        // Offset
        let [viewportX, viewportY] = viewportCoords
        console.log('viewport zui offset', viewportZuiOffset)
        let [zOffsetX, zOffsetY] = viewportZuiOffset
        // Spawn (is top left most tile so not needed if is 0,0)
        let [spawnX, spawnY] = this.spawnPoint.coords

        // console.log('x', viewportX, zOffsetX, spawnX)
        let worldPoint = new Point
        worldPoint.coords = [
            viewportX - zOffsetX, viewportY - zOffsetY
        ]
        return worldPoint
    }
}