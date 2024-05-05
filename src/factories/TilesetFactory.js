export default class TilesetFactory
{
    /**
      * Generate tiles with alternated colors
      */
    static alternateColors(count, colors = []) {
        // Define palette
        let palette = colors.length > 0 ? colors : DEFAULT_COLORS;

        // Calculate repetitions and tailend of pattern
        let quotient = Math.floor(count / palette.length);
        let remainder = count % palette.length;

        // Built pattern of repeating colors
        let pattern = Array(quotient).fill(palette);
        // Append partial repeat
        pattern.push( palette.slice(0, remainder) );
        // Flatten for a single continuous pattern which is basically just an array of colors
        return pattern.flat()
    }

    // static checkered(count, colors = [])
    // {
    //     return [...Array(count).keys()].map( (index) => {
    //         let color = 
    //         return new Tile
    //     })
    // }
}