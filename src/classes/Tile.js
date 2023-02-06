const DEFAULTS = {
    border: true
}

export default class Tile
{
    constructor(options) {
        this.options = Object.assign({}, DEFAULTS, options)
    }

    set worldCoords(worldCoords) {
        let [worldX, worldY] = worldCoords
        Object.assign(this.options, {worldX, worldY})
    }

    get worldCoords() {
        let {worldX, worldY} = this.options
        return [worldX, worldY]
    }

    get shape() {
        return this.isShape ? this.options.shape : null 
    }

    get hasBorder() {
        return this.options?.border ?? false
    }

    get isShape() {
        return Object.keys(this.options).includes('shape')
    }

    get isImage() {
        return Object.keys(this.options).includes('img')
    }
}