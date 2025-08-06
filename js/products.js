// Products data and functionality
class ProductManager {
    constructor() {
        this.products = this.getProductsData();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadFeaturedProducts();
        this.setupFilterListeners();
    }

    getProductsData() {
        return [
            {
                id: 1,
                name: "iPhone 15 Pro",
                category: "electronics",
                price: 999.99,
                image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
                description: "Latest iPhone with advanced camera system and A17 Pro chip.",
                featured: true,
                badge: "New"
            },
            {
                id: 2,
                name: "MacBook Air M2",
                category: "electronics",
                price: 1199.99,
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
                description: "Ultra-thin laptop with M2 chip for incredible performance.",
                featured: true,
                badge: "Popular"
            },
            {
                id: 3,
                name: "Nike Air Max 270",
                category: "fashion",
                price: 150.00,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
                description: "Comfortable running shoes with Air Max technology.",
                featured: true,
                badge: "Sale"
            },
            {
                id: 4,
                name: "Levi's 501 Jeans",
                category: "fashion",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
                description: "Classic straight-leg jeans with perfect fit.",
                featured: false
            },
            {
                id: 5,
                name: "Samsung 4K Smart TV",
                category: "electronics",
                price: 799.99,
                image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
                description: "55-inch 4K Ultra HD Smart TV with Crystal Display.",
                featured: false
            },
            {
                id: 6,
                name: "Yoga Mat Premium",
                category: "sports",
                price: 45.00,
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
                description: "Non-slip yoga mat perfect for home workouts.",
                featured: true,
                badge: "Best Seller"
            },
            {
                id: 7,
                name: "Coffee Maker Deluxe",
                category: "home",
                price: 129.99,
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
                description: "Programmable coffee maker with thermal carafe.",
                featured: false
            },
            {
                id: 8,
                name: "Wireless Headphones",
                category: "electronics",
                price: 199.99,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                description: "Noise-cancelling wireless headphones with premium sound.",
                featured: true,
                badge: "Top Rated"
            },
            {
                id: 9,
                name: "Running Shorts",
                category: "sports",
                price: 35.00,
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                description: "Lightweight running shorts with built-in liner.",
                featured: false
            },
            {
                id: 10,
                name: "Throw Pillow Set",
                category: "home",
                price: 59.99,
                image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
                description: "Decorative throw pillows for your living room.",
                featured: false
            },
            {
                id: 11,
                name: "Gaming Mouse",
                category: "electronics",
                price: 79.99,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
                description: "High-precision gaming mouse with RGB lighting.",
                featured: false
            },
            {
                id: 12,
                name: "Dumbbell Set",
                category: "sports",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                description: "Adjustable dumbbell set for home workouts.",
                featured: true,
                badge: "Limited"
            }
        ];
    }

    loadFeaturedProducts() {
        const featuredContainer = document.getElementById('featured-products');
        if (featuredContainer) {
            const featuredProducts = this.products.filter(product => product.featured);
            this.renderProducts(featuredProducts, featuredContainer);
        }
    }

    renderProducts(products, container) {
        if (!container) return;

        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
        
        // Add stagger animation
        if (window.app) {
            window.app.addStaggerAnimation(container, '.product-card');
        }
    }

    createProductCard(product) {
        const badge = product.badge ? `<div class="product-card-badge">${product.badge}</div>` : '';
        
        return `
            <div class="product-card hover-lift" data-product-id="${product.id}">
                <div class="product-card-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${badge}
                </div>
                <div class="product-card-content">
                    <div class="product-card-category">${this.capitalizeFirst(product.category)}</div>
                    <h3 class="product-card-title">${product.name}</h3>
                    <div class="product-card-price">${window.app ? window.app.formatCurrency(product.price) : `$${product.price}`}</div>
                    <div class="product-card-actions">
                        <button class="btn btn-outline btn-sm" onclick="viewProduct(${product.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    filterByCategory(category) {
        this.currentFilter = category;
        
        const productsContainer = document.querySelector('.products-grid');
        if (!productsContainer) return;

        let filteredProducts;
        if (category === 'all') {
            filteredProducts = this.products;
        } else {
            filteredProducts = this.products.filter(product => product.category === category);
        }

        this.renderProducts(filteredProducts, productsContainer);
        this.updateFilterUI(category);
        
        // Show toast notification
        if (window.app) {
            const categoryName = category === 'all' ? 'All Products' : this.capitalizeFirst(category);
            window.app.showToast(`Showing ${categoryName}`, 'info');
        }
    }

    updateFilterUI(activeCategory) {
        const filterOptions = document.querySelectorAll('.filter-option');
        filterOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.category === activeCategory) {
                option.classList.add('active');
            }
        });
    }

    setupFilterListeners() {
        const filterOptions = document.querySelectorAll('.filter-option');
        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                const category = option.dataset.category;
                this.filterByCategory(category);
            });
        });
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }
}

// Global functions for product interactions
function viewProduct(productId) {
    // Navigate to product detail page
    window.location.href = `product-detail.html?id=${productId}`;
}

function addToCart(productId) {
    const productManager = window.productManager;
    const product = productManager.getProductById(productId);
    
    if (!product) {
        if (window.app) {
            window.app.showToast('Product not found', 'error');
        }
        return;
    }

    // Get current cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    if (window.app) {
        window.app.updateCartCount();
        window.app.showToast(`${product.name} added to cart!`, 'success');
    }
}

function filterByCategory(category) {
    if (window.productManager) {
        window.productManager.filterByCategory(category);
    }
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
    
    // Check for category filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category && window.productManager) {
        window.productManager.filterByCategory(category);
    }
});

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            const productsContainer = document.querySelector('.products-grid');
            
            if (!productsContainer || !window.productManager) return;
            
            if (query.length === 0) {
                // Show all products
                window.productManager.filterByCategory('all');
            } else {
                // Show search results
                const searchResults = window.productManager.searchProducts(query);
                window.productManager.renderProducts(searchResults, productsContainer);
                
                if (window.app) {
                    window.app.showToast(`Found ${searchResults.length} products`, 'info');
                }
            }
        });
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', setupSearch);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
} 