// GSAP Animations
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Loader animation
    const loader = document.getElementById('loader');
    if (loader) {
        gsap.to(loader, {
            opacity: 0,
            visibility: 'hidden',
            duration: 1,
            delay: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
                loader.style.display = 'none';
                loader.classList.add('hidden');
            }
        });
    }

    // Hero animations
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTimeline
        .from('.hero-title .word', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2
        })
        .from('.hero-subtitle', {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, '-=0.5')
        .from('.hero-description', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, '-=0.5')
        .from('.hero-cta .btn', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2
        }, '-=0.5')
        .from('.floating-cards .card', {
            scale: 0,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        }, '-=0.5')
        .from('.scroll-indicator', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, '-=0.5');

    // Navbar animation on scroll
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            gsap.to(navbar, { y: -100, duration: 0.3 });
        } else {
            gsap.to(navbar, { y: 0, duration: 0.3 });
        }
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = window.scrollY;
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-card');
    stats.forEach(stat => {
        const number = stat.querySelector('.stat-number');
        const finalCount = parseInt(stat.dataset.count);
        
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%',
                once: true
            },
            y: 50,
            opacity: 0,
            duration: 0.8
        });
        
        gsap.to(number, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%',
                once: true
            },
            textContent: finalCount,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
                number.textContent = Math.floor(number.textContent);
            }
        });
    });

    // Project cards animation
    gsap.utils.toArray('.project-preview').forEach((project, index) => {
        gsap.from(project, {
            scrollTrigger: {
                trigger: project,
                start: 'top 80%',
                once: true
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1
        });
    });

    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                once: true
            },
            y: 50,
            opacity: 0,
            duration: 0.8
        });
    });

    // CTA section animation
    const ctaSection = document.querySelector('.cta');
    if (ctaSection) {
        gsap.from('.cta-content > *', {
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top 80%',
                once: true
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2
        });
    }

    // Parallax effect for hero section
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: -150,
        opacity: 0.5
    });

    // Floating animation for cards
    gsap.utils.toArray('.floating-cards .card').forEach((card, index) => {
        gsap.to(card, {
            y: '+=20',
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    });

    // Magnetic button effect
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.3
            });
        });
    });

    // Typing effect
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        
        let charIndex = 0;
        const typeSpeed = 50;
        
        function typeWriter() {
            if (charIndex < text.length) {
                typingText.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typeSpeed);
            }
        }
        
        setTimeout(typeWriter, 1500);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });
});