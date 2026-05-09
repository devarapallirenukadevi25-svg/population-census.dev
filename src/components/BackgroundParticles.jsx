import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference';

const BackgroundParticles = () => {
  const mountRef = useRef(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
    const mountElement = mountRef.current;
    mountElement.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.matchMedia('(max-width: 767px)').matches ? 650 : 1100;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color('#3CE0A6'); // Aurora green
    const color2 = new THREE.Color('#FFB347'); // Amber
    const color3 = new THREE.Color('#ffffff');

    for(let i = 0; i < particlesCount * 3; i+=3) {
      // Create a wide cylinder distribution for the particles
      posArray[i] = (Math.random() - 0.5) * 20; // x
      posArray[i+1] = (Math.random() - 0.5) * 20; // y
      posArray[i+2] = (Math.random() - 0.5) * 15; // z

      const mixedColor = color1.clone();
      const rand = Math.random();
      if(rand > 0.8) mixedColor.copy(color2);
      else if(rand > 0.5) mixedColor.copy(color3);
      
      colorsArray[i] = mixedColor.r;
      colorsArray[i+1] = mixedColor.g;
      colorsArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        particlesMesh.rotation.y += 0.00024;
        particlesMesh.rotation.x += 0.0001;
      
        particlesMesh.rotation.y += mouseX * 0.003;
        particlesMesh.rotation.x += mouseY * 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      material.dispose();
    };
  }, [prefersReducedMotion]);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
};

export default BackgroundParticles;
