// Import Three.js and Dat.GUI
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/dat.gui/build/dat.gui.module.js';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particle geometry and material
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 10000; // Number of particles
const positions = new Float32Array(particleCount * 3); // x, y, z for each particle
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    // Random positions in a cube space
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 10; // X
    positions[i3 + 1] = (Math.random() - 0.5) * 10; // Y
    positions[i3 + 2] = (Math.random() - 0.5) * 10; // Z

    // Random colors
    colors[i3 + 0] = Math.random(); // Red
    colors[i3 + 1] = Math.random(); // Green
    colors[i3 + 2] = Math.random(); // Blue
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true, // Enable per-particle color
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending, // Add a glow effect
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// GUI for customization
const gui = new GUI();
const parameters = {
    particleSize: 0.05,
    particleOpacity: 0.8,
};

gui.add(parameters, 'particleSize', 0.01, 0.2).onChange((value) => {
    particlesMaterial.size = value;
});

gui.add(parameters, 'particleOpacity', 0.1, 1.0).onChange((value) => {
    particlesMaterial.opacity = value;
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles
    particles.rotation.y = elapsedTime * 0.1; // Slow Y-axis rotation
    particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1; // Slight X-axis sway

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
