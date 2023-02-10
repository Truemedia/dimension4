import * as THREE from 'https://cdn.skypack.dev/three@latest';
import {CanvasGrid, Tile} from './../browser.js'

// Add Two.js scene
let grid = new CanvasGrid(
    // [
    //     [4, 4], [0, 6]
    // ]
    {
        tilePixelSize: 64,
        viewportTiles: [4, 4],
        worldTiles: [0, 4]
    }
)

grid.plotBaseTiles( new Tile(
    {shape: 'rectangle', border: false, text: '', textStyles: {size: 10}
}) )
grid.refreshStage()

// const two = new Two({
//   type: Two.Types.canvas,
//   width: 512,
//   height: 512,
//   autostart: true
// }).appendTo(document.body);

// const x = two.width / 2;
// const y = two.height / 2;

// const background = two.makeRectangle(x, y, two.width, two.height);
// background.fill = '#00AEFF';

// const styles = {
//   size: 50,
//   color: 'white'
// };
// const text = two.makeText('Hello World', x, y, styles);

// Add Three.js scene

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70);

// Make the animation

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(grid.two.renderer.domElement)
  })
);

scene.add(cube);

renderer.setSize(grid.two.width, grid.two.height);
camera.aspect = 1;
camera.updateProjectionMatrix();
camera.position.z = 2;

document.body.appendChild(renderer.domElement);

let elapsed = 0;

grid.two.bind('update', function(frameCount, timeDelta) {

  if (timeDelta) {
    elapsed += timeDelta / 1000;
  }

//   text.scale = 0.5 * Math.sin(elapsed) + 1;

  cube.rotation.y = elapsed;
  cube.material.map.needsUpdate = true;

  renderer.render(scene, camera);

});