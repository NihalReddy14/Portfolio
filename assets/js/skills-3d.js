// 3D Scene for Skills Page - Technology Matrix Theme
let skillsScene, skillsCamera, skillsRenderer;
let techCube, skillSpheres = [], circuitLines = [];
let skillsMouseX = 0, skillsMouseY = 0;

function initSkills3D() {
    const container = document.getElementById('skills-canvas');
    if (!container) return;

    // Scene setup
    skillsScene = new THREE.Scene();

    // Camera setup
    skillsCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    skillsCamera.position.set(0, 10, 50);
    skillsCamera.lookAt(0, 0, 0);

    // Renderer setup
    skillsRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    skillsRenderer.setPixelRatio(window.devicePixelRatio);
    skillsRenderer.setSize(window.innerWidth, window.innerHeight);
    skillsRenderer.setClearColor(0x000000, 0);
    container.appendChild(skillsRenderer.domElement);

    // Create central tech cube
    createTechCube();

    // Create floating skill spheres
    createSkillSpheres();

    // Create circuit board lines
    createCircuitBoard();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    skillsScene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(0x6366f1, 2);
    spotLight1.position.set(20, 20, 20);
    spotLight1.angle = Math.PI / 4;
    spotLight1.penumbra = 0.5;
    skillsScene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0x14b8a6, 1.5);
    spotLight2.position.set(-20, 20, -20);
    spotLight2.angle = Math.PI / 4;
    spotLight2.penumbra = 0.5;
    skillsScene.add(spotLight2);

    // Mouse interaction
    document.addEventListener('mousemove', onSkillsMouseMove);
    window.addEventListener('resize', onSkillsResize);

    // Start animation
    animateSkills();
}

function createTechCube() {
    const cubeGroup = new THREE.Group();
    
    // Main cube frame - smaller
    const frameGeometry = new THREE.BoxGeometry(12, 12, 12);
    const frameMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    cubeGroup.add(frame);
    
    // Inner rotating cube - smaller
    const innerGeometry = new THREE.IcosahedronGeometry(6, 2);
    const innerMaterial = new THREE.MeshPhongMaterial({
        color: 0x14b8a6,
        emissive: 0x14b8a6,
        emissiveIntensity: 0.3,
        flatShading: true,
        transparent: true,
        opacity: 0.6,
        shininess: 100
    });
    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    cubeGroup.add(inner);
    
    // Add "SKILLS" text in center
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.font = 'Bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('SKILLS', 128, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(8, 2, 1);
    cubeGroup.add(sprite);
    
    // Data particles inside cube
    const particleCount = 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 15;
        positions[i + 1] = (Math.random() - 0.5) * 15;
        positions[i + 2] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.8,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    cubeGroup.add(particles);
    
    techCube = cubeGroup;
    skillsScene.add(techCube);
}

function createSkillSpheres() {
    const skills = [
        { name: 'JavaScript', color: 0xf7df1e, level: 0.9 },
        { name: 'React', color: 0x61dafb, level: 0.85 },
        { name: 'Node.js', color: 0x339933, level: 0.8 },
        { name: 'Python', color: 0x3776ab, level: 0.75 },
        { name: 'AWS', color: 0xff9900, level: 0.7 },
        { name: 'Docker', color: 0x2496ed, level: 0.65 },
        { name: 'TypeScript', color: 0x3178c6, level: 0.85 },
        { name: 'MongoDB', color: 0x47a248, level: 0.7 },
        { name: 'Next.js', color: 0x000000, level: 0.75 },
        { name: 'GraphQL', color: 0xe10098, level: 0.65 },
        { name: 'Redux', color: 0x764abc, level: 0.7 },
        { name: 'Git', color: 0xf05032, level: 0.85 }
    ];
    
    skills.forEach((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const radius = 25;
        
        // Skill sphere group
        const sphereGroup = new THREE.Group();
        
        // Main sphere with better material - smaller size
        const sphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: skill.color,
            emissive: skill.color,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereGroup.add(sphere);
        
        
        // Add inner core - smaller
        const coreGeometry = new THREE.IcosahedronGeometry(1.5, 1);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        sphereGroup.add(core);
        
        // Add glow ring - smaller
        const ringGeometry = new THREE.TorusGeometry(3, 0.2, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        sphereGroup.add(ring);
        
        
        // Position in space
        sphereGroup.position.x = Math.cos(angle) * radius;
        sphereGroup.position.z = Math.sin(angle) * radius;
        sphereGroup.position.y = Math.sin(angle * 2) * 5;
        
        sphereGroup.userData = {
            angle: angle,
            radius: radius,
            floatSpeed: 0.0005 + Math.random() * 0.0005,
            rotationSpeed: 0.005 + Math.random() * 0.005,
            skill: skill,
            core: core
        };
        
        skillSpheres.push(sphereGroup);
        skillsScene.add(sphereGroup);
    });
}

function createCircuitBoard() {
    // Create a grid of circuit-like lines
    const gridSize = 40;
    const divisions = 10;
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x6366f1, 0x6366f1);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -15;
    skillsScene.add(gridHelper);
    
    // Circuit paths
    const pathMaterial = new THREE.LineBasicMaterial({
        color: 0x14b8a6,
        transparent: true,
        opacity: 0.3
    });
    
    // Create random circuit paths
    for (let i = 0; i < 5; i++) {
        const points = [];
        const startX = (Math.random() - 0.5) * gridSize;
        const startZ = (Math.random() - 0.5) * gridSize;
        
        points.push(new THREE.Vector3(startX, -15, startZ));
        
        for (let j = 0; j < 3; j++) {
            const x = (Math.random() - 0.5) * gridSize;
            const z = (Math.random() - 0.5) * gridSize;
            points.push(new THREE.Vector3(x, -15, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, pathMaterial);
        
        line.userData = {
            pulseOffset: Math.random() * Math.PI * 2
        };
        
        circuitLines.push(line);
        skillsScene.add(line);
    }
}

function onSkillsMouseMove(event) {
    skillsMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    skillsMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onSkillsResize() {
    skillsCamera.aspect = window.innerWidth / window.innerHeight;
    skillsCamera.updateProjectionMatrix();
    skillsRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animateSkills() {
    requestAnimationFrame(animateSkills);
    
    const time = Date.now() * 0.001;
    
    // Animate tech cube
    if (techCube) {
        techCube.rotation.x += 0.003;
        techCube.rotation.y += 0.005;
        
        // Animate inner cube differently
        techCube.children[1].rotation.x -= 0.01;
        techCube.children[1].rotation.y += 0.015;
        
        // Animate particles
        const positions = techCube.children[2].geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] = Math.sin(time + i) * 5;
        }
        techCube.children[2].geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate skill spheres
    skillSpheres.forEach((sphere, index) => {
        const userData = sphere.userData;
        
        // Orbital motion around center
        userData.angle += userData.floatSpeed;
        sphere.position.x = Math.cos(userData.angle) * userData.radius;
        sphere.position.z = Math.sin(userData.angle) * userData.radius;
        sphere.position.y = Math.sin(userData.angle * 2) * 5 + Math.sin(time + index) * 2;
        
        // Sphere rotation
        sphere.rotation.y += userData.rotationSpeed;
        
        // Rotate inner elements
        if (userData.core) {
            userData.core.rotation.x += 0.02;
            userData.core.rotation.y += 0.01;
        }
        
        // Pulse effect
        const scale = 1 + Math.sin(time * 2 + index) * 0.05;
        sphere.scale.setScalar(scale);
    });
    
    // Animate circuit lines
    circuitLines.forEach((line, index) => {
        const opacity = 0.1 + Math.sin(time * 2 + line.userData.pulseOffset) * 0.2;
        line.material.opacity = Math.max(0.1, opacity);
    });
    
    // Camera follows mouse
    skillsCamera.position.x += (skillsMouseX * 20 - skillsCamera.position.x) * 0.05;
    skillsCamera.position.y = 10 + skillsMouseY * 10;
    skillsCamera.lookAt(skillsScene.position);
    
    skillsRenderer.render(skillsScene, skillsCamera);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkills3D);
} else {
    initSkills3D();
}

// GSAP Animations for Skills Page
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

    // Skill categories entrance
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
            delay: index * 0.1
        });
    });

    // Skill items
    gsap.utils.toArray('.skill-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                once: true
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            delay: (index % 3) * 0.1
        });

        // Animate skill bars
        const skillBar = item.querySelector('.skill-progress');
        if (skillBar) {
            gsap.from(skillBar, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    once: true
                },
                scaleX: 0,
                duration: 1,
                delay: 0.3 + (index % 3) * 0.1,
                ease: 'power2.out',
                transformOrigin: 'left center'
            });
        }
    });

    // Certifications
    gsap.utils.toArray('.cert-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            scale: 0,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'back.out(1.7)'
        });
    });

    // Learning cards
    gsap.utils.toArray('.learning-card').forEach((card, index) => {
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
            rotationX: -30
        });
    });
});