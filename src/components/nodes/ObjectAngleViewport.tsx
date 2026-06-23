"use client";

import React from "react";

const VIEWPORT_SIZE = 144;
const DRAG_YAW_SENSITIVITY = 2.4;
const DRAG_PITCH_SENSITIVITY = 1.1;

type ObjectAngleViewportProps = {
  yaw: number;
  pitch: number;
  onChange: (yaw: number, pitch: number) => void;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startYaw: number;
  startPitch: number;
};

type ThreeInstance = {
  THREE: typeof import("three");
  renderer: import("three").WebGLRenderer;
  scene: import("three").Scene;
  camera: import("three").PerspectiveCamera;
  objectGroup: import("three").Group;
  frontMarker: import("three").Mesh;
  resizeObserver: ResizeObserver;
  disposables: Array<{ dispose: () => void }>;
  render: () => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeYaw(value: number) {
  let nextValue = value;
  while (nextValue > 180) nextValue -= 360;
  while (nextValue < -180) nextValue += 360;
  return nextValue;
}

function parseColor(value: string, fallback: number) {
  const normalized = value.trim();
  const rgbMatch = normalized.match(/rgba?\(([^)]+)\)/i);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch[1].split(/[\s,\/]+/).map(Number);
    if ([r, g, b].every(Number.isFinite)) return (r << 16) + (g << 8) + b;
  }

  const srgbMatch = normalized.match(/color\(srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/i);
  if (srgbMatch) {
    const [, r, g, b] = srgbMatch.map(Number);
    if ([r, g, b].every(Number.isFinite)) {
      return (Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255);
    }
  }

  return fallback;
}

function resolveCssColor(host: HTMLElement, token: string, fallback: number) {
  const computed = getComputedStyle(host).getPropertyValue(token);
  return parseColor(computed, fallback);
}

function applyObjectRotation(instance: ThreeInstance, yaw: number, pitch: number) {
  const { THREE, objectGroup, frontMarker } = instance;
  // Positive prompt pitch means top-down tilt; Three.js X rotation is inverted for this object-facing control.
  objectGroup.rotation.set(THREE.MathUtils.degToRad(-pitch), THREE.MathUtils.degToRad(yaw), 0);

  const depth = Math.cos(THREE.MathUtils.degToRad(yaw)) * Math.cos(THREE.MathUtils.degToRad(pitch));
  const material = frontMarker.material;
  if ("opacity" in material) {
    material.opacity = depth >= 0 ? 1 : 0.38;
    material.transparent = depth < 0;
  }
}

function disposeInstance(instance: ThreeInstance) {
  instance.resizeObserver.disconnect();
  instance.disposables.forEach((item) => item.dispose());
  instance.renderer.dispose();
}

export function ObjectAngleViewport({ yaw, pitch, onChange }: ObjectAngleViewportProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const instanceRef = React.useRef<ThreeInstance | null>(null);
  const dragRef = React.useRef<DragState | null>(null);
  const latestAnglesRef = React.useRef({ yaw, pitch });
  const [isDragging, setIsDragging] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    latestAnglesRef.current = { yaw, pitch };
  }, [pitch, yaw]);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    async function setup() {
      const THREE = await import("three");
      if (cancelled || !hostRef.current) return;

      const currentHost = hostRef.current;
      const foreground = resolveCssColor(currentHost, "--text-primary", 0xfafafa);
      const muted = resolveCssColor(currentHost, "--text-secondary", 0xa1a1a1);
      const surface = resolveCssColor(currentHost, "--bg-node-base", 0x171717);
      const canvas = resolveCssColor(currentHost, "--bg-canvas", 0x0a0a0a);
      const accent = resolveCssColor(currentHost, "--port-object-angle", foreground);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0.2, 5.2);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      currentHost.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(3, 4, 5);
      const rimLight = new THREE.DirectionalLight(accent, 1.1);
      rimLight.position.set(-3, 2, -3);
      scene.add(ambient, keyLight, rimLight);

      const objectGroup = new THREE.Group();
      scene.add(objectGroup);

      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: surface,
        roughness: 0.48,
        metalness: 0.04,
        emissive: canvas,
        emissiveIntensity: 0.08,
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.35, 1.35), bodyMaterial);
      objectGroup.add(body);

      const edgeMaterial = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.52 });
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), edgeMaterial);
      objectGroup.add(edges);

      const frontMaterial = new THREE.MeshStandardMaterial({
        color: accent,
        roughness: 0.34,
        metalness: 0.1,
        emissive: accent,
        emissiveIntensity: 0.16,
      });
      const frontMarker = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), frontMaterial);
      frontMarker.position.set(0, 0, 0.686);
      objectGroup.add(frontMarker);

      const stripeMaterial = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.54 });
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.08), stripeMaterial);
      stripe.position.set(0, -0.36, 0.692);
      objectGroup.add(stripe);

      const ringMaterial = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.24 });
      const rings = new THREE.Group();
      scene.add(rings);
      [0, Math.PI / 2].forEach((rotation) => {
        const ring = new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(
            Array.from({ length: 96 }, (_, index) => {
              const angle = (index / 96) * Math.PI * 2;
              return new THREE.Vector3(Math.cos(angle) * 1.86, Math.sin(angle) * 1.86, 0);
            }),
          ),
          ringMaterial,
        );
        ring.rotation.y = rotation;
        rings.add(ring);
      });
      const horizon = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: 96 }, (_, index) => {
            const angle = (index / 96) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle) * 1.86, 0, Math.sin(angle) * 1.86);
          }),
        ),
        ringMaterial,
      );
      rings.add(horizon);

      const disposeTargets = [
        body.geometry,
        bodyMaterial,
        edges.geometry,
        edgeMaterial,
        frontMarker.geometry,
        frontMaterial,
        stripe.geometry,
        stripeMaterial,
        ringMaterial,
        ...rings.children.map((child) => (child as import("three").Line).geometry),
      ];

      const centerPixel = new Uint8Array(4);
      const render = () => {
        renderer.render(scene, camera);
        const gl = renderer.getContext();
        gl.readPixels(
          Math.max(0, Math.floor(renderer.domElement.width / 2)),
          Math.max(0, Math.floor(renderer.domElement.height / 2)),
          1,
          1,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          centerPixel,
        );
        currentHost.dataset.renderState = centerPixel[3] > 0 ? "painted" : "empty";
        currentHost.dataset.centerPixel = Array.from(centerPixel).join(",");
      };

      const resize = () => {
        const rect = currentHost.getBoundingClientRect();
        const size = Math.max(1, Math.floor(Math.min(rect.width, rect.height)));
        renderer.setSize(size, size, false);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        render();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(currentHost);

      const instance: ThreeInstance = {
        THREE,
        renderer,
        scene,
        camera,
        objectGroup,
        frontMarker,
        resizeObserver,
        disposables: disposeTargets,
        render,
      };

      instanceRef.current = instance;
      applyObjectRotation(instance, latestAnglesRef.current.yaw, latestAnglesRef.current.pitch);
      resize();
      setIsReady(true);
    }

    void setup();

    return () => {
      cancelled = true;
      const instance = instanceRef.current;
      if (instance) {
        disposeInstance(instance);
        instance.renderer.domElement.remove();
        instanceRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    applyObjectRotation(instance, yaw, pitch);
    instance.render();
  }, [yaw, pitch]);

  const updateAngleFromDrag = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      const nextYaw = normalizeYaw(Math.round(drag.startYaw + deltaX * DRAG_YAW_SENSITIVITY));
      const nextPitch = clamp(Math.round(drag.startPitch - deltaY * DRAG_PITCH_SENSITIVITY), -60, 60);
      onChange(nextYaw, nextPitch);
    },
    [onChange],
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startYaw: yaw,
        startPitch: pitch,
      };
      setIsDragging(true);
    },
    [pitch, yaw],
  );

  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }
  }, []);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 15 : 5;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChange(normalizeYaw(yaw - step), pitch);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onChange(normalizeYaw(yaw + step), pitch);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        onChange(yaw, clamp(pitch + step, -60, 60));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        onChange(yaw, clamp(pitch - step, -60, 60));
      } else if (event.key === "Home") {
        event.preventDefault();
        onChange(0, 0);
      }
    },
    [onChange, pitch, yaw],
  );

  return (
    <div
      ref={hostRef}
      className="nodrag nowheel"
      data-testid="object-angle-webgl"
      role="slider"
      aria-label="오브젝트 3D 앵글 조정"
      aria-valuemin={-180}
      aria-valuemax={180}
      aria-valuenow={yaw}
      aria-valuetext={`yaw ${yaw} degrees, pitch ${pitch} degrees`}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={updateAngleFromDrag}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={() => onChange(0, 0)}
      onKeyDown={handleKeyDown}
      style={{
        width: VIEWPORT_SIZE,
        height: VIEWPORT_SIZE,
        alignSelf: "center",
        borderRadius: "50%",
        position: "relative",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        background:
          "radial-gradient(circle at 34% 24%, color-mix(in srgb, var(--bg-node-base) 82%, var(--text-primary)), var(--bg-canvas) 52%, color-mix(in srgb, var(--bg-canvas) 92%, black) 100%)",
        border: "1px solid color-mix(in srgb, var(--border-node) 80%, transparent)",
        boxShadow: "inset -18px -22px 34px color-mix(in srgb, black 26%, transparent), inset 14px 14px 28px color-mix(in srgb, var(--text-primary) 7%, transparent)",
        overflow: "hidden",
        outline: "none",
      }}
    >
      {!isReady ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "calc(var(--ui-space-unit) * 7)",
            borderRadius: "50%",
            border: "1px solid color-mix(in srgb, var(--border-node) 70%, transparent)",
            background: "color-mix(in srgb, var(--bg-node-base) 60%, transparent)",
          }}
        />
      ) : null}
      <span style={{ position: "absolute", left: 12, top: "50%", fontSize: "calc(var(--ui-type-xs-size) * 0.9)", fontWeight: 800, color: "var(--text-muted)", transform: "translateY(-50%)", pointerEvents: "none" }}>L</span>
      <span style={{ position: "absolute", right: 12, top: "50%", fontSize: "calc(var(--ui-type-xs-size) * 0.9)", fontWeight: 800, color: "var(--text-muted)", transform: "translateY(-50%)", pointerEvents: "none" }}>R</span>
      <span style={{ position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)", fontSize: "calc(var(--ui-type-xs-size) * 0.82)", fontWeight: 850, color: "var(--text-muted)", pointerEvents: "none" }}>FRONT</span>
    </div>
  );
}
