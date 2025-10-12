// RGR Logistics Ltd - Main JavaScript File
// Professional logistics website functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initContactForms();
    initAnimations();
    initMobileMenu();
    initParallaxEffects();
    initTypewriterEffect();
    initCounterAnimations();
    initParticleBackground();
    initScrollProgress();
    
    console.log('🚀 RGR Logistics website loaded successfully with enhanced features!');
});

// Enhanced navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Enhanced scroll effect to navbar with throttling
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Enhanced smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Add active state to clicked link
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Smooth scroll with offset for fixed navbar
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = target.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`[href="#${sectionId}"]`);
                
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Enhanced scroll effects and animations
function initScrollEffects() {
    // Enhanced fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in, .service-card, .location-card, .value-card, .team-member, .stat-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax scroll effect for hero section
    window.addEventListener('scroll', debounce(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    }, 10));
}

// Contact form functionality
function initContactForms() {
    // Quote form handling
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteSubmission);
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });
}

// Handle quote form submission
function handleQuoteSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const quoteData = {
        origin: formData.get('origin'),
        destination: formData.get('destination'),
        cargoType: formData.get('cargo-type'),
        weight: formData.get('weight'),
        transportMode: formData.get('transport-mode'),
        timeline: formData.get('timeline'),
        details: formData.get('quote-details'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };
    
    // Validate required fields
    if (!quoteData.origin || !quoteData.destination || !quoteData.name || !quoteData.email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Quote request sent successfully! We will contact you within 24 hours.', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Handle contact form submission
function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Phone number formatting
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format for Ugandan numbers
    if (value.startsWith('256')) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
    } else if (value.startsWith('0')) {
        value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, '$1$2 $3 $4');
    }
    
    e.target.value = value;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Enhanced animation initialization
function initAnimations() {
    // Counter animation for statistics
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        if (target) {
            animateCounter(counter, target);
        }
    });
    
    // Stagger animation for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.classList.add('animate-fade-in-up');
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add ripple effect to cards
    const cards = document.querySelectorAll('.service-card, .location-card');
    cards.forEach(card => {
        card.addEventListener('click', createRippleEffect);
    });
}

// Counter animation
function animateCounter(element, target) {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let current = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
                    }
                }, 20);
                observer.unobserve(element);
            }
        });
    });
    
    observer.observe(element);
}

// Enhanced mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    // Create mobile overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    body.appendChild(overlay);
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isActive = hamburger.classList.contains('active');
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (!isActive) {
                body.style.overflow = 'hidden';
                // Add staggered animation to menu items
                const menuItems = navMenu.querySelectorAll('li');
                menuItems.forEach((item, index) => {
                    item.style.animationDelay = `${(index + 1) * 0.1}s`;
                });
            } else {
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on overlay
        overlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        function closeMobileMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation for Ugandan numbers
function isValidUgandanPhone(phone) {
    const phoneRegex = /^(\+256|0)[7-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button if needed
window.addEventListener('scroll', debounce(function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
        if (window.scrollY > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }
}, 100));

// Parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-image, .about-image');
    
    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10));
}

// Typewriter effect for hero heading
function initTypewriterEffect() {
    const heroHeading = document.querySelector('#hero-heading');
    if (!heroHeading) return;
    
    const text = heroHeading.textContent;
    const highlightText = 'Logistics Expert';
    const mainText = 'Your Trusted ';
    
    heroHeading.innerHTML = '';
    
    let i = 0;
    function typeWriter() {
        if (i < mainText.length) {
            heroHeading.innerHTML += mainText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            heroHeading.innerHTML += `<span class="highlight">${highlightText}</span>`;
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// Counter animations
function initCounterAnimations() {
    const stats = [
        { element: '.years-experience', target: 5, suffix: '+' },
        { element: '.happy-clients', target: 150, suffix: '+' },
        { element: '.projects-completed', target: 300, suffix: '+' },
        { element: '.countries-served', target: 10, suffix: '+' }
    ];
    
    stats.forEach(stat => {
        const element = document.querySelector(stat.element);
        if (element) {
            animateCounter(element, stat.target, stat.suffix);
        }
    });
}

// Particle background effect
function initParticleBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    hero.appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Ripple effect for interactive elements
function createRippleEffect(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Enhanced counter animation
function animateCounter(element, target, suffix = '') {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let current = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current) + suffix;
                    }
                }, 20);
                observer.unobserve(element);
            }
        });
    });
    
    observer.observe(element);
}

// Scroll progress bar
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', debounce(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrolled + '%';
    }, 10));
}

// Export functions for global access
window.RGRLogistics = {
    showNotification,
    scrollToTop,
    isValidEmail,
    isValidUgandanPhone,
    createRippleEffect,
    initParallaxEffects,
    initTypewriterEffect,
    initScrollProgress
};
