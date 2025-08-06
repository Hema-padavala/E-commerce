// App initialization and utility functions
class ShopHubApp {
    constructor() {
        this.currentPage = window.location.pathname;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeNavigation();
        this.showPageTransition();
        this.updateCartCount();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            });
        });

        // Button click animations
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                this.addButtonClickAnimation(e.target);
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeNavigation() {
        // Set active navigation link based on current page
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === this.currentPage || 
                (this.currentPage === '/' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    showPageTransition() {
        // Add page transition animation
        document.body.classList.add('page-transition');
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('page-transition');
        }, 600);
    }

    addButtonClickAnimation(button) {
        button.classList.add('btn-click');
        setTimeout(() => {
            button.classList.remove('btn-click');
        }, 200);
    }

    showLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('active');
            this.isLoading = true;
        }
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('active');
            this.isLoading = false;
        }
    }

    showToast(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Remove toast after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Add animation if count changed
            if (totalItems > 0) {
                cartCount.classList.add('pulse');
                setTimeout(() => {
                    cartCount.classList.remove('pulse');
                }, 1000);
            }
        }
    }

    // Utility function to format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Utility function to debounce
    debounce(func, wait) {
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

    // Utility function to throttle
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Smooth page navigation
    navigateTo(url) {
        this.showLoadingSpinner();
        
        // Simulate loading time
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // Handle form submissions
    handleFormSubmit(form, callback) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Call the callback function
            callback(form);
            
            // Reset button after a delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 2000);
        });
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
            errors: {
                length: password.length < minLength,
                uppercase: !hasUpperCase,
                lowercase: !hasLowerCase,
                numbers: !hasNumbers,
                special: !hasSpecialChar
            }
        };
    }

    // Add stagger animation to elements
    addStaggerAnimation(container, selector) {
        const elements = container.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('stagger-item');
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Lazy load images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Handle keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal-overlay.active');
                modals.forEach(modal => {
                    modal.classList.remove('active');
                });
            }
            
            // Enter key to submit forms
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                const form = e.target.closest('form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShopHubApp();
    
    // Setup lazy loading
    app.setupLazyLoading();
    
    // Setup keyboard navigation
    app.setupKeyboardNavigation();
    
    // Add stagger animation to product grids
    const productGrids = document.querySelectorAll('.products-grid');
    productGrids.forEach(grid => {
        app.addStaggerAnimation(grid, '.product-card');
    });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Update cart count when page becomes visible
        if (window.app) {
            app.updateCartCount();
        }
    }
});

// Handle window resize
window.addEventListener('resize', app?.debounce(() => {
    // Handle responsive behavior
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
}, 250));

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopHubApp;
} 