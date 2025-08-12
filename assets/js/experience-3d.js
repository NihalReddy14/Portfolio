// 3D Scene for Experience Page - Timeline Journey Theme
let expScene, expCamera, expRenderer;
let timelinePath, milestones = [], dataFlows = [];
let expMouseX = 0, expMouseY = 0;

function initExperience3D() {
    const container = document.getElementById('experience-canvas');
    if (!container) return;

    // Scene setup
    expScene = new THREE.Scene();
    expScene.fog = new THREE.FogExp2(0x000000, 0.001);

    // Camera setup
    expCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    expCamera.position.set(30, 20, 50);
    expCamera.lookAt(0, 0, 0);

    // Renderer setup
    expRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    expRenderer.setPixelRatio(window.devicePixelRatio);
    expRenderer.setSize(window.innerWidth, window.innerHeight);
    expRenderer.setClearColor(0x000000, 0);
    container.appendChild(expRenderer.domElement);

    // Create 3D timeline path
    createTimelinePath();

    // Create milestone nodes
    createMilestones();

    // Create data flow particles
    createDataFlows();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    expScene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0x6366f1, 2);
    spotLight.position.set(0, 30, 30);
    spotLight.angle = Math.PI / 4;
    expScene.add(spotLight);

    const pointLight = new THREE.PointLight(0xec4899, 1);
    pointLight.position.set(-20, 0, 20);
    expScene.add(pointLight);

    // Mouse interaction
    document.addEventListener('mousemove', onExpMouseMove);
    window.addEventListener('resize', onExpResize);

    // Start animation
    animateExperience();
}

function createTimelinePath() {
    // Create a curved timeline path
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-40, -10, 0),
        new THREE.Vector3(-20, 0, 10),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(20, 0, -10),
        new THREE.Vector3(40, 10, 0)
    ]);

    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Main timeline
    const material = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.6,
        linewidth: 3
    });
    
    timelinePath = new THREE.Line(geometry, material);
    expScene.add(timelinePath);

    // Glowing outline
    const glowMaterial = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.2,
        linewidth: 5
    });
    const glowLine = new THREE.Line(geometry, glowMaterial);
    expScene.add(glowLine);
}

function createMilestones() {
    const milestoneData = [
        { position: -40, year: '2022', color: 0x14b8a6 },
        { position: -20, year: '2023', color: 0xec4899 },
        { position: 0, year: '2024', color: 0x6366f1 },
        { position: 20, year: '2025', color: 0xf59e0b },
        { position: 40, year: 'Future', color: 0x8b5cf6 }
    ];

    milestoneData.forEach((data, index) => {
        const group = new THREE.Group();
        
        // Milestone sphere
        const sphereGeometry = new THREE.IcosahedronGeometry(3, 1);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.3,
            flatShading: true
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        group.add(sphere);
        
        // Outer ring
        const ringGeometry = new THREE.TorusGeometry(4, 0.3, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        group.add(ring);
        
        // Position along timeline
        const t = (data.position + 40) / 80; // Normalize to 0-1
        const point = timelinePath.geometry.attributes.position;
        const idx = Math.floor(t * 100) * 3;
        
        group.position.x = data.position;
        group.position.y = Math.sin(index * 0.5) * 5;
        group.position.z = Math.cos(index * 0.8) * 5;
        
        group.userData = {
            year: data.year,
            rotationSpeed: 0.01 + Math.random() * 0.01,
            floatOffset: Math.random() * Math.PI * 2,
            pulseOffset: index * 0.5
        };
        
        milestones.push(group);
        expScene.add(group);
    });
}

function createDataFlows() {
    // Create flowing particles along the timeline
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const t = Math.random();
        const idx = Math.floor(t * 100) * 3;
        
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.3, 0.7, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 2 + 0.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData = { startPositions: positions.slice() };
    dataFlows.push(particles);
    expScene.add(particles);
}

function onExpMouseMove(event) {
    expMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    expMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onExpResize() {
    expCamera.aspect = window.innerWidth / window.innerHeight;
    expCamera.updateProjectionMatrix();
    expRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animateExperience() {
    requestAnimationFrame(animateExperience);
    
    const time = Date.now() * 0.001;
    
    // Animate milestones
    milestones.forEach((milestone, index) => {
        const userData = milestone.userData;
        
        // Rotation
        milestone.rotation.y += userData.rotationSpeed;
        milestone.rotation.x = Math.sin(time) * 0.1;
        
        // Floating motion
        milestone.position.y = Math.sin(time + userData.floatOffset) * 3;
        
        // Pulse effect
        const scale = 1 + Math.sin(time * 2 + userData.pulseOffset) * 0.1;
        milestone.scale.setScalar(scale);
    });
    
    // Animate data flow particles
    dataFlows.forEach(flow => {
        const positions = flow.geometry.attributes.position.array;
        const startPositions = flow.userData.startPositions;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Flow along timeline
            positions[i] = startPositions[i] + Math.sin(time + i) * 2;
            positions[i + 1] = startPositions[i + 1] + Math.cos(time + i) * 2;
            
            // Move particles forward
            positions[i] += time * 2 % 80 - 40;
        }
        
        flow.geometry.attributes.position.needsUpdate = true;
        flow.rotation.y = time * 0.05;
    });
    
    // Animate timeline
    if (timelinePath) {
        timelinePath.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
    
    // Camera movement
    expCamera.position.x = 30 + Math.sin(time * 0.2) * 10;
    expCamera.position.y = 20 + expMouseY * 10;
    expCamera.lookAt(0, 0, 0);
    
    expRenderer.render(expScene, expCamera);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExperience3D);
} else {
    initExperience3D();
}

// GSAP Animations for Experience Page
document.addEventListener('DOMContentLoaded', function() {
    // Hero animations
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
        }, '-=0.5');

    // Timeline animations
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                once: true
            },
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Skill categories
    gsap.utils.toArray('.skill-category').forEach((category, index) => {
        gsap.from(category, {
            scrollTrigger: {
                trigger: category,
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

    // Career goals
    gsap.utils.toArray('.goal-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.15,
            rotationY: -30
        });
    });
});