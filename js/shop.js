
// Load products from localStorage or use default
let laptops = JSON.parse(localStorage.getItem('pulseProducts'));

// If no products in storage, initialize with defaults
if (!laptops || laptops.length === 0) {
  laptops = [
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
    },
    {
      id: 3,
      name: "Asus Gaming Laptop",
      price: 27000,
      condition: "New",
      image: "images/Asus.jpg",
      specs: "AMD Ryzen 7 • 16GB RAM • 512GB SSD",
      deliveryMinDays: 9,
      deliveryMaxDays: 14
    },
    {
      id: 4,
      name: "Dell Alienware",
      price: 35000,
      condition: "Refurbished",
      image: "images/Alienware.jpg",
      specs: "Intel i9 • 32GB RAM • 1TB SSD",
      deliveryMinDays: 14,
      deliveryMaxDays: 20
    }
  ];
  localStorage.setItem('pulseProducts', JSON.stringify(laptops));
  localStorage.setItem('pulseNextId', '5');
}

const grid = document.getElementById("productGrid");

// Render products
function renderProducts(filter = "All") {
  grid.innerHTML = "";
  
  // Reload from localStorage to get latest data
  const currentProducts = JSON.parse(localStorage.getItem('pulseProducts')) || laptops;
  
  currentProducts.forEach((laptop) => {
    if (filter === "All" || laptop.condition === filter) {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.setAttribute("data-condition", laptop.condition);
      card.innerHTML = `
        <img src="${laptop.image}" alt="${laptop.name}">
        <h2>${laptop.name}</h2>
        <p class="price">ZMW ${laptop.price.toLocaleString()}</p>
        <p class="condition">${laptop.condition}</p>
        <button onclick="viewProduct(${laptop.id})">View Details</button>
      `;
      grid.appendChild(card);
    }
  });
}

// View product details
function viewProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

// Filter buttons
const filterButtons = document.querySelectorAll(".filter-buttons button");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.getAttribute("data-filter"));
  });
});

// Initial render
renderProducts();
