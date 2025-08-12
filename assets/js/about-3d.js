// 3D Scene for About Page - Professional Identity Theme
let aboutScene, aboutCamera, aboutRenderer;
let profileOrb, orbWireframe, dataNodes = [];
let aboutMouseX = 0, aboutMouseY = 0;

function initAbout3D() {
    const container = document.getElementById('about-canvas');
    if (!container) return;

    // Scene setup
    aboutScene = new THREE.Scene();

    // Camera setup
    aboutCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    aboutCamera.position.z = 40;

    // Renderer setup
    aboutRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    aboutRenderer.setPixelRatio(window.devicePixelRatio);
    aboutRenderer.setSize(window.innerWidth, window.innerHeight);
    aboutRenderer.setClearColor(0x000000, 0);
    container.appendChild(aboutRenderer.domElement);

    // Create central profile orb
    createProfileOrb();

    // Create orbiting data nodes
    createOrbitingNodes();

    // Create connection lines
    createConnectionLines();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    aboutScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 2);
    pointLight.position.set(0, 0, 20);
    aboutScene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xec4899, 1);
    pointLight2.position.set(-20, 10, -10);
    aboutScene.add(pointLight2);

    // Mouse interaction
    document.addEventListener('mousemove', onAboutMouseMove);
    window.addEventListener('resize', onAboutResize);

    // Start animation
    animateAbout();
}

function createProfileOrb() {
    const orbGroup = new THREE.Group();
    
    // Core sphere with gradient-like effect
    const coreGeometry = new THREE.IcosahedronGeometry(8, 2);
    const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        emissive: 0x6366f1,
        emissiveIntensity: 0.2,
        flatShading: true,
        shininess: 100
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    orbGroup.add(core);
    
    // Wireframe overlay
    const wireGeometry = new THREE.IcosahedronGeometry(8.5, 2);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    orbWireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    orbGroup.add(orbWireframe);
    
    // Outer glow sphere
    const glowGeometry = new THREE.SphereGeometry(10, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    orbGroup.add(glow);
    
    profileOrb = orbGroup;
    aboutScene.add(profileOrb);
}

function createOrbitingNodes() {
    const nodeCount = 6;
    const radius = 20;
    
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        
        // Create node group
        const nodeGroup = new THREE.Group();
        
        // Node mesh
        const nodeGeometry = new THREE.OctahedronGeometry(2, 0);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0xec4899 : 0x14b8a6,
            emissive: i % 2 === 0 ? 0xec4899 : 0x14b8a6,
            emissiveIntensity: 0.3,
            flatShading: true
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        nodeGroup.add(node);
        
        // Node orbit ring
        const ringGeometry = new THREE.RingGeometry(2.5, 3, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        nodeGroup.add(ring);
        
        // Position node
        nodeGroup.position.x = Math.cos(angle) * radius;
        nodeGroup.position.z = Math.sin(angle) * radius;
        nodeGroup.position.y = Math.sin(angle * 2) * 5;
        
        nodeGroup.userData = {
            angle: angle,
            radius: radius,
            speed: 0.005 + Math.random() * 0.005,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        dataNodes.push(nodeGroup);
        aboutScene.add(nodeGroup);
    }
}

function createConnectionLines() {
    // Create dynamic connection lines between orb and nodes
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.1
    });
    
    dataNodes.forEach(node => {
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(node.position);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        
        aboutScene.add(line);
        node.userData.connectionLine = line;
    });
}

function onAboutMouseMove(event) {
    aboutMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    aboutMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onAboutResize() {
    aboutCamera.aspect = window.innerWidth / window.innerHeight;
    aboutCamera.updateProjectionMatrix();
    aboutRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animateAbout() {
    requestAnimationFrame(animateAbout);
    
    // Rotate profile orb
    if (profileOrb) {
        profileOrb.rotation.y += 0.005;
        profileOrb.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
        
        // Wireframe counter-rotation
        orbWireframe.rotation.y -= 0.007;
    }
    
    // Animate orbiting nodes
    dataNodes.forEach((node, index) => {
        const userData = node.userData;
        userData.angle += userData.speed;
        
        // Orbital motion
        node.position.x = Math.cos(userData.angle) * userData.radius;
        node.position.z = Math.sin(userData.angle) * userData.radius;
        node.position.y = Math.sin(userData.angle * 2) * 5 + 
                         Math.sin(Date.now() * 0.001 + userData.floatOffset) * 2;
        
        // Node rotation
        node.rotation.x += 0.01;
        node.rotation.y += 0.02;
        
        // Update connection line
        if (node.userData.connectionLine) {
            const positions = node.userData.connectionLine.geometry.attributes.position.array;
            positions[3] = node.position.x;
            positions[4] = node.position.y;
            positions[5] = node.position.z;
            node.userData.connectionLine.geometry.attributes.position.needsUpdate = true;
        }
    });
    
    // Camera follows mouse
    aboutCamera.position.x += (aboutMouseX * 10 - aboutCamera.position.x) * 0.05;
    aboutCamera.position.y += (aboutMouseY * 10 - aboutCamera.position.y) * 0.05;
    aboutCamera.lookAt(aboutScene.position);
    
    aboutRenderer.render(aboutScene, aboutCamera);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAbout3D);
} else {
    initAbout3D();
}

// GSAP Animations for About Page
document.addEventListener('DOMContentLoaded', function() {
    // Page entrance animations
    gsap.timeline()
        .from('.page-title', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.page-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.about-intro', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');

    // Scroll animations
    gsap.utils.toArray('.detail-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1
        });
    });

    gsap.from('.profile-card', {
        scrollTrigger: {
            trigger: '.profile-card',
            start: 'top 80%',
            once: true
        },
        x: 50,
        opacity: 0,
        duration: 0.8
    });

    gsap.from('.quick-facts', {
        scrollTrigger: {
            trigger: '.quick-facts',
            start: 'top 80%',
            once: true
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2
    });

    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                once: true
            },
            x: -50,
            opacity: 0,
            duration: 0.8
        });
    });

    gsap.utils.toArray('.value-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            scale: 0.9
        });
    });
});