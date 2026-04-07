// Hardcoded product list (same as shop.js)
const laptops = [
  { id: 1, name: "Lenovo Legion 5", price: 25000, condition: "New", image: "images/Legion.jpg", specs: "Intel i7 • 16GB RAM • 512GB SSD", deliveryMinDays: 10, deliveryMaxDays: 15 },
  { id: 2, name: "HP Envy", price: 22500, condition: "Refurbished", image: "images/Envy.jpg", specs: "Intel i5 • 8GB RAM • 256GB SSD", deliveryMinDays: 12, deliveryMaxDays: 18 },
  { id: 3, name: "Asus Gaming Laptop", price: 27000, condition: "New", image: "images/Asus.jpg", specs: "AMD Ryzen 7 • 16GB RAM • 512GB SSD", deliveryMinDays: 9, deliveryMaxDays: 14 },
  { id: 4, name: "Dell Alienware", price: 35000, condition: "Refurbished", image: "images/Alienware.jpg", specs: "Intel i9 • 32GB RAM • 1TB SSD", deliveryMinDays: 14, deliveryMaxDays: 20 }
];

const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const product = laptops.find(p => p.id === productId);

if (product) {
  const img = document.getElementById("productImage");
  img.src = product.image;
  img.onerror = () => { img.src = 'https://via.placeholder.com/400x300/111/0ef?text=No+Image'; };
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productCondition").textContent = `Condition: ${product.condition}`;
  document.getElementById("productSpecs").textContent = product.specs;
  document.getElementById("productPrice").textContent = `ZMW ${product.price.toLocaleString()}`;

  const today = new Date();
  const minDate = new Date(today);
  const maxDate = new Date(today);
  minDate.setDate(today.getDate() + product.deliveryMinDays);
  maxDate.setDate(today.getDate() + product.deliveryMaxDays);
  const options = { month: "short", day: "numeric" };
  document.getElementById("productDelivery").textContent = `Expected delivery: between ${minDate.toLocaleDateString("en-US", options)} and ${maxDate.toLocaleDateString("en-US", options)}`;

  document.getElementById("orderButton").addEventListener("click", () => {
      window.location.href = `order.html?id=${product.id}`;
  });
} else {
  document.querySelector(".product-container").innerHTML = `<p style="text-align:center;">Product not found. <a href="shop.html">Back to Shop</a></p>`;
}