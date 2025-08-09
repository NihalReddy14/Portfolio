// 3D Timeline Visualization for Experience Page
let scene, camera, renderer;
let timelineGroup;
let nodes = [];

function initExperience3D() {
    const container = document.getElementById('experience-canvas');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 1, 1000);
    camera.position.set(0, 0, 50);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, 400);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create 3D timeline visualization
    createTimelineVisualization();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 1);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xec4899, 1);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    // Handle resize
    window.addEventListener('resize', onExperienceResize);

    // Start animation
    animateExperience();
}

function createTimelineVisualization() {
    timelineGroup = new THREE.Group();

    // Create timeline path
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-30, 15, 0),
        new THREE.Vector3(-15, 5, 10),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(15, -5, -10),
        new THREE.Vector3(30, -15, 0)
    ]);

    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        opacity: 0.6,
        transparent: true
    });
    const line = new THREE.Line(geometry, material);
    timelineGroup.add(line);

    // Create timeline nodes
    const nodePositions = [
        { pos: 0.2, year: '2023', color: 0x6366f1 },
        { pos: 0.5, year: '2024', color: 0x14b8a6 },
        { pos: 0.8, year: '2025', color: 0xec4899 }
    ];

    nodePositions.forEach((node, index) => {
        const position = curve.getPointAt(node.pos);
        
        // Create node sphere
        const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: node.color,
            emissive: node.color,
            emissiveIntensity: 0.3,
            shininess: 100
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(position);
        
        // Create outer ring
        const ringGeometry = new THREE.TorusGeometry(5, 0.5, 16, 100);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: node.color,
            opacity: 0.6,
            transparent: true
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(position);
        
        // Create year text (using sprites)
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = '#ffffff';
        context.font = 'Bold 48px Arial';
        context.textAlign = 'center';
        context.fillText(node.year, 128, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            opacity: 0.8,
            transparent: true
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(10, 5, 1);
        sprite.position.copy(position);
        sprite.position.y += 8;
        
        nodes.push({ sphere, ring, sprite, originalY: position.y });
        timelineGroup.add(sphere);
        timelineGroup.add(ring);
        timelineGroup.add(sprite);
    });

    // Add floating particles around timeline
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = [];
    const colors = [];

    for (let i = 0; i < particleCount; i++) {
        const t = Math.random();
        const point = curve.getPointAt(t);
        
        positions.push(
            point.x + (Math.random() - 0.5) * 20,
            point.y + (Math.random() - 0.5) * 20,
            point.z + (Math.random() - 0.5) * 20
        );

        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.4, 0.7, 0.5);
        colors.push(color.r, color.g, color.b);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    timelineGroup.add(particles);

    scene.add(timelineGroup);
}

function onExperienceResize() {
    camera.aspect = window.innerWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 400);
}

function animateExperience() {
    requestAnimationFrame(animateExperience);

    // Rotate timeline
    timelineGroup.rotation.y += 0.002;

    // Animate nodes
    nodes.forEach((node, index) => {
        // Float animation
        node.sphere.position.y = node.originalY + Math.sin(Date.now() * 0.001 + index) * 1;
        node.ring.position.y = node.sphere.position.y;
        node.sprite.position.y = node.sphere.position.y + 8;
        
        // Rotate rings
        node.ring.rotation.x += 0.01;
        node.ring.rotation.y += 0.01;
        
        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.002 + index) * 0.1;
        node.sphere.scale.setScalar(scale);
    });

    renderer.render(scene, camera);
}

// Initialize 3D scene
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExperience3D);
} else {
    initExperience3D();
}

// GSAP Animations for Experience Page
document.addEventListener('DOMContentLoaded', function() {
    // Timeline animations with ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animate timeline items on scroll
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        const isOdd = index % 2 === 0;
        
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                once: true
            },
            x: isOdd ? -100 : 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Animate marker dot
        gsap.from(item.querySelector('.marker-dot'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                once: true
            },
            scale: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });
    });

    // Animate skill categories
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

    // Animate goal cards
    gsap.utils.toArray('.goal-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // Parallax effect for timeline line
    gsap.to('.timeline-line', {
        scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        scaleY: 1.2,
        ease: 'none'
    });
});