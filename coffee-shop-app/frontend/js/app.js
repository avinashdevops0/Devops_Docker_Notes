// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Global variables
let coffeeItems = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.querySelector('.cart-count');
const totalPriceElement = document.getElementById('total-price');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const orderSummaryItems = document.getElementById('order-summary-items');
const orderTotalElement = document.getElementById('order-total');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadCoffeeItems();
    updateCartDisplay();
    setupEventListeners();
});

// Load coffee items from backend
async function loadCoffeeItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/coffee`);
        const data = await response.json();
        
        if (data.success) {
            coffeeItems = data.data;
            displayCoffeeItems(coffeeItems);
        }
    } catch (error) {
        console.error('Error loading coffee items:', error);
        // Fallback to hardcoded data if API fails
        coffeeItems = getFallbackCoffeeItems();
        displayCoffeeItems(coffeeItems);
    }
}

// Fallback data if API is not available
function getFallbackCoffeeItems() {
    return [
        {
            id: 1,
            name: 'Espresso',
            description: 'Strong and concentrated coffee',
            price: 3.50,
            category: 'Hot Coffee',
            image_url: 'images/coffee1.jpg'
        },
        {
            id: 2,
            name: 'Cappuccino',
            description: 'Espresso with steamed milk foam',
            price: 4.25,
            category: 'Hot Coffee',
            image_url: 'images/coffee2.jpg'
        },
        {
            id: 3,
            name: 'Latte',
            description: 'Smooth espresso with steamed milk',
            price: 4.75,
            category: 'Hot Coffee',
            image_url: 'images/coffee3.jpg'
        },
        {
            id: 4,
            name: 'Iced Coffee',
            description: 'Chilled coffee with ice',
            price: 3.75,
            category: 'Cold Coffee',
            image_url: 'images/coffee4.jpg'
        }
    ];
}

// Display coffee items in the menu
function displayCoffeeItems(items) {
    menuContainer.innerHTML = '';
    
    items.forEach(item => {
        const coffeeItem = document.createElement('div');
        coffeeItem.className = 'coffee-item';
        coffeeItem.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" class="coffee-img">
            <div class="coffee-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="coffee-price">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        menuContainer.appendChild(coffeeItem);
    });
}

// Filter menu by category
function filterMenu(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    event.target.classList.add('active');
    
    if (category === 'all') {
        displayCoffeeItems(coffeeItems);
    } else {
        const filteredItems = coffeeItems.filter(item => item.category === category);
        displayCoffeeItems(filteredItems);
    }
}

// Cart functionality
function addToCart(itemId) {
    const item = coffeeItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        saveCart();
        updateCartDisplay();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalPriceElement.textContent = '0.00';
        return;
    }
    
    let cartHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <span class="item-total">$${itemTotal.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Checkout functionality
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Update order summary
    let summaryHTML = '';
    let orderTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        orderTotal += itemTotal;
        
        summaryHTML += `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderSummaryItems.innerHTML = summaryHTML;
    orderTotalElement.textContent = orderTotal.toFixed(2);
    
    // Show modal
    checkoutModal.style.display = 'block';
}

function closeModal() {
    checkoutModal.style.display = 'none';
}

// Handle checkout form submission
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    const orderData = {
        customer_name: name,
        email: email,
        items: cart.map(item => ({
            coffee_id: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Order placed successfully!');
            cart = [];
            saveCart();
            updateCartDisplay();
            closeModal();
            checkoutForm.reset();
        } else {
            alert('Error placing order. Please try again.');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
    }
});

// Setup event listeners
function setupEventListeners() {
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            closeModal();
        }
    });
}

// Utility functions
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4a2c2a;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);