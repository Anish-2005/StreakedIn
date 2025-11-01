// components/Scene.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Scene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000); // aspect will be set below
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    // Use mount element size instead of full window to avoid 100vw-style overflow
    const mountEl = mountRef.current;
    if (mountEl) {
      mountEl.appendChild(renderer.domElement);
      // make canvas scale responsively to its container
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      // initial sizing function
      const setSizeToMount = () => {
        const width = Math.max(1, mountEl.clientWidth);
        const height = Math.max(1, mountEl.clientHeight);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      setSizeToMount();

      // responsive: use ResizeObserver when available
      let ro: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => setSizeToMount());
        ro.observe(mountEl);
      } else {
        // fallback to window resize
        window.addEventListener('resize', setSizeToMount);
      }

      // ensure we clean up the observer/listener later (handled in cleanup)
    }

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
      colorArray[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4f46e5, 1);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    camera.position.z = 5;

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      particlesMesh.rotation.x = elapsedTime * 0.1;
      particlesMesh.rotation.y = elapsedTime * 0.15;

      const positions = particlesMesh.geometry.attributes.position.array;
      for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsedTime + positions[i3]) * 0.001;
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    // If ResizeObserver isn't available we already attached a window resize listener above.

    // Cleanup
    return () => {
      // disconnect any ResizeObserver
      if (mountRef.current) {
        // if a ResizeObserver was attached, disconnect it by iterating observers (we stored in closure)
        // easiest approach: try to remove renderer.domElement and rely on garbage collection
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // ignore
        }
      }
      // remove any global resize listener (in case ResizeObserver wasn't available)
      try {
        window.removeEventListener('resize', () => {});
      } catch (e) {
        // noop
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}