// assets/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // This function runs once the entire HTML document is loaded and ready.
    loadTrendingProducts();
    loadBestSellingProducts();
    updateCartCount();
});

/**
 * Dynamically loads products into the trending products carousel.
 */
function loadTrendingProducts() {
    const container = document.getElementById('trending-product-list');
    if (!container) {
        console.error('Trending product container not found!');
        return;
    }

    container.innerHTML = ''; 
    
    const trendingProducts = products.filter(p => p.isTrending === 'y');

    trendingProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = "col-lg-3"; 
        
        productDiv.innerHTML = `
            <div class="product-style2 version2">
                <div class="product-action">
                    <button class="product-action__btn"><i class="fal fa-heart"></i></button>
                    <button class="product-action__btn"><i class="fal fa-eye"></i></button>
                </div>
                <div class="product-img">
                    <img class="img" src="${product.image}" alt="${product.name}">
                </div>
                <h3 class="product-title">
                    <a href="#">${product.name}</a>
                </h3>
                <span class="product-price">
                    <span class="product-price__number">₹${product.price.toFixed(2)}</span>
                    <a href="#" class="product-cart" onclick="event.preventDefault(); addToCart(${product.id})">add to cart</a>
                </span>
            </div>
        `;
        container.appendChild(productDiv);
    });

    if (jQuery().slick) {
        $('.product-carousel2').slick('refresh');
    }
}

/**
 * Dynamically loads products into the best selling tabs.
 */
function loadBestSellingProducts() {
    const classicContainer = document.getElementById('bestselling-classic');
    const modernContainer = document.getElementById('bestselling-modern');

    if (!classicContainer || !modernContainer) {
        console.error('Best selling product containers not found!');
        return;
    }

    classicContainer.innerHTML = '';
    modernContainer.innerHTML = '';

    const bestSellingProducts = products.filter(p => p.isBestSelling === 'y');

    bestSellingProducts.forEach(product => {
        const productHTML = `
            <div class="col-lg-3 col-md-6 wow animate__fadeInUp" data-wow-delay="0.2s">
                <div class="product-style2 version2">
                    <div class="product-action">
                        <button class="product-action__btn"><i class="fal fa-heart"></i></button>
                        <button class="product-action__btn"><i class="fal fa-eye"></i></button>
                    </div>
                    <div class="product-img">
                        <img class="img" src="${product.image}" alt="${product.name}">
                    </div>
                    <h3 class="product-title">
                        <a href="#">${product.name}</a>
                    </h3>
                    <span class="product-price">
                        <span class="product-price__number">₹${product.price.toFixed(2)}</span>
                        <a class="product-cart" href="#" onclick="event.preventDefault(); addToCart(${product.id})">add to cart</a>
                    </span>
                </div>
            </div>
        `;

        if (product.type === 'CLASSIC') {
            classicContainer.innerHTML += productHTML;
        } else if (product.type === 'Modern') {
            modernContainer.innerHTML += productHTML;
        }
    });
}


// assets/js/app.js
// --- Shopping Cart Functions (Cookie-Based) ---

function getCart() {
    const cartCookie = document.cookie.split('; ').find(row => row.startsWith('cart='));
    if (cartCookie) {
        try {
            return JSON.parse(decodeURIComponent(cartCookie.split('=')[1]));
        } catch (e) {
            console.error("Error parsing cart cookie:", e);
            return [];
        }
    }
    return [];
}

function saveCart(cart) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; expires=${expires}; path=/`;
}

function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    saveCart(cart);
    updateCartCount();
    alert(`${product.name} has been added to your cart!`);
}

function removeFromCart(productId) {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        saveCart(cart);
        updateCartCount();
        openCartModal(); // Refresh the modal to reflect updated cart
        alert(`Item removed from cart!`);
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

// --- Cart Modal Functions ---

function openCartModal() {
    const modal = document.getElementById("cart-modal");
    const modalCartItems = document.getElementById("modal-cart-items");
    const modalCartTotal = document.getElementById("modal-cart-total");
    
    const cart = getCart();
    modalCartItems.innerHTML = "";

    if (cart.length === 0) {
        modalCartItems.innerHTML = "<p>Your cart is empty.</p>";
        modalCartTotal.innerHTML = "";
    } else {
        let total = 0;
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.padding = '10px 0';
            li.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            li.innerHTML = `
                <span>${index + 1}. ${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart(${item.id})" style="background: red; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer; font-size: 12px;">Remove</button>
            `;
            ul.appendChild(li);
            total += item.price * item.quantity;
        });
        modalCartItems.appendChild(ul);
        modalCartTotal.innerHTML = `<strong>Total: ₹${total.toFixed(2)}</strong>`;
    }

    modal.style.display = "flex";
}

function closeCartModal() {
    document.getElementById("cart-modal").style.display = "none";
}

function sendToWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Hello! I'd like to place the following order:%0A%0A";
    let total = 0;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}%0A`;
        total += item.price * item.quantity;
    });
    message += `%0A*Total: ₹${total.toFixed(2)}*`;

    const phone = "9425545594";
    const whatsappURL = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappURL, "_blank");
}

window.onclick = function(event) {
    const modal = document.getElementById("cart-modal");
    if (event.target == modal) {
        closeCartModal();
    }
}