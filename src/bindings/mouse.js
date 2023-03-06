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

    updateHover(mouseEvent, canvas, tilePixelSize) {
        let pixelCoords = this.coordsFromMouseEvent(mouseEvent)
        this.hoverPoint.coords = pixelCoords
        canvas.dispatchEvent( new CustomEvent('tile:hover', {
            detail: {
                pixelCoords,
                viewportCoords: this.viewportCoordsFromPixelCoords(pixelCoords, tilePixelSize)
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
            this.updateHover(mouseEvent, canvas, tilePixelSize)
        }
        
        canvas.addEventListener('mouseenter', (mouseEvent) => {
            canvas.addEventListener('mousedown', onMouseDown, false)
            canvas.addEventListener('mouseup', onMouseUp, false)
            canvas.addEventListener('mousemove', onMouseMove, false)

            this.updateHover(mouseEvent, canvas, tilePixelSize)
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
}