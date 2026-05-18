// ==========================================
// 🌟 0. Local Storage Cart Helpers 🌟
// ==========================================
const getCart = () => JSON.parse(localStorage.getItem('nwarMaGyiCart')) || [];
const saveCart = (cart) => localStorage.setItem('nwarMaGyiCart', JSON.stringify(cart));

// Cart အရေအတွက်ကို Header Icon တွင် ပြပေးမည့် Function
const updateCartBadge = () => {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const cart = getCart();
        // Cart ထဲရှိ မုန့်အရေအတွက် စုစုပေါင်းကို တွက်မည်
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        
        if (totalQty > 0) {
            badge.textContent = totalQty;
            badge.style.display = 'flex'; // အရေအတွက်ရှိလျှင် ပြမည်
        } else {
            badge.style.display = 'none'; // မရှိလျှင် ဖျောက်ထားမည်
        }
    }
};

// ==========================================
// 1. Hero Auto Slider Logic
// ==========================================
const sliderTrack = document.getElementById('sliderTrack');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
const totalSlides = slides.length;

if (sliderTrack && totalSlides > 0) {
    function moveToNextSlide() {
        currentIndex++;
        if (currentIndex >= totalSlides) {
            currentIndex = 0;
        }
        const transformValue = `translateX(-${currentIndex * 100}%)`;
        sliderTrack.style.transform = transformValue;
    }
    setInterval(moveToNextSlide, 3500);
}

// ==========================================
// 2. Bottom Navigation Active State Logic
// ==========================================
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// ==========================================
// 3. Dynamic Data Arrays
// ==========================================
const galleryImages = [
    "/images/Strawberry Cheesecake.jpg",
    "/images/Chocolate Strawberry Cake.webp",
    "/images/Strawberry Cheesecake.jpg",
    "/images/Chocolate Strawberry Cake.webp" 
];
const categories = ["Cakes", "Bread", "Cookies", "Drinks", "Snacks"];

const productSections = [
    {
        title: "Cakes",
        items: [
            { name: "Strawberry Cake", price: "15,000 Ks", image: "/images/Strawberry Cheesecake.jpg" },
            { name: "Chocolate Cake", price: "18,000 Ks", image: "/images/Chocolate Strawberry Cake.webp" },
            { name: "Vanilla Cake", price: "12,000 Ks", image: "/images/Strawberry Cheesecake.jpg"  }
        ]
    },
    {
        title: "Fresh Breads",
        items: [
            { name: "Milk Bread", price: "3,500 Ks", image: "/images/Strawberry Cheesecake.jpg"  },
            { name: "Croissant", price: "2,000 Ks", image: "/images/Strawberry Cheesecake.jpg"  },
            { name: "Garlic Bread", price: "2,500 Ks", image: "/images/Strawberry Cheesecake.jpg"  }
        ]
    }
];

// ==========================================
// 4. Render Functions (Home & Customize Page)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Page စတက်သည်နှင့် Cart Badge ကို Update လုပ်မည်
    updateCartBadge();

    // --- Render Inspiration Gallery ---
    const galleryContainer = document.getElementById('inspirationGallery');
    if (galleryContainer) {
        const renderGallery = () => {
            galleryImages.forEach(imgSrc => {
                const card = document.createElement('div');
                card.className = 'gallery-card';
                card.innerHTML = `<img src="${imgSrc}" alt="Cake inspiration" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">`;
                galleryContainer.appendChild(card);
            });
        };

        renderGallery();
        renderGallery();

        let isPaused = false;
        let scrollSpeed = 1; 

        setTimeout(() => {
            galleryContainer.scrollLeft = galleryContainer.scrollWidth / 2;
        }, 100);

        const startAutoScroll = () => {
            if (!isPaused) {
                galleryContainer.scrollLeft -= scrollSpeed; 
                if (galleryContainer.scrollLeft <= 0) {
                    galleryContainer.scrollLeft = galleryContainer.scrollWidth / 2;
                }
            }
            requestAnimationFrame(startAutoScroll); 
        };

        startAutoScroll();

        galleryContainer.addEventListener('mouseenter', () => isPaused = true);
        galleryContainer.addEventListener('mouseleave', () => isPaused = false);
        galleryContainer.addEventListener('touchstart', () => isPaused = true, {passive: true});
        galleryContainer.addEventListener('touchend', () => isPaused = false);
    }

    // --- Render Categories ---
    const categoryMenuContainer = document.getElementById('categoryMenu');
    if (categoryMenuContainer) {
        categories.forEach((cat, index) => {
            const btn = document.createElement('button');
            btn.className = `category-btn ${index === 0 ? 'active' : ''}`;
            btn.textContent = cat;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            categoryMenuContainer.appendChild(btn);
        });
    }

    // --- Render Products ---
    const productsContainer = document.getElementById('dynamicProductSections');
    if (productsContainer) {
        productSections.forEach(section => {
            const sectionEl = document.createElement('section');
            sectionEl.className = 'product-section';
            
            const headerEl = document.createElement('div');
            headerEl.className = 'section-header';
            headerEl.innerHTML = `
                <h2 class="section-title">${section.title}</h2>
                <a href="#" class="see-more">See All</a>
            `;
            sectionEl.appendChild(headerEl);

            const scrollEl = document.createElement('div');
            scrollEl.className = 'product-scroll';

            section.items.forEach(product => {
                const cardEl = document.createElement('div');
                cardEl.className = 'product-card';
                cardEl.innerHTML = `
                    <div class="product-img-wrapper">
                        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                        <button class="circular-add-btn"><i class="bi bi-plus ico"></i></button>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.price}</p>
                    </div>
                `;
                
                // 🌟 Add to Cart Logic 🌟
                const addBtn = cardEl.querySelector('.circular-add-btn');
                addBtn.addEventListener('click', () => {
                    let cart = getCart();
                    
                    const priceNum = parseInt(product.price.replace(/,/g, '').replace(' Ks', ''));
                    let existingItem = cart.find(item => item.name === product.name);
                    
                    if (existingItem) {
                        existingItem.qty += 1; 
                    } else {
                        // 🌟 push() အစား unshift() သုံး၍ အသစ်ထည့်သည်များကို အပေါ်ဆုံးသို့ ရောက်စေသည် 🌟
                        cart.unshift({
                            id: Date.now(),
                            name: product.name,
                            price: priceNum,
                            qty: 1,
                            img: product.image
                        });
                    }
                    
                    saveCart(cart); 
                    updateCartBadge(); // 🌟 Badge အရေအတွက်ကို Update လုပ်မည် 🌟

                    const originalHTML = addBtn.innerHTML;
                    addBtn.innerHTML = '✔';
                    addBtn.style.backgroundColor = '#10b981'; 
                    setTimeout(() => {
                        addBtn.innerHTML = originalHTML;
                        addBtn.style.backgroundColor = 'var(--primary-color)';
                    }, 800);
                });

                scrollEl.appendChild(cardEl);
            });

            sectionEl.appendChild(scrollEl);
            productsContainer.appendChild(sectionEl);
        });
    }
});

// ==========================================
// 5. Cart Page Logic (With Local Storage)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('emptyCartState');
    const bottomCard = document.getElementById('bottomCheckoutCard');

    if (cartContainer) {
        
        let deliveryFee = 5000;

        const renderCart = () => {
            let cartItems = getCart();
            cartContainer.innerHTML = ''; 

            if (cartItems.length === 0) {
                cartContainer.style.display = 'none';
                bottomCard.style.display = 'none'; 
                emptyState.style.display = 'flex'; 
                return; 
            }

            cartContainer.style.display = 'flex';
            bottomCard.style.display = 'block';
            emptyState.style.display = 'none';

            let subtotal = 0;

            cartItems.forEach((item, index) => {
                subtotal += (item.price * item.qty);

                const card = document.createElement('div');
                card.className = 'cart-item-card';
                card.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/150'">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="price">${item.price.toLocaleString()} Ks</div>
                        <div class="qty-control">
                            <button class="qty-btn minus-btn" data-index="${index}"><ion-icon name="remove-outline"></ion-icon></button>
                            <span class="qty-amount">${item.qty}</span>
                            <button class="qty-btn plus-btn" data-index="${index}"><ion-icon name="add-outline"></ion-icon></button>
                        </div>
                    </div>
                    <ion-icon name="trash-outline" class="delete-icon" data-index="${index}"></ion-icon>
                `;
                cartContainer.appendChild(card);
            });

            updateTotals(subtotal);
            attachCartEvents(cartItems);
        };

        const updateTotals = (subtotal) => {
            const radioDelivery = document.getElementById('radioDelivery');
            const isDelivery = radioDelivery ? radioDelivery.checked : true;
            const currentDeliveryFee = isDelivery ? deliveryFee : 0;
            const total = subtotal + currentDeliveryFee;

            document.getElementById('subtotalDisplay').innerText = `${subtotal.toLocaleString()} Ks`;
            document.getElementById('deliveryFeeDisplay').innerText = `${currentDeliveryFee.toLocaleString()} Ks`;
            document.getElementById('totalAmountDisplay').innerText = `${total.toLocaleString()} Ks`;
        };

        const attachCartEvents = (cartItems) => {
            document.querySelectorAll('.plus-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-index');
                    cartItems[idx].qty += 1;
                    saveCart(cartItems); 
                    renderCart(); 
                });
            });

            document.querySelectorAll('.minus-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-index');
                    if (cartItems[idx].qty > 1) {
                        cartItems[idx].qty -= 1;
                        saveCart(cartItems);
                        renderCart();
                    }
                });
            });

            document.querySelectorAll('.delete-icon').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-index');
                    cartItems.splice(idx, 1); 
                    saveCart(cartItems);
                    renderCart(); 
                });
            });
        };

        const radioDelivery = document.getElementById('radioDelivery');
        const radioPickup = document.getElementById('radioPickup');
        if (radioDelivery) radioDelivery.addEventListener('change', renderCart);
        if (radioPickup) radioPickup.addEventListener('change', renderCart);

        renderCart();
    }
});