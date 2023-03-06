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

    get color() {
        return this.isColor ? this.options.color : null
    }

    get shape() {
        return this.isShape ? this.options.shape : null 
    }

    get img() {
        return this.isImage ? this.options.img : null
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

    hasOption(option) {
        return Object.keys(this.options).includes(option)
    }

    get hasText() {
        return (typeof this.options?.text === 'string') ?? false
    }

    get isColor() {
        return this.hasOption('color')
    }

    get isShape() {
        return this.hasOption('shape')
    }

    get isImage() {
        return this.hasOption('img')
    }

    get type() {
        let type = null

        switch (true) {
            // Color
            case this.isColor:
                type = 'color'
            break;
            // Image
            case this.isImage:
                type = 'image'
            break;
            // Shape
            case this.isShape:
                type = 'shape'
            break;
        }

        return type
    }
}