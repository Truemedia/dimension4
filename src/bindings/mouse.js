import Point from './../classes/Point'

export default class Mouse
{
    constructor()
    {
        this.draggingPoint = new Point
        this.hoverPoint = new Point
    }

    updateDragging(mouseEvent, canvas) {
        let viewportCoords = this.coordsFromMouseEvent(mouseEvent)
        this.draggingPoint.coords = viewportCoords
        canvas.dispatchEvent( new CustomEvent('tile:drag', {
            detail: {viewportCoords}
        }))
    }

    updateHover(mouseEvent, canvas) {
        let viewportCoords = this.coordsFromMouseEvent(mouseEvent)
        this.hoverPoint.coords = viewportCoords
        canvas.dispatchEvent( new CustomEvent('tile:hover', {
            detail: {viewportCoords}
        }))
    }

    // Initialise bindings to link to canvas element
    bindings(canvas, zui) {
        const onMouseDown = () => {
            canvas.addEventListener('mousemove', onMouseDrag, false)
        }

        const onMouseUp = () => {
            canvas.removeEventListener('mousemove', onMouseDrag, false)

            this.draggingPoint.clearCoords()
        }

        const onMouseDrag = (mouseEvent) =>
        {
            if (!this.draggingPoint.isCleared) {
                let [nextMouseX, nextMouseY] = this.coordsFromMouseEvent(mouseEvent)
                let [prevMouseX, prevMouseY] = this.draggingPoint.coords
                let [panX, panY] = [nextMouseX - prevMouseX, nextMouseY - prevMouseY]
                zui.translateSurface(panX, panY)
            }

            this.updateDragging(mouseEvent, canvas)
        }
        
        const onMouseMove = (mouseEvent) =>
        {
            this.updateHover(mouseEvent, canvas)
        }
        
        canvas.addEventListener('mouseenter', (mouseEvent) => {
            canvas.addEventListener('mousedown', onMouseDown, false)
            canvas.addEventListener('mouseup', onMouseUp, false)
            canvas.addEventListener('mousemove', onMouseMove, false)

            this.updateHover(mouseEvent, canvas)
        })
        canvas.addEventListener('mouseleave', () => {
            canvas.removeEventListener('mousedown', onMouseDown, false)
            canvas.removeEventListener('mouseup', onMouseUp, false)
            canvas.removeEventListener('mousemove', onMouseMove, false)
            canvas.removeEventListener('mousemove', onMouseDrag, false)

            this.hoverPoint.clearCoords()
            this.draggingPoint.clearCoords()
        })
    }

    // Get pixel coordinates of mouse on canvas
    coordsFromMouseEvent(mouseEvent) {
        let {offsetX, offsetY} = mouseEvent
        return [offsetX, offsetY]
    }
}