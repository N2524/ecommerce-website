// EliteShop JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSlider();
    initScrollToTop();
    initProductTabs();
    initQuantityControls();
    initFilters();
    initFormValidation();
    initFAQ();
    initViewToggle();
    initCartFunctionality();
    initCheckoutFunctionality();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            body.classList.toggle('nav-open');
            
            // Update aria attributes
            const isOpen = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            navMenu.setAttribute('aria-hidden', !isOpen);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                navToggle.focus();
            }
        });
    }

    // Mobile filter toggle
    const filterToggle = document.querySelector('.filter-toggle');
    const filtersSidebar = document.querySelector('.filters-sidebar, .search-filters');

    if (filterToggle && filtersSidebar) {
        filterToggle.addEventListener('click', function() {
            filtersSidebar.classList.toggle('active');
            body.classList.toggle('filters-open');
        });

        // Close filters when clicking outside
        filtersSidebar.addEventListener('click', function(e) {
            if (e.target === filtersSidebar) {
                filtersSidebar.classList.remove('active');
                body.classList.remove('filters-open');
            }
        });
    }
}

// Hero slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Wrap around if necessary
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;

        // Show current slide and dot
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopSlideshow();
            nextSlide();
            startSlideshow();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopSlideshow();
            prevSlide();
            startSlideshow();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopSlideshow();
            currentSlide = index;
            showSlide(currentSlide);
            startSlideshow();
        });
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopSlideshow);
        sliderContainer.addEventListener('mouseleave', startSlideshow);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (document.activeElement.closest('.hero-slider')) {
            if (e.key === 'ArrowLeft') {
                stopSlideshow();
                prevSlide();
                startSlideshow();
            } else if (e.key === 'ArrowRight') {
                stopSlideshow();
                nextSlide();
                startSlideshow();
            }
        }
    });

    // Start slideshow
    startSlideshow();
}

// Global slider control functions
function changeSlide(direction) {
    const event = new CustomEvent('slideChange', { detail: { direction } });
    document.dispatchEvent(event);
}

function currentSlide(n) {
    const event = new CustomEvent('slideGoTo', { detail: { slide: n - 1 } });
    document.dispatchEvent(event);
}

// Listen for custom slider events
document.addEventListener('slideChange', function(e) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    currentSlide += e.detail.direction;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
});

document.addEventListener('slideGoTo', function(e) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const targetSlide = e.detail.slide;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[targetSlide]) {
        slides[targetSlide].classList.add('active');
    }
    if (dots[targetSlide]) {
        dots[targetSlide].classList.add('active');
    }
});

// Scroll to top functionality
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    if (!scrollBtn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Product tabs functionality
function initProductTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length === 0) return;

    function showTab(tabId) {
        // Remove active class from all tabs and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        const activeBtn = document.querySelector(`[onclick="showTab('${tabId}')"]`);
        const activeContent = document.getElementById(tabId);

        if (activeBtn) activeBtn.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }

    // Make showTab globally available
    window.showTab = showTab;

    // Add click event listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(tabId);
        });
    });
}

// Quantity controls
function initQuantityControls() {
    const quantityControls = document.querySelectorAll('.quantity-controls');

    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.qty-btn:first-child');
        const plusBtn = control.querySelector('.qty-btn:last-child');
        const input = control.querySelector('input[type="number"]');

        if (!input) return;

        const min = parseInt(input.getAttribute('min')) || 1;
        const max = parseInt(input.getAttribute('max')) || 99;

        if (minusBtn) {
            minusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || min;
                if (value > min) {
                    input.value = value - 1;
                    updateCartItemTotal(input);
                }
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || min;
                if (value < max) {
                    input.value = value + 1;
                    updateCartItemTotal(input);
                }
            });
        }

        input.addEventListener('change', function() {
            let value = parseInt(this.value) || min;
            if (value < min) this.value = min;
            if (value > max) this.value = max;
            updateCartItemTotal(this);
        });
    });
}

// Global quantity control functions
function increaseQuantity() {
    const input = document.getElementById('quantity');
    if (input) {
        const max = parseInt(input.getAttribute('max')) || 99;
        let value = parseInt(input.value) || 1;
        if (value < max) {
            input.value = value + 1;
        }
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (input) {
        const min = parseInt(input.getAttribute('min')) || 1;
        let value = parseInt(input.value) || 1;
        if (value > min) {
            input.value = value - 1;
        }
    }
}

function updateQuantity(itemId, change) {
    const input = document.getElementById(`qty-${itemId}`);
    if (input) {
        const min = parseInt(input.getAttribute('min')) || 1;
        const max = parseInt(input.getAttribute('max')) || 99;
        let value = parseInt(input.value) || min;
        
        value += change;
        if (value >= min && value <= max) {
            input.value = value;
            updateCartItemTotal(input);
            updateCartSummary();
        }
    }
}

function updateCartItemTotal(input) {
    const cartItem = input.closest('.cart-item, .cart-card');
    if (!cartItem) return;

    const quantity = parseInt(input.value) || 1;
    const priceElement = cartItem.querySelector('.price, .current-price');
    const totalElement = cartItem.querySelector('.total-price, .price');

    if (priceElement && totalElement) {
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        const total = price * quantity;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Filters functionality
function initFilters() {
    const filterOptions = document.querySelectorAll('.filter-option input, .rating-option input');
    const clearFilters = document.querySelector('.clear-filters');
    const priceRangeInputs = document.querySelectorAll('#min-price, #max-price');
    const rangeSliders = document.querySelectorAll('#price-range-min, #price-range-max');

    // Filter change events
    filterOptions.forEach(option => {
        option.addEventListener('change', function() {
            applyFilters();
        });
    });

    // Clear filters
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            filterOptions.forEach(option => {
                option.checked = false;
            });
            
            priceRangeInputs.forEach(input => {
                input.value = input === document.getElementById('min-price') ? '0' : '1000';
            });
            
            rangeSliders.forEach(slider => {
                slider.value = slider === document.getElementById('price-range-min') ? '0' : '1000';
            });
            
            applyFilters();
        });
    }

    // Price range synchronization
    priceRangeInputs.forEach(input => {
        input.addEventListener('input', function() {
            const isMin = this.id === 'min-price';
            const slider = document.getElementById(isMin ? 'price-range-min' : 'price-range-max');
            if (slider) {
                slider.value = this.value;
            }
            applyFilters();
        });
    });

    rangeSliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const isMin = this.id === 'price-range-min';
            const input = document.getElementById(isMin ? 'min-price' : 'max-price');
            if (input) {
                input.value = this.value;
            }
            applyFilters();
        });
    });
}

function applyFilters() {
    // This would typically filter products based on selected criteria
    // For now, we'll just log the selected filters
    const selectedFilters = {
        categories: [],
        brands: [],
        priceRange: {
            min: document.getElementById('min-price')?.value || 0,
            max: document.getElementById('max-price')?.value || 1000
        },
        rating: null
    };

    document.querySelectorAll('.filter-option input:checked').forEach(input => {
        const filterType = input.name;
        const filterValue = input.value;
        
        if (filterType === 'category') {
            selectedFilters.categories.push(filterValue);
        } else if (filterType === 'brand') {
            selectedFilters.brands.push(filterValue);
        }
    });

    const selectedRating = document.querySelector('.rating-option input:checked');
    if (selectedRating) {
        selectedFilters.rating = selectedRating.value;
    }

    console.log('Applied filters:', selectedFilters);
    
    // Update URL with filter parameters
    updateFilterURL(selectedFilters);
}

function updateFilterURL(filters) {
    const url = new URL(window.location);
    const params = new URLSearchParams();

    if (filters.categories.length > 0) {
        params.set('categories', filters.categories.join(','));
    }
    if (filters.brands.length > 0) {
        params.set('brands', filters.brands.join(','));
    }
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
        params.set('price_min', filters.priceRange.min);
        params.set('price_max', filters.priceRange.max);
    }
    if (filters.rating) {
        params.set('rating', filters.rating);
    }

    url.search = params.toString();
    window.history.replaceState({}, '', url);
}

// View toggle functionality
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('products-grid, search-results-grid');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (productsGrid) {
                productsGrid.className = productsGrid.className.replace(/view-\w+/, '');
                productsGrid.classList.add(`view-${view}`);
            }
        });
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                if (form.id === 'contact-form') {
                    handleContactForm(form);
                } else if (form.id === 'checkout-form') {
                    handleCheckoutForm(form);
                } else {
                    form.submit();
                }
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearFieldError(field);

    // Required field validation
    if (isRequired && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    // Card number validation (basic)
    else if (field.name === 'cardNumber' && value) {
        const cardRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
        if (!cardRegex.test(value)) {
            errorMessage = 'Please enter a valid card number';
            isValid = false;
        }
    }
    // Expiry date validation
    else if (field.name === 'expiryDate' && value) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(value)) {
            errorMessage = 'Please enter a valid expiry date (MM/YY)';
            isValid = false;
        }
    }
    // CVV validation
    else if (field.name === 'cvv' && value) {
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(value)) {
            errorMessage = 'Please enter a valid CVV';
            isValid = false;
        }
    }
    // ZIP code validation
    else if (field.name === 'zipCode' && value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) {
            errorMessage = 'Please enter a valid ZIP code';
            isValid = false;
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function handleContactForm(form) {
    // Show success message
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        form.reset();
    }, 1000);
    
    console.log('Contact form submitted:', data);
}

function handleCheckoutForm(form) {
    // Handle checkout form submission
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Checkout form submitted:', data);
    
    // Redirect to order confirmation
    window.location.href = 'order-confirmation.html';
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        if (!question || !answer) return;
        
        // Initially hide all answers
        answer.style.display = 'none';
        
        question.addEventListener('click', function() {
            const isOpen = answer.style.display === 'block';
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.faq-question i');
                if (otherAnswer && otherAnswer !== answer) {
                    otherAnswer.style.display = 'none';
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current FAQ
            if (isOpen) {
                answer.style.display = 'none';
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.display = 'block';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// Cart functionality
function initCartFunctionality() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || 
            e.target.closest('.add-to-cart-btn')) {
            e.preventDefault();
            handleAddToCart(e.target);
        }
    });
}

function handleAddToCart(button) {
    // Get product information
    const productCard = button.closest('.product-card, .product-info-section');
    if (!productCard) return;
    
    const productName = productCard.querySelector('h3, h1')?.textContent || 'Unknown Product';
    const productPrice = productCard.querySelector('.current-price')?.textContent || '$0.00';
    
    // Get quantity if available
    let quantity = 1;
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantity = parseInt(quantityInput.value) || 1;
    }
    
    // Add visual feedback
    button.classList.add('adding');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    
    setTimeout(() => {
        button.classList.remove('adding');
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        
        // Update cart count
        updateCartCount();
        
        // Show success message
        showNotification(`${productName} added to cart!`, 'success');
        
        // Reset button after delay
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        }, 2000);
    }, 1000);
    
    console.log('Added to cart:', { productName, productPrice, quantity });
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        let currentCount = parseInt(element.textContent) || 0;
        element.textContent = currentCount + 1;
    });
}

function removeItem(itemId) {
    const confirmation = confirm('Are you sure you want to remove this item from your cart?');
    if (!confirmation) return;
    
    const cartItem = document.querySelector(`[data-item-id="${itemId}"], .cart-item:nth-child(${itemId}), .cart-card:nth-child(${itemId})`);
    if (cartItem) {
        cartItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            cartItem.remove();
            updateCartSummary();
            showNotification('Item removed from cart', 'info');
        }, 300);
    }
}

function updateCartSummary() {
    // This would typically recalculate cart totals
    // For now, we'll just log the action
    console.log('Cart summary updated');
}

// Checkout functionality
function initCheckoutFunctionality() {
    // Shipping option changes
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateShippingCost(this.value);
        });
    });
    
    // Payment method changes
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            togglePaymentForm(this.value);
        });
    });
}

function updateShippingCost(shippingMethod) {
    const shippingCostElement = document.getElementById('shipping-cost');
    const totalCostElement = document.getElementById('total-cost');
    
    if (!shippingCostElement || !totalCostElement) return;
    
    let shippingCost = 0;
    switch (shippingMethod) {
        case 'standard':
            shippingCost = 0;
            shippingCostElement.textContent = 'Free';
            break;
        case 'express':
            shippingCost = 15.99;
            shippingCostElement.textContent = `$${shippingCost.toFixed(2)}`;
            break;
        case 'overnight':
            shippingCost = 29.99;
            shippingCostElement.textContent = `$${shippingCost.toFixed(2)}`;
            break;
    }
    
    // Update total (this is simplified - in reality you'd recalculate from cart items)
    const currentTotal = parseFloat(totalCostElement.textContent.replace('$', ''));
    const newTotal = currentTotal + shippingCost;
    totalCostElement.textContent = `$${newTotal.toFixed(2)}`;
}

function togglePaymentForm(paymentMethod) {
    const cardForm = document.getElementById('card-form');
    if (!cardForm) return;
    
    if (paymentMethod === 'card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
}

function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    if (!couponInput) return;
    
    const couponCode = couponInput.value.trim().toUpperCase();
    
    // Simple coupon validation (in reality, this would be server-side)
    const validCoupons = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'WELCOME': 0.15
    };
    
    if (validCoupons[couponCode]) {
        const discount = validCoupons[couponCode];
        showNotification(`Coupon applied! You saved ${(discount * 100)}%`, 'success');
        // Update pricing display
        updateCouponDiscount(discount);
    } else {
        showNotification('Invalid coupon code', 'error');
    }
    
    couponInput.value = '';
}

function updateCouponDiscount(discount) {
    // This would update the discount display in the cart/checkout
    console.log('Applied discount:', discount);
}

function placeOrder() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        const formEvent = new Event('submit', { bubbles: true, cancelable: true });
        checkoutForm.dispatchEvent(formEvent);
    } else {
        // Fallback if no form
        window.location.href = 'order-confirmation.html';
    }
}

// Search functionality
function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Redirect to search page with query parameter
        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    }
}

// Initialize search on Enter key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement.id === 'search-input') {
        e.preventDefault();
        performSearch();
    }
});

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
    }
    
    // Set notification style based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images (if needed)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause any animations or timers
        document.dispatchEvent(new Event('pauseAnimations'));
    } else {
        // Page is visible, resume animations
        document.dispatchEvent(new Event('resumeAnimations'));
    }
});

// Accessibility improvements
function improveAccessibility() {
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add ARIA labels where needed
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.setAttribute('aria-label', element.dataset.tooltip);
    });
}

// Initialize accessibility improvements
improveAccessibility();

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
            }
        }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send error reports to your analytics service here
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Handle promise rejections
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for use in other scripts if needed
window.EliteShop = {
    showNotification,
    performSearch,
    applyCoupon,
    placeOrder,
    updateQuantity,
    removeItem,
    showTab,
    changeSlide,
    currentSlide
};
