import Two from 'two.js'

const DEFAULT_FILL = 'white'

const DEFAULT_OPTIONS = {
    fill: DEFAULT_FILL
}

export default class ShapeFactory
{
    static rectangle(coords, dimensions, options = {}) {
        const shapeOptions = Object.assign({}, DEFAULT_OPTIONS, options)

        let rectangle = new Two.Rectangle(...coords, ...dimensions)
        
        rectangle.fill = shapeOptions.fill

        return rectangle
    }
}