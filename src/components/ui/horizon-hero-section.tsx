// horizon-hero-section.tsx
// Interactive 3D WebGL Horizon Hero Section with Three.js and GSAP
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ThreeSceneRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  atmosphere: THREE.Mesh | null;
  animationId: number | null;
}

export const Component: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  const cameraVelocity = useRef({ x: 0, y: 0, z: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [locationLabel, setLocationLabel] = useState('ORBIT 01 // 37.7749° N, 122.4194° W');
  const totalSections = 2;
  
  const threeRefs = useRef<ThreeSceneRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    atmosphere: null,
    animationId: null
  });

  const getLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lon = pos.coords.longitude.toFixed(4);
          setLocationLabel(`ORBIT GEO // ${lat}° N, ${lon}° W`);
        },
        () => {
          setLocationLabel('SECTOR 07 // DEEP COSMOS HORIZON');
        },
        { timeout: 5000 }
      );
    } else {
      setLocationLabel('SECTOR 07 // DEEP COSMOS HORIZON');
    }
  };

  const createStarField = () => {
    const { current: refs } = threeRefs;
    if (!refs.scene) return;
    const starCount = 4000;
    
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let j = 0; j < starCount; j++) {
        const radius = 200 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        // Color variation
        const color = new THREE.Color();
        const colorChoice = Math.random();
        if (colorChoice < 0.7) {
          color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
        } else if (colorChoice < 0.9) {
          color.setHSL(0.08, 0.5, 0.8);
        } else {
          color.setHSL(0.6, 0.5, 0.8);
        }
        
        colors[j * 3] = color.r;
        colors[j * 3 + 1] = color.g;
        colors[j * 3 + 2] = color.b;

        sizes[j] = Math.random() * 2.2 + 0.6;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          depth: { value: i }
        },
        vertexShader: `
          uniform float time;
          uniform float depth;
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec3 p = position;
            p.y += sin(time * 0.4 + p.x * 0.01) * 2.0;
            p.x += cos(time * 0.3 + p.z * 0.01) * 2.0;
            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = size * (260.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
            gl_FragColor = vec4(vColor, alpha * 0.85);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const points = new THREE.Points(geometry, material);
      refs.scene.add(points);
      refs.stars.push(points);
    }
  };

  const createNebula = () => {
    const { current: refs } = threeRefs;
    if (!refs.scene) return;

    const geo = new THREE.PlaneGeometry(1600, 900, 32, 32);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x05051a) },
        color2: { value: new THREE.Color(0x381232) },
        color3: { value: new THREE.Color(0x0c2540) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float n = sin(p.x * 2.5 + time * 0.15) * cos(p.y * 2.5 + time * 0.1);
          float glow = smoothstep(1.2, 0.0, length(p) + n * 0.25);
          vec3 mixed = mix(color1, color2, clamp(n + 0.5, 0.0, 1.0));
          mixed = mix(mixed, color3, clamp(glow * 0.5, 0.0, 1.0));
          gl_FragColor = vec4(mixed, glow * 0.35);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 40, -400);
    refs.scene.add(mesh);
    refs.nebula = mesh;
  };

  const createMountains = () => {
    const { current: refs } = threeRefs;
    if (!refs.scene) return;

    // Create 3 layers of low-poly terrain ridges
    const layers = [
      { width: 1400, depth: 800, z: -200, y: -40, color: 0x070b19, wireColor: 0x22366b, segments: 48 },
      { width: 1200, depth: 600, z: -100, y: -50, color: 0x050711, wireColor: 0x3b1d54, segments: 36 },
      { width: 1000, depth: 400, z: -20,  y: -60, color: 0x020308, wireColor: 0x5a1836, segments: 24 }
    ];

    layers.forEach((layer, idx) => {
      const geo = new THREE.PlaneGeometry(layer.width, layer.depth, layer.segments, layer.segments);
      geo.rotateX(-Math.PI / 2.2);

      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const distFromCenter = Math.abs(x) / (layer.width * 0.5);
        const wave = Math.sin(x * 0.015 + idx) * 35.0 + Math.cos(z * 0.02) * 20.0;
        const peak = Math.sin(x * 0.005) * 60.0;
        const elevation = (wave + peak) * (1.0 - Math.pow(distFromCenter, 2.5) * 0.4);
        pos.setY(i, elevation - (idx * 15));
      }
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: layer.color,
        roughness: 0.85,
        metalness: 0.2,
        wireframe: false,
        flatShading: true
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, layer.y, layer.z);
      refs.scene?.add(mesh);
      refs.mountains.push(mesh);

      // Wireframe overlay accent
      const wireMat = new THREE.MeshBasicMaterial({
        color: layer.wireColor,
        wireframe: true,
        transparent: true,
        opacity: 0.28
      });
      const wireMesh = new THREE.Mesh(geo, wireMat);
      wireMesh.position.set(0, layer.y + 0.2, layer.z);
      refs.scene?.add(wireMesh);
    });

    // Add ambient & directional light for mountain geometry
    const ambLight = new THREE.AmbientLight(0x22263d, 1.2);
    const dirLight = new THREE.DirectionalLight(0xff6075, 1.8);
    dirLight.position.set(200, 300, 100);
    refs.scene.add(ambLight);
    refs.scene.add(dirLight);
  };

  const createAtmosphere = () => {
    const { current: refs } = threeRefs;
    if (!refs.scene) return;

    const geo = new THREE.SphereGeometry(650, 32, 32);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.85, 0.25, 0.45, 1.0) * intensity * 0.45;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(geo, mat);
    refs.scene.add(atmosphere);
    refs.atmosphere = atmosphere;
  };

  const animate = () => {
    const { current: refs } = threeRefs;
    if (!refs.renderer || !refs.composer || !refs.camera) return;

    const clockTime = performance.now() * 0.001;

    // Update star uniforms
    refs.stars.forEach((starPoints) => {
      const mat = starPoints.material as THREE.ShaderMaterial;
      if (mat.uniforms?.time) {
        mat.uniforms.time.value = clockTime;
      }
      starPoints.rotation.y = clockTime * 0.015;
    });

    // Update nebula shader
    if (refs.nebula) {
      const mat = refs.nebula.material as THREE.ShaderMaterial;
      if (mat.uniforms?.time) {
        mat.uniforms.time.value = clockTime;
      }
    }

    // Smooth Camera Dampening & Mouse Parallax
    const targetX = mousePos.current.x * 25;
    const targetY = 25 - mousePos.current.y * 15;
    
    cameraVelocity.current.x += (targetX - smoothCameraPos.current.x) * 0.035;
    cameraVelocity.current.y += (targetY - smoothCameraPos.current.y) * 0.035;
    cameraVelocity.current.x *= 0.85;
    cameraVelocity.current.y *= 0.85;

    smoothCameraPos.current.x += cameraVelocity.current.x;
    smoothCameraPos.current.y += cameraVelocity.current.y;

    refs.camera.position.x = smoothCameraPos.current.x;
    refs.camera.position.y = smoothCameraPos.current.y;
    refs.camera.lookAt(0, 10, -300);

    // Post-processing render
    refs.composer.render();
    refs.animationId = requestAnimationFrame(animate);
  };

  // Initialize Three.js
  useEffect(() => {
    const { current: refs } = threeRefs;
    if (!canvasRef.current) return;

    // Scene setup
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x02040a, 0.0006);

    // Camera
    refs.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      2500
    );
    refs.camera.position.set(0, 30, 100);

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.85;

    // Post-processing pipeline
    refs.composer = new EffectComposer(refs.renderer);
    const renderPass = new RenderPass(refs.scene, refs.camera);
    refs.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.9,  // strength
      0.4,  // radius
      0.82  // threshold
    );
    refs.composer.addPass(bloomPass);

    // Create scene elements
    createStarField();
    createNebula();
    createMountains();
    createAtmosphere();
    getLocation();

    // Start animation loop
    animate();
    setIsReady(true);

    // Mouse Parallax Listener
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!refs.camera || !refs.renderer || !refs.composer) return;
      refs.camera.aspect = window.innerWidth / window.innerHeight;
      refs.camera.updateProjectionMatrix();
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // GSAP ScrollTrigger Integration
    let ctx: gsap.Context | null = null;
    if (containerRef.current) {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1.2,
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollProgress(progress);
            
            // Camera push-in based on scroll progress
            if (refs.camera) {
              refs.camera.position.z = 100 - progress * 90;
            }

            if (progress < 0.5) {
              setCurrentSection(1);
            } else {
              setCurrentSection(2);
            }
          }
        });
      }, containerRef);
    }

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (ctx) ctx.revert();
      if (refs.renderer) refs.renderer.dispose();
      refs.scene = null;
    };
  }, []);

  const sectionData: Record<number, { title: string; subtitle: string; tag: string }> = {
    1: {
      title: 'HORIZON',
      subtitle: 'EXPLORE THE UNKNOWN BOUNDARIES OF SPACE & CINEMATIC AUDIOVISUAL CRAFT',
      tag: 'PHASE 01 // EXPEDITION'
    },
    2: {
      title: 'COSMOS',
      subtitle: 'REAL-TIME VOLUMETRIC SCATTERING WITH PROCEDURAL MESH GENERATION',
      tag: 'PHASE 02 // TRANSCENDENCE'
    }
  };

  const activeContent = sectionData[currentSection] || sectionData[1];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-slate-950 text-white font-sans select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing z-0"
      />

      {/* Subtle Vignette & Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(2,4,10,0.75)_100%)] z-10" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none z-10" />

      {/* Top Header / Status Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-12 py-6 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-300 font-semibold">
            STRIKU HORIZON
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
          <span className="text-slate-400">{locationLabel}</span>
          <span className="text-slate-600">|</span>
          <span className="text-rose-400 font-semibold">FPS 60.0 // WEBGL 2.0</span>
        </div>
      </header>

      {/* Side HUD Menu / Quick Nav */}
      <aside
        ref={menuRef}
        className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-4 font-mono text-xs pointer-events-auto"
      >
        {[1, 2].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setCurrentSection(num)}
            className="group flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <span
              className={`h-0.5 transition-all duration-300 ${
                currentSection === num
                  ? 'w-8 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                  : 'w-4 bg-slate-600 group-hover:w-6 group-hover:bg-slate-400'
              }`}
            />
            <span
              className={`text-[10px] uppercase tracking-widest transition-colors ${
                currentSection === num ? 'text-white font-bold' : 'text-slate-500 group-hover:text-slate-300'
              }`}
            >
              0{num} {sectionData[num].title}
            </span>
          </button>
        ))}
      </aside>

      {/* Main Hero Content Overlay */}
      <main className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4">
          {/* Phase Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/20 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-rose-300 font-medium">
              {activeContent.tag}
            </span>
          </div>

          {/* Big Title */}
          <h1
            ref={titleRef}
            className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-700"
          >
            {activeContent.title}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="max-w-xl text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-300/80 leading-relaxed drop-shadow-md px-2"
          >
            {activeContent.subtitle}
          </p>

          {/* Call to action interaction */}
          <div className="pt-6 pointer-events-auto flex items-center gap-4">
            <a
              href="#video-scanner"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-rose-900/40 hover:scale-105 active:scale-95"
            >
              Launch Audit Experience
            </a>
          </div>
        </div>
      </main>

      {/* Bottom Progress & Scroll Meter */}
      <footer className="absolute bottom-6 left-6 right-6 sm:left-12 sm:right-12 z-20 flex items-center justify-between text-xs font-mono text-slate-400 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            SCROLL ENGINE
          </span>
          <div
            ref={scrollProgressRef}
            className="w-24 sm:w-36 h-1 bg-slate-800 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-500 tracking-wider uppercase">
          <span>INTERACTIVE THREE.JS + GSAP</span>
        </div>
      </footer>
    </div>
  );
};

export const HorizonHeroSection = Component;
export default Component;
