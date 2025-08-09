// 3D Gallery Visualization for Projects Page
let scene, camera, renderer;
let carouselGroup;
let projectCards = [];
let mouseX = 0;
let targetRotation = 0;

function initProjects3D() {
    const container = document.getElementById('projects-canvas');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 1, 1000);
    camera.position.set(0, 0, 40);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, 400);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create 3D carousel
    create3DCarousel();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0x6366f1, 1);
    spotLight.position.set(0, 30, 30);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const spotLight2 = new THREE.SpotLight(0xec4899, 1);
    spotLight2.position.set(0, -30, 30);
    scene.add(spotLight2);

    // Mouse interaction
    container.addEventListener('mousemove', onProjectsMouseMove);

    // Handle resize
    window.addEventListener('resize', onProjectsResize);

    // Start animation
    animateProjects();
}

function create3DCarousel() {
    carouselGroup = new THREE.Group();

    const cardCount = 6;
    const radius = 20;

    for (let i = 0; i < cardCount; i++) {
        const angle = (i / cardCount) * Math.PI * 2;
        
        // Create card
        const cardGeometry = new THREE.BoxGeometry(12, 8, 0.5);
        const cardMaterial = new THREE.MeshPhongMaterial({
            color: 0x1e293b,
            emissive: 0x1e293b,
            emissiveIntensity: 0.1,
            shininess: 100
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);

        // Position card
        card.position.x = Math.cos(angle) * radius;
        card.position.z = Math.sin(angle) * radius;
        card.rotation.y = -angle + Math.PI / 2;

        // Add border
        const borderGeometry = new THREE.EdgesGeometry(cardGeometry);
        const borderMaterial = new THREE.LineBasicMaterial({ 
            color: 0x6366f1,
            linewidth: 2
        });
        const border = new THREE.LineSegments(borderGeometry, borderMaterial);
        card.add(border);

        // Add glowing effect
        const glowGeometry = new THREE.BoxGeometry(12.5, 8.5, 0.6);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.1
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        card.add(glow);

        // Add some text/icon representation
        const iconGeometry = new THREE.IcosahedronGeometry(1, 0);
        const iconMaterial = new THREE.MeshPhongMaterial({
            color: 0xec4899,
            emissive: 0xec4899,
            emissiveIntensity: 0.5
        });
        const icon = new THREE.Mesh(iconGeometry, iconMaterial);
        icon.position.z = 0.5;
        card.add(icon);

        projectCards.push({ card, icon, angle: angle });
        carouselGroup.add(card);
    }

    scene.add(carouselGroup);

    // Add floating particles
    createFloatingParticles();
}

function createFloatingParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 15 + Math.random() * 15;
        const height = (Math.random() - 0.5) * 40;

        positions.push(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );

        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.4, 0.7, 0.5);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    carouselGroup.add(particles);
}

function onProjectsMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    targetRotation = mouseX * Math.PI * 0.5;
}

function onProjectsResize() {
    camera.aspect = window.innerWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 400);
}

function animateProjects() {
    requestAnimationFrame(animateProjects);

    // Smooth carousel rotation
    carouselGroup.rotation.y += (targetRotation - carouselGroup.rotation.y) * 0.05;

    // Animate individual cards
    projectCards.forEach((item, index) => {
        // Float animation
        item.card.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
        
        // Icon rotation
        item.icon.rotation.x += 0.01;
        item.icon.rotation.y += 0.02;
        
        // Scale based on position
        const worldPos = new THREE.Vector3();
        item.card.getWorldPosition(worldPos);
        const distance = worldPos.z;
        const scale = 1 + (distance / 30) * 0.3;
        item.card.scale.setScalar(Math.max(0.8, Math.min(1.2, scale)));
    });

    renderer.render(scene, camera);
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