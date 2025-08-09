// 3D Visualization for Skills Page
let scene, camera, renderer, raycaster, mouse;
let skillSpheres = [];
let rotationGroup;

function initSkills3D() {
    const container = document.getElementById('skills-canvas');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 1, 1000);
    camera.position.z = 50;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, 400);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Raycaster for interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create skill network
    createSkillNetwork();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 1);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 1);
    pointLight2.position.set(-50, -50, 50);
    scene.add(pointLight2);

    // Event listeners
    window.addEventListener('resize', onSkillsResize);
    container.addEventListener('mousemove', onSkillsMouseMove);

    // Start animation
    animateSkills();
}

function createSkillNetwork() {
    rotationGroup = new THREE.Group();
    
    const categories = {
        languages: { color: 0x6366f1, skills: ['JS', 'TS', 'Python', 'Java', 'C++'] },
        frontend: { color: 0xec4899, skills: ['React', 'Next', 'Angular', 'CSS'] },
        backend: { color: 0x14b8a6, skills: ['Node', 'Spring', 'GraphQL'] },
        cloud: { color: 0xf59e0b, skills: ['AWS', 'Docker', 'CI/CD'] },
        tools: { color: 0x8b5cf6, skills: ['Git', 'MongoDB', 'SQL'] }
    };

    let nodeIndex = 0;
    const totalNodes = Object.values(categories).reduce((sum, cat) => sum + cat.skills.length, 0);
    
    Object.entries(categories).forEach(([category, data]) => {
        data.skills.forEach((skill, index) => {
            // Create sphere
            const geometry = new THREE.SphereGeometry(2, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: data.color,
                emissive: data.color,
                emissiveIntensity: 0.2,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            
            // Position in 3D space
            const angle = (nodeIndex / totalNodes) * Math.PI * 2;
            const radius = 20 + Math.random() * 10;
            const y = (Math.random() - 0.5) * 30;
            
            sphere.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            
            sphere.userData = { skill, category, originalColor: data.color };
            skillSpheres.push(sphere);
            rotationGroup.add(sphere);
            
            // Create connections
            if (index > 0) {
                const prevSphere = skillSpheres[skillSpheres.length - 2];
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    sphere.position,
                    prevSphere.position
                ]);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: data.color,
                    opacity: 0.3,
                    transparent: true
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                rotationGroup.add(line);
            }
            
            nodeIndex++;
        });
    });
    
    scene.add(rotationGroup);
}

function onSkillsMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onSkillsResize() {
    camera.aspect = window.innerWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 400);
}

function animateSkills() {
    requestAnimationFrame(animateSkills);
    
    // Rotate the entire group
    rotationGroup.rotation.y += 0.002;
    
    // Float individual spheres
    skillSpheres.forEach((sphere, index) => {
        sphere.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
    });
    
    // Raycaster for hover effects
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(skillSpheres);
    
    // Reset all spheres
    skillSpheres.forEach(sphere => {
        sphere.scale.set(1, 1, 1);
        sphere.material.emissiveIntensity = 0.2;
    });
    
    // Highlight hovered sphere
    if (intersects.length > 0) {
        const hoveredSphere = intersects[0].object;
        hoveredSphere.scale.set(1.5, 1.5, 1.5);
        hoveredSphere.material.emissiveIntensity = 0.5;
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
    
    renderer.render(scene, camera);
}

// Initialize 3D scene
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkills3D);
} else {
    initSkills3D();
}

// Skills page specific interactions
document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Filter cards
            skillCards.forEach((card, index) => {
                card.style.setProperty('--index', index + 1);
                
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    gsap.from(card, {
                        scale: 0,
                        opacity: 0,
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: 'back.out(1.7)'
                    });
                } else {
                    gsap.to(card, {
                        scale: 0,
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });

    // Animate skill bars on scroll
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const levelBar = entry.target.querySelector('.level-bar');
                if (levelBar) {
                    levelBar.style.animation = 'fillBar 1.5s ease-out forwards';
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillCards.forEach(card => {
        skillObserver.observe(card);
    });

    // Create 3D skill chart
    createSkillChart();

    // GSAP ScrollTrigger animations
    gsap.utils.toArray('.cert-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.8
        });
    });

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
            delay: index * 0.1
        });
    });
});

// Create 3D donut chart for skills distribution
function createSkillChart() {
    const chartContainer = document.getElementById('skill-chart');
    if (!chartContainer) return;

    const chartScene = new THREE.Scene();
    const chartCamera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
    chartCamera.position.z = 30;

    const chartRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    chartRenderer.setSize(400, 400);
    chartRenderer.setClearColor(0x000000, 0);
    chartContainer.appendChild(chartRenderer.domElement);

    // Create donut segments
    const segments = [
        { color: 0x6366f1, angle: 72 },  // Languages
        { color: 0xec4899, angle: 54 },  // Frontend
        { color: 0x14b8a6, angle: 54 },  // Backend
        { color: 0xf59e0b, angle: 72 },  // Cloud
        { color: 0x8b5cf6, angle: 108 }  // Tools
    ];

    const chartGroup = new THREE.Group();
    let startAngle = 0;

    segments.forEach((segment, index) => {
        const geometry = new THREE.RingGeometry(8, 12, 32, 1, startAngle, segment.angle * Math.PI / 180);
        const material = new THREE.MeshPhongMaterial({
            color: segment.color,
            side: THREE.DoubleSide,
            emissive: segment.color,
            emissiveIntensity: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Add depth
        const extrudeSettings = {
            depth: 4,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.5,
            bevelThickness: 0.5
        };
        
        chartGroup.add(mesh);
        startAngle += segment.angle * Math.PI / 180;
    });

    chartScene.add(chartGroup);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    chartScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 20);
    chartScene.add(pointLight);

    // Animate chart
    function animateChart() {
        requestAnimationFrame(animateChart);
        chartGroup.rotation.z += 0.005;
        chartGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        chartRenderer.render(chartScene, chartCamera);
    }

    animateChart();
}