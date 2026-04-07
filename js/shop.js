// Hardcoded product list for v1 (same for all users)
const laptops = [
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

const grid = document.getElementById("productGrid");

function renderProducts(filter = "All") {
  grid.innerHTML = "";
  laptops.forEach(laptop => {
      if (filter === "All" || laptop.condition === filter) {
          const card = document.createElement("div");
          card.classList.add("product-card");
          card.innerHTML = `
              <img src="${laptop.image}" alt="${laptop.name}" onerror="this.src='https://via.placeholder.com/300x200/111/0ef?text=No+Image'">
              <h2>${laptop.name}</h2>
              <p class="price">ZMW ${laptop.price.toLocaleString()}</p>
              <p class="condition">${laptop.condition}</p>
              <button onclick="viewProduct(${laptop.id})">See Specs →</button>
          `;
          grid.appendChild(card);
      }
  });
}

function viewProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

// Filter buttons
document.querySelectorAll(".filter-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-buttons button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts(btn.getAttribute("data-filter"));
  });
});

renderProducts();