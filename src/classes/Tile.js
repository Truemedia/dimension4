import PixelGrid from './PixelGrid'

const DEFAULTS = {
    border: true,
    max: 16
}

export default class Tile extends PixelGrid
{
    constructor(options) {
        super( Object.assign({}, DEFAULTS, options) )
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

    get text() {
        return this.hasText ? this.options.text : null
    }

    set text(text) {
        this.options.text = text
    }

    get hasBorder() {
        return this.options?.border ?? false
    }

    get hasText() {
        return (typeof this.options?.text === 'string') ?? false
    }

    get isShape() {
        return Object.keys(this.options).includes('shape')
    }

    get isImage() {
        return Object.keys(this.options).includes('img')
    }
}