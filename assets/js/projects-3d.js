// 3D Scene for Projects Page - Creative Building Blocks Theme
let projScene, projCamera, projRenderer;
let buildingBlocks = [], codeParticles = [], creativeSparks = [];
let projMouseX = 0, projMouseY = 0;

function initProjects3D() {
    const container = document.getElementById('projects-canvas');
    if (!container) return;

    // Scene setup
    projScene = new THREE.Scene();

    // Camera setup
    projCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    projCamera.position.set(25, 15, 40);
    projCamera.lookAt(0, 0, 0);

    // Renderer setup
    projRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    projRenderer.setPixelRatio(window.devicePixelRatio);
    projRenderer.setSize(window.innerWidth, window.innerHeight);
    projRenderer.setClearColor(0x000000, 0);
    container.appendChild(projRenderer.domElement);

    // Create building blocks
    createBuildingBlocks();

    // Create code particles
    createCodeParticles();

    // Create creative sparks
    createCreativeSparks();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    projScene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(0x6366f1, 2);
    spotLight1.position.set(20, 30, 20);
    spotLight1.castShadow = true;
    projScene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xec4899, 1.5);
    spotLight2.position.set(-20, 20, -20);
    projScene.add(spotLight2);

    // Mouse interaction
    document.addEventListener('mousemove', onProjMouseMove);
    window.addEventListener('resize', onProjResize);

    // Start animation
    animateProjects();
}

function createBuildingBlocks() {
    const blockTypes = [
        { geometry: new THREE.BoxGeometry(4, 4, 4), color: 0x6366f1 },
        { geometry: new THREE.CylinderGeometry(2, 2, 4, 8), color: 0xec4899 },
        { geometry: new THREE.OctahedronGeometry(3, 0), color: 0x14b8a6 },
        { geometry: new THREE.TetrahedronGeometry(3, 0), color: 0xf59e0b },
        { geometry: new THREE.IcosahedronGeometry(2.5, 0), color: 0x8b5cf6 }
    ];

    // Create floating building blocks
    for (let i = 0; i < 8; i++) {
        const type = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        
        const material = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8,
            flatShading: true
        });
        
        const block = new THREE.Mesh(type.geometry, material);
        
        // Add wireframe overlay
        const wireframe = new THREE.Mesh(
            type.geometry,
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            })
        );
        block.add(wireframe);
        
        // Random position
        block.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 30
        );
        
        block.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        block.userData = {
            originalY: block.position.y,
            floatSpeed: 0.5 + Math.random() * 0.5,
            rotationSpeed: {
                x: 0.001 + Math.random() * 0.01,
                y: 0.001 + Math.random() * 0.01,
                z: 0.001 + Math.random() * 0.01
            }
        };
        
        buildingBlocks.push(block);
        projScene.add(block);
    }
}

function createCodeParticles() {
    // Create flowing code-like particles
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        
        const color = new THREE.Color();
        if (i % 3 === 0) {
            color.set(0x6366f1); // Blue
        } else if (i % 3 === 1) {
            color.set(0xec4899); // Pink
        } else {
            color.set(0x14b8a6); // Teal
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    codeParticles.push(particles);
    projScene.add(particles);
}

function createCreativeSparks() {
    // Create spark connections between blocks
    const sparkMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
    });
    
    for (let i = 0; i < 10; i++) {
        const points = [];
        const startPoint = new THREE.Vector3(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 30
        );
        
        points.push(startPoint);
        
        // Create lightning-like path
        for (let j = 0; j < 5; j++) {
            const nextPoint = new THREE.Vector3(
                startPoint.x + (Math.random() - 0.5) * 10,
                startPoint.y + (Math.random() - 0.5) * 10,
                startPoint.z + (Math.random() - 0.5) * 10
            );
            points.push(nextPoint);
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const spark = new THREE.Line(geometry, sparkMaterial);
        
        spark.userData = {
            opacity: Math.random(),
            fadeSpeed: 0.01 + Math.random() * 0.02
        };
        
        creativeSparks.push(spark);
        projScene.add(spark);
    }
}

function onProjMouseMove(event) {
    projMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    projMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onProjResize() {
    projCamera.aspect = window.innerWidth / window.innerHeight;
    projCamera.updateProjectionMatrix();
    projRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animateProjects() {
    requestAnimationFrame(animateProjects);
    
    const time = Date.now() * 0.001;
    
    // Animate building blocks
    buildingBlocks.forEach((block, index) => {
        const userData = block.userData;
        
        // Floating motion
        block.position.y = userData.originalY + Math.sin(time * userData.floatSpeed + index) * 3;
        
        // Rotation
        block.rotation.x += userData.rotationSpeed.x;
        block.rotation.y += userData.rotationSpeed.y;
        block.rotation.z += userData.rotationSpeed.z;
        
        // Scale pulse
        const scale = 1 + Math.sin(time * 2 + index) * 0.05;
        block.scale.setScalar(scale);
    });
    
    // Animate code particles
    codeParticles.forEach(particles => {
        particles.rotation.y += 0.001;
        
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + i) * 0.01;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    });
    
    // Animate creative sparks
    creativeSparks.forEach((spark, index) => {
        const userData = spark.userData;
        
        // Fade in and out
        userData.opacity += userData.fadeSpeed;
        if (userData.opacity > 0.3 || userData.opacity < 0) {
            userData.fadeSpeed *= -1;
        }
        spark.material.opacity = Math.max(0, userData.opacity);
        
        // Move spark
        const positions = spark.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.05;
            positions[i + 1] += Math.cos(time + i) * 0.05;
        }
        spark.geometry.attributes.position.needsUpdate = true;
    });
    
    // Camera follows mouse
    projCamera.position.x = 25 + projMouseX * 10;
    projCamera.position.y = 15 + projMouseY * 10;
    projCamera.lookAt(0, 0, 0);
    
    projRenderer.render(projScene, projCamera);
}

// Initialize 3D scene
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects3D);
} else {
    initProjects3D();
}

// Projects page specific interactions
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card:not(.coming-soon)');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter cards
            projectCards.forEach((card, index) => {
                card.style.setProperty('--index', index + 1);
                const categories = card.dataset.category.split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    gsap.from(card, {
                        scale: 0,
                        opacity: 0,
                        rotationY: 180,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: 'back.out(1.7)'
                    });
                } else {
                    gsap.to(card, {
                        scale: 0,
                        opacity: 0,
                        rotationY: -180,
                        duration: 0.4,
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });

    // Animate project cards on scroll
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1
        });
    });

    // Animate GitHub stats
    gsap.utils.toArray('.stat-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            scale: 0,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
        });
    });

    // 3D tilt effect enhancement
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Parallax effect for hero
    gsap.to('.projects-hero-content', {
        scrollTrigger: {
            trigger: '.projects-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: -100,
        opacity: 0.5
    });
});