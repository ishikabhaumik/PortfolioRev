"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Data ───────────────────────────────────────────────────────────────── */

interface Cube {
  id: string;
  label: string;
  copy: string;
  isCenter?: boolean;
}

const CUBES: Cube[] = [
  { id: "systems", label: "Systems", copy: "Thinking in architectures, not pages." },
  { id: "design", label: "Design", copy: "Precision that feels effortless." },
  { id: "ai", label: "AI", copy: "Tools that think alongside people." },
  { id: "motion", label: "Motion", copy: "Movement as a layer of meaning." },
  { id: "human", label: "Human", copy: "Technology should feel human.", isCenter: true },
  { id: "research", label: "Research", copy: "Curiosity before certainty." },
  { id: "craft", label: "Craft", copy: "I obsess over the last 10%." },
  { id: "writing", label: "Writing", copy: "Clarity of thought, clarity of code." },
  { id: "play", label: "Play", copy: "The best ideas happen away from the screen." },
];

const CUBE_SIZE = 0.78;
const GAP = 0.34;
const STEP = CUBE_SIZE + GAP;

/* ─── Single cube ────────────────────────────────────────────────────────── */

interface CubeMeshProps {
  cube: Cube;
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

function CubeMesh({ cube, index, hoveredId, setHoveredId }: CubeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const row = Math.floor(index / 3);
  const col = index % 3;
  const baseX = (col - 1) * STEP;
  const baseY = (1 - row) * STEP;

  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const isHovered = hoveredId === cube.id;
  const anyHovered = hoveredId !== null;

  useFrame((state) => {
    const g = groupRef.current;
    const m = meshRef.current;
    if (!g || !m) return;

    const t = state.clock.elapsedTime;

    const floatAmp = cube.isCenter ? 0.08 : 0.05;
    const floatSpeed = cube.isCenter ? 0.42 : 0.7;
    const idleZ = Math.sin(t * floatSpeed + phase) * floatAmp;
    const liftZ = isHovered ? 0.4 : 0;
    const targetZ = idleZ + liftZ;

    g.position.z += (targetZ - g.position.z) * 0.12;

    const targetScale = isHovered ? 1.08 : 1;
    const s = m.scale.x + (targetScale - m.scale.x) * 0.16;
    m.scale.set(s, s, s);

    const mat = m.material as THREE.MeshStandardMaterial;
    const targetOpacity = anyHovered ? (isHovered ? 1 : 0.45) : 1;
    mat.opacity += (targetOpacity - mat.opacity) * 0.1;
  });

  const baseColor = cube.isCenter ? "#c4c4c4" : "#a9a9a9";
  const cubeBaseScale = cube.isCenter ? 1.08 : 1;

  return (
    <group ref={groupRef} position={[baseX, baseY, 0]}>
      <mesh
        ref={meshRef}
        scale={cubeBaseScale}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredId(cube.id);
          if (typeof document !== "undefined") document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHoveredId(null);
          if (typeof document !== "undefined") document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
        <meshStandardMaterial
          color={baseColor}
          metalness={0.55}
          roughness={0.5}
          transparent
          opacity={1}
          envMapIntensity={0.6}
        />
        <Edges threshold={15} color="#1a1a1a" />
      </mesh>
    </group>
  );
}

/* ─── Grid ───────────────────────────────────────────────────────────────── */

function GridGroup({
  hoveredId,
  setHoveredId,
}: {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const startRot = useMemo(() => new THREE.Euler(1.05, 0.95, 0.5), []);
  const settleRot = useMemo(() => new THREE.Euler(-0.42, 0.5, 0), []);
  const introT = useRef(0);
  const pointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    introT.current = Math.min(introT.current + delta / 2.8, 1);
    const eased = 1 - Math.pow(1 - introT.current, 3.2);

    const targetX = -state.pointer.y * 0.22;
    const targetY = state.pointer.x * 0.32;
    pointer.current.x += (targetX - pointer.current.x) * 0.03;
    pointer.current.y += (targetY - pointer.current.y) * 0.03;

    g.rotation.x =
      THREE.MathUtils.lerp(startRot.x, settleRot.x, eased) + pointer.current.x * eased;
    g.rotation.y =
      THREE.MathUtils.lerp(startRot.y, settleRot.y, eased) + pointer.current.y * eased;
    g.rotation.z = THREE.MathUtils.lerp(startRot.z, settleRot.z, eased);
  });

  return (
    <group ref={groupRef}>
      {CUBES.map((cube, i) => (
        <CubeMesh
          key={cube.id}
          cube={cube}
          index={i}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      ))}
    </group>
  );
}

function SceneLighting() {
  const keyRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (!keyRef.current) return;
    const tx = 5 + state.pointer.x * 1.4;
    const ty = 6 + state.pointer.y * 0.8;
    keyRef.current.position.x += (tx - keyRef.current.position.x) * 0.04;
    keyRef.current.position.y += (ty - keyRef.current.position.y) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.14} />
      <directionalLight ref={keyRef} position={[5, 6, 5]} intensity={1.65} color="#fefefe" />
      <directionalLight position={[-5, 1, -4]} intensity={0.85} color="#a3acbb" />
      <hemisphereLight args={["#ffffff", "#080808", 0.22]} />
    </>
  );
}

export default function IdentityGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredCube = CUBES.find((c) => c.id === hoveredId);

  return (
    <div className="relative w-full max-w-[500px] aspect-square md:max-w-[580px]">
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0, 0, 6.6], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <fog attach="fog" args={["#000000", 7, 14]} />
        <SceneLighting />
        <GridGroup hoveredId={hoveredId} setHoveredId={setHoveredId} />
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.6) 84%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 -bottom-14 flex flex-col items-center md:-bottom-16">
        <AnimatePresence mode="wait">
          {hoveredCube && (
            <motion.div
              key={hoveredCube.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-bone">
                {hoveredCube.label}
              </span>
              <span className="font-serif italic text-bone/55 text-sm md:text-base max-w-[28ch]">
                {hoveredCube.copy}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
