export default class Grid {
    constructor(options)
    {
        this.options = options
    }

    get maxX() {
        return this.options.max
    }

    get maxY() {
        return this.options.max
    }

    get minX() {
        return this.options.min
    }

    get minY() {
        return this.options.min
    }

    midpoint(min, max) {
        return (min + max) / 2
    }

    get centreX() {
        let {minX, maxX} = this
        return this.midpoint(minX, maxX)
    }

    get centreY() {
        let {minY, maxY} = this
        return this.midpoint(minY, maxY)
    }

    get radiusX() {
        return this.maxX - this.centreX
    }

    get radiusY() {
        return this.maxY - this.centreY
    }
}