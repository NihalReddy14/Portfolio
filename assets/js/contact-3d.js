// 3D Scene for Contact Page - Communication Network Theme
let contactScene, contactCamera, contactRenderer;
let networkNodes = [], connections = [], messageParticles = [];
let contactMouseX = 0, contactMouseY = 0;

function initContact3D() {
    const container = document.getElementById('contact-canvas');
    if (!container) return;

    // Scene setup
    contactScene = new THREE.Scene();

    // Camera setup
    contactCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    contactCamera.position.set(0, 0, 60);

    // Renderer setup
    contactRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    contactRenderer.setPixelRatio(window.devicePixelRatio);
    contactRenderer.setSize(window.innerWidth, window.innerHeight);
    contactRenderer.setClearColor(0x000000, 0);
    container.appendChild(contactRenderer.domElement);

    // Create network nodes
    createNetworkNodes();

    // Create connections
    createConnections();

    // Create message particles
    createMessageParticles();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    contactScene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2);
    pointLight1.position.set(20, 20, 20);
    contactScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2);
    pointLight2.position.set(-20, -20, 20);
    contactScene.add(pointLight2);

    // Mouse interaction
    document.addEventListener('mousemove', onContactMouseMove);
    window.addEventListener('resize', onContactResize);

    // Start animation
    animateContact();
}

function createNetworkNodes() {
    // Central communication hub
    const hubGeometry = new THREE.IcosahedronGeometry(4, 2);
    const hubMaterial = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        emissive: 0x6366f1,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.userData = { isHub: true, pulseSpeed: 0.02 };
    networkNodes.push(hub);
    contactScene.add(hub);

    // Surrounding nodes (representing different contact methods)
    const nodeData = [
        { icon: 'email', color: 0xec4899, angle: 0 },
        { icon: 'linkedin', color: 0x0077b5, angle: Math.PI / 3 },
        { icon: 'github', color: 0x333333, angle: 2 * Math.PI / 3 },
        { icon: 'phone', color: 0x14b8a6, angle: Math.PI },
        { icon: 'location', color: 0xf59e0b, angle: 4 * Math.PI / 3 },
        { icon: 'message', color: 0x8b5cf6, angle: 5 * Math.PI / 3 }
    ];

    nodeData.forEach((data, index) => {
        const nodeGroup = new THREE.Group();
        
        // Node sphere
        const nodeGeometry = new THREE.SphereGeometry(2, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        nodeGroup.add(node);
        
        // Outer ring
        const ringGeometry = new THREE.TorusGeometry(2.5, 0.1, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        nodeGroup.add(ring);
        
        // Position in circle
        const radius = 20;
        nodeGroup.position.x = Math.cos(data.angle) * radius;
        nodeGroup.position.y = Math.sin(data.angle) * radius;
        nodeGroup.position.z = Math.sin(index) * 5;
        
        nodeGroup.userData = {
            type: data.icon,
            angle: data.angle,
            radius: radius,
            orbitSpeed: 0.001 + Math.random() * 0.002,
            rotationSpeed: 0.01 + Math.random() * 0.01
        };
        
        networkNodes.push(nodeGroup);
        contactScene.add(nodeGroup);
    });
}

function createConnections() {
    // Create dynamic connections between hub and nodes
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.3
    });
    
    // Connect hub to each node
    networkNodes.forEach((node, index) => {
        if (index === 0) return; // Skip hub itself
        
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0)); // Hub position
        points.push(node.position.clone());
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial.clone());
        
        line.userData = {
            startNode: 0,
            endNode: index,
            pulseOffset: Math.random() * Math.PI * 2
        };
        
        connections.push(line);
        contactScene.add(line);
    });
    
    // Create some connections between nodes
    for (let i = 1; i < networkNodes.length - 1; i++) {
        if (Math.random() > 0.5) {
            const points = [];
            points.push(networkNodes[i].position.clone());
            points.push(networkNodes[i + 1].position.clone());
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial.clone());
            
            line.userData = {
                startNode: i,
                endNode: i + 1,
                pulseOffset: Math.random() * Math.PI * 2
            };
            
            connections.push(line);
            contactScene.add(line);
        }
    }
}

function createMessageParticles() {
    // Create particles flowing along connections
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        // Random position
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        // Color gradient
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 2 + 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData = {
        targetNodes: Array(particleCount).fill(0).map(() => Math.floor(Math.random() * networkNodes.length)),
        speeds: Array(particleCount).fill(0).map(() => 0.01 + Math.random() * 0.02)
    };
    
    messageParticles.push(particles);
    contactScene.add(particles);
}

function onContactMouseMove(event) {
    contactMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    contactMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onContactResize() {
    contactCamera.aspect = window.innerWidth / window.innerHeight;
    contactCamera.updateProjectionMatrix();
    contactRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animateContact() {
    requestAnimationFrame(animateContact);
    
    const time = Date.now() * 0.001;
    
    // Animate hub
    const hub = networkNodes[0];
    if (hub) {
        // Pulse effect
        const scale = 1 + Math.sin(time * 2) * 0.1;
        hub.scale.setScalar(scale);
        hub.rotation.y += 0.005;
    }
    
    // Animate network nodes
    networkNodes.forEach((node, index) => {
        if (index === 0) return; // Skip hub
        
        const userData = node.userData;
        
        // Orbit around hub
        userData.angle += userData.orbitSpeed;
        node.position.x = Math.cos(userData.angle) * userData.radius;
        node.position.y = Math.sin(userData.angle) * userData.radius;
        
        // Rotation
        node.rotation.x += userData.rotationSpeed;
        node.rotation.y += userData.rotationSpeed * 0.5;
        
        // Floating motion
        node.position.z = Math.sin(time + index) * 5;
    });
    
    // Update connections
    connections.forEach((connection, index) => {
        const startNode = networkNodes[connection.userData.startNode];
        const endNode = networkNodes[connection.userData.endNode];
        
        if (startNode && endNode) {
            const positions = connection.geometry.attributes.position.array;
            positions[0] = startNode.position.x;
            positions[1] = startNode.position.y;
            positions[2] = startNode.position.z;
            positions[3] = endNode.position.x;
            positions[4] = endNode.position.y;
            positions[5] = endNode.position.z;
            connection.geometry.attributes.position.needsUpdate = true;
            
            // Pulse effect
            const opacity = 0.2 + Math.sin(time * 3 + connection.userData.pulseOffset) * 0.2;
            connection.material.opacity = Math.max(0.1, opacity);
        }
    });
    
    // Animate message particles
    messageParticles.forEach(system => {
        const positions = system.geometry.attributes.position.array;
        const targetNodes = system.userData.targetNodes;
        const speeds = system.userData.speeds;
        
        for (let i = 0; i < positions.length / 3; i++) {
            const targetNode = networkNodes[targetNodes[i]];
            if (targetNode) {
                const idx = i * 3;
                
                // Move towards target
                const dx = targetNode.position.x - positions[idx];
                const dy = targetNode.position.y - positions[idx + 1];
                const dz = targetNode.position.z - positions[idx + 2];
                
                positions[idx] += dx * speeds[i];
                positions[idx + 1] += dy * speeds[i];
                positions[idx + 2] += dz * speeds[i];
                
                // Reset if close to target
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (distance < 2) {
                    targetNodes[i] = Math.floor(Math.random() * networkNodes.length);
                }
            }
        }
        
        system.geometry.attributes.position.needsUpdate = true;
        system.rotation.z += 0.001;
    });
    
    // Camera follows mouse
    contactCamera.position.x += (contactMouseX * 15 - contactCamera.position.x) * 0.05;
    contactCamera.position.y += (contactMouseY * 15 - contactCamera.position.y) * 0.05;
    contactCamera.lookAt(contactScene.position);
    
    contactRenderer.render(contactScene, contactCamera);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContact3D);
} else {
    initContact3D();
}

// GSAP Animations for Contact Page
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

    // Contact form animation
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            once: true
        },
        x: -50,
        opacity: 0,
        duration: 0.8
    });

    // Contact info cards
    gsap.utils.toArray('.contact-info').forEach((info, index) => {
        gsap.from(info, {
            scrollTrigger: {
                trigger: info,
                start: 'top 80%',
                once: true
            },
            x: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1
        });
    });

    // Social links
    gsap.utils.toArray('.social-link').forEach((link, index) => {
        gsap.from(link, {
            scrollTrigger: {
                trigger: link,
                start: 'top 85%',
                once: true
            },
            scale: 0,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
        });
    });

    // Form field animations
    const formFields = document.querySelectorAll('.form-group');
    formFields.forEach((field, index) => {
        gsap.from(field, {
            scrollTrigger: {
                trigger: field,
                start: 'top 85%',
                once: true
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1
        });
    });
});