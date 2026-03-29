// Payment configuration - Will be loaded from localStorage
const yourWhatsAppNumber = "260773082934"; // ← CHANGE TO YOUR ACTUAL NUMBER

// Load product from localStorage
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const laptops = JSON.parse(localStorage.getItem('pulseProducts')) || [];
const product = laptops.find(p => p.id === productId);

// DOM Elements
const orderForm = document.getElementById("orderForm");
const thankYouMessage = document.getElementById("thankYouMessage");
const paymentInstructions = document.getElementById("paymentInstructions");
const submitBtn = document.getElementById("submitBtn");

// Load payment configuration
function loadPaymentConfig() {
    const saved = localStorage.getItem('pulsePaymentConfig');
    if (saved) {
        return JSON.parse(saved);
    }
    // Default config
    return {
        mtn: { 
            enabled: true, 
            number: "0961451908", 
            name: "MTN Mobile Money",
            accountName: "Pulse Technologies",
            instructions: "Include your name as reference when sending payment"
        },
        airtel: { 
            enabled: true, 
            number: "0773082934", 
            name: "Airtel Money",
            accountName: "Pulse Technologies",
            instructions: "Include your name as reference when sending payment"
        },
        card: { 
            enabled: false, 
            name: "Card Payment",
            instructions: "Secure card payments - coming soon!"
        }
    };
}

// Render payment options based on configuration
function renderPaymentOptions() {
    const config = loadPaymentConfig();
    const container = document.querySelector('.payment-options');
    
    container.innerHTML = Object.keys(config).map(method => {
        const isEnabled = config[method].enabled;
        return `
            <label class="payment-option ${isEnabled ? '' : 'disabled'}">
                <input type="radio" name="paymentMethod" value="${method}" 
                       ${isEnabled ? '' : 'disabled'}>
                <div class="payment-card">
                    <span class="payment-icon">${method === 'card' ? '💳' : '📱'}</span>
                    <span class="payment-text">
                        ${config[method].name}
                        ${!isEnabled ? '<span class="coming-soon-badge">Coming Soon</span>' : ''}
                    </span>
                </div>
            </label>
        `;
    }).join('');

    // Re-attach event listeners
    attachPaymentMethodListeners();
}

// Updated payment method selection handler
function attachPaymentMethodListeners() {
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.disabled) return;
            
            // Hide all instructions first
            document.querySelectorAll('.instruction').forEach(instruction => {
                instruction.classList.add('hidden');
            });
            
            const method = this.value;
            paymentInstructions.classList.remove('hidden');
            document.getElementById(`${method}Instructions`).classList.remove('hidden');
            
            // Update button text
            submitBtn.textContent = 'Proceed to WhatsApp';
            submitBtn.disabled = false;
        });
    });
}

// Update payment instructions in HTML
function updatePaymentInstructions() {
    const config = loadPaymentConfig();
    
    // Update MTN instructions
    const mtnInstructions = document.getElementById('mtnInstructions');
    if (mtnInstructions) {
        mtnInstructions.innerHTML = `
            <p><strong>Send payment to MTN Number:</strong> ${config.mtn.number}</p>
            <p><strong>Account Name:</strong> ${config.mtn.accountName}</p>
            <p>${config.mtn.instructions}</p>
        `;
    }
    
    // Update Airtel instructions  
    const airtelInstructions = document.getElementById('airtelInstructions');
    if (airtelInstructions) {
        airtelInstructions.innerHTML = `
            <p><strong>Send payment to Airtel Number:</strong> ${config.airtel.number}</p>
            <p><strong>Account Name:</strong> ${config.airtel.accountName}</p>
            <p>${config.airtel.instructions}</p>
        `;
    }
    
    // Update Card instructions
    const cardInstructions = document.getElementById('cardInstructions');
    if (cardInstructions) {
        cardInstructions.innerHTML = `
            <p><strong>Card Payments</strong></p>
            <p>${config.card.enabled ? 
                'Secure card payments are now available!' : 
                'Card payments are temporarily unavailable. Please use Mobile Money options.'}</p>
            <p>We apologize for any inconvenience.</p>
        `;
    }
}

// Initialize payment system when page loads
function initializeOrderPage() {
    if (product) {
        document.getElementById("orderImage").src = product.image;
        document.getElementById("orderName").textContent = product.name;
        document.getElementById("orderCondition").textContent = `Condition: ${product.condition}`;
        document.getElementById("orderPrice").textContent = `ZMW ${product.price.toLocaleString()}`;
        document.getElementById("productId").value = product.id;
        
        renderPaymentOptions();
        updatePaymentInstructions();
        
        // Initialize - disable submit until payment method selected
        submitBtn.disabled = true;
    } else {
        document.querySelector(".order-container").innerHTML = "<p>Product not found.</p>";
    }
}

// Form submission with WhatsApp integration
orderForm.addEventListener("submit", e => {
    e.preventDefault();
    
    const formData = new FormData(orderForm);
    const paymentMethod = formData.get('paymentMethod');
    const config = loadPaymentConfig();
    
    if (!product) {
        alert("Product not found!");
        return;
    }

    if (!paymentMethod) {
        alert("Please select a payment method!");
        return;
    }

    if (!config[paymentMethod].enabled) {
        alert("This payment method is currently unavailable. Please select another option.");
        return;
    }

    // Create comprehensive WhatsApp message
    const message = `🛒 NEW ORDER - Pulse Laptops%0A%0A` +
        `📦 *PRODUCT DETAILS*%0A` +
        `• Product: ${product.name}%0A` +
        `• Price: ZMW ${product.price.toLocaleString()}%0A` +
        `• Condition: ${product.condition}%0A%0A` +
        `👤 *CUSTOMER INFORMATION*%0A` +
        `• Name: ${formData.get('name')}%0A` +
        `• Email: ${formData.get('email')}%0A` +
        `• Phone: ${formData.get('phone')}%0A` +
        `• Address: ${formData.get('address')}%0A%0A` +
        `💳 *PAYMENT METHOD*%0A` +
        `• Selected: ${paymentMethod.toUpperCase()}%0A` +
        `• Instructions: ${config[paymentMethod].instructions}%0A` +
        `${paymentMethod !== 'card' ? `• Send to: ${config[paymentMethod].number}%0A` : ''}%0A` +
        `📄 *NEXT STEPS*%0A` +
        `1. ${paymentMethod === 'card' ? 'Await payment confirmation' : 'Send payment proof via WhatsApp'}%0A` +
        `2. We'll confirm your order%0A` +
        `3. Arrange delivery%0A%0A` +
        `🕒 Order Time: ${new Date().toLocaleString()}`;

    // Show success message
    orderForm.classList.add("hidden");
    thankYouMessage.classList.remove("hidden");

    // Save order to history
    saveOrderToHistory(formData, product, paymentMethod);

    // Redirect to WhatsApp after short delay
    setTimeout(() => {
        window.open(`https://wa.me/${yourWhatsAppNumber}?text=${message}`, '_blank');
        
        // Optional: Redirect back to shop after WhatsApp opens
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 3000);
    }, 2000);
});

// Save order to localStorage
function saveOrderToHistory(formData, product, paymentMethod) {
    const orders = JSON.parse(localStorage.getItem('pulseOrders')) || [];
    const newOrder = {
        id: Date.now(),
        product: product.name,
        price: product.price,
        customer: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        paymentMethod: paymentMethod,
        date: new Date().toLocaleString(),
        status: 'pending'
    };
    
    orders.push(newOrder);
    localStorage.setItem('pulseOrders', JSON.stringify(orders));
}

// Initialize the order page
document.addEventListener('DOMContentLoaded', initializeOrderPage);