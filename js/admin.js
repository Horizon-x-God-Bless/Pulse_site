// Admin product management system
let products = JSON.parse(localStorage.getItem('pulseProducts')) || [];
let nextId = parseInt(localStorage.getItem('pulseNextId')) || 1;

// Payment Methods Configuration
const paymentMethodsConfig = {
    mtn: {
        name: "MTN Mobile Money",
        enabled: true,
        number: "0967 123 456",
        accountName: "Pulse Technologies",
        instructions: "Include your name as reference when sending payment"
    },
    airtel: {
        name: "Airtel Money", 
        enabled: true,
        number: "0977 654 321",
        accountName: "Pulse Technologies", 
        instructions: "Include your name as reference when sending payment"
    },
    card: {
        name: "Card Payment",
        enabled: false, // Start disabled
        instructions: "Secure card payments - coming soon!"
    }
};

// Initialize with sample data if empty
if (products.length === 0) {
    products = [
        {
            id: 1,
            name: "Lenovo Legion 5",
            price: 25000,
            condition: "New",
            image: "images/Legion.jpg",
            specs: "Intel i7 • 16GB RAM • 512GB SSD",
            deliveryMinDays: 10,
            deliveryMaxDays: 15
        },
        {
            id: 2,
            name: "HP Envy",
            price: 22500,
            condition: "Refurbished",
            image: "images/Envy.jpg",
            specs: "Intel i5 • 8GB RAM • 256GB SSD",
            deliveryMinDays: 12,
            deliveryMaxDays: 18
        }
    ];
    nextId = 3;
    saveProducts();
}

// Initialize payment config if not exists
if (!localStorage.getItem('pulsePaymentConfig')) {
    localStorage.setItem('pulsePaymentConfig', JSON.stringify(paymentMethodsConfig));
}

function saveProducts() {
    localStorage.setItem('pulseProducts', JSON.stringify(products));
    localStorage.setItem('pulseNextId', nextId.toString());
    updateStats();
}

function updateStats() {
    const orders = JSON.parse(localStorage.getItem('pulseOrders')) || [];
    document.getElementById('productsCount').textContent = products.length;
    document.getElementById('ordersCount').textContent = orders.length;
}

// Render admin products
function renderAdminProducts() {
    const grid = document.getElementById('adminProductGrid');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #ccc; grid-column: 1/-1;">No products found. Add your first laptop above.</p>';
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200/111/0ef?text=No+Image'">
            <h2>${product.name}</h2>
            <p class="price">ZMW ${product.price.toLocaleString()}</p>
            <p class="condition">${product.condition}</p>
            <p style="color: #ccc; font-size: 0.9em; margin: 10px 0;">${product.specs}</p>
            <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete Product</button>
        `;
        grid.appendChild(card);
    });
}

// Add new product
document.getElementById('addProductForm').addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newProduct = {
        id: nextId++,
        name: formData.get('name'),
        price: parseInt(formData.get('price')),
        condition: formData.get('condition'),
        image: formData.get('image'),
        specs: formData.get('specs'),
        deliveryMinDays: parseInt(formData.get('deliveryMinDays')) || 10,
        deliveryMaxDays: parseInt(formData.get('deliveryMaxDays')) || 15
    };
    
    products.push(newProduct);
    saveProducts();
    renderAdminProducts();
    e.target.reset();
    
    alert('✅ Product added successfully!');
});

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderAdminProducts();
        alert('🗑️ Product deleted successfully!');
    }
}

// Payment Management Functions
function loadPaymentConfig() {
    const saved = localStorage.getItem('pulsePaymentConfig');
    if (saved) {
        return JSON.parse(saved);
    }
    return paymentMethodsConfig;
}

function savePaymentConfig(config) {
    localStorage.setItem('pulsePaymentConfig', JSON.stringify(config));
}

function renderPaymentMethods() {
    const config = loadPaymentConfig();
    const container = document.getElementById('paymentMethodsList');
    
    container.innerHTML = Object.keys(config).map(method => `
        <div class="payment-method-item">
            <div class="method-info">
                <strong>${config[method].name}</strong>
                <span class="status ${config[method].enabled ? 'enabled' : 'disabled'}">
                    ${config[method].enabled ? '✅ Enabled' : '❌ Disabled'}
                </span>
            </div>
            <div class="method-actions">
                <button onclick="togglePaymentMethod('${method}', true)" 
                        class="btn ${config[method].enabled ? 'active' : ''}">
                    Enable
                </button>
                <button onclick="togglePaymentMethod('${method}', false)" 
                        class="btn delete-btn ${!config[method].enabled ? 'active' : ''}">
                    Disable
                </button>
            </div>
            ${method !== 'card' ? `
            <div class="method-details">
                <input type="text" value="${config[method].number}" 
                       onchange="updatePaymentNumber('${method}', this.value)"
                       placeholder="Phone Number">
                <input type="text" value="${config[method].accountName}" 
                       onchange="updateAccountName('${method}', this.value)"
                       placeholder="Account Name">
            </div>
            ` : ''}
        </div>
    `).join('');
}

function togglePaymentMethod(method, enabled) {
    const config = loadPaymentConfig();
    config[method].enabled = enabled;
    savePaymentConfig(config);
    renderPaymentMethods();
    alert(`✅ ${config[method].name} ${enabled ? 'enabled' : 'disabled'}!`);
}

function updatePaymentNumber(method, number) {
    const config = loadPaymentConfig();
    config[method].number = number;
    savePaymentConfig(config);
}

function updateAccountName(method, name) {
    const config = loadPaymentConfig();
    config[method].accountName = name;
    savePaymentConfig(config);
}

// Initialize admin panel
renderAdminProducts();
updateStats();
renderPaymentMethods();

// Export function for other pages
window.getProducts = function() {
    return products;
};


// Add to admin.js
const ADMIN_PASSWORD = "pulse2024"; // Change this!

function checkAdminAuth() {
    const savedAuth = localStorage.getItem('pulseAdminAuth');
    if (!savedAuth || savedAuth !== ADMIN_PASSWORD) {
        const password = prompt("🔒 Enter Admin Password:");
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('pulseAdminAuth', ADMIN_PASSWORD);
        } else {
            alert("❌ Access Denied");
            window.location.href = 'index.html';
            return false;
        }
    }
    return true;
}

// Call this at the start of admin.js
if (!checkAdminAuth()) {
    // Stop execution if not authenticated
    throw new Error("Authentication failed");
}