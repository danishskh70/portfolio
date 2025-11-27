

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation feedback
        darkModeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            darkModeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== NAVBAR SCROLL EFFECT =====
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    const handleNavbarScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Add shadow on scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    };
    
    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ===== ACTIVE NAVIGATION HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const highlightNavigation = () => {
        let currentSection = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', highlightNavigation);

    // ===== ANIMATED STATISTICS COUNTER =====
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };
    
    // Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const statNumber = entry.target.querySelector('.stat-number');
                const target = parseInt(statNumber.getAttribute('data-target'));
                
                animateCounter(statNumber, target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===== PROJECT CARD HOVER EFFECTS =====
    document.querySelectorAll('.project-card').forEach(card => {
        const techItems = card.querySelectorAll('.tech-list li');
        
        card.addEventListener('mouseenter', () => {
            techItems.forEach((tech, index) => {
                setTimeout(() => {
                    tech.style.transform = 'scale(1.05)';
                    tech.style.borderColor = 'var(--accent)';
                    tech.style.color = 'var(--accent)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            techItems.forEach(tech => {
                tech.style.transform = 'scale(1)';
                tech.style.borderColor = 'var(--border)';
                tech.style.color = 'var(--text-sec)';
            });
        });
    });

    // ===== EMAIL COPY FUNCTIONALITY =====
    const emailLinks = document.querySelectorAll('[data-email]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = link.getAttribute('data-email');
            const originalText = link.textContent;
            
            try {
                await navigator.clipboard.writeText(email);
                
                // Success feedback
                link.textContent = '✓ Email Copied!';
                link.style.color = 'var(--success)';
                
                setTimeout(() => {
                    link.textContent = originalText;
                    link.style.color = '';
                }, 2000);
                
            } catch (err) {
                // Fallback: open email client
                window.location.href = `mailto:${email}`;
            }
        });
    });

    // ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                // Stop observing after animation
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Apply fade-in to elements
    const animatedElements = document.querySelectorAll(
        '.project-card, .exp-card, .skill-group, .contact-item'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        fadeInObserver.observe(element);
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Press '/' to jump to projects
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Press 'Escape' to scroll to top
        if (e.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // ===== PERFORMANCE: LAZY LOAD IMAGES =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== PRELOAD CRITICAL RESOURCES =====
    const preloadLink = (href) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = href;
        document.head.appendChild(link);
    };

    // ===== UTILITY: DEBOUNCE FUNCTION =====
    const debounce = (func, wait = 100) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // ===== RESIZE HANDLER =====
    const handleResize = debounce(() => {
        // Recalculate positions if needed
        highlightNavigation();
    }, 250);
    
    window.addEventListener('resize', handleResize);

    // ===== CONSOLE EASTER EGG =====
    console.log('%c👨‍💻 Danish Shaikh Portfolio', 'font-size: 20px; font-weight: bold; color: #007acc;');
    console.log('%cLooking for a developer? Let\'s connect!', 'font-size: 14px; color: #666;');
    console.log('%c📧 danishshk70@gmail.com', 'font-size: 14px; color: #007acc;');

    // ===== INITIALIZATION COMPLETE =====
    console.log('✅ Portfolio initialized successfully');
});

// ===== SERVICE WORKER REGISTRATION (OPTIONAL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker for offline support
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

