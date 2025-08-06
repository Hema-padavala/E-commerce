// Authentication functionality
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAuthUI();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }

    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
        this.updateAuthUI();
    }

    register(email, password, name) {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        if (users.find(user => user.email === email)) {
            throw new Error('User with this email already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            email,
            password, // In a real app, this would be hashed
            name,
            createdAt: new Date().toISOString()
        };

        // Add to users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Log in the new user
        this.setCurrentUser(newUser);

        return newUser;
    }

    login(email, password) {
        // Get users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(user => user.email === email && user.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Log in user
        this.setCurrentUser(user);

        return user;
    }

    logout() {
        this.setCurrentUser(null);
        
        if (window.app) {
            window.app.showToast('Logged out successfully', 'success');
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    updateAuthUI() {
        const loginLink = document.querySelector('a[href*="login"]');
        const signupLink = document.querySelector('a[href*="signup"]');
        const userMenu = document.getElementById('user-menu');

        if (this.isLoggedIn()) {
            // Hide login/signup links
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';

            // Show user menu
            if (userMenu) {
                userMenu.style.display = 'block';
                userMenu.innerHTML = `
                    <div class="user-menu">
                        <span>Welcome, ${this.currentUser.name}</span>
                        <button class="btn btn-outline btn-sm" onclick="authManager.logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                `;
            }
        } else {
            // Show login/signup links
            if (loginLink) loginLink.style.display = 'inline-block';
            if (signupLink) signupLink.style.display = 'inline-block';

            // Hide user menu
            if (userMenu) {
                userMenu.style.display = 'none';
            }
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(signupForm);
            });
        }

        // Form toggle
        const toggleForms = document.querySelectorAll('.toggle-form');
        toggleForms.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForm();
            });
        });

        // Password validation
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validatePassword(input);
            });
        });

        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateEmail(input);
            });
        });
    }

    handleLogin(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        // Validate inputs
        if (!this.validateForm(form)) {
            return;
        }

        try {
            const user = this.login(email, password);
            
            if (window.app) {
                window.app.showToast(`Welcome back, ${user.name}!`, 'success');
            }

            // Redirect to home page
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);

        } catch (error) {
            if (window.app) {
                window.app.showToast(error.message, 'error');
            }
        }
    }

    handleSignup(form) {
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;

        // Validate inputs
        if (!this.validateForm(form)) {
            return;
        }

        // Check password confirmation
        if (password !== confirmPassword) {
            if (window.app) {
                window.app.showToast('Passwords do not match', 'error');
            }
            return;
        }

        try {
            const user = this.register(email, password, name);
            
            if (window.app) {
                window.app.showToast(`Welcome, ${user.name}! Account created successfully.`, 'success');
            }

            // Redirect to home page
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);

        } catch (error) {
            if (window.app) {
                window.app.showToast(error.message, 'error');
            }
        }
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    }

    validateEmail(input) {
        const email = input.value.trim();
        
        if (email && !window.app?.isValidEmail(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        } else {
            this.clearFieldError(input);
            return true;
        }
    }

    validatePassword(input) {
        const password = input.value;
        const validation = window.app?.validatePassword(password);
        
        if (password && validation && !validation.isValid) {
            this.showPasswordStrength(input, validation.errors);
            return false;
        } else {
            this.clearFieldError(input);
            return true;
        }
    }

    showFieldError(input, message) {
        const errorElement = input.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = message;
        } else {
            const error = document.createElement('div');
            error.className = 'form-error';
            error.textContent = message;
            input.parentNode.appendChild(error);
        }
        
        input.classList.add('error');
    }

    clearFieldError(input) {
        const errorElement = input.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
        input.classList.remove('error');
    }

    showPasswordStrength(input, errors) {
        const strengthContainer = input.parentNode.querySelector('.password-strength');
        if (!strengthContainer) {
            const container = document.createElement('div');
            container.className = 'password-strength';
            input.parentNode.appendChild(container);
        }

        const container = input.parentNode.querySelector('.password-strength');
        container.innerHTML = `
            <div class="strength-indicators">
                <div class="strength-item ${errors.length ? '' : 'valid'}">
                    <i class="fas ${errors.length ? 'fa-times' : 'fa-check'}"></i>
                    At least 8 characters
                </div>
                <div class="strength-item ${errors.uppercase ? '' : 'valid'}">
                    <i class="fas ${errors.uppercase ? 'fa-times' : 'fa-check'}"></i>
                    One uppercase letter
                </div>
                <div class="strength-item ${errors.lowercase ? '' : 'valid'}">
                    <i class="fas ${errors.lowercase ? 'fa-times' : 'fa-check'}"></i>
                    One lowercase letter
                </div>
                <div class="strength-item ${errors.numbers ? '' : 'valid'}">
                    <i class="fas ${errors.numbers ? 'fa-times' : 'fa-check'}"></i>
                    One number
                </div>
                <div class="strength-item ${errors.special ? '' : 'valid'}">
                    <i class="fas ${errors.special ? 'fa-times' : 'fa-check'}"></i>
                    One special character
                </div>
            </div>
        `;
    }

    toggleForm() {
        const loginContainer = document.querySelector('.login-container');
        const signupContainer = document.querySelector('.signup-container');
        
        if (loginContainer && signupContainer) {
            loginContainer.classList.toggle('hidden');
            signupContainer.classList.toggle('hidden');
        }
    }

    // Check if user is authenticated for protected routes
    requireAuth() {
        if (!this.isLoggedIn()) {
            if (window.app) {
                window.app.showToast('Please log in to access this page', 'warning');
            }
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Global auth manager instance
let authManager;

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    window.authManager = authManager;
});

// Global functions for authentication
function login(email, password) {
    if (authManager) {
        return authManager.login(email, password);
    }
}

function register(email, password, name) {
    if (authManager) {
        return authManager.register(email, password, name);
    }
}

function logout() {
    if (authManager) {
        authManager.logout();
    }
}

function isLoggedIn() {
    return authManager ? authManager.isLoggedIn() : false;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
} 