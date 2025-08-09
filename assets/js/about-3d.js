// 3D Scene for About Page
let scene, camera, renderer;
let shapes = [];

function initAbout3D() {
    const container = document.getElementById('about-canvas');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 30;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, 400);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create floating DNA helix
    createDNAHelix();

    // Create floating spheres
    createFloatingSpheres();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Handle resize
    window.addEventListener('resize', onAboutResize);

    // Start animation
    animateAbout();
}

function createDNAHelix() {
    const helixGroup = new THREE.Group();
    
    const helixGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const material1 = new THREE.MeshPhongMaterial({ 
        color: 0x6366f1,
        emissive: 0x6366f1,
        emissiveIntensity: 0.2
    });
    const material2 = new THREE.MeshPhongMaterial({ 
        color: 0xec4899,
        emissive: 0xec4899,
        emissiveIntensity: 0.2
    });

    for (let i = 0; i < 50; i++) {
        const angle = (i / 5) * Math.PI;
        const y = (i - 25) * 0.5;
        
        // First strand
        const sphere1 = new THREE.Mesh(helixGeometry, material1);
        sphere1.position.set(Math.cos(angle) * 5, y, Math.sin(angle) * 5);
        helixGroup.add(sphere1);
        
        // Second strand
        const sphere2 = new THREE.Mesh(helixGeometry, material2);
        sphere2.position.set(Math.cos(angle + Math.PI) * 5, y, Math.sin(angle + Math.PI) * 5);
        helixGroup.add(sphere2);
        
        // Connecting lines
        if (i % 3 === 0) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                sphere1.position,
                sphere2.position
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0x6366f1,
                opacity: 0.3,
                transparent: true
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            helixGroup.add(line);
        }
    }
    
    helixGroup.position.x = -15;
    helixGroup.rotation.z = 0.3;
    scene.add(helixGroup);
    shapes.push({ mesh: helixGroup, rotationSpeed: 0.005 });
}

function createFloatingSpheres() {
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 1);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x14b8a6,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    for (let i = 0; i < 3; i++) {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(
            Math.random() * 20 - 10,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        );
        sphere.position.x += 10; // Offset to the right
        scene.add(sphere);
        shapes.push({
            mesh: sphere,
            rotationSpeed: 0.01 + Math.random() * 0.01,
            floatSpeed: 0.001 + Math.random() * 0.002,
            floatOffset: Math.random() * Math.PI * 2
        });
    }
}

function onAboutResize() {
    camera.aspect = window.innerWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 400);
}

function animateAbout() {
    requestAnimationFrame(animateAbout);
    
    // Rotate shapes
    shapes.forEach((shape, index) => {
        if (shape.rotationSpeed) {
            shape.mesh.rotation.y += shape.rotationSpeed;
        }
        
        // Float effect
        if (shape.floatSpeed) {
            shape.mesh.position.y += Math.sin(Date.now() * shape.floatSpeed + shape.floatOffset) * 0.02;
        }
    });
    
    renderer.render(scene, camera);
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