"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uSize;

  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aOrigin;

  varying float vAlpha;

  void main() {
    vec3 pos = aOrigin;

    // very gentle drift
    pos.x += sin(uTime * 0.25 + aPhase) * 0.12;
    pos.y += cos(uTime * 0.2 + aPhase * 1.7) * 0.14;
    pos.z += sin(uTime * 0.3 + aPhase * 0.6) * 0.1;

    // soft mouse repulsion in XY plane
    vec2 toMouse = pos.xy - uMouse;
    float dist = length(toMouse);
    float influence = smoothstep(2.0, 0.0, dist) * uMouseStrength;
    pos.xy += normalize(toMouse + 0.0001) * influence * 0.5;

    // dimmer near the cursor (it does not "light up" — it stays restrained)
    vAlpha = 0.25 + 0.25 * smoothstep(0.0, 6.0, dist);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * (220.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;

  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // soft round point sprite, falls off fast at the edge
    float soft = smoothstep(0.5, 0.05, d);
    soft = pow(soft, 2.6);

    gl_FragColor = vec4(uColor, soft * vAlpha);
  }
`;

interface ParticlesProps {
  count?: number;
}

function Particles({ count = 1800 }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const { positions, sizes, phases, origins } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const origins = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute across a wide elliptical disc with depth
      const r = Math.pow(Math.random(), 0.6) * 7;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r * 1.5;
      const y = Math.sin(theta) * r * 0.9;
      const z = (Math.random() - 0.5) * 4;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      origins[i * 3] = x;
      origins[i * 3 + 1] = y;
      origins[i * 3 + 2] = z;

      sizes[i] = 0.3 + Math.random() * 1.6;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, sizes, phases, origins };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 0 },
      uSize: { value: 1.6 },
      // Dim, dusty off-white — sits in the deep background, never competes with text
      uColor: { value: new THREE.Color("#4a4a48") },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;

    // smooth mouse follow
    const mx = (state.pointer.x * viewport.width) / 2;
    const my = (state.pointer.y * viewport.height) / 2;
    mouseTarget.current.x += (mx - mouseTarget.current.x) * 0.08;
    mouseTarget.current.y += (my - mouseTarget.current.y) * 0.08;
    materialRef.current.uniforms.uMouse.value.copy(mouseTarget.current);

    // ramp in strength
    const target = 1.0;
    materialRef.current.uniforms.uMouseStrength.value +=
      (target - materialRef.current.uniforms.uMouseStrength.value) * 0.04;

    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.012;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aOrigin"
          count={count}
          array={origins}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={count}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <Particles />
    </Canvas>
  );
}
