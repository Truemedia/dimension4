# dimension4
A node tool for dealing with advanced dimension plotting 

## Installation
```bash
    npm i -S dimension4
```

## Usage
```js
    import {CanvasGrid} from 'dimension4'

    let grid = new CanvasGrid({
        tilePixelSize: 16,
        viewportTiles: [10, 10],
        worldTiles: [-200, 200]
    }, [50, 50])
```

## Examples
```bash
    npm run serve
```

## Compile
```bash
    rollup src/main.js --file bundle.js --format cjs
```