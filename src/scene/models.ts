import * as THREE from 'three';
import { ProceduralTextureSet } from './textures';

export interface CaseArtifactBinding {
  caseId: string;
  caseNumber: number;
  group: THREE.Group;
  beaconMat: THREE.MeshStandardMaterial;
  beaconMesh: THREE.Mesh;
  focusPosition: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  animatedPart?: THREE.Object3D;
}

export interface BuiltDeskScene {
  root: THREE.Group;
  caseBindings: CaseArtifactBinding[];
  raycastTargets: THREE.Object3D[];
  steamParticles: THREE.Points;
  lampBulbMat: THREE.MeshStandardMaterial;
  dispose: () => void;
}

function addContactShadow(
  parent: THREE.Object3D,
  shadowTex: THREE.CanvasTexture,
  width: number,
  depth: number,
  yOffset = 0.004
): THREE.Mesh {
  const mat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.55,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = yOffset;
  parent.add(mesh);
  return mesh;
}

function createBeaconRing(radius: number): {
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
} {
  const geo = new THREE.RingGeometry(radius * 0.85, radius, 40);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xe5a93c,
    emissive: 0xe5a93c,
    emissiveIntensity: 0.75,
    roughness: 0.35,
    metalness: 0.2,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.012;
  return { mesh, mat };
}

function attachProxyCollider(
  group: THREE.Group,
  size: [number, number, number],
  centerY: number,
  caseId: string,
  raycastTargets: THREE.Object3D[]
): void {
  const proxyGeo = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
  const proxy = new THREE.Mesh(proxyGeo, proxyMat);
  proxy.position.y = centerY;
  proxy.layers.set(1);
  proxy.userData.caseId = caseId;
  group.add(proxy);
  raycastTargets.push(proxy);
}

export function buildDetectiveDeskScene(
  textures: ProceduralTextureSet,
  isSoftwareGl: boolean
): BuiltDeskScene {
  const root = new THREE.Group();
  const caseBindings: CaseArtifactBinding[] = [];
  const raycastTargets: THREE.Object3D[] = [];

  // Shared calibrated PBR materials
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4a446,
    roughness: 0.26,
    metalness: 0.9,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1e2530,
    roughness: 0.48,
    metalness: 0.78,
  });
  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0x9aa6b5,
    roughness: 0.25,
    metalness: 0.88,
  });
  const walnutMat = new THREE.MeshStandardMaterial({
    map: textures.woodAlbedo,
    bumpMap: textures.woodBump,
    bumpScale: 0.015,
    roughness: 0.62,
    metalness: 0.04,
  });
  const paperMat = new THREE.MeshStandardMaterial({
    map: textures.paperSheet,
    roughness: 0.88,
    metalness: 0.0,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  // =========================================================
  // 1. DETECTIVE DESK & ENVIRONMENT BACKDROP (Tabletop y = 0)
  // =========================================================
  const deskGroup = new THREE.Group();
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.16, 4.4), walnutMat);
  deskTop.position.set(0, -0.08, 0);
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  // Brass edge inlay trim
  const frontTrim = new THREE.Mesh(new THREE.BoxGeometry(8.22, 0.04, 0.04), brassMat);
  frontTrim.position.set(0, -0.02, 2.2);
  deskGroup.add(frontTrim);

  // Desk mat sitting flush on y = 0.008
  const matMesh = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 0.014, 2.3),
    new THREE.MeshStandardMaterial({
      map: textures.deskMat,
      roughness: 0.86,
      metalness: 0.05,
    })
  );
  matMesh.position.set(0, 0.007, 0.2);
  matMesh.receiveShadow = true;
  deskGroup.add(matMesh);

  // Rear Studio Wall & Evidence Corkboard (composite 7-part)
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(14, 6.5, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x101722, roughness: 0.9, metalness: 0.05 })
  );
  backWall.position.set(0, 2.2, -2.35);
  backWall.receiveShadow = true;
  deskGroup.add(backWall);

  const corkGroup = new THREE.Group();
  corkGroup.position.set(0, 1.45, -2.18);
  const corkFrame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.05, 0.09), walnutMat);
  corkFrame.castShadow = true;
  corkGroup.add(corkFrame);

  const corkSurface = new THREE.Mesh(
    new THREE.BoxGeometry(4.24, 1.82, 0.04),
    new THREE.MeshStandardMaterial({
      map: textures.corkBoard,
      roughness: 0.92,
      metalness: 0.0,
    })
  );
  corkSurface.position.z = 0.04;
  corkSurface.receiveShadow = true;
  corkGroup.add(corkSurface);

  // 7 Evidence Pins + Red Investigation Yarn (TubeGeometry)
  const pinPositions = [
    new THREE.Vector3(-1.55, 0.42, 0.08),
    new THREE.Vector3(-0.95, -0.18, 0.08),
    new THREE.Vector3(-0.32, 0.35, 0.08),
    new THREE.Vector3(0.18, -0.25, 0.08),
    new THREE.Vector3(0.75, 0.45, 0.08),
    new THREE.Vector3(1.22, -0.12, 0.08),
    new THREE.Vector3(1.62, 0.25, 0.08),
  ];
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35, metalness: 0.2 });
  const pinGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.06, 12);
  pinGeo.rotateX(Math.PI / 2);
  pinPositions.forEach((pos) => {
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.copy(pos);
    corkGroup.add(pin);
  });

  // Yarn connecting pins using TubeGeometry
  const yarnCurve = new THREE.CatmullRomCurve3(pinPositions);
  const yarnGeo = new THREE.TubeGeometry(yarnCurve, 48, 0.011, 6, false);
  const yarnMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.85, metalness: 0.0 });
  const yarnMesh = new THREE.Mesh(yarnGeo, yarnMat);
  corkGroup.add(yarnMesh);

  // Small pinned evidence cards on corkboard
  for (let i = 0; i < 4; i++) {
    const note = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.01), paperMat);
    note.position.set(-1.55 + i * 1.02, i % 2 === 0 ? 0.3 : -0.18, 0.068);
    note.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.07;
    corkGroup.add(note);
  }
  deskGroup.add(corkGroup);
  root.add(deskGroup);

  // =========================================================
  // 2. ARTICULATED BRASS DESK LAMP (7 parts, left rear)
  // =========================================================
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-2.75, 0, -1.05);
  lampGroup.rotation.y = 0.45;
  addContactShadow(lampGroup, textures.contactShadow, 0.8, 0.8);

  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.09, 28), darkMetalMat);
  lampBase.position.y = 0.045;
  lampBase.castShadow = true;
  lampGroup.add(lampBase);

  const lampCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.12, 20), brassMat);
  lampCollar.position.y = 0.14;
  lampGroup.add(lampCollar);

  const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.036, 0.95, 16), brassMat);
  lowerArm.position.set(0, 0.6, -0.06);
  lowerArm.rotation.x = -0.18;
  lowerArm.castShadow = true;
  lampGroup.add(lowerArm);

  const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), darkMetalMat);
  elbowJoint.position.set(0, 1.05, -0.14);
  lampGroup.add(elbowJoint);

  const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.82, 16), brassMat);
  upperArm.position.set(0, 1.28, 0.18);
  upperArm.rotation.x = 0.92;
  upperArm.castShadow = true;
  lampGroup.add(upperArm);

  // Turned metal shade via LatheGeometry
  const shadePoints = [
    new THREE.Vector2(0.04, 0.24),
    new THREE.Vector2(0.11, 0.22),
    new THREE.Vector2(0.26, 0.08),
    new THREE.Vector2(0.32, 0.0),
  ];
  const shadeGeo = new THREE.LatheGeometry(shadePoints, 28);
  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0x164e3f,
    roughness: 0.22,
    metalness: 0.65,
    side: THREE.DoubleSide,
  });
  const shade = new THREE.Mesh(shadeGeo, shadeMat);
  shade.position.set(0, 1.38, 0.52);
  shade.rotation.x = 0.35;
  shade.castShadow = true;
  lampGroup.add(shade);

  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xffb84d,
    emissiveIntensity: 2.2,
    roughness: 0.2,
  });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), lampBulbMat);
  bulb.position.set(0, 1.4, 0.52);
  lampGroup.add(bulb);
  root.add(lampGroup);

  // =========================================================
  // 3. CERAMIC COFFEE MUG + STEAM PARTICLES (4 parts, decorative prop)
  // =========================================================
  const mugGroup = new THREE.Group();
  mugGroup.position.set(2.55, 0, 0.85);
  addContactShadow(mugGroup, textures.contactShadow, 0.45, 0.45);
  const coaster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.21, 0.016, 24),
    new THREE.MeshStandardMaterial({ map: textures.corkBoard, roughness: 0.9 })
  );
  coaster.position.y = 0.008;
  mugGroup.add(coaster);

  const mugPoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.14, 0),
    new THREE.Vector2(0.15, 0.28),
    new THREE.Vector2(0.125, 0.28),
    new THREE.Vector2(0.12, 0.03),
    new THREE.Vector2(0, 0.03),
  ];
  const mugMesh = new THREE.Mesh(
    new THREE.LatheGeometry(mugPoints, 24),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.28, metalness: 0.05 })
  );
  mugMesh.position.y = 0.016;
  mugMesh.castShadow = true;
  mugGroup.add(mugMesh);

  const coffeeDisk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.122, 0.122, 0.01, 20),
    new THREE.MeshStandardMaterial({ color: 0x241409, roughness: 0.12, metalness: 0.1 })
  );
  coffeeDisk.position.y = 0.24;
  mugGroup.add(coffeeDisk);

  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.135, 0.24, 0),
    new THREE.Vector3(0.23, 0.21, 0),
    new THREE.Vector3(0.23, 0.1, 0),
    new THREE.Vector3(0.135, 0.08, 0),
  ]);
  const mugHandle = new THREE.Mesh(
    new THREE.TubeGeometry(handleCurve, 16, 0.018, 8, false),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.28 })
  );
  mugGroup.add(mugHandle);
  root.add(mugGroup);

  // Subtle ambient dust/steam points above desk
  const particleCount = 36;
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPos[i * 3] = 2.55 + (Math.random() - 0.5) * 0.18;
    pPos[i * 3 + 1] = 0.35 + Math.random() * 0.7;
    pPos[i * 3 + 2] = 0.85 + (Math.random() - 0.5) * 0.18;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const steamParticles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xcbd5e1,
      size: 0.035,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  root.add(steamParticles);

  // =========================================================
  // 4. THE 7 INTERACTIVE CASE ARTIFACTS (Materi a - g)
  // =========================================================

  // --- KASUS 1 (a): Piagam Identitas Warga Digital (Front-Left) ---
  {
    const g = new THREE.Group();
    g.position.set(-1.95, 0, 0.75);
    g.rotation.y = 0.25;
    addContactShadow(g, textures.contactShadow, 0.95, 0.75);

    const cardBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.024, 0.54),
      new THREE.MeshStandardMaterial({ map: textures.charterCard, roughness: 0.72 })
    );
    cardBoard.position.y = 0.012;
    cardBoard.castShadow = true;
    g.add(cardBoard);

    const scrollRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.62, 20),
      new THREE.MeshStandardMaterial({ color: 0xf1e6cf, roughness: 0.85 })
    );
    scrollRod.rotation.x = Math.PI / 2;
    scrollRod.position.set(-0.24, 0.068, 0);
    scrollRod.castShadow = true;
    g.add(scrollRod);

    const capGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.04, 16);
    capGeo.rotateX(Math.PI / 2);
    const cap1 = new THREE.Mesh(capGeo, brassMat);
    cap1.position.set(-0.24, 0.068, 0.33);
    const cap2 = new THREE.Mesh(capGeo, brassMat);
    cap2.position.set(-0.24, 0.068, -0.33);
    g.add(cap1, cap2);

    const waxSeal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.08, 0.02, 20),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4, metalness: 0.1 })
    );
    waxSeal.position.set(0.2, 0.032, 0.12);
    g.add(waxSeal);

    const { mesh: beaconMesh, mat: beaconMat } = createBeaconRing(0.56);
    g.add(beaconMesh);
    attachProxyCollider(g, [0.9, 0.3, 0.7], 0.14, 'case-1', raycastTargets);
    root.add(g);

    caseBindings.push({
      caseId: 'case-1',
      caseNumber: 1,
      group: g,
      beaconMat,
      beaconMesh,
      focusPosition: new THREE.Vector3(-1.95, 0.08, 0.75),
      cameraPosition: new THREE.Vector3(-2.1, 1.35, 2.25),
    });
  }

  // --- KASUS 2 (b): Berkas Profil Karakter Siber (Front-Center-Left) ---
  {
    const g = new THREE.Group();
    g.position.set(-0.92, 0, 0.92);
    g.rotation.y = -0.14;
    addContactShadow(g, textures.contactShadow, 0.85, 0.95);

    const folderBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.64, 0.02, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xd9a14a, roughness: 0.84 })
    );
    folderBottom.position.y = 0.01;
    folderBottom.castShadow = true;
    g.add(folderBottom);

    const folderTab = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.02, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xc28a36, roughness: 0.84 })
    );
    folderTab.position.set(-0.18, 0.01, -0.43);
    g.add(folderTab);

    const sheet1 = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.008, 0.72), paperMat);
    sheet1.position.set(0.02, 0.026, 0.01);
    sheet1.rotation.y = 0.06;
    g.add(sheet1);

    const paperClip = new THREE.Mesh(
      new THREE.TorusGeometry(0.045, 0.008, 8, 20, Math.PI * 1.4),
      aluminumMat
    );
    paperClip.rotation.x = Math.PI / 2;
    paperClip.position.set(0.2, 0.036, -0.26);
    g.add(paperClip);

    const { mesh: beaconMesh, mat: beaconMat } = createBeaconRing(0.55);
    g.add(beaconMesh);
    attachProxyCollider(g, [0.76, 0.25, 0.92], 0.12, 'case-2', raycastTargets);
    root.add(g);

    caseBindings.push({
      caseId: 'case-2',
      caseNumber: 2,
      group: g,
      beaconMat,
      beaconMesh,
      focusPosition: new THREE.Vector3(-0.92, 0.08, 0.92),
      cameraPosition: new THREE.Vector3(-1.0, 1.35, 2.38),
    });
  }

  // --- KASUS 3 (c): Prisma 5 Dimensi Kecerdasan (Center-Right Hero Artifact) ---
  {
    const g = new THREE.Group();
    g.position.set(0.98, 0, 0.72);
    addContactShadow(g, textures.contactShadow, 0.8, 0.8);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.31, 0.08, 8),
      darkMetalMat
    );
    pedestal.position.y = 0.04;
    pedestal.castShadow = true;
    g.add(pedestal);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.05, 8), brassMat);
    collar.position.y = 0.1;
    g.add(collar);

    const prismGroup = new THREE.Group();
    prismGroup.position.y = 0.38;

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.12,
      metalness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: isSoftwareGl ? 0.78 : 0.9,
      transmission: isSoftwareGl ? 0 : 0.55,
      ior: 1.55,
    });
    const pentagonCore = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.34, 5), crystalMat);
    pentagonCore.castShadow = true;
    prismGroup.add(pentagonCore);

    const capTop = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.12, 5), crystalMat);
    capTop.position.y = 0.23;
    prismGroup.add(capTop);

    const gyroRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.014, 12, 36), brassMat);
    gyroRing.rotation.x = Math.PI / 3;
    prismGroup.add(gyroRing);

    g.add(prismGroup);

    const { mesh: beaconMesh, mat: beaconMat } = createBeaconRing(0.46);
    g.add(beaconMesh);
    attachProxyCollider(g, [0.65, 0.78, 0.65], 0.36, 'case-3', raycastTargets);
    root.add(g);

    caseBindings.push({
      caseId: 'case-3',
      caseNumber: 3,
      group: g,
      beaconMat,
      beaconMesh,
      focusPosition: new THREE.Vector3(0.98, 0.34, 0.72),
      cameraPosition: new THREE.Vector3(1.1, 1.32, 2.18),
      animatedPart: prismGroup,
    });
  }

  // --- KASUS 4 (d): Terminal Forensik SIFT / Laptop (Center Hero) ---
  {
    const g = new THREE.Group();
    g.position.set(0, 0, -0.35);
    addContactShadow(g, textures.contactShadow, 1.4, 1.05);

    // Base chassis
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.04, 0.78), aluminumMat);
    base.position.y = 0.02;
    base.castShadow = true;
    g.add(base);

    // Trackpad
    const trackpad = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.004, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.35, metalness: 0.6 })
    );
    trackpad.position.set(0, 0.041, 0.22);
    g.add(trackpad);

    // 48 Instanced keycaps (using InstancedMesh as required for >20 repeated parts)
    const keyGeo = new THREE.BoxGeometry(0.068, 0.012, 0.058);
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.1 });
    const keysInst = new THREE.InstancedMesh(keyGeo, keyMat, 48);
    const dummy = new THREE.Object3D();
    let idx = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        dummy.position.set(-0.44 + col * 0.08, 0.044, -0.22 + row * 0.075);
        dummy.updateMatrix();
        keysInst.setMatrixAt(idx++, dummy.matrix);
      }
    }
    keysInst.instanceMatrix.needsUpdate = true;
    keysInst.computeBoundingSphere();
    g.add(keysInst);

    // Hinged Display Group
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.04, -0.38);
    screenGroup.rotation.x = -0.24;

    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.76, 0.028), aluminumMat);
    lid.position.set(0, 0.38, 0);
    lid.castShadow = true;
    screenGroup.add(lid);

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(1.12, 0.7, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.2 })
    );
    bezel.position.set(0, 0.38, 0.014);
    screenGroup.add(bezel);

    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.04, 0.64),
      new THREE.MeshStandardMaterial({
        map: textures.laptopScreen,
        emissive: 0xffffff,
        emissiveMap: textures.laptopScreen,
        emissiveIntensity: 0.85,
        roughness: 0.18,
      })
    );
    screenMesh.position.set(0, 0.38, 0.02);
    screenGroup.add(screenMesh);
    g.add(screenGroup);

    const { mesh: beaconMesh, mat: beaconMat } = createBeaconRing(0.75);
    g.add(beaconMesh);
    attachProxyCollider(g, [1.26, 0.82, 0.92], 0.38, 'case-4', raycastTargets);
    root.add(g);

    caseBindings.push({
      caseId: 'case-4',
      caseNumber: 4,
      group: g,
      beaconMat,
      beaconMesh,
      focusPosition: new THREE.Vector3(0, 0.32, -0.35),
      cameraPosition: new THREE.Vector3(0, 1.05, 1.48),
    });
  }

  // --- KASUS 5 (e): Smartphone Bukti Jejak Digital (Front-Right) ---
  {
    const g = new THREE.Group();
    g.position.set(1.88, 0, 0.45);
    g.rotation.y = -0.36;
    addContactShadow(g, textures.contactShadow, 0.58, 0.82);

    const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.028, 0.62), darkMetalMat);
    phoneBody.position.y = 0.014;
    phoneBody.castShadow = true;
    g.add(phoneBody);

    const phoneScreenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.56),
      new THREE.MeshStandardMaterial({
        map: textures.phoneScreen,
        emissive: 0xffffff,
        emissiveMap: textures.phoneScreen,
        emissiveIntensity: 0.72,
        roughness: 0.12,
      })
    );
    phoneScreenMesh.rotation.x = -Math.PI / 2;
    phoneScreenMesh.position.y = 0.03;
    g.add(phoneScreenMesh);

    const sideBtn = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.012, 0.09), brassMat);
    sideBtn.position.set(0.163, 0.016, -0.06);
    g.add(sideBtn);

    const homeDock = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.016, 0.14), aluminumMat);
    homeDock.position.set(0, 0.008, -0.28);
    g.add(homeDock);

    const { mesh: beaconMesh, mat: beaconMat } = createBeaconRing(0.45);
    g.add(beaconMesh);
    attachProxyCollider(g, [0.46, 0.22, 0.74], 0.1, 'case-5', raycastTargets);
    root.add(g);

    caseBindings.push({
      caseId: 'case-5',
      caseNumber: 5,
      group: g,
      beaconMat,
      beaconMesh,
      focusPosition: new THREE.Vector3(1.88, 0.08, 0.45),
      cameraPosition: new THREE.Vector3(1.92, 1.15, 1.75),
    });
  }

  // --- KASUS 6 (f): Buku Panduan Aksi Harian (Rear-Left) ---
  {
    const g = new THREE.Group();
    g.position.set(-1.68, 0, -0.58);
    g.rotation.y = 0.34;
    addContactShadow(g, textures.contactShadow, 0.95, 1.05);

    const bookBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.09, 0.86),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.78 })
    );
    bookBottom.position.y = 0.045;
    bookBottom.castShadow = true;
    g.add(bookBottom);

    const bookPages = new THREE.Mesh(
      new THREE.BoxGeometry(0.64, 0.075, 0.82),
      new THREE.MeshStandardMaterial({ color: 0xe7dfd0, roughness: 0.9 })
    );
    bookPages.position.set(0.01, 0.045, 0);
    g.add(bookPages);

    const bookTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.075, 0.78),
      new THREE.MeshStandardMaterial({ map: textures.bookCover, roughness: 0.55, metalness: 0.08 })
    );
    bookTop.position.set(-0.02, 0.128, 0.02);
    bookTop.rotation.y = -0.14;
    bookTop.castShadow = true;
    g.add(bookTop);

    const spineBand = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.078, 0.785), brassMat);
    spineBand.position.set(-0.31, 0.128, -0.02);
    spineBand.rotation.y = -0.14;
    g.add(spineBand);

    const { mesh: beaconMesh, mat: beaconMat } = createBeaconRing(0.58);
    g.add(beaconMesh);
    attachProxyCollider(g, [0.8, 0.34, 0.95], 0.14, 'case-6', raycastTargets);
    root.add(g);

    caseBindings.push({
      caseId: 'case-6',
      caseNumber: 6,
      group: g,
      beaconMat,
      beaconMesh,
      focusPosition: new THREE.Vector3(-1.68, 0.14, -0.58),
      cameraPosition: new THREE.Vector3(-1.82, 1.32, 1.05),
    });
  }

  // --- KASUS 7 (g): Kaca Pembesar Forensik & Berkas Hoaks (Rear-Right) ---
  {
    const g = new THREE.Group();
    g.position.set(1.52, 0, -0.62);
    g.rotation.y = -0.28;
    addContactShadow(g, textures.contactShadow, 0.98, 0.98);

    const dossierPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.024, 0.86),
      new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.76 })
    );
    dossierPad.position.y = 0.012;
    dossierPad.castShadow = true;
    g.add(dossierPad);

    const hoaksSheet = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.008, 0.74), paperMat);
    hoaksSheet.position.y = 0.028;
    g.add(hoaksSheet);

    // Magnifying glass resting on top
    const magGroup = new THREE.Group();
    magGroup.position.set(0.04, 0.055, 0.05);
    magGroup.rotation.y = 0.55;

    // Turned wood handle via LatheGeometry
    const hPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.028, 0.02),
      new THREE.Vector2(0.036, 0.18),
      new THREE.Vector2(0.024, 0.34),
      new THREE.Vector2(0, 0.35),
    ];
    const handle = new THREE.Mesh(
      new THREE.LatheGeometry(hPoints, 16),
      new THREE.MeshStandardMaterial({ color: 0x452718, roughness: 0.52 })
    );
    handle.rotation.x = Math.PI / 2;
    handle.position.z = 0.24;
    handle.castShadow = true;
    magGroup.add(handle);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.07, 16), brassMat);
    ferrule.rotation.x = Math.PI / 2;
    ferrule.position.z = 0.22;
    magGroup.add(ferrule);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.022, 14, 36), brassMat);
    rim.rotation.x = Math.PI / 2;
    rim.castShadow = true;
    magGroup.add(rim);

    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.018, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        roughness: 0.06,
        metalness: 0.0,
        clearcoat: 1.0,
        transparent: true,
        opacity: isSoftwareGl ? 0.38 : 0.85,
        transmission: isSoftwareGl ? 0 : 0.9,
        ior: 1.52,
      })
    );
    magGroup.add(lens);
    g.add(magGroup);

    const { mesh: beaconMesh, mat: beaconMat } = createBeaconRing(0.62);
    g.add(beaconMesh);
    attachProxyCollider(g, [0.9, 0.32, 0.96], 0.14, 'case-7', raycastTargets);
    root.add(g);

    caseBindings.push({
      caseId: 'case-7',
      caseNumber: 7,
      group: g,
      beaconMat,
      beaconMesh,
      focusPosition: new THREE.Vector3(1.52, 0.1, -0.62),
      cameraPosition: new THREE.Vector3(1.62, 1.32, 0.95),
    });
  }

  return {
    root,
    caseBindings,
    raycastTargets,
    steamParticles,
    lampBulbMat,
    dispose: () => {
      root.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material.dispose();
          }
        }
      });
    },
  };
}
