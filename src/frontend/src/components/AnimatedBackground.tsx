import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ─── Particle Count & Config ──────────────────────────────────── */
const PARTICLE_COUNT = 180;
const MAX_LINES = 300;
const DIST_THRESHOLD = 8;

/* ─── Particle Field ───────────────────────────────────────────── */
function ParticleField() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const linesRef = useRef<THREE.LineSegments | null>(null);

  // Initial positions
  const positions = useMemo(() => {
    const pos: {
      id: string;
      x: number;
      y: number;
      z: number;
      offset: number;
      speed: number;
    }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos.push({
        id: `particle-${i}`,
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 20,
        offset: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.25,
      });
    }
    return pos;
  }, []);

  // Line geometry
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(MAX_LINES * 2 * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#00c896"),
        transparent: true,
        opacity: 0.12,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Update particle positions
    const currentPos: THREE.Vector3[] = [];
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p = positions[i];
      const nx = p.x + Math.sin(t * p.speed + p.offset) * 1.2;
      const ny = p.y + Math.cos(t * p.speed * 0.7 + p.offset) * 0.9;
      const nz = p.z + Math.sin(t * p.speed * 0.5 + p.offset * 1.3) * 0.6;
      mesh.position.set(nx, ny, nz);
      currentPos.push(mesh.position);
    });

    // Update connection lines
    if (linesRef.current && currentPos.length === PARTICLE_COUNT) {
      const attr = linesRef.current.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const posArr = attr.array as Float32Array;
      let lineIdx = 0;

      outer: for (let a = 0; a < PARTICLE_COUNT; a++) {
        for (let b = a + 1; b < PARTICLE_COUNT; b++) {
          if (lineIdx >= MAX_LINES) break outer;
          const dist = currentPos[a].distanceTo(currentPos[b]);
          if (dist < DIST_THRESHOLD) {
            const base = lineIdx * 6;
            posArr[base + 0] = currentPos[a].x;
            posArr[base + 1] = currentPos[a].y;
            posArr[base + 2] = currentPos[a].z;
            posArr[base + 3] = currentPos[b].x;
            posArr[base + 4] = currentPos[b].y;
            posArr[base + 5] = currentPos[b].z;
            lineIdx++;
          }
        }
      }
      // Zero out unused lines
      for (let k = lineIdx; k < MAX_LINES; k++) {
        const base = k * 6;
        posArr[base + 0] = 0;
        posArr[base + 1] = 0;
        posArr[base + 2] = 0;
        posArr[base + 3] = 0;
        posArr[base + 4] = 0;
        posArr[base + 5] = 0;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Particles */}
      {positions.map((p, i) => (
        <mesh
          key={p.id}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshBasicMaterial color="#00c896" transparent opacity={0.55} />
        </mesh>
      ))}

      {/* Connection Lines */}
      <lineSegments
        ref={linesRef}
        geometry={lineGeometry}
        material={lineMaterial}
      />
    </>
  );
}

/* ─── Glow Orbs ────────────────────────────────────────────────── */
function GlowOrbs() {
  const orb1Ref = useRef<THREE.Mesh | null>(null);
  const orb2Ref = useRef<THREE.Mesh | null>(null);
  const orb3Ref = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (orb1Ref.current) {
      orb1Ref.current.rotation.x = t * 0.08;
      orb1Ref.current.rotation.y = t * 0.12;
      orb1Ref.current.position.y = -4 + Math.sin(t * 0.3) * 1.5;
    }
    if (orb2Ref.current) {
      orb2Ref.current.rotation.x = t * 0.06;
      orb2Ref.current.rotation.z = t * 0.09;
      orb2Ref.current.position.y = 5 + Math.cos(t * 0.25) * 1.2;
    }
    if (orb3Ref.current) {
      orb3Ref.current.rotation.y = t * 0.1;
      orb3Ref.current.rotation.z = t * 0.07;
      orb3Ref.current.position.x = -12 + Math.sin(t * 0.2) * 1.0;
    }
  });

  return (
    <>
      {/* Large emerald orb — bottom right */}
      <mesh ref={orb1Ref} position={[14, -4, -6]}>
        <icosahedronGeometry args={[5, 1]} />
        <meshBasicMaterial
          color="#00c896"
          transparent
          opacity={0.04}
          wireframe
        />
      </mesh>

      {/* Medium indigo orb — top left */}
      <mesh ref={orb2Ref} position={[-16, 5, -8]}>
        <icosahedronGeometry args={[4, 1]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.035}
          wireframe
        />
      </mesh>

      {/* Small emerald orb — left center */}
      <mesh ref={orb3Ref} position={[-12, -2, -4]}>
        <icosahedronGeometry args={[3, 1]} />
        <meshBasicMaterial
          color="#00c896"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>

      {/* Solid glow core orb — center background */}
      <mesh position={[8, 6, -10]}>
        <sphereGeometry args={[4, 8, 8]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.025} />
      </mesh>
    </>
  );
}

/* ─── Scene ────────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <fog attach="fog" args={["#0a0e14", 30, 80]} />
      <ParticleField />
      <GlowOrbs />
    </>
  );
}

/* ─── AnimatedBackground ───────────────────────────────────────── */
export default function AnimatedBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
