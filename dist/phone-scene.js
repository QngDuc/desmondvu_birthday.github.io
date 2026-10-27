import * as THREE from './vendor/three.module.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { CSS3DObject, CSS3DRenderer } from './vendor/CSS3DRenderer.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { assemblePhone, SCREEN } from './phone-model.js';

const stage = document.querySelector('#stage');
const screenElement = document.querySelector('#phone-display');
const coverElement = document.querySelector('#cover-display');
const hint = document.querySelector('#hint');
const loading = document.querySelector('#load-state');
const loadLabel = document.querySelector('#load-label');
const modelProgress = document.querySelector('#model-progress');
const rotateButton = document.querySelector('#rotate');
const foldButton = document.querySelector('#fold');
const resetButton = document.querySelector('#reset');
const zoomInButton = document.querySelector('#zoom-in');
const zoomOutButton = document.querySelector('#zoom-out');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let rotating = false, folded = false, foldAngle = 0, targetFold = 0;
let yaw = -0.2, pointer = null, phone, raf;

async function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  camera.position.set(0, 0, 9);
  const defaultZoom = camera.zoom;
  const minZoom = 0.75;
  const maxZoom = 1.8;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const pixelRatioLimit = navigator.connection?.saveData
    ? 1
    : matchMedia('(max-width: 760px)').matches
      ? 1.5
      : 2;
  renderer.setPixelRatio(Math.min(devicePixelRatio, pixelRatioLimit));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.className = 'model-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.append(renderer.domElement);
  const css = new CSS3DRenderer();
  css.domElement.className = 'screen-layer';
  stage.append(css.domElement);
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xfff5e8, 0x7a8d83, 2));
  const key = new THREE.DirectionalLight(0xffeadb, 3);
  key.position.set(4, 5, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 2);
  rim.position.set(-4, 1, -3);
  scene.add(rim);

  const gltf = await new GLTFLoader().loadAsync(
    './assets/galaxy-z-flip-7.glb',
    event => {
      if (event.lengthComputable) {
        modelProgress.value = event.loaded / event.total;
        loadLabel.textContent = `Đang tải mô hình 3D… ${Math.round(modelProgress.value * 100)}%`;
      } else {
        loadLabel.textContent = `Đang tải mô hình 3D… ${(event.loaded / 1_000_000).toFixed(1)} MB`;
      }
    }
  );
  loadLabel.textContent = 'Đang dựng mô hình 3D…';
  modelProgress.value = 1;
  phone = assemblePhone(gltf);
  scene.add(phone.root);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  stage.addEventListener('click', event => {
    if (screenElement.contains(event.target) || coverElement.contains(event.target)) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.intersectObject(phone.root, true).length) window.enterPhoneFocus?.();
  });
  screenElement.hidden = false;
  const display = new CSS3DObject(screenElement);
  display.position.set(0, 0, SCREEN.z);
  display.scale.setScalar(SCREEN.width / 232);
  phone.body.add(display);
  coverElement.hidden = false;
  const cover = new CSS3DObject(coverElement);
  cover.position.set(0, 0.0305, -0.00365);
  cover.rotation.x = Math.PI;
  cover.scale.setScalar(0.067 / 232);
  phone.top.add(cover);
  loading.hidden = true;
  [rotateButton, foldButton, resetButton, zoomInButton, zoomOutButton].forEach(button => button.disabled = false);

  function resize() {
    const width = stage.clientWidth, height = stage.clientHeight;
    renderer.setSize(width, height);
    css.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();
  function setFold(next) {
    folded = next;
    targetFold = next ? Math.PI : 0;
    foldButton.setAttribute('aria-pressed', String(next));
    foldButton.innerHTML = `<span aria-hidden="true">◫</span><span class="control-label"> ${next ? 'Mở điện thoại' : 'Gập lại'}</span>`;
    foldButton.setAttribute('aria-label', next ? 'Mở điện thoại' : 'Gập điện thoại');
    foldButton.title = next ? 'Mở điện thoại' : 'Gập điện thoại';
    updateHint();
    if (screenElement.contains(document.activeElement) || coverElement.contains(document.activeElement)) foldButton.focus();
  }
  function updateHint() {
    hint.textContent = rotating ? 'Kéo bên ngoài màn hình để xoay · Dùng con lăn hoặc nút +/− để zoom · Điện thoại luôn thẳng đứng' : folded ? 'Chạm màn hình ngoài hoặc bấm Mở điện thoại' : 'Chạm vào một app · Vuốt để chuyển lời chúc và fan art';
  }
  function setZoom(next) {
    camera.zoom = THREE.MathUtils.clamp(next, minZoom, maxZoom);
    camera.updateProjectionMatrix();
  }
  zoomInButton.onclick = () => setZoom(camera.zoom * 1.2);
  zoomOutButton.onclick = () => setZoom(camera.zoom / 1.2);
  stage.addEventListener('wheel', event => {
    event.preventDefault();
    setZoom(camera.zoom * (event.deltaY < 0 ? 1.1 : 1 / 1.1));
  }, { passive: false });
  foldButton.onclick = () => setFold(!folded);
  coverElement.onclick = () => setFold(false);
  rotateButton.onclick = () => {
    rotating = !rotating;
    pointer = null;
    rotateButton.setAttribute('aria-pressed', String(rotating));
    stage.classList.toggle('rotation-mode', rotating);
    stage.tabIndex = rotating ? 0 : -1;
    updateHint();
  };
  resetButton.onclick = () => {
    yaw = -0.2;
    setZoom(defaultZoom);
    pointer = null;
    rotating = false;
    rotateButton.setAttribute('aria-pressed', 'false');
    stage.classList.remove('rotation-mode');
    stage.tabIndex = -1;
    setFold(false);
  };
  stage.addEventListener('pointerdown', event => {
    if (!rotating) return;
    if (screenElement.contains(event.target) || coverElement.contains(event.target)) return;
    pointer = { id: event.pointerId, x: event.clientX, yaw };
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    yaw = pointer.yaw + (event.clientX - pointer.x) * 0.012;
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) stage.addEventListener(event, () => pointer = null);
  stage.addEventListener('keydown', event => {
    if (!rotating || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') yaw -= 0.15;
    if (event.key === 'ArrowRight') yaw += 0.15;
    if (event.key === 'ArrowUp') setZoom(camera.zoom * 1.1);
    if (event.key === 'ArrowDown') setZoom(camera.zoom / 1.1);
  });

  const normal = new THREE.Vector3(), position = new THREE.Vector3(), towardCamera = new THREE.Vector3(), quaternion = new THREE.Quaternion();
  function isFacingCamera(object) {
    object.getWorldQuaternion(quaternion);
    normal.set(0, 0, 1).applyQuaternion(quaternion);
    object.getWorldPosition(position);
    towardCamera.copy(camera.position).sub(position);
    return normal.dot(towardCamera) > 0;
  }
  function visibility(element, visible) {
    element.style.visibility = visible ? 'visible' : 'hidden';
    element.inert = !visible;
  }
  let lastTime = 0;
  function render(time) {
    const dt = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
    lastTime = time;
    foldAngle = reducedMotion.matches ? targetFold : THREE.MathUtils.damp(foldAngle, targetFold, 9, dt);
    if (Math.abs(foldAngle - targetFold) < 0.0005) foldAngle = targetFold;
    phone.hinge.rotation.x = foldAngle;
    phone.root.position.y = 0.04 + (foldAngle / Math.PI) * 1.03;
    phone.root.rotation.set(0, yaw, 0, 'YXZ');
    phone.root.updateMatrixWorld(true);
    visibility(screenElement, foldAngle < 0.035 && isFacingCamera(display));
    visibility(coverElement, foldAngle > 2.95 && isFacingCamera(cover));
    renderer.render(scene, camera);
    css.render(scene, camera);
    raf = requestAnimationFrame(render);
  }
  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) { lastTime = 0; raf = requestAnimationFrame(render); }
  });
}

init().catch(error => {
  console.error('Không tải được điện thoại 3D:', error);
  stage.querySelectorAll('.model-canvas, .screen-layer').forEach(element => element.remove());
  loadLabel.textContent = 'Không mở được model 3D. Bạn vẫn có thể xem các app bên dưới.';
  modelProgress.hidden = true;
  screenElement.hidden = false;
  screenElement.classList.add('display-fallback');
  stage.append(screenElement);
  hint.textContent = 'Thử tải lại trang hoặc mở bằng trình duyệt có hỗ trợ WebGL.';
});
