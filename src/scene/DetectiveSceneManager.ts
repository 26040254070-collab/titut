import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildDetectiveDeskScene, BuiltDeskScene } from './models';
import { createProceduralTextures, ProceduralTextureSet } from './textures';

export type CameraPreset = 'desk' | 'board' | 'overview';

export interface SceneCallbacks {
  onHoverCase: (caseId: string | null) => void;
  onSelectCase: (caseId: string) => void;
  onContextLost?: (lost: boolean) => void;
}

// Pre-allocated scratch math helpers (zero GC inside animation loop)
const _mouseVec = new THREE.Vector2();
const _targetCamPos = new THREE.Vector3(0, 2.35, 3.85);
const _targetLookAt = new THREE.Vector3(0, 0.25, -0.1);
const _burstColor = new THREE.Color();

interface BurstParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class DetectiveSceneManager {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private textures: ProceduralTextureSet;
  private builtScene: BuiltDeskScene;
  private raycaster: THREE.Raycaster;
  private callbacks: SceneCallbacks;
  private isSoftwareGl: boolean;
  private envRenderTarget: THREE.WebGLRenderTarget;

  private frameId = 0;
  private disposed = false;
  private clock = new THREE.Clock();
  private mode: 'title' | 'playing' = 'title';
  private cameraTransitionActive = false;
  private hoveredCaseId: string | null = null;
  private activeCaseId: string | null = null;
  private solvedCaseIds = new Set<string>();
  private lastHoverCheck = 0;
  private pointerDownPos = { x: 0, y: 0 };

  // Celebration burst pool
  private burstPoints: THREE.Points;
  private burstGeo: THREE.BufferGeometry;
  private burstParticles: BurstParticle[] = [];
  private readonly maxBurst = 60;

  private boundOnResize: () => void;
  private boundOnPointerMove: (e: PointerEvent) => void;
  private boundOnPointerDown: (e: PointerEvent) => void;
  private boundOnPointerUp: (e: PointerEvent) => void;
  private boundOnContextLost: (e: Event) => void;
  private boundOnContextRestored: () => void;

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // Software WebGL probe
    this.isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(1, container.clientWidth || window.innerWidth);
    const height = Math.max(1, container.clientHeight || window.innerHeight);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1018);
    this.scene.fog = new THREE.FogExp2(0x0b1018, 0.085);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envRenderTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = this.envRenderTarget.texture;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 45);
    this.camera.position.set(0, 2.55, 4.35);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 1.35;
    this.controls.maxDistance = 6.2;
    this.controls.minPolarAngle = 0.28;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.06;
    this.controls.minAzimuthAngle = -Math.PI / 2.6;
    this.controls.maxAzimuthAngle = Math.PI / 2.6;
    this.controls.target.set(0, 0.25, -0.1);
    this.controls.addEventListener('start', () => {
      this.cameraTransitionActive = false;
    });

    // Studio 3-point lighting rig (warm key + cool hemi fill + desk lamp spot)
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e1b18, 0.68);
    this.scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffe7c2, 1.35);
    keyLight.position.set(3.2, 5.2, 3.8);
    keyLight.castShadow = !this.isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -4.5;
    keyLight.shadow.camera.right = 4.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -4.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
    rimLight.position.set(-4.0, 3.2, -3.5);
    this.scene.add(rimLight);

    const deskSpot = new THREE.SpotLight(0xffb85c, 4.8, 7.5, Math.PI / 3.2, 0.55, 1.4);
    deskSpot.position.set(-2.35, 1.35, -0.58);
    deskSpot.target.position.set(-0.2, 0, 0.25);
    this.scene.add(deskSpot);
    this.scene.add(deskSpot.target);

    // Build textures and models
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.textures = createProceduralTextures(maxAniso);
    this.builtScene = buildDetectiveDeskScene(this.textures, this.isSoftwareGl);
    this.scene.add(this.builtScene.root);

    // Burst particle system
    this.burstGeo = new THREE.BufferGeometry();
    this.burstGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(this.maxBurst * 3), 3)
    );
    this.burstPoints = new THREE.Points(
      this.burstGeo,
      new THREE.PointsMaterial({
        color: 0x34d399,
        size: 0.065,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      })
    );
    this.burstPoints.frustumCulled = false;
    this.scene.add(this.burstPoints);

    // Raycaster locked to layer 1 proxy colliders
    this.raycaster = new THREE.Raycaster();
    this.raycaster.layers.set(1);

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    // Bind events
    this.boundOnResize = this.handleResize.bind(this);
    this.boundOnPointerMove = this.handlePointerMove.bind(this);
    this.boundOnPointerDown = this.handlePointerDown.bind(this);
    this.boundOnPointerUp = this.handlePointerUp.bind(this);
    this.boundOnContextLost = (e: Event) => {
      e.preventDefault();
      this.callbacks.onContextLost?.(true);
    };
    this.boundOnContextRestored = () => {
      this.callbacks.onContextLost?.(false);
    };

    window.addEventListener('resize', this.boundOnResize);
    const dom = this.renderer.domElement;
    dom.addEventListener('pointermove', this.boundOnPointerMove);
    dom.addEventListener('pointerdown', this.boundOnPointerDown);
    dom.addEventListener('pointerup', this.boundOnPointerUp);
    dom.addEventListener('webglcontextlost', this.boundOnContextLost);
    dom.addEventListener('webglcontextrestored', this.boundOnContextRestored);

    this.tick();
  }

  public setMode(mode: 'title' | 'playing'): void {
    this.mode = mode;
    if (mode === 'playing') {
      this.setCameraPreset('desk');
    } else {
      this.cameraTransitionActive = false;
    }
  }

  public setCameraPreset(preset: CameraPreset): void {
    if (preset === 'desk') {
      _targetCamPos.set(0, 2.25, 3.65);
      _targetLookAt.set(0, 0.22, -0.05);
    } else if (preset === 'board') {
      _targetCamPos.set(0, 1.55, 1.45);
      _targetLookAt.set(0, 1.38, -2.1);
    } else {
      _targetCamPos.set(2.35, 2.55, 3.75);
      _targetLookAt.set(0, 0.35, -0.35);
    }
    this.cameraTransitionActive = true;
  }

  public focusOnCase(caseId: string): void {
    const binding = this.builtScene.caseBindings.find((b) => b.caseId === caseId);
    if (!binding) return;
    this.activeCaseId = caseId;
    _targetCamPos.copy(binding.cameraPosition);
    _targetLookAt.copy(binding.focusPosition);
    this.cameraTransitionActive = true;
    this.updateBeaconColors();
  }

  public setSolvedCases(solvedIds: string[]): void {
    this.solvedCaseIds = new Set(solvedIds);
    this.updateBeaconColors();
  }

  public setActiveCase(caseId: string | null): void {
    this.activeCaseId = caseId;
    this.updateBeaconColors();
  }

  public triggerSolveBurst(caseId: string): void {
    const binding = this.builtScene.caseBindings.find((b) => b.caseId === caseId);
    if (!binding) return;
    const origin = binding.focusPosition;
    _burstColor.setHex(0x34d399);
    (this.burstPoints.material as THREE.PointsMaterial).color.copy(_burstColor);
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.4;
      this.burstParticles.push({
        pos: new THREE.Vector3(origin.x, origin.y + 0.12, origin.z),
        vel: new THREE.Vector3(
          Math.cos(angle) * speed,
          1.1 + Math.random() * 1.4,
          Math.sin(angle) * speed
        ),
        life: 0,
        maxLife: 0.9 + Math.random() * 0.4,
      });
    }
  }

  private updateBeaconColors(): void {
    for (const b of this.builtScene.caseBindings) {
      const isSolved = this.solvedCaseIds.has(b.caseId);
      const isActive = this.activeCaseId === b.caseId;
      const isHovered = this.hoveredCaseId === b.caseId;
      if (isSolved) {
        b.beaconMat.color.setHex(0x10b981);
        b.beaconMat.emissive.setHex(0x10b981);
        b.beaconMat.emissiveIntensity = isHovered || isActive ? 1.5 : 0.75;
      } else if (isActive || isHovered) {
        b.beaconMat.color.setHex(0xfbbf24);
        b.beaconMat.emissive.setHex(0xf59e0b);
        b.beaconMat.emissiveIntensity = 1.65;
      } else {
        b.beaconMat.color.setHex(0xe5a93c);
        b.beaconMat.emissive.setHex(0xd97706);
        b.beaconMat.emissiveIntensity = 0.55;
      }
    }
  }

  private updateMouseFromEvent(e: PointerEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    _mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private handlePointerDown(e: PointerEvent): void {
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
  }

  private handlePointerMove(e: PointerEvent): void {
    if (this.mode !== 'playing') return;
    const now = performance.now();
    if (now - this.lastHoverCheck < 45) return;
    this.lastHoverCheck = now;

    this.updateMouseFromEvent(e);
    this.raycaster.setFromCamera(_mouseVec, this.camera);
    const hits = this.raycaster.intersectObjects(this.builtScene.raycastTargets, false);
    const hitId = hits.length > 0 ? (hits[0].object.userData.caseId as string) : null;
    if (hitId !== this.hoveredCaseId) {
      this.hoveredCaseId = hitId;
      this.renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
      this.updateBeaconColors();
      this.callbacks.onHoverCase(hitId);
    }
  }

  private handlePointerUp(e: PointerEvent): void {
    if (this.mode !== 'playing') return;
    const dx = e.clientX - this.pointerDownPos.x;
    const dy = e.clientY - this.pointerDownPos.y;
    if (Math.hypot(dx, dy) > 6) return; // Dragged camera, not a click

    this.updateMouseFromEvent(e);
    this.raycaster.setFromCamera(_mouseVec, this.camera);
    const hits = this.raycaster.intersectObjects(this.builtScene.raycastTargets, false);
    if (hits.length > 0) {
      const caseId = hits[0].object.userData.caseId as string;
      this.focusOnCase(caseId);
      this.callbacks.onSelectCase(caseId);
    }
  }

  private handleResize(): void {
    if (this.disposed) return;
    const w = Math.max(1, this.container.clientWidth || window.innerWidth);
    const h = Math.max(1, this.container.clientHeight || window.innerHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  }

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private tick = (): void => {
    if (this.disposed) return;
    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05);
    const elapsed = this.clock.elapsedTime;

    // Animate 5-dimension civic crystal prism
    for (const b of this.builtScene.caseBindings) {
      if (b.animatedPart) {
        b.animatedPart.rotation.y += dt * 0.55;
        b.animatedPart.position.y = 0.38 + Math.sin(elapsed * 2.1) * 0.025;
      }
    }

    // Gentle coffee steam rise
    const steamAttr = this.builtScene.steamParticles.geometry.attributes
      .position as THREE.BufferAttribute;
    for (let i = 0; i < steamAttr.count; i++) {
      let y = steamAttr.getY(i) + dt * 0.14;
      if (y > 1.05) y = 0.34;
      steamAttr.setY(i, y);
    }
    steamAttr.needsUpdate = true;

    // Update celebration burst particles
    if (this.burstParticles.length > 0) {
      const posAttr = this.burstGeo.attributes.position as THREE.BufferAttribute;
      for (let i = this.burstParticles.length - 1; i >= 0; i--) {
        const p = this.burstParticles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          this.burstParticles.splice(i, 1);
          continue;
        }
        p.vel.y -= 2.8 * dt;
        p.pos.addScaledVector(p.vel, dt);
      }
      for (let i = 0; i < this.maxBurst; i++) {
        if (i < this.burstParticles.length) {
          const p = this.burstParticles[i];
          posAttr.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
        } else {
          posAttr.setXYZ(i, 0, -50, 0);
        }
      }
      posAttr.needsUpdate = true;
    }

    // Camera choreography
    if (this.mode === 'title') {
      const orbitAngle = Math.sin(elapsed * 0.22) * 0.38;
      const desiredX = Math.sin(orbitAngle) * 3.9;
      const desiredZ = Math.cos(orbitAngle) * 3.9;
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, desiredX, 2.5, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, 2.15, 2.5, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, desiredZ, 2.5, dt);
      this.controls.target.set(0, 0.32, -0.2);
      this.controls.update();
    } else {
      if (this.cameraTransitionActive) {
        this.camera.position.x = THREE.MathUtils.damp(
          this.camera.position.x,
          _targetCamPos.x,
          4.5,
          dt
        );
        this.camera.position.y = THREE.MathUtils.damp(
          this.camera.position.y,
          _targetCamPos.y,
          4.5,
          dt
        );
        this.camera.position.z = THREE.MathUtils.damp(
          this.camera.position.z,
          _targetCamPos.z,
          4.5,
          dt
        );
        this.controls.target.x = THREE.MathUtils.damp(
          this.controls.target.x,
          _targetLookAt.x,
          4.5,
          dt
        );
        this.controls.target.y = THREE.MathUtils.damp(
          this.controls.target.y,
          _targetLookAt.y,
          4.5,
          dt
        );
        this.controls.target.z = THREE.MathUtils.damp(
          this.controls.target.z,
          _targetLookAt.z,
          4.5,
          dt
        );
        if (
          this.camera.position.distanceTo(_targetCamPos) < 0.025 &&
          this.controls.target.distanceTo(_targetLookAt) < 0.025
        ) {
          this.cameraTransitionActive = false;
        }
      }
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);

    window.removeEventListener('resize', this.boundOnResize);
    const dom = this.renderer.domElement;
    dom.removeEventListener('pointermove', this.boundOnPointerMove);
    dom.removeEventListener('pointerdown', this.boundOnPointerDown);
    dom.removeEventListener('pointerup', this.boundOnPointerUp);
    dom.removeEventListener('webglcontextlost', this.boundOnContextLost);
    dom.removeEventListener('webglcontextrestored', this.boundOnContextRestored);

    this.controls.dispose();
    this.burstGeo.dispose();
    (this.burstPoints.material as THREE.Material).dispose();
    this.builtScene.dispose();
    this.textures.dispose();
    this.envRenderTarget.dispose();
    this.renderer.dispose();

    if (dom.parentElement === this.container) {
      this.container.removeChild(dom);
    }
  }
}
