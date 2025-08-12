// Universal 3D Background for All Pages
let universalScene, universalCamera, universalRenderer;
let stars = [];
let universalMouseX = 0, universalMouseY = 0;
let universalWindowHalfX = window.innerWidth / 2;
let universalWindowHalfY = window.innerHeight / 2;

function initUniversal3D() {
    // Check if we're on the home page - skip if so (it has its own 3D)
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        return;
    }

    // Create or find container
    let container = document.getElementById('universal-3d-canvas');
    if (!container) {
        // Create container if it doesn't exist
        container = document.createElement('div');
        container.id = 'universal-3d-canvas';
        container.className = 'universal-3d-background';
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Scene setup
    universalScene = new THREE.Scene();
    universalScene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // Camera setup
    universalCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    universalCamera.position.z = 500;

    // Renderer setup
    universalRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    universalRenderer.setPixelRatio(window.devicePixelRatio);
    universalRenderer.setSize(window.innerWidth, window.innerHeight);
    universalRenderer.setClearColor(0x000000, 0);
    container.appendChild(universalRenderer.domElement);

    // Create starfield
    createStarfield();

    // Create floating particles
    createFloatingParticles();

    // Add subtle geometric shapes
    createSubtleShapes();

    // Event listeners
    document.addEventListener('mousemove', onUniversalMouseMove, false);
    window.addEventListener('resize', onUniversalResize, false);

    // Start animation
    animateUniversal();
}

function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starsVertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    universalScene.add(starField);
    stars.push(starField);
}

function createFloatingParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x6366f1,
        size: 3,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particlesVertices = [];
    const particleColors = [];
    
    for (let i = 0; i < 500; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        particlesVertices.push(x, y, z);

        // Create gradient colors
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.4, 0.7, 0.5);
        particleColors.push(color.r, color.g, color.b);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
    
    particlesMaterial.vertexColors = true;
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    universalScene.add(particles);
    stars.push(particles);
}

function createSubtleShapes() {
    // Add some floating geometric shapes
    const shapes = [];
    
    // Floating tetrahedrons
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.TetrahedronGeometry(20, 0);
        const material = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 800;
        mesh.position.y = (Math.random() - 0.5) * 800;
        mesh.position.z = (Math.random() - 0.5) * 800;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        universalScene.add(mesh);
        shapes.push(mesh);
    }

    // Store shapes for animation
    universalScene.userData.shapes = shapes;
}

function onUniversalMouseMove(event) {
    universalMouseX = (event.clientX - universalWindowHalfX) / universalWindowHalfX;
    universalMouseY = (event.clientY - universalWindowHalfY) / universalWindowHalfY;
}

function onUniversalResize() {
    universalWindowHalfX = window.innerWidth / 2;
    universalWindowHalfY = window.innerHeight / 2;

    universalCamera.aspect = window.innerWidth / window.innerHeight;
    universalCamera.updateProjectionMatrix();

    universalRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animateUniversal() {
    requestAnimationFrame(animateUniversal);

    // Rotate stars
    stars.forEach((starField, index) => {
        starField.rotation.x += 0.0001;
        starField.rotation.y += 0.0002;
        
        if (index === 1) { // Floating particles
            starField.rotation.z -= 0.0001;
        }
    });

    // Animate shapes
    if (universalScene.userData.shapes) {
        universalScene.userData.shapes.forEach((shape, index) => {
            shape.rotation.x += 0.001 * (index + 1);
            shape.rotation.y += 0.002 * (index + 1);
            
            // Floating motion
            shape.position.y = shape.position.y + Math.sin(Date.now() * 0.001 + index) * 0.1;
        });
    }

    // Camera follows mouse slightly
    universalCamera.position.x += (universalMouseX * 50 - universalCamera.position.x) * 0.02;
    universalCamera.position.y += (-universalMouseY * 50 - universalCamera.position.y) * 0.02;
    universalCamera.lookAt(universalScene.position);

    universalRenderer.render(universalScene, universalCamera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUniversal3D);
} else {
    initUniversal3D();
}