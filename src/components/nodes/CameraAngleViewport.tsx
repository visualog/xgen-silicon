"use client";

import React from "react";

const VIEWPORT_HEIGHT = 206;
const DRAG_YAW_SENSITIVITY = 2.2;
const DRAG_PITCH_SENSITIVITY = 1.05;

type CameraDistance = "close" | "medium" | "wide" | "establishing";

type CameraViewportModel = {
  yaw: number;
  pitch: number;
  roll: number;
  lens: number;
  distance: CameraDistance;
};

type CameraAngleViewportProps = {
  model: CameraViewportModel;
  onChange: (patch: Pick<CameraViewportModel, "yaw" | "pitch">) => void;
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
  viewCamera: import("three").PerspectiveCamera;
  subjectGroup: import("three").Group;
  orbitCameraGroup: import("three").Group;
  targetLine: import("three").Line;
  coneLeft: import("three").Line;
  coneRight: import("three").Line;
  coneTop: import("three").Line;
  coneBottom: import("three").Line;
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

function getDistanceRadius(distance: CameraDistance) {
  if (distance === "close") return 1.92;
  if (distance === "wide") return 2.82;
  if (distance === "establishing") return 3.22;
  return 2.34;
}

function getLensConeHalfWidth(lens: number) {
  const normalized = (clamp(lens, 18, 135) - 18) / 117;
  return 0.84 - normalized * 0.58;
}

function setLinePoints(line: import("three").Line, points: import("three").Vector3[]) {
  line.geometry.setFromPoints(points);
  line.geometry.computeBoundingSphere();
}

function applyCameraModel(instance: ThreeInstance, model: CameraViewportModel) {
  const { THREE, subjectGroup, orbitCameraGroup, targetLine, coneLeft, coneRight, coneTop, coneBottom } = instance;
  const yawRad = THREE.MathUtils.degToRad(model.yaw);
  const pitchRad = THREE.MathUtils.degToRad(model.pitch);
  const radius = getDistanceRadius(model.distance);
  const cameraPosition = new THREE.Vector3(
    Math.sin(yawRad) * Math.cos(pitchRad) * radius,
    Math.sin(pitchRad) * radius,
    Math.cos(yawRad) * Math.cos(pitchRad) * radius,
  );

  orbitCameraGroup.position.copy(cameraPosition);
  orbitCameraGroup.lookAt(0, 0, 0);
  orbitCameraGroup.rotateZ(THREE.MathUtils.degToRad(model.roll));
  orbitCameraGroup.scale.setScalar(model.distance === "close" ? 1.12 : model.distance === "establishing" ? 0.9 : 1);

  // Camera angle changes must move only the camera marker; the subject remains fixed.
  subjectGroup.rotation.set(0, 0, 0);

  const target = new THREE.Vector3(0, 0, 0);
  setLinePoints(targetLine, [cameraPosition, target]);

  const direction = target.clone().sub(cameraPosition).normalize();
  const right = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();
  if (right.lengthSq() < 0.01) right.set(1, 0, 0);
  const up = new THREE.Vector3().crossVectors(right, direction).normalize();
  const coneDepth = Math.min(radius * 0.72, 1.78);
  const coneWidth = getLensConeHalfWidth(model.lens);
  const coneCenter = cameraPosition.clone().add(direction.multiplyScalar(coneDepth));
  setLinePoints(coneLeft, [cameraPosition, coneCenter.clone().add(right.clone().multiplyScalar(-coneWidth))]);
  setLinePoints(coneRight, [cameraPosition, coneCenter.clone().add(right.clone().multiplyScalar(coneWidth))]);
  setLinePoints(coneTop, [cameraPosition, coneCenter.clone().add(up.clone().multiplyScalar(coneWidth * 0.72))]);
  setLinePoints(coneBottom, [cameraPosition, coneCenter.clone().add(up.clone().multiplyScalar(-coneWidth * 0.72))]);
}

function disposeInstance(instance: ThreeInstance) {
  instance.resizeObserver.disconnect();
  instance.disposables.forEach((item) => item.dispose());
  instance.renderer.dispose();
}

export function CameraAngleViewport({ model, onChange }: CameraAngleViewportProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const instanceRef = React.useRef<ThreeInstance | null>(null);
  const dragRef = React.useRef<DragState | null>(null);
  const latestModelRef = React.useRef(model);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    latestModelRef.current = model;
  }, [model]);

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
      const accent = resolveCssColor(currentHost, "--port-camera-angle", foreground);

      const scene = new THREE.Scene();
      const viewCamera = new THREE.PerspectiveCamera(38, 1.5, 0.1, 100);
      viewCamera.position.set(0, 1.2, 6.3);
      viewCamera.lookAt(0, 0, 0);

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

      const ambient = new THREE.AmbientLight(0xffffff, 1.18);
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.15);
      keyLight.position.set(3.5, 4.5, 5.5);
      const accentLight = new THREE.PointLight(accent, 1.6, 6);
      accentLight.position.set(-2.5, 1.4, 2.2);
      scene.add(ambient, keyLight, accentLight);

      const subjectGroup = new THREE.Group();
      scene.add(subjectGroup);

      const subjectMaterial = new THREE.MeshStandardMaterial({
        color: surface,
        roughness: 0.44,
        metalness: 0.05,
        emissive: canvas,
        emissiveIntensity: 0.08,
      });
      const subjectBody = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.02, 1.02), subjectMaterial);
      subjectGroup.add(subjectBody);

      const edgeMaterial = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.52 });
      const subjectEdges = new THREE.LineSegments(new THREE.EdgesGeometry(subjectBody.geometry), edgeMaterial);
      subjectGroup.add(subjectEdges);

      const frontMaterial = new THREE.MeshStandardMaterial({
        color: accent,
        roughness: 0.35,
        metalness: 0.06,
        emissive: accent,
        emissiveIntensity: 0.18,
      });
      const frontDot = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), frontMaterial);
      frontDot.position.set(0, 0, 0.522);
      subjectGroup.add(frontDot);

      const orbitMaterial = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.24 });
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);
      [0, Math.PI / 2].forEach((rotation) => {
        const ring = new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(
            Array.from({ length: 120 }, (_, index) => {
              const angle = (index / 120) * Math.PI * 2;
              return new THREE.Vector3(Math.cos(angle) * 3.02, Math.sin(angle) * 3.02, 0);
            }),
          ),
          orbitMaterial,
        );
        ring.rotation.y = rotation;
        orbitGroup.add(ring);
      });
      const horizon = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: 120 }, (_, index) => {
            const angle = (index / 120) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle) * 3.02, 0, Math.sin(angle) * 3.02);
          }),
        ),
        orbitMaterial,
      );
      orbitGroup.add(horizon);

      const lineMaterial = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.58 });
      const coneMaterial = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.34 });
      const targetLine = new THREE.Line(new THREE.BufferGeometry(), lineMaterial);
      const coneLeft = new THREE.Line(new THREE.BufferGeometry(), coneMaterial);
      const coneRight = new THREE.Line(new THREE.BufferGeometry(), coneMaterial);
      const coneTop = new THREE.Line(new THREE.BufferGeometry(), coneMaterial);
      const coneBottom = new THREE.Line(new THREE.BufferGeometry(), coneMaterial);
      scene.add(targetLine, coneLeft, coneRight, coneTop, coneBottom);

      const orbitCameraGroup = new THREE.Group();
      scene.add(orbitCameraGroup);

      const cameraMaterial = new THREE.MeshStandardMaterial({
        color: accent,
        roughness: 0.32,
        metalness: 0.12,
        emissive: accent,
        emissiveIntensity: 0.18,
      });
      cameraMaterial.depthTest = false;
      cameraMaterial.depthWrite = false;
      const cameraHaloMaterial = new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.32,
        depthTest: false,
        depthWrite: false,
      });
      const cameraHalo = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 12, 48), cameraHaloMaterial);
      cameraHalo.renderOrder = 18;
      orbitCameraGroup.add(cameraHalo);
      const cameraBody = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.36, 0.3), cameraMaterial);
      cameraBody.renderOrder = 20;
      orbitCameraGroup.add(cameraBody);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.28, 24), cameraMaterial);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0, 0.28);
      lens.renderOrder = 20;
      orbitCameraGroup.add(lens);
      const cameraTop = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.11, 0.16), cameraMaterial);
      cameraTop.position.set(0, 0.23, 0);
      cameraTop.renderOrder = 20;
      orbitCameraGroup.add(cameraTop);

      const centerPixel = new Uint8Array(4);
      const render = () => {
        renderer.render(scene, viewCamera);
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
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        renderer.setSize(width, height, false);
        viewCamera.aspect = width / height;
        viewCamera.updateProjectionMatrix();
        render();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(currentHost);

      const disposables = [
        subjectBody.geometry,
        subjectMaterial,
        subjectEdges.geometry,
        edgeMaterial,
        frontDot.geometry,
        frontMaterial,
        orbitMaterial,
        ...orbitGroup.children.map((child) => (child as import("three").Line).geometry),
        targetLine.geometry,
        coneLeft.geometry,
        coneRight.geometry,
        coneTop.geometry,
        coneBottom.geometry,
        lineMaterial,
        coneMaterial,
        cameraHalo.geometry,
        cameraHaloMaterial,
        cameraBody.geometry,
        cameraMaterial,
        lens.geometry,
        cameraTop.geometry,
      ];

      const instance: ThreeInstance = {
        THREE,
        renderer,
        scene,
        viewCamera,
        subjectGroup,
        orbitCameraGroup,
        targetLine,
        coneLeft,
        coneRight,
        coneTop,
        coneBottom,
        resizeObserver,
        disposables,
        render,
      };

      instanceRef.current = instance;
      applyCameraModel(instance, latestModelRef.current);
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
    applyCameraModel(instance, model);
    instance.render();
  }, [model]);

  const updateAngleFromDrag = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      const nextYaw = normalizeYaw(Math.round(drag.startYaw + deltaX * DRAG_YAW_SENSITIVITY));
      const nextPitch = clamp(Math.round(drag.startPitch - deltaY * DRAG_PITCH_SENSITIVITY), -75, 60);
      onChange({ yaw: nextYaw, pitch: nextPitch });
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
        startYaw: model.yaw,
        startPitch: model.pitch,
      };
      setIsDragging(true);
    },
    [model.pitch, model.yaw],
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
        onChange({ yaw: normalizeYaw(model.yaw - step), pitch: model.pitch });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onChange({ yaw: normalizeYaw(model.yaw + step), pitch: model.pitch });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        onChange({ yaw: model.yaw, pitch: clamp(model.pitch + step, -75, 60) });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        onChange({ yaw: model.yaw, pitch: clamp(model.pitch - step, -75, 60) });
      } else if (event.key === "Home") {
        event.preventDefault();
        onChange({ yaw: 0, pitch: 0 });
      }
    },
    [model.pitch, model.yaw, onChange],
  );

  return (
    <div
      ref={hostRef}
      className="nodrag nowheel"
      data-testid="camera-angle-webgl"
      role="slider"
      aria-label="카메라 3D 앵글 조정"
      aria-valuemin={-180}
      aria-valuemax={180}
      aria-valuenow={model.yaw}
      aria-valuetext={`yaw ${model.yaw} degrees, pitch ${model.pitch} degrees`}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={updateAngleFromDrag}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={() => onChange({ yaw: 0, pitch: 0 })}
      onKeyDown={handleKeyDown}
      style={{
        position: "relative",
        height: VIEWPORT_HEIGHT,
        borderRadius: "var(--ui-radius-xl)",
        border: "1px solid var(--border-node)",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 52% 48%, color-mix(in srgb, var(--port-camera-angle) 14%, transparent), transparent 42%), linear-gradient(180deg, color-mix(in srgb, var(--text-primary) 7%, transparent), transparent 60%), var(--bg-canvas)",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        outline: "none",
      }}
    >
      {!isReady ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "var(--ui-space-24)",
            borderRadius: "var(--ui-radius-xl)",
            border: "1px solid color-mix(in srgb, var(--border-node) 70%, transparent)",
            background: "color-mix(in srgb, var(--bg-node-base) 48%, transparent)",
          }}
        />
      ) : null}
      <span style={{ position: "absolute", left: 14, top: 12, color: "var(--text-muted)", fontSize: 10, fontWeight: 850, pointerEvents: "none" }}>상단</span>
      <span style={{ position: "absolute", left: 14, bottom: 12, color: "var(--text-muted)", fontSize: 10, fontWeight: 850, pointerEvents: "none" }}>하단</span>
      <span style={{ position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)", color: "var(--text-muted)", fontSize: 10, fontWeight: 850, pointerEvents: "none" }}>앞</span>
      <span style={{ position: "absolute", left: "50%", top: 10, transform: "translateX(-50%)", color: "var(--text-muted)", fontSize: 10, fontWeight: 850, pointerEvents: "none" }}>뒤</span>
      <span style={{ position: "absolute", left: "15%", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 10, fontWeight: 850, pointerEvents: "none" }}>좌</span>
      <span style={{ position: "absolute", right: "15%", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 10, fontWeight: 850, pointerEvents: "none" }}>우</span>
      <span style={{ position: "absolute", right: 12, top: 10, color: "var(--port-camera-angle)", fontSize: 10, fontWeight: 850, pointerEvents: "none" }}>
        {model.lens}mm
      </span>
    </div>
  );
}
