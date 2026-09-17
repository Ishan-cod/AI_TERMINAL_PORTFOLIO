"use client";

import * as THREE from "three";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useControls, folder, Leva } from "leva";
import {
  SiCodechef,
  SiCodeforces,
  SiGithub,
  SiLeetcode,
} from "@icons-pack/react-simple-icons";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { Download } from "lucide-react";
import { ImageDown } from "lucide-react";
import Image from "next/image";
import { Infinity } from "lucide-react";

extend({ MeshLineGeometry, MeshLineMaterial });
const CARD_CONFIG = {
  scale: 2.3,
  aspectRatio: { width: 0.8, height: 1.2 },

  profile: {
    fullName: "Ishan Jaiswal",
    handle: "@ishan_cder",
    role: "Full stack | AI + ML | DSA",
    joinDate: "AUG 2024",
    idNumber: "24U022007",
    status: "student",
    monogramLetter: "I",
    email: "ishanj2024@gmail.com",
    github: "github.com/Ishan-cod",
    linkedin: "www.linkedin.com/in/ishan-jaiswal-178b71313",
    website: "localhost:3000",
    avatarUrl: "/rem_child.jpg",
  },

  theme: {
    isDark: true,
    colors: {
      bg: "#0c0e12",
      dim: "#181b20",
      primary: "#ff79c6",
      accent: "#50fa7b",
      secondary: "#8be9fd",
      text: "#f8f8f2",
      textDim: "#6272a4",
    },
  },
};

// ============================================================================
// GEOMETRY & TEXTURE HELPERS
// ============================================================================
function createProceduralCardGeometry(w, h) {
  const shape = new THREE.Shape();
  const radius = 0.05;

  shape.moveTo(-w / 2 + radius, -h / 2);
  shape.lineTo(w / 2 - radius, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
  shape.lineTo(w / 2, h / 2 - radius);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
  shape.lineTo(-w / 2 + radius, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2 + radius, h / 2 - radius);
  shape.lineTo(-w / 2, -h / 2 + radius);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);

  const holeWidth = 0.18;
  const holeHeight = 0.04;
  const holeY = h / 2 - 0.08;
  const hole = new THREE.Path();
  hole.moveTo(-holeWidth / 2, holeY - holeHeight / 2);
  hole.lineTo(holeWidth / 2, holeY - holeHeight / 2);
  hole.lineTo(holeWidth / 2, holeY + holeHeight / 2);
  hole.lineTo(-holeWidth / 2, holeY + holeHeight / 2);
  hole.closePath();
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.015,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.005,
    bevelThickness: 0.005,
  });
  geom.center();

  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    let u = (x + w / 2) / w;
    let v = 1 - (y + h / 2) / h;

    if (z > 0) {
      u = u * 0.5;
    } else {
      u = 0.5 + (1 - u) * 0.5;
    }
    uv.setXY(i, u, v);
  }

  uv.needsUpdate = true;
  return geom;
}

function createDefaultAvatarCanvas(letter, bgGradient) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, bgGradient[0]);
  grad.addColorStop(1, bgGradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "#ffffff";
  ctx.font = 'bold 200px "Fira Code", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`>${letter}`, 256, 256);

  return canvas;
}

function loadCustomImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(
        `Failed to load avatar from URL: ${url}. Falling back to default monogram.`,
      );
      resolve(null);
    };
    img.src = url;
  });
}

function useDynamicCardTexture(config) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const W = 4096;
    const H = 4096;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { profile, theme } = config;
    const { colors } = theme;

    const drawCard = (avatarImg) => {
      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.scale(2.0, 2.5);
      ctx.imageSmoothingEnabled = true;

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, 2048, 2048);

      const roundRect = (x, y, w, h, r, fill, stroke, strokeWidth = 1) => {
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, w, h, r);
        } else {
          ctx.rect(x, y, w, h);
        }
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.stroke();
        }
      };

      // FRONT FACE
      const ox = 0;
      const cardW = 1024;
      const cardH = 1610;

      ctx.fillStyle = colors.bg;
      ctx.fillRect(ox, 0, cardW, cardH);

      // Card Outer Accent Border (Front Face)
      roundRect(ox + 16, 16, cardW - 32, cardH, 32, null, colors.primary, 6);

      // Clip Hole border
      roundRect(ox + 442, -30, 140, 70, 24, colors.dim, colors.primary, 4);

      // Terminal Monogram Badge
      roundRect(ox + 90, 80, 108, 108, 16, colors.dim, colors.accent, 3);
      ctx.fillStyle = colors.accent;
      ctx.font = '700 64px "Fira Code", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(">", ox + 144, 134);

      ctx.fillStyle = colors.secondary;
      ctx.font = '700 38px "Fira Code", monospace';
      ctx.textAlign = "right";
      ctx.fillText(`~/${profile.handle}`, ox + 934, 134);

      // Avatar Frame
      const pw = 520;
      const ph = 520;
      const px = ox + (cardW - pw) / 2;
      const py = 210;

      roundRect(px, py, pw, ph, 28, colors.dim, colors.primary, 4);
      if (avatarImg) {
        ctx.save();
        roundRect(px, py, pw, ph, 28, null, null);
        ctx.clip();

        const imgRatio = avatarImg.width / avatarImg.height;
        const boxRatio = pw / ph;
        let renderW, renderH, offsetX, offsetY;

        if (imgRatio > boxRatio) {
          renderH = ph;
          renderW = ph * imgRatio;
          offsetX = px - (renderW - pw) / 2;
          offsetY = py;
        } else {
          renderW = pw;
          renderH = pw / imgRatio;
          offsetX = px;
          offsetY = py - (renderH - ph) / 2;
        }

        ctx.drawImage(avatarImg, offsetX, offsetY, renderW, renderH);
        ctx.restore();
      }

      // Name & Role
      ctx.textAlign = "center";

      // Prompt + Name
      ctx.fillStyle = "#ff4d9d";
      ctx.font = '700 30px "Fira Code", monospace';
      const prompt = ">";

      ctx.fillStyle = "#f8fafc";
      ctx.font = '700 62px "Fira Code", monospace';

      const nameText = profile.fullName.toUpperCase();
      const nameWidth = ctx.measureText(nameText).width;

      // Draw prompt slightly before name
      ctx.fillStyle = "#ff4d9d";
      ctx.font = '700 30px "Fira Code", monospace';

      const promptWidth = ctx.measureText(prompt).width;
      const gap = 14;

      const totalWidth = promptWidth + gap + nameWidth;
      const startX = ox + 512 - totalWidth / 2;

      ctx.fillText(prompt, startX + promptWidth / 2, 770);

      ctx.fillStyle = "#f8fafc";
      ctx.font = '700 62px "Fira Code", monospace';
      ctx.fillText(nameText, startX + promptWidth + gap + nameWidth / 2, 770);

      // Role
      ctx.fillStyle = "#cbd5e1";
      ctx.font = '500 25px "Fira Code", monospace';

      const roleText = profile.role.toUpperCase();
      ctx.fillText(roleText, ox + 512, 820);

      // Decorative line
      const lineWidth = 235;

      ctx.strokeStyle = "#ff4d9d";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(ox + 512 - lineWidth / 2, 845);
      ctx.lineTo(ox + 512 + lineWidth / 2, 845);
      ctx.stroke();

      // Tiny terminal metadata
      ctx.fillStyle = "#64748b";
      ctx.font = '400 17px "Fira Code", monospace';

      ctx.fillText("[ SYSTEM // ONLINE ]", ox + 512, 875);

      // Divider Line 1
      ctx.strokeStyle = colors.textDim;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox + 90, 940);
      ctx.lineTo(ox + 934, 940);
      ctx.stroke();

      // Meta Block: JOIN_DATE & USER_ID
      ctx.textAlign = "left";
      ctx.fillStyle = colors.textDim;
      ctx.font = '700 22px "Fira Code", monospace';
      ctx.fillText("// JOIN_DATE", ox + 90, 980);

      ctx.fillStyle = colors.text;
      ctx.font = '700 34px "Fira Code", monospace';
      ctx.fillText(profile.joinDate, ox + 90, 1025);

      ctx.textAlign = "right";
      ctx.fillStyle = colors.textDim;
      ctx.font = '700 22px "Fira Code", monospace';
      ctx.fillText("// status", ox + 934, 980);

      ctx.fillStyle = "yellow";
      ctx.font = '700 34px "Fira Code", monospace';
      ctx.fillText(profile.status, ox + 934, 1025);

      // Divider Line 2
      ctx.strokeStyle = colors.textDim;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 90, 1060);
      ctx.lineTo(ox + 934, 1060);
      ctx.stroke();

      // Back details integrated into front bottom
      ctx.textAlign = "left";
      ctx.fillStyle = colors.primary;
      ctx.font = '700 28px "Fira Code", monospace';
      ctx.fillText(`my info`, ox + 90, 1105);

      const items = [
        { label: "email", val: profile.email },
        { label: "github", val: profile.github },
        { label: "linkedin", val: profile.linkedin },
        { label: "website", val: profile.website },
      ];

      items.forEach((item, idx) => {
        const y = 1155 + idx * 85;
        ctx.fillStyle = colors.secondary;
        ctx.font = '700 20px "Fira Code", monospace';
        ctx.fillText(`[${item.label}]`, ox + 90, y);

        ctx.fillStyle = colors.text;
        ctx.font = '700 24px "Fira Code", monospace';
        ctx.fillText(item.val, ox + 90, y + 30);
      });

      // BACK FACE
      const bx = 1024;
      ctx.fillStyle = colors.bg;
      ctx.fillRect(bx, 0, 1024, cardH);
      roundRect(
        bx + 16,
        16,
        cardW - 32,
        cardH - 32,
        32,
        null,
        colors.primary,
        6,
      );

      ctx.fillStyle = colors.dim;
      ctx.fillRect(bx + 16, 100, 992, 180);

      ctx.restore();
    };

    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.anisotropy = 16;
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);

    loadCustomImage(profile.avatarUrl).then((customImg) => {
      const finalAvatar =
        customImg ||
        createDefaultAvatarCanvas(profile.monogramLetter, [
          colors.dim,
          colors.bg,
        ]);
      drawCard(finalAvatar);
      tex.needsUpdate = true;
    });

    return () => tex.dispose();
  }, [config]);

  return texture;
}

function useBandTexture(config) {
  return useMemo(() => {
    const W = 2048;
    const H = 120;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = config.theme.colors.dim;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = config.theme.colors.accent;
      ctx.fillRect(0, 0, W, 6);
      ctx.fillRect(0, H - 6, W, 6);

      ctx.font = '700 44px "Fira Code", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = `>_ ${config.profile.fullName.toUpperCase()} `;
      const step = W / 3;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = config.theme.colors.primary;
        ctx.fillText(text, step * i + step / 2, H / 2);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    return tex;
  }, [config]);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function IdCard() {
  const { cardScale, debugColliders, gravityY, minSpeed, maxSpeed } =
    useControls({
      "Card Settings": folder({
        cardScale: { value: CARD_CONFIG.scale, min: 1.5, max: 2.5, step: 0.05 },
      }),
      "Physics Settings": folder({
        debugColliders: { value: false },
        gravityY: { value: -40, min: -100, max: 0, step: 1 },
        minSpeed: { value: 10, min: 1, max: 50 },
        maxSpeed: { value: 50, min: 10, max: 150 },
      }),
    });

  return (
    <div>
      <Leva hidden />
      {/* Main Container Wrapper */}
      <div className="w-full h-screen relative bg-[#050a08]">
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 sm:p-6 select-none">
          {/* Top Header Row */}
          <div className="flex items-center justify-between w-full">
            <div className="bg-slate-900/80 border border-pink-500/30 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono backdrop-blur-lg shadow-lg">
              <div className="text-lg font-sans text-green-200 font-bold tracking-widest">
                ISHAN JAISWAL
              </div>
              <div className="text-sm opacity-50">fullstack + AIML</div>
              <div className="text-xs opacity-35">(undergrad)</div>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="flex items-center justify-between w-full my-auto pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-2 p-1.5 border border-pink-500/20 bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg">
              <a
                href="https://errorbattle.vercel.app"
                className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-pink-400"
                title="Errorbattle : codeforces 1v1"
              >
                <Image src={"/errorbattle.png"} width={20} height={20} />
              </a>

              <a
                href="https://jalsaarthi.vercel.app"
                className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-pink-400"
                title="Neermitra : Agentic AI model"
              >
                {/* Replace with your choice of icons (e.g. Lucide or React Icons) */}
                <Image src={"/neermitra.png"} width={20} height={20} />
              </a>

              <a
                href="https://ai-vue-sand.vercel.app"
                className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-pink-400"
                title="AIVUE : Ai interviewee"
              >
                {/* Replace with your choice of icons (e.g. Lucide or React Icons) */}
                <Infinity size={20} />
              </a>

              <a
                href="https://drive.google.com/file/d/1CcqEoCLyTLE7kATDVkSbw7HG9xstepJW/view?usp=sharing"
                className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-pink-400"
                title="Show Resume"
                target="_blank"
              >
                <Download size={20} />
              </a>
            </div>
          </div>

          {/* Bottom Helper Hint */}
          <div className="self-center text-center pointer-events-auto">
            <div className="border border-yellow-500/20 backdrop-blur-md rounded-xl flex p-1">
              <Link
                href="https://www.linkedin.com/in/ishan-jaiswal-178b71313"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <FaLinkedin size={24} color="#ffffff" />
              </Link>

              <Link
                href="https://github.com/Ishan-cod"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <SiGithub size={24} color="#ffffff" />
              </Link>

              <Link
                href="https://leetcode.com/u/Ishan_cder"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <SiLeetcode size={24} color="#ffffff" />
              </Link>

              <Link
                href="https://www.codechef.com/users/ishan_cder"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <SiCodechef size={24} color="#ffffff" />
              </Link>

              <Link
                href="https://codeforces.com/profile/only_error"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <SiCodeforces size={24} color="#ffffff" />
              </Link>

              <a
                href="https://codolio.com/profile/Ishan_cder"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <img
                  src="https://codolio.com/codolio_assets/codolio.svg"
                  alt="Codolio"
                  width={24}
                  height={24}
                />
              </a>
            </div>
          </div>
        </div>

        {/* 
        ================================================================
        2. 3D CANVAS LAYER
        ================================================================
      */}
        <Canvas
          gl={{ antialias: true, powerPreference: "high-performance" }}
          dpr={[1.5, 2]}
          camera={{ position: [0, 0, 10], fov: 25 }}
        >
          <ambientLight intensity={Math.PI} />
          <Physics debug={debugColliders} gravity={[0, gravityY, 0]}>
            <Band
              config={CARD_CONFIG}
              scale={cardScale}
              minSpeed={minSpeed}
              maxSpeed={maxSpeed}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="#ff79c6"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="#8be9fd"
              position={[-1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
          </Environment>
        </Canvas>
      </div>
    </div>
  );
}

function Band({ config, scale, minSpeed, maxSpeed }) {
  const band = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const card = useRef(null);

  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const baseW = config.aspectRatio.width * scale;
  const baseH = config.aspectRatio.height * scale;

  const cardGeometry = useMemo(
    () => createProceduralCardGeometry(baseW, baseH),
    [baseW, baseH],
  );
  const cardTexture = useDynamicCardTexture(config);
  const customBandTexture = useBandTexture(config);

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );

  const [dragged, drag] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.45]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.45]);
  useSphericalJoint(j2, card, [
    [0, 0, 0],
    [0, baseH * 0.48, 0],
  ]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && card.current) {
      [j1].forEach((ref) => {
        const trans = ref.current.translation();
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(trans);

        const dist = ref.current.lerped.distanceTo(trans);
        const clampedDist = Math.max(0.1, Math.min(1, dist));
        ref.current.lerped.lerp(
          trans,
          delta * (minSpeed + clampedDist * (maxSpeed - minSpeed)),
        );
      });

      const cardPos = card.current.translation();
      const q = new THREE.Quaternion().copy(card.current.rotation());
      const clampWorldPos = new THREE.Vector3(0, baseH * 0.48, 0)
        .applyQuaternion(q)
        .add(cardPos);

      curve.points[0].copy(clampWorldPos);
      curve.points[1].copy(j1.current.lerped || j1.current.translation());
      curve.points[2].copy(fixed.current.translation());

      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(24));
      }
    }
  });

  return (
    <>
      <group position={[0, 2.7, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody
          position={[0, -0.4, 0]}
          ref={j1}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody
          position={[0, -0.8, 0]}
          ref={j2}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.08]} />
        </RigidBody>

        <RigidBody
          position={[0, -1.3, 0]}
          ref={card}
          angularDamping={2}
          linearDamping={2}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[baseW / 2, baseH / 2, 0.01]} />

          <group
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation())),
              );
            }}
          >
            <mesh geometry={cardGeometry}>
              {cardTexture && (
                <meshPhysicalMaterial
                  map={cardTexture}
                  clearcoat={0.8}
                  roughness={0.2}
                />
              )}
            </mesh>

            <mesh position={[0, baseH * 0.46, 0]}>
              <boxGeometry args={[baseW * 0.25, 0.05 * scale, 0.03]} />
              <meshStandardMaterial
                color="#50fa7b"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest
          depthWrite={false}
          transparent
          resolution={[width, height]}
          useMap
          map={customBandTexture}
          repeat={[-1.2, 1]}
          lineWidth={0.7}
        />
      </mesh>
    </>
  );
}
