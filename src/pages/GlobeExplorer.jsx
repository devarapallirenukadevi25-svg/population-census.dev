import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference';

const EARTH_TEXTURE = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const EARTH_BUMP_TEXTURE = '//unpkg.com/three-globe/example/img/earth-topology.png';
const EARTH_SPECULAR_TEXTURE = '//unpkg.com/three-globe/example/img/earth-water.png';
const CLOUDS_TEXTURE = '//unpkg.com/three-globe/example/img/fair_clouds_4k.png';
const SPACE_TEXTURE = '//unpkg.com/three-globe/example/img/night-sky.png';
const TOOLTIP_WIDTH = 248;
const TOOLTIP_HEIGHT = 148;
const TOOLTIP_MARGIN = 18;

const numberFormatter = new Intl.NumberFormat('en-US');
const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getCountryName = (properties = {}) => {
  return properties.ADMIN || properties.NAME_LONG || properties.NAME || properties.SOVEREIGNT || 'Unknown country';
};

const getPopulation = (properties = {}) => {
  const population = Number(properties.POP_EST ?? properties.POPULATION ?? properties.population);
  return Number.isFinite(population) && population > 0 ? population : null;
};

const getPopulationDensity = (properties = {}, population) => {
  const directDensity = Number(
    properties.POP_DENSITY
      ?? properties.POP_DENS
      ?? properties.DENSITY
      ?? properties.populationDensity
  );

  if (Number.isFinite(directDensity) && directDensity > 0) {
    return directDensity;
  }

  const area = Number(properties.AREA_KM2 ?? properties.AREA ?? properties.areaKm2);

  if (population && Number.isFinite(area) && area > 0) {
    return population / area;
  }

  return null;
};

const getCountryKey = (country) => {
  const properties = country?.properties;
  return properties?.ISO_A3 || properties?.ADM0_A3 || properties?.NAME || properties?.ADMIN || null;
};

const buildTooltipData = (country) => {
  if (!country?.properties) return null;

  const population = getPopulation(country.properties);
  const density = getPopulationDensity(country.properties, population);

  return {
    key: getCountryKey(country),
    name: getCountryName(country.properties),
    population,
    density,
  };
};

const CountryTooltip = ({ country, position }) => {
  const tooltipData = useMemo(() => buildTooltipData(country), [country]);

  if (typeof document === 'undefined') return null;
  if (!tooltipData) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-50 w-[248px] overflow-hidden rounded-2xl border border-white/15 bg-[#06101d]/72 px-4 py-3 text-white shadow-[0_20px_70px_rgba(0,0,0,0.55),0_0_34px_rgba(95,231,255,0.2)] backdrop-blur-xl"
      style={{ left: position.x, top: position.y }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{tooltipData.name}</div>
          <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-cyan-200/75">
            Census profile
          </div>
        </div>
        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
      </div>

      <div className="space-y-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Population</div>
          <div className="mt-1 font-mono text-lg text-cyan-100">
            {tooltipData.population ? compactNumberFormatter.format(tooltipData.population) : 'Unavailable'}
          </div>
          {tooltipData.population && (
            <div className="mt-0.5 font-mono text-[11px] text-slate-400">
              {numberFormatter.format(Math.round(tooltipData.population))}
            </div>
          )}
        </div>

        {tooltipData.density && (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Density</span>
            <span className="font-mono text-sm text-amber-100">
              {numberFormatter.format(Math.round(tooltipData.density))}/km2
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

const GlobeExplorer = () => {
  const globeRef = useRef();
  const sceneCleanupRef = useRef(() => {});
  const hoveredCountryKeyRef = useRef(null);
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotionPreference();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const [tooltipPosition, setTooltipPosition] = useState({
    x: TOOLTIP_MARGIN,
    y: TOOLTIP_MARGIN,
  });

  const globeMaterial = useMemo(() => {
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      bumpScale: 4.5,
      shininess: 18,
      specular: new THREE.Color('#496a78'),
      emissive: new THREE.Color('#071019'),
      emissiveIntensity: 0.12,
    });

    new THREE.TextureLoader().load(EARTH_SPECULAR_TEXTURE, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      material.specularMap = texture;
      material.needsUpdate = true;
    });

    return material;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson', {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load country boundaries');
        return res.json();
      })
      .then(setCountries)
      .catch(error => {
        if (error.name !== 'AbortError') {
          setCountries({ features: [] });
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => {
      sceneCleanupRef.current();
    };
  }, []);

  const updateTooltipPosition = useCallback((clientX, clientY) => {
    const maxX = window.innerWidth - TOOLTIP_WIDTH - TOOLTIP_MARGIN;
    const maxY = window.innerHeight - TOOLTIP_HEIGHT - TOOLTIP_MARGIN;
    const preferredX = clientX + 20;
    const preferredY = clientY + 18;
    const fallbackX = clientX - TOOLTIP_WIDTH - 20;
    const fallbackY = clientY - TOOLTIP_HEIGHT - 18;

    setTooltipPosition({
      x: clamp(preferredX > maxX ? fallbackX : preferredX, TOOLTIP_MARGIN, maxX),
      y: clamp(preferredY > maxY ? fallbackY : preferredY, TOOLTIP_MARGIN, maxY),
    });
  }, []);

  const handlePointerMove = useCallback((event) => {
    updateTooltipPosition(event.clientX, event.clientY);
  }, [updateTooltipPosition]);

  const handlePolygonHover = useCallback((polygon) => {
    const nextKey = getCountryKey(polygon);

    if (hoveredCountryKeyRef.current === nextKey) return;

    hoveredCountryKeyRef.current = nextKey;
    setHoverD(polygon);
  }, []);

  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;

    sceneCleanupRef.current();

    const scene = globe.scene();
    const camera = globe.camera();
    const controls = globe.controls();
    const renderer = globe.renderer();
    const disposableObjects = [];
    let animationFrameId;
    const isCoarseViewport = window.matchMedia('(max-width: 767px)').matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCoarseViewport ? 1.25 : 1.6));
    renderer.setClearColor(0x02040a, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    controls.autoRotate = !prefersReducedMotion;
    controls.autoRotateSpeed = 0.26;
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.48;
    controls.minDistance = 180;
    controls.maxDistance = 520;

    globe.pointOfView({ lat: 18, lng: 74, altitude: 2.35 }, prefersReducedMotion ? 0 : 1500);

    scene.fog = new THREE.FogExp2(0x030711, 0.0007);
    camera.position.set(camera.position.x, camera.position.y, camera.position.z);

    const ambientLight = new THREE.AmbientLight(0x87a5c7, 0.42);
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.45);
    sunLight.position.set(-220, 110, 180);

    const rimLight = new THREE.DirectionalLight(0x58e4ff, 1.15);
    rimLight.position.set(210, 75, -180);

    const softFill = new THREE.HemisphereLight(0xb9e7ff, 0x111827, 0.62);

    scene.add(ambientLight, sunLight, rimLight, softFill);
    disposableObjects.push(ambientLight, sunLight, rimLight, softFill);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(104, 96, 96),
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color('#5fe7ff') },
          power: { value: 3.15 },
          intensity: { value: 0.72 },
        },
        vertexShader: `
          varying vec3 vNormal;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;

          void main() {
            float rim = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
            gl_FragColor = vec4(glowColor, rim * intensity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );

    scene.add(atmosphere);
    disposableObjects.push(atmosphere);

    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const globeSegments = isCoarseViewport ? 64 : 96;
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(101.2, globeSegments, globeSegments), cloudMaterial);
    clouds.rotation.set(0, -0.42, 0.08);
    scene.add(clouds);
    disposableObjects.push(clouds);

    new THREE.TextureLoader().load(CLOUDS_TEXTURE, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      cloudMaterial.map = texture;
      cloudMaterial.alphaMap = texture;
      cloudMaterial.needsUpdate = true;
    });

    const animateClouds = () => {
      if (!prefersReducedMotion) {
        clouds.rotation.y += 0.0003;
        clouds.rotation.x = Math.sin(performance.now() * 0.000065) * 0.012;
        atmosphere.material.uniforms.intensity.value = 0.68 + Math.sin(performance.now() * 0.00042) * 0.055;
      }

      controls.update();
      animationFrameId = requestAnimationFrame(animateClouds);
    };

    animateClouds();

    sceneCleanupRef.current = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      disposableObjects.forEach(object => {
        scene.remove(object);
        object.geometry?.dispose?.();

        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(material => {
            material.map?.dispose?.();
            material.alphaMap?.dispose?.();
            material.dispose?.();
          });
        }
      });
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className="relative flex h-[calc(100vh-2rem)] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#02040a] shadow-[0_24px_120px_rgba(0,0,0,0.72)]"
      onPointerMove={handlePointerMove}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_36%,rgba(95,231,255,0.14),transparent_28%),radial-gradient(circle_at_18%_75%,rgba(255,179,71,0.11),transparent_24%),linear-gradient(135deg,#02040a_0%,#070b14_48%,#02040a_100%)]" />

      <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing touch-none">
        <Globe
          ref={globeRef}
          animateIn
          waitForGlobeReady
          rendererConfig={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          globeImageUrl={EARTH_TEXTURE}
          bumpImageUrl={EARTH_BUMP_TEXTURE}
          backgroundImageUrl={SPACE_TEXTURE}
          globeMaterial={globeMaterial}
          onGlobeReady={handleGlobeReady}
          polygonsData={countries.features}
          polygonAltitude={d => (getCountryKey(d) === hoveredCountryKeyRef.current ? 0.058 : 0.007)}
          polygonCapCurvatureResolution={4}
          polygonsTransitionDuration={260}
          polygonCapColor={d => (
            getCountryKey(d) === hoveredCountryKeyRef.current
              ? 'rgba(95, 231, 255, 0.78)'
              : 'rgba(255, 255, 255, 0.055)'
          )}
          polygonSideColor={d => (
            getCountryKey(d) === hoveredCountryKeyRef.current
              ? 'rgba(95, 231, 255, 0.32)'
              : 'rgba(4, 8, 16, 0.28)'
          )}
          polygonStrokeColor={d => (
            getCountryKey(d) === hoveredCountryKeyRef.current
              ? 'rgba(255, 255, 255, 0.92)'
              : 'rgba(160, 190, 205, 0.24)'
          )}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={({ properties: d }) => navigate(`/country/${d.ISO_A3}`)}
          showAtmosphere
          atmosphereColor="#5fe7ff"
          atmosphereAltitude={0.22}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_50%,transparent_48%,rgba(2,4,10,0.32)_76%,rgba(2,4,10,0.72)_100%)]" />

      <CountryTooltip country={hoverD} position={tooltipPosition} />

      <div className="pointer-events-none absolute left-6 top-6 z-10 max-w-[calc(100%-3rem)]">
        <div className="pointer-events-auto rounded-2xl border border-white/10 border-l-4 border-l-cyan-300 bg-[#07111f]/70 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.48)] backdrop-blur-xl">
          <h2 className="mb-2 text-2xl font-bold text-white">Globe Explorer</h2>
          <p className="text-sm text-slate-400">Drag to rotate - scroll to zoom - click a country</p>

          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="mb-2 flex items-center justify-between gap-6">
              <span className="text-sm text-slate-400">Global Population</span>
              <span className="font-mono text-cyan-200">8,045,311,447</span>
            </div>
            <div className="mb-4 h-1.5 w-full rounded-full bg-white/5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-cyan-300 via-aurora-green to-amber-highlight shadow-[0_0_22px_rgba(95,231,255,0.45)]"
                style={{ width: '80%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeExplorer;
