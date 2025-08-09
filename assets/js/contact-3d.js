// 3D Communication Network for Contact Page
let scene, camera, renderer;
let networkGroup;
let nodes = [];
let connections = [];

function initContact3D() {
    const container = document.getElementById('contact-canvas');
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

    // Create communication network
    createCommunicationNetwork();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 1);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xec4899, 1);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    // Handle resize
    window.addEventListener('resize', onContactResize);

    // Start animation
    animateContact();
}

function createCommunicationNetwork() {
    networkGroup = new THREE.Group();

    // Create central node (user)
    const centralGeometry = new THREE.SphereGeometry(4, 32, 32);
    const centralMaterial = new THREE.MeshPhongMaterial({
        color: 0xec4899,
        emissive: 0xec4899,
        emissiveIntensity: 0.5,
        shininess: 100
    });
    const centralNode = new THREE.Mesh(centralGeometry, centralMaterial);
    centralNode.position.set(0, 0, 0);
    networkGroup.add(centralNode);

    // Create outer ring
    const ringGeometry = new THREE.TorusGeometry(8, 0.3, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0xec4899,
        opacity: 0.6,
        transparent: true
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    networkGroup.add(ring);

    // Create communication nodes
    const nodeTypes = [
        { icon: '✉', color: 0x6366f1, size: 2.5 },  // Email
        { icon: '📱', color: 0x14b8a6, size: 2.5 },  // Phone
        { icon: '💬', color: 0xf59e0b, size: 2.5 },  // Chat
        { icon: '🌐', color: 0x8b5cf6, size: 2.5 },  // Web
        { icon: '👥', color: 0x22c55e, size: 2.5 },  // Social
        { icon: '📅', color: 0xef4444, size: 2.5 }   // Calendar
    ];

    nodeTypes.forEach((type, index) => {
        const angle = (index / nodeTypes.length) * Math.PI * 2;
        const radius = 20;
        
        // Create node
        const nodeGeometry = new THREE.SphereGeometry(type.size, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.3,
            shininess: 100
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        
        node.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            (Math.random() - 0.5) * 10
        );
        
        nodes.push({
            mesh: node,
            angle: angle,
            radius: radius,
            originalZ: node.position.z,
            speed: 0.001 + Math.random() * 0.002
        });
        
        networkGroup.add(node);
        
        // Create connection to center
        const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            node.position
        ]);
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: type.color,
            opacity: 0.3,
            transparent: true
        });
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        connections.push(connection);
        networkGroup.add(connection);
    });

    // Add floating particles
    createFloatingMessages();

    scene.add(networkGroup);
}

function createFloatingMessages() {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 25;
        const height = (Math.random() - 0.5) * 30;

        positions.push(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );

        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.4, 0.7, 0.6);
        colors.push(color.r, color.g, color.b);
        
        sizes.push(Math.random() * 3 + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    networkGroup.add(particles);
}

function onContactResize() {
    camera.aspect = window.innerWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 400);
}

function animateContact() {
    requestAnimationFrame(animateContact);

    // Rotate network
    networkGroup.rotation.y += 0.001;

    // Animate nodes
    nodes.forEach((node, index) => {
        // Orbital motion
        node.angle += node.speed;
        node.mesh.position.x = Math.cos(node.angle) * node.radius;
        node.mesh.position.y = Math.sin(node.angle) * node.radius;
        
        // Floating motion
        node.mesh.position.z = node.originalZ + Math.sin(Date.now() * 0.001 + index) * 2;
        
        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.002 + index) * 0.1;
        node.mesh.scale.setScalar(scale);
        
        // Update connection
        const connection = connections[index];
        if (connection) {
            const points = [
                new THREE.Vector3(0, 0, 0),
                node.mesh.position
            ];
            connection.geometry.setFromPoints(points);
        }
    });

    renderer.render(scene, camera);
}

// Initialize 3D scene
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContact3D);
} else {
    initContact3D();
}

// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Form handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                contactForm.reset();
                
                // Animate success
                gsap.from(formStatus, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            } catch (error) {
                // Show error message
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Something went wrong. Please try again.';
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Animate form elements
    gsap.from('.contact-form-section', {
        scrollTrigger: {
            trigger: '.contact-form-section',
            start: 'top 80%',
            once: true
        },
        x: -50,
        opacity: 0,
        duration: 0.8
    });

    gsap.from('.info-card, .availability-card', {
        scrollTrigger: {
            trigger: '.contact-info-section',
            start: 'top 80%',
            once: true
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });

    // Animate FAQ items
    gsap.utils.toArray('.faq-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                once: true
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1
        });
    });

    // Form field animations
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const icon = group.querySelector('.form-icon');
        
        if (input && icon) {
            input.addEventListener('focus', () => {
                gsap.to(icon, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
            
            input.addEventListener('blur', () => {
                gsap.to(icon, {
                    scale: 1,
                    duration: 0.3
                });
            });
        }
    });

    // Parallax effect
    gsap.to('.contact-hero-content', {
        scrollTrigger: {
            trigger: '.contact-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: -100,
        opacity: 0.5
    });
});