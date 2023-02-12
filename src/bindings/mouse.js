import Two from 'two.js'

const CLEARED_VALUE = null

export default class Mouse
{
    constructor()
    {
        this.vector = new Two.Vector(CLEARED_VALUE, CLEARED_VALUE)
    }

    set coords(coords) {
        let [x, y] = coords
        this.vector.x = x
        this.vector.y = y
    }

    get coords() {
        let {x, y} = this.vector
        return [x, y]
    }

    get x() {
        return this.vector.x
    }

    get y() {
        return this.vector.y
    }

    clearCoords() {
        this.coords = Array(2).fill(CLEARED_VALUE)
    }

    get isCleared() {
        let [x, y] = this.coords
        return (x === CLEARED_VALUE && y === CLEARED_VALUE)
    }
}