// Three.js Scene for Hero Background
let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 500;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create particle system
    createParticles();

    // Create geometric shapes
    createGeometricShapes();

    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    const color1 = new THREE.Color(0x6366f1); // Primary color
    const color2 = new THREE.Color(0xec4899); // Secondary color

    for (let i = 0; i < 1000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );

        const mixedColor = color1.clone();
        mixedColor.lerp(color2, Math.random());
        colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createGeometricShapes() {
    // Create floating geometric shapes
    const shapes = [];
    
    // Icosahedron
    const geo1 = new THREE.IcosahedronGeometry(50, 1);
    const mat1 = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const mesh1 = new THREE.Mesh(geo1, mat1);
    mesh1.position.set(-200, 100, -100);
    shapes.push(mesh1);
    scene.add(mesh1);

    // Octahedron
    const geo2 = new THREE.OctahedronGeometry(40, 0);
    const mat2 = new THREE.MeshPhongMaterial({
        color: 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const mesh2 = new THREE.Mesh(geo2, mat2);
    mesh2.position.set(200, -100, -200);
    shapes.push(mesh2);
    scene.add(mesh2);

    // Torus
    const geo3 = new THREE.TorusGeometry(30, 10, 16, 100);
    const mat3 = new THREE.MeshPhongMaterial({
        color: 0x14b8a6,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const mesh3 = new THREE.Mesh(geo3, mat3);
    mesh3.position.set(0, 200, -150);
    shapes.push(mesh3);
    scene.add(mesh3);

    // Add lights
    const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(0, 1, 1);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0x404040);
    scene.add(light2);

    // Store shapes for animation
    window.geometricShapes = shapes;
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particle system
    if (particleSystem) {
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.001;
    }

    // Animate geometric shapes
    if (window.geometricShapes) {
        window.geometricShapes.forEach((shape, index) => {
            shape.rotation.x += 0.01 * (index + 1) * 0.5;
            shape.rotation.y += 0.01 * (index + 1) * 0.5;
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.5;
        });
    }

    // Camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
} else {
    initThreeJS();
}