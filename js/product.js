// Sample product data (same structure as shop)
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
  
  // Helper: Get product ID from URL
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  
  const product = laptops.find(p => p.id === productId);
  
  if (product) {
    document.getElementById("productImage").src = product.image;
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productCondition").textContent = `Condition: ${product.condition}`;
    document.getElementById("productSpecs").textContent = product.specs;
    document.getElementById("productPrice").textContent = `ZMW ${product.price.toLocaleString()}`;
  
    // Calculate estimated delivery dates
    const today = new Date();
    const minDate = new Date(today);
    const maxDate = new Date(today);
    minDate.setDate(today.getDate() + product.deliveryMinDays);
    maxDate.setDate(today.getDate() + product.deliveryMaxDays);
  
    const options = { month: "short", day: "numeric" };
    const deliveryText = `Expected delivery: between ${minDate.toLocaleDateString("en-US", options)} and ${maxDate.toLocaleDateString("en-US", options)}`;
    document.getElementById("productDelivery").textContent = deliveryText;
  
    // Proceed button
    document.getElementById("orderButton").addEventListener("click", () => {
      window.location.href = `order.html?id=${product.id}`;
    });
  } else {
    document.querySelector(".product-container").innerHTML = "<p>Product not found.</p>";
  }
  