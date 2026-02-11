/**
 * ============================================
 * TRANSPORTES MARMUSA - Main JavaScript
 * ============================================
 * 
 * This script handles all interactive functionality:
 * - Mobile menu toggle
 * - Dropdown menus
 * - Header scroll effects
 * - Smooth scrolling
 * 
 * @author Transportes Marmusa Development Team
 * @version 1.0.0
 */

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    // Header
    header: document.getElementById('header'),
    
    // Mobile Menu
    menuToggle: document.getElementById('menuToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    menuClose: document.getElementById('menuClose'),
    
    // Navigation Links
    mobileMenuLinks: document.querySelectorAll('.mobile-menu__link:not(.mobile-menu__link--dropdown)'),
    
    // Dropdowns
    desktopDropdowns: document.querySelectorAll('.header__nav-link--dropdown'),
    mobileDropdowns: document.querySelectorAll('.mobile-menu__link--dropdown'),
};

// ============================================
// STATE
// ============================================

const state = {
    isMenuOpen: false,
    isScrolled: false,
    activeDropdown: null,
};

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================

/**
 * Opens the mobile menu
 */
function openMobileMenu() {
    state.isMenuOpen = true;
    DOM.mobileMenu.setAttribute('aria-hidden', 'false');
    DOM.menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    
    // Trap focus inside menu
    DOM.menuClose.focus();
}

/**
 * Closes the mobile menu
 */
function closeMobileMenu() {
    state.isMenuOpen = false;
    DOM.mobileMenu.setAttribute('aria-hidden', 'true');
    DOM.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    
    // Close all mobile dropdowns
    DOM.mobileDropdowns.forEach(dropdown => {
        dropdown.setAttribute('aria-expanded', 'false');
    });
    
    // Return focus to toggle button
    DOM.menuToggle.focus();
}

/**
 * Toggles the mobile menu
 */
function toggleMobileMenu() {
    if (state.isMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// ============================================
// DROPDOWN FUNCTIONALITY
// ============================================

/**
 * Toggles a dropdown menu
 * @param {HTMLElement} dropdownButton - The dropdown toggle button
 */
function toggleDropdown(dropdownButton) {
    const isExpanded = dropdownButton.getAttribute('aria-expanded') === 'true';
    
    // Close all other dropdowns first
    document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
        if (btn !== dropdownButton && btn.classList.contains('mobile-menu__link--dropdown')) {
            btn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Toggle current dropdown
    dropdownButton.setAttribute('aria-expanded', !isExpanded);
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================

/**
 * Handles header appearance on scroll
 */
function handleScroll() {
    const scrollY = window.scrollY;
    const threshold = 50;
    
    if (scrollY > threshold && !state.isScrolled) {
        state.isScrolled = true;
        DOM.header.classList.add('header--scrolled');
    } else if (scrollY <= threshold && state.isScrolled) {
        state.isScrolled = false;
        DOM.header.classList.remove('header--scrolled');
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================

/**
 * Smooth scroll to an element
 * @param {string} targetId - The ID of the target element
 */
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    
    if (target) {
        const headerHeight = DOM.header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

/**
 * Handles keyboard navigation for accessibility
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboard(event) {
    // Close menu on Escape
    if (event.key === 'Escape' && state.isMenuOpen) {
        closeMobileMenu();
    }
    
    // Close dropdowns on Escape
    if (event.key === 'Escape') {
        document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
        });
    }
}

// ============================================
// CLICK OUTSIDE HANDLER
// ============================================

/**
 * Closes dropdowns when clicking outside
 * @param {MouseEvent} event - The click event
 */
function handleClickOutside(event) {
    // Close desktop dropdowns
    DOM.desktopDropdowns.forEach(dropdown => {
        const parent = dropdown.closest('.header__nav-item--dropdown');
        if (parent && !parent.contains(event.target)) {
            dropdown.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    // Mobile menu toggle
    if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile menu close button
    if (DOM.menuClose) {
        DOM.menuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close mobile menu when clicking on nav links
    DOM.mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            
            // Handle smooth scroll for anchor links
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                smoothScrollTo(href);
            }
        });
    });
    
    // Desktop dropdowns hover/click
    DOM.desktopDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDropdown(dropdown);
        });
        
        // Also toggle on hover for desktop
        const parent = dropdown.closest('.header__nav-item--dropdown');
        if (parent) {
            parent.addEventListener('mouseenter', () => {
                dropdown.setAttribute('aria-expanded', 'true');
            });
            parent.addEventListener('mouseleave', () => {
                dropdown.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    // Mobile dropdowns
    DOM.mobileDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDropdown(dropdown);
        });
    });
    
    // Scroll handler
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Click outside handler
    document.addEventListener('click', handleClickOutside);
    
    // Handle resize (close mobile menu if resizing to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && state.isMenuOpen) {
            closeMobileMenu();
        }
    });
}

// ============================================
// HERO ANIMATIONS
// ============================================

/**
 * Initialize hero section animations
 */
function initHeroAnimations() {
    // Add intersection observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateOnScroll.observe(el);
    });
}

// ============================================
// SECTION SCROLL ANIMATIONS
// ============================================

/**
 * Initialize scroll animations for sections
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.about, .services, .coverage, .fleet, .routes, .units, .advantages, .process, .contact');
    
    if (!sections.length) return;
    
    const sectionObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, sectionObserverOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ============================================
// PARALLAX EFFECT (OPTIONAL)
// ============================================

/**
 * Simple parallax effect for hero background
 */
function initParallax() {
    const heroSky = document.querySelector('.hero__sky');
    
    if (!heroSky || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const speed = 0.3;
        
        if (scrollY < window.innerHeight) {
            heroSky.style.transform = `translateY(${scrollY * speed}px)`;
        }
    }, { passive: true });
}

// ============================================
// LOADING STATE
// ============================================

/**
 * Handle page load animations
 */
function handlePageLoad() {
    // Remove loading class after a short delay
    document.body.classList.add('is-loaded');
    
    // Initialize scroll position check
    handleScroll();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all functionality
 */
function init() {
    initEventListeners();
    initHeroAnimations();
    initScrollAnimations();
    initParallax();
    handlePageLoad();
    
    console.log('✅ Transportes Marmusa website initialized');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait = 100) {
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

/**
 * Throttle function for performance optimization
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
