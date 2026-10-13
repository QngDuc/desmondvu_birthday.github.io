import * as THREE from './vendor/three.module.js';

// Dimensions measured from the Screen primitive in the supplied GLB (meters).
export const SCREEN = { width: 0.068948, height: 0.160448, z: 0.00372 };

export function assemblePhone(gltf) {
  const nodes = new Map();
  gltf.scene.traverse(object => {
    const node = gltf.parser.associations.get(object)?.nodes;
    if (node !== undefined) nodes.set(node, object);
  });
  const body = nodes.get(37), bottom = nodes.get(25), top = nodes.get(36);
  if (!body || !bottom || !top) throw new Error('GLB thiếu các phần thân và bản lề của Galaxy Z Flip 7.');
  // The GLB has two copies. Use the articulated copy with separated halves.
  body.removeFromParent();
  body.position.set(0, 0, 0);
  body.quaternion.identity();
  for (const half of [top, bottom]) {
    half.position.set(0, 0, 0);
    half.quaternion.identity();
  }
  const hinge = new THREE.Group();
  hinge.name = 'Birthday hinge';
  hinge.position.z = SCREEN.z;
  body.add(hinge);
  body.updateMatrixWorld(true);
  hinge.attach(top);
  body.traverse(object => {
    if (!object.isMesh) return;
    const wasArray = Array.isArray(object.material);
    const materials = wasArray ? object.material : [object.material];
    const replacements = materials.map(material => {
      // Replace stock wallpaper; HTML provides the interactive screen.
      if (/^Screen(?: back)?$/.test(material.name)) return new THREE.MeshBasicMaterial({ color: 0x172a24 });
      return material;
    });
    object.material = wasArray ? replacements : replacements[0];
  });
  const root = new THREE.Group();
  root.name = 'Birthday Galaxy Z Flip 7';
  root.scale.setScalar(26);
  root.add(body);
  return { root, body, hinge, top, bottom };
}
