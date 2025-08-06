// Cart management functionality
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.renderCart();
        this.setupEventListeners();
    }

    loadCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.renderCart();
        
        if (window.app) {
            window.app.showToast(`${product.name} added to cart!`, 'success');
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        
        if (window.app) {
            window.app.showToast('Item removed from cart', 'info');
        }
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
        
        if (window.app) {
            window.app.showToast('Cart cleared', 'info');
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    renderCart() {
        const cartContainer = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 class="empty-state-title">Your cart is empty</h3>
                    <p class="empty-state-description">
                        Looks like you haven't added any items to your cart yet. 
                        Start shopping to see items here.
                    </p>
                    <button class="btn btn-primary" onclick="window.location.href='products.html'">
                        <i class="fas fa-shopping-bag"></i> Start Shopping
                    </button>
                </div>
            `;
            
            if (cartSummary) {
                cartSummary.innerHTML = '';
            }
        } else {
            cartContainer.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
            
            if (cartSummary) {
                cartSummary.innerHTML = this.createCartSummaryHTML();
            }
        }
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-content">
                    <div>
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">${window.app ? window.app.formatCurrency(item.price) : `$${item.price}`}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-btn" onclick="cartManager.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createCartSummaryHTML() {
        const subtotal = this.getCartTotal();
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        return `
            <h3>Order Summary</h3>
            <div class="cart-summary-row">
                <span>Subtotal (${this.getCartCount()} items)</span>
                <span>${window.app ? window.app.formatCurrency(subtotal) : `$${subtotal.toFixed(2)}`}</span>
            </div>
            <div class="cart-summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : (window.app ? window.app.formatCurrency(shipping) : `$${shipping.toFixed(2)}`)}</span>
            </div>
            <div class="cart-summary-row">
                <span>Tax</span>
                <span>${window.app ? window.app.formatCurrency(tax) : `$${tax.toFixed(2)}`}</span>
            </div>
            <div class="cart-summary-row">
                <span>Total</span>
                <span>${window.app ? window.app.formatCurrency(total) : `$${total.toFixed(2)}`}</span>
            </div>
            <button class="btn btn-primary btn-lg" onclick="cartManager.checkout()" style="width: 100%; margin-top: 1rem;">
                <i class="fas fa-credit-card"></i> Proceed to Checkout
            </button>
        `;
    }

    setupEventListeners() {
        // Quantity change buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quantity-btn')) {
                const btn = e.target.closest('.quantity-btn');
                const cartItem = btn.closest('.cart-item');
                const productId = parseInt(cartItem.dataset.productId);
                const quantityDisplay = cartItem.querySelector('.quantity-display');
                const currentQuantity = parseInt(quantityDisplay.textContent);
                
                if (btn.querySelector('.fa-minus')) {
                    this.updateQuantity(productId, currentQuantity - 1);
                } else if (btn.querySelector('.fa-plus')) {
                    this.updateQuantity(productId, currentQuantity + 1);
                }
            }
        });

        // Remove item buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-btn')) {
                const btn = e.target.closest('.remove-btn');
                const cartItem = btn.closest('.cart-item');
                const productId = parseInt(cartItem.dataset.productId);
                this.removeFromCart(productId);
            }
        });
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getCartCount();
            cartCount.textContent = count;
            
            // Add animation if count changed
            if (count > 0) {
                cartCount.classList.add('pulse');
                setTimeout(() => {
                    cartCount.classList.remove('pulse');
                }, 1000);
            }
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            if (window.app) {
                window.app.showToast('Your cart is empty', 'warning');
            }
            return;
        }

        // Show loading spinner
        if (window.app) {
            window.app.showLoadingSpinner();
        }

        // Simulate checkout process
        setTimeout(() => {
            if (window.app) {
                window.app.hideLoadingSpinner();
                
                // Show success modal
                this.showCheckoutSuccessModal();
            }
        }, 2000);
    }

    showCheckoutSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Order Confirmed!</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 4rem; color: var(--success-color); margin-bottom: 1rem;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3 style="margin-bottom: 1rem;">Thank you for your order!</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                            Your order has been successfully placed. You will receive a confirmation email shortly.
                        </p>
                        <div style="background: var(--secondary-color); padding: 1rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
                            <strong>Order Total:</strong> ${window.app ? window.app.formatCurrency(this.getCartTotal()) : `$${this.getCartTotal().toFixed(2)}`}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Continue Shopping
                    </button>
                    <button class="btn btn-primary" onclick="cartManager.clearCart(); this.closest('.modal-overlay').remove();">
                        View Orders
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Get cart items for external use
    getCartItems() {
        return this.cart;
    }

    // Check if cart is empty
    isEmpty() {
        return this.cart.length === 0;
    }

    // Get item by ID
    getItemById(productId) {
        return this.cart.find(item => item.id === productId);
    }
}

// Global cart manager instance
let cartManager;

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    window.cartManager = cartManager;
});

// Global functions for cart interactions
function addToCart(productId) {
    if (!window.productManager) return;
    
    const product = window.productManager.getProductById(productId);
    if (product && cartManager) {
        cartManager.addToCart(product);
    }
}

function removeFromCart(productId) {
    if (cartManager) {
        cartManager.removeFromCart(productId);
    }
}

function updateQuantity(productId, quantity) {
    if (cartManager) {
        cartManager.updateQuantity(productId, quantity);
    }
}

function clearCart() {
    if (cartManager) {
        cartManager.clearCart();
    }
}

function checkout() {
    if (cartManager) {
        cartManager.checkout();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
} 