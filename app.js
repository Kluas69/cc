/**
 * CardMarket - Main Application
 * Premium checkout with payment method selector, card brand detection, multi-item cart
 */
(() => {
  "use strict";

  // ============================================
  // PRODUCT DATA ($4 - $30 range)
  // ============================================
  const products = [
    {
      id: 1,
      name: "Spotify Gift Card",
      desc: "Music for every mood",
      price: 4,
      color: "from-green-400 to-green-600",
      icon: "🎵",
      category: "entertainment",
      card_type: "Spotify",
    },
    {
      id: 2,
      name: "Starbucks Card",
      desc: "Coffee & drinks",
      price: 5,
      color: "from-green-600 to-green-800",
      icon: "☕",
      category: "food",
      card_type: "Starbucks",
    },
    {
      id: 3,
      name: "Apple Music Card",
      desc: "Ad-free music streaming",
      price: 6,
      color: "from-pink-400 to-rose-600",
      icon: "🎶",
      category: "entertainment",
      card_type: "Apple Music",
    },
    {
      id: 4,
      name: "Netflix Gift Card",
      desc: "Stream movies & shows",
      price: 8,
      color: "from-red-500 to-red-700",
      icon: "🎬",
      category: "entertainment",
      card_type: "Netflix",
    },
    {
      id: 5,
      name: "Uber Eats Card",
      desc: "Food delivery credits",
      price: 10,
      color: "from-emerald-400 to-teal-600",
      icon: "🍔",
      category: "food",
      card_type: "Uber Eats",
    },
    {
      id: 6,
      name: "Google Play Card",
      desc: "Android apps & content",
      price: 12,
      color: "from-blue-400 to-blue-600",
      icon: "🎮",
      category: "technology",
      card_type: "Google Play",
    },
    {
      id: 7,
      name: "Steam Gift Card",
      desc: "PC games & software",
      price: 15,
      color: "from-blue-600 to-indigo-700",
      icon: "🎮",
      category: "gaming",
      card_type: "Steam",
    },
    {
      id: 8,
      name: "Amazon Gift Card",
      desc: "Shop anything on Amazon",
      price: 18,
      color: "from-orange-400 to-yellow-500",
      icon: "🛍️",
      category: "shopping",
      card_type: "Amazon",
    },
    {
      id: 9,
      name: "Xbox Gift Card",
      desc: "Games & subscriptions",
      price: 20,
      color: "from-green-500 to-green-700",
      icon: "🕹️",
      category: "gaming",
      card_type: "Xbox",
    },
    {
      id: 10,
      name: "PlayStation Card",
      desc: "PS Store credits",
      price: 25,
      color: "from-blue-500 to-blue-800",
      icon: "🎯",
      category: "gaming",
      card_type: "PlayStation",
    },
    {
      id: 11,
      name: "Apple Gift Card",
      desc: "Apps, games & more",
      price: 25,
      color: "from-gray-700 to-gray-900",
      icon: "🍎",
      category: "technology",
      card_type: "Apple",
    },
    {
      id: 12,
      name: "Airbnb Gift Card",
      desc: "Travel & stays",
      price: 30,
      color: "from-pink-500 to-red-500",
      icon: "✈️",
      category: "travel",
      card_type: "Airbnb",
    },
    {
      id: 14,
      name: "PUBG UC Card - 5000 UC",
      desc: "5000 Unknown Cash for PUBG",
      price: 5,
      color: "from-yellow-500 to-orange-600",
      icon: "🔫",
      category: "gaming",
      card_type: "PUBG",
    },
    {
      id: 17,
      name: "PUBG UC Card - 50000 UC",
      desc: "50000 Unknown Cash for PUBG",
      price: 50,
      color: "from-yellow-500 to-orange-600",
      icon: "🔫",
      category: "gaming",
      card_type: "PUBG",
    },
  ];

  // ============================================
  // STATE
  // ============================================
  function loadCart() {
    try {
      const storedCart = JSON.parse(
        localStorage.getItem("cardmarket_cart") || "[]",
      );
      return Array.isArray(storedCart) ? storedCart : [];
    } catch (error) {
      localStorage.removeItem("cardmarket_cart");
      return [];
    }
  }

  let cart = loadCart();
  let selectedPaymentMethod = "visa";
  const MAX_QTY = 10;

  // ============================================
  // PAYMENT METHOD CONFIG
  // ============================================
  const paymentMethods = {
    visa: { label: "Visa", brand: "Visa", type: "card" },
    mastercard: { label: "Mastercard", brand: "Mastercard", type: "card" },
    amex: {
      label: "American Express",
      brand: "American Express",
      type: "card",
    },
    discover: { label: "Discover", brand: "Discover", type: "card" },
    apple_pay: { label: "Apple Pay", brand: "Apple Pay", type: "wallet" },
    google_pay: { label: "Google Pay", brand: "Google Pay", type: "wallet" },
    paypal: { label: "PayPal", brand: "PayPal", type: "wallet" },
  };

  // ============================================
  // DOM
  // ============================================
  const $ = (sel) => document.querySelector(sel);
  const productGrid = $("#productGrid");
  const categoryFilters = $("#categoryFilters");
  const searchInput = $("#searchInput");
  const searchInputMobile = $("#searchInputMobile");
  const noResults = $("#noResults");
  const cartBadge = $("#cartBadge");
  const cartBtn = $("#cartBtn");
  const cartDrawer = $("#cartDrawer");
  const cartBackdrop = $("#cartBackdrop");
  const closeCartBtn = $("#closeCart");
  const cartItemsEl = $("#cartItems");
  const cartEmpty = $("#cartEmpty");
  const cartFooter = $("#cartFooter");
  const cartSubtotal = $("#cartSubtotal");
  const cartTotal = $("#cartTotal");
  const checkoutBtnEl = $("#checkoutBtn");
  const checkoutEmail = $("#checkoutEmail");
  const checkoutItemsEl = $("#checkoutItems");
  const checkoutItemCount = $("#checkoutItemCount");
  const checkoutSubtotal = $("#checkoutSubtotal");
  const checkoutTotalEl = $("#checkoutTotal");
  const payNowBtn = $("#payNowBtn");
  const processingOverlay = $("#processingOverlay");
  const paymentForm = $("#paymentForm");
  const applePayForm = $("#applePayForm");
  const googlePayForm = $("#googlePayForm");
  const paypalForm = $("#paypalForm");
  const cardBrandIndicator = $("#cardBrandIndicator");
  const brandDot = $("#brandDot");
  const brandLabel = $("#brandLabel");
  const cardBrandLogo = $("#cardBrandLogo");
  const cardMethods = $("#cardMethods");
  const walletMethods = $("#walletMethods");
  const paymentStatusStates = document.querySelectorAll("[data-payment-state]");
  const paymentStatusDialog = $(".payment-status-dialog");
  const paymentSuccessOrder = $("#paymentSuccessOrder");
  const paymentSuccessAmount = $("#paymentSuccessAmount");
  const paymentFailureTitle = $("#paymentFailureTitle");
  const paymentFailureMessage = $("#paymentFailureMessage");
  const paymentFailureAmount = $("#paymentFailureAmount");
  const paymentUnknownAmount = $("#paymentUnknownAmount");
  let pendingSuccess = null;
  let activeCategory = "all";

  // ============================================
  // CART PERSISTENCE
  // ============================================
  function saveCart() {
    localStorage.setItem("cardmarket_cart", JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (count > 0) {
      cartBadge.textContent = count;
      cartBadge.classList.remove("hidden");
    } else {
      cartBadge.classList.add("hidden");
    }
  }

  // ============================================
  // CART OPERATIONS
  // ============================================
  function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      if (existing.quantity < MAX_QTY) existing.quantity++;
    } else {
      cart.push({
        id: product.id,
        product: product.name,
        price: product.price,
        card_type: product.card_type,
        quantity: 1,
        icon: product.icon,
        color: product.color,
      });
    }
    saveCart();
    renderCartItems();
    openCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    renderCartItems();
  }

  function updateQuantity(productId, delta) {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;
    item.quantity = Math.max(1, Math.min(MAX_QTY, item.quantity + delta));
    saveCart();
    renderCartItems();
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Build flat list of cards for the email,
  // assigning dummy cards to each cart item across its quantity.
  function buildEmailCards(cartItems, dummyCards) {
    const cards = [];
    let idx = 0;
    let list = [...dummyCards];
    for (const item of cartItems) {
      for (let q = 0; q < item.quantity; q++) {
        if (list.length === 0) list = [...dummyCards];
        const card = list[idx % list.length] || {};
        idx++;
        cards.push({
          product: item.product,
          card_type: item.card_type,
          name: card.name,
          number: card.number,
          expiry: card.expiry,
          cvv: card.cvv,
        });
      }
    }
    return cards;
  }

  // ============================================
  // RENDER PRODUCTS
  // ============================================
  function renderCategoryFilters() {
    if (!categoryFilters) return;

    const categories = ["all", ...new Set(products.map((product) => product.category))];
    categoryFilters.innerHTML = categories
      .map((category) => {
        const label = category === "all" ? "All cards" : category.replace(/^./, (letter) => letter.toUpperCase());
        const isActive = activeCategory === category;
        return `<button type="button" class="category-pill ${isActive ? "active" : ""}" data-category="${category}" role="tab" aria-selected="${isActive}">${label}</button>`;
      })
      .join("");

    categoryFilters.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderCategoryFilters();
        renderProducts(getActiveSearch());
      });
    });
  }

  function renderProducts(filter = "") {
    const query = filter.toLowerCase().trim();
    const filtered = products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      productGrid.innerHTML = "";
      noResults.classList.remove("hidden");
      return;
    }

    noResults.classList.add("hidden");
    productGrid.innerHTML = filtered
      .map((p) => {
        const inCart = cart.find((c) => c.id === p.id);
        const qty = inCart ? inCart.quantity : 0;
        return `
        <article class="product-card">
          <div class="card-visual" style="background: linear-gradient(135deg, ${getGradientColors(p.color)})">
            ${p.card_type === "PUBG" ? `<img class="card-thumbnail-image" src="pubg.jpeg" alt="${p.name}" />` : `<span class="card-icon">${p.icon}</span>`}
            <span class="card-category">${p.category}</span>
          </div>
          <div class="product-card-body">
            <div class="product-card-copy">
              <span class="delivery-badge">&#9889; Digital delivery</span>
              <h3>${p.name}</h3>
              <p>${p.desc}</p>
            </div>
            <div class="product-card-footer">
              <span class="product-price">$${p.price.toFixed(2)}</span>
              ${
                qty > 0
                  ? `
                <div class="product-actions">
                  <div class="quantity-control">
                    <button onclick="event.stopPropagation(); app.updateQuantity(${p.id}, -1)" aria-label="Decrease quantity">-</button>
                    <span>${qty}</span>
                    <button onclick="event.stopPropagation(); app.updateQuantity(${p.id}, 1)" ${qty >= MAX_QTY ? "disabled" : ""} aria-label="Increase quantity">+</button>
                  </div>
                  <button onclick="event.stopPropagation(); app.addToCart(${p.id})" class="add-button">
                    Add
                  </button>
                </div>
              `
                  : `
                <button onclick="event.stopPropagation(); app.addToCart(${p.id})" class="add-button">
                  Add <span aria-hidden="true">+</span>
                </button>
              `
              }
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  }

  function getGradientColors(tailwindClasses) {
    const colorMap = {
      "green-400": "#4ade80",
      "green-600": "#16a34a",
      "green-800": "#166534",
      "green-500": "#22c55e",
      "green-700": "#15803d",
      "pink-400": "#f472b6",
      "rose-600": "#e11d48",
      "pink-500": "#ec4899",
      "red-500": "#ef4444",
      "red-700": "#b91c1c",
      "emerald-400": "#34d399",
      "teal-600": "#0d9488",
      "blue-400": "#60a5fa",
      "blue-600": "#2563eb",
      "blue-800": "#1e40af",
      "blue-500": "#3b82f6",
      "indigo-700": "#4338ca",
      "orange-400": "#fb923c",
      "yellow-500": "#eab308",
      "orange-600": "#ea580c",
      "gray-700": "#374151",
      "gray-900": "#111827",
    };
    const parts = tailwindClasses.split(" ");
    const from = colorMap[parts[0]?.replace("from-", "")] || "#6b7280";
    const to = colorMap[parts[1]?.replace("to-", "")] || "#374151";
    return `${from}, ${to}`;
  }

  // ============================================
  // RENDER CART ITEMS
  // ============================================
  function renderCartItems() {
    if (cart.length === 0) {
      cartItemsEl.innerHTML = "";
      cartEmpty.classList.remove("hidden");
      cartFooter.classList.add("hidden");
      return;
    }

    cartEmpty.classList.add("hidden");
    cartFooter.classList.remove("hidden");

    cartItemsEl.innerHTML = cart
      .map(
        (item) => `
      <article class="cart-item-card">
        <div class="cart-item-topline">
          <div class="cart-item-thumbnail bg-gradient-to-br ${item.color}">
            <span>${item.icon}</span>
          </div>
          <div class="cart-item-info">
            <div class="cart-item-title-row">
              <div>
                <h3>${item.product}</h3>
                <p>${item.card_type}</p>
              </div>
              <button onclick="app.removeFromCart(${item.id})" class="cart-remove-button" title="Remove" aria-label="Remove ${item.product}">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
            <span class="cart-delivery-label"><span aria-hidden="true">&#9889;</span> Digital delivery</span>
          </div>
        </div>
        <div class="cart-item-bottomline">
          <div class="cart-quantity-control" aria-label="Quantity controls">
            <button onclick="app.updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button onclick="app.updateQuantity(${item.id}, 1)" ${item.quantity >= MAX_QTY ? "disabled" : ""} aria-label="Increase quantity">+</button>
          </div>
          <strong class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      </article>
    `,
      )
      .join("");

    const total = getCartTotal();
    cartSubtotal.textContent = `$${total.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
    renderProducts(getActiveSearch());
  }

  // ============================================
  // SEARCH
  // ============================================
  function getActiveSearch() {
    return (searchInput.value || searchInputMobile?.value || "").trim();
  }

  let searchTimeout;
  function handleSearch(e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (searchInputMobile) searchInputMobile.value = e.target.value;
      if (searchInput !== e.target) searchInput.value = e.target.value;
      renderProducts(e.target.value);
    }, 200);
  }
  searchInput.addEventListener("input", handleSearch);
  if (searchInputMobile)
    searchInputMobile.addEventListener("input", handleSearch);

  // ============================================
  // CART DRAWER
  // ============================================
  function openCart() {
    renderCartItems();
    cartDrawer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeCartDrawer() {
    cartDrawer.classList.add("hidden");
    document.body.style.overflow = "";
  }

  cartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCartDrawer);
  cartBackdrop.addEventListener("click", closeCartDrawer);

  // ============================================
  // CARD BRAND DETECTION
  // ============================================
  const brandColors = {
    visa: "#1a1f71",
    mastercard: "#eb001b",
    amex: "#006fcf",
    discover: "#ff6000",
  };

  function detectCardBrand(number) {
    const n = number.replace(/\s/g, "");
    if (/^4/.test(n)) return "visa";
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
    if (/^3[47]/.test(n)) return "amex";
    if (/^6(?:011|5)/.test(n)) return "discover";
    return null;
  }

  function updateCardBrandVisual(brand) {
    if (!brand) {
      brandDot.className = "w-2 h-2 rounded-full bg-gray-300";
      brandLabel.textContent = "Enter card number";
      brandLabel.className = "text-sm text-gray-400";
      cardBrandLogo.textContent = "";
      return;
    }
    const color = brandColors[brand] || "#6b7280";
    brandDot.className = `w-2 h-2 rounded-full`;
    brandDot.style.backgroundColor = color;
    brandLabel.textContent = paymentMethods[brand]?.brand || brand;
    brandLabel.className = "text-sm font-medium text-gray-700";
    cardBrandLogo.textContent = brand.toUpperCase().substring(0, 4);
    cardBrandLogo.style.color = color;
  }

  // ============================================
  // PAYMENT METHOD SELECTOR
  // ============================================
  function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    // Update active states
    document.querySelectorAll(".pm-btn").forEach((btn) => {
      const isActive = btn.dataset.method === method;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-checked", isActive);
    });

    // Show/hide forms
    const config = paymentMethods[method];
    const isCard = config.type === "card";

    paymentForm.classList.toggle("hidden", !isCard);
    applePayForm.classList.toggle("hidden", method !== "apple_pay");
    googlePayForm.classList.toggle("hidden", method !== "google_pay");
    paypalForm.classList.toggle("hidden", method !== "paypal");
    cardBrandIndicator.classList.toggle("hidden", !isCard);

    // Update pay button
    updatePayButton();
  }

  // Event listeners for payment method buttons
  document.querySelectorAll(".pm-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      selectPaymentMethod(btn.dataset.method),
    );
  });

  // ============================================
  // PAY BUTTON UPDATE
  // ============================================
  function updatePayButton() {
    const total = getCartTotal();
    payNowBtn.innerHTML = `<span class="pay-button-label"><svg class="lock-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Pay Securely <span id="payAmount">$${total.toFixed(2)}</span></span>`;
    payNowBtn.disabled = cart.length === 0;
  }

  // ============================================
  // CHECKOUT (route: #/checkout)
  // ============================================
  function populateCheckout() {
    if (cart.length === 0) {
      Router.navigate("#/");
      return;
    }

    // Render order items
    checkoutItemsEl.innerHTML = cart
      .map(
        (item) => `
      <div class="flex items-center gap-3 py-2">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0">
          <span class="text-lg">${item.icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">${item.product}</p>
          <p class="text-xs text-gray-500">${item.card_type} &middot; Qty ${item.quantity} &times; $${item.price.toFixed(2)}</p>
        </div>
        <span class="text-sm font-semibold text-gray-900">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `,
      )
      .join("");

    const total = getCartTotal();
    const itemCount = getCartItemCount();
    checkoutItemCount.textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;
    checkoutSubtotal.textContent = `$${total.toFixed(2)}`;
    checkoutTotalEl.textContent = `$${total.toFixed(2)}`;

    // Reset payment form
    selectPaymentMethod(selectedPaymentMethod);

    // Close cart drawer if open
    closeCartDrawer();

    // Focus email field
    setTimeout(() => checkoutEmail.focus(), 100);
  }

  // ============================================
  // CARD INPUT FORMATTING
  // ============================================
  const cardNumberInput = $("#cardNumber");
  const cardExpiryInput = $("#cardExpiry");
  const cardCvvInput = $("#cardCvv");

  cardNumberInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").substring(0, 16);
    e.target.value = v.replace(/(.{4})/g, "$1 ").trim();
    const brand = detectCardBrand(e.target.value);
    updateCardBrandVisual(brand);
  });

  cardExpiryInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (v.length >= 2) v = v.substring(0, 2) + " / " + v.substring(2);
    e.target.value = v;
  });

  cardCvvInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
  });

  // ============================================
  // WALLET / PAYPAL BUTTON HANDLERS
  // ============================================
  $("#applePayBtn").addEventListener("click", () => handleCheckout());
  $("#googlePayBtn").addEventListener("click", () => handleCheckout());
  $("#paypalBtn").addEventListener("click", () => handleCheckout());

  function setPaymentOverlayState(state, details = {}) {
    processingOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    paymentStatusStates.forEach((stateEl) => {
      stateEl.classList.toggle("hidden", stateEl.dataset.paymentState !== state);
    });
    const activeState = document.querySelector(`[data-payment-state="${state}"]`);
    const activeTitle = activeState?.querySelector("h2");
    if (activeTitle) {
      activeTitle.id ||= `paymentStatusTitle-${state}`;
      paymentStatusDialog?.setAttribute("aria-labelledby", activeTitle.id);
    }

    const total = `$${getCartTotal().toFixed(2)}`;
    if (paymentSuccessOrder) paymentSuccessOrder.textContent = details.orderId ? `#${details.orderId}` : "#--";
    if (paymentSuccessAmount) paymentSuccessAmount.textContent = total;
    if (paymentFailureAmount) paymentFailureAmount.textContent = total;
    if (paymentUnknownAmount) paymentUnknownAmount.textContent = total;
    if (paymentFailureTitle) paymentFailureTitle.textContent = details.declined ? "Card Declined" : "Payment Failed";
    if (paymentFailureMessage) {
      paymentFailureMessage.textContent = details.declined
        ? "Please verify your card details or try another payment method."
        : "Your payment was not completed. Please check your payment details or try another payment method.";
    }
  }

  function closePaymentOverlay() {
    processingOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function restorePaymentForm() {
    closePaymentOverlay();
    updatePayButton();
    cardNumberInput.value = "";
    cardExpiryInput.value = "";
    cardCvvInput.value = "";
    updateCardBrandVisual(null);
    cardNumberInput.focus();
  }

  $("#continueOrderBtn").addEventListener("click", () => {
    if (!pendingSuccess) return;
    const completedOrder = pendingSuccess;
    pendingSuccess = null;
    closePaymentOverlay();
    showSuccessPage(completedOrder.orderData, completedOrder.emailSent);
  });

  $("#retryPaymentBtn").addEventListener("click", restorePaymentForm);
  $("#changePaymentMethodBtn").addEventListener("click", () => {
    closePaymentOverlay();
    updatePayButton();
    document.querySelector(".payment-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#returnCheckoutBtn").addEventListener("click", () => {
    closePaymentOverlay();
    updatePayButton();
  });
  $("#returnCartBtn").addEventListener("click", () => {
    closePaymentOverlay();
    updatePayButton();
    openCart();
  });

  // ============================================
  // CHECKOUT SUBMIT
  // ============================================
  payNowBtn.addEventListener("click", () => handleCheckout());

  async function handleCheckout() {
    const email = checkoutEmail.value.trim();
    if (!email) {
      checkoutEmail.focus();
      checkoutEmail.classList.add("ring-2", "ring-red-400");
      setTimeout(
        () => checkoutEmail.classList.remove("ring-2", "ring-red-400"),
        2000,
      );
      return;
    }

    // Validate card form if card method selected
    const isCard = paymentMethods[selectedPaymentMethod].type === "card";
    if (isCard && !paymentForm.checkValidity()) {
      paymentForm.reportValidity();
      return;
    }

    if (cart.length === 0) return;

    // Disable button
    payNowBtn.disabled = true;
    payNowBtn.textContent = "Processing...";

    // Show an in-progress state while the payment provider request is pending.
    setPaymentOverlayState("processing");
    setPaymentOverlayState("verifying");

    try {
      // Mock payment — pass card details for validation
      const paymentResult = await PaymentService.processPayment({
        items: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price.toFixed(2),
          card_type: item.card_type,
        })),
        total: getCartTotal().toFixed(2),
        card_number: $("#cardNumber")?.value || "",
        card_expiry: $("#cardExpiry")?.value || "",
        card_cvv: $("#cardCvv")?.value || "",
        payment_method: selectedPaymentMethod,
      });

      if (!paymentResult.success) {
        updatePayButton();
        setPaymentOverlayState("failed", {
          declined: /declined/i.test(paymentResult.error || "") || paymentResult.status === "declined",
        });
        return;
      }

      // Build order data
      const orderData = {
        order_id: paymentResult.order_id,
        email: email,
        items: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price.toFixed(2),
          card_type: item.card_type,
        })),
        item_count: String(getCartItemCount()),
        total: getCartTotal().toFixed(2),
        payment_method: paymentMethods[selectedPaymentMethod].label,
        payment_status: 'Paid',
        transaction_id: paymentResult.transaction_id,
        cards: buildEmailCards(cart, paymentResult.dummy_cards || [])
      };

      // Send email
      let emailSent = false;
      try {
        console.log("[Checkout] Sending email to:", email);
        console.log(
          "[Checkout] Order data for email:",
          JSON.stringify(orderData, null, 2),
        );
        const emailResult = await EmailService.sendOrderConfirmation(orderData);
        console.log("[Checkout] Email result:", emailResult);
        emailSent = emailResult.success === true;
        if (!emailSent) {
          console.warn("[Checkout] Email failed:", emailResult.error);
        }
      } catch (emailErr) {
        emailSent = false;
        console.error("[Checkout] Email exception:", emailErr);
      }

      // Clear cart
      cart = [];
      saveCart();
      renderCartItems();

      // Show success only after payment confirmation and the existing email attempt.
      pendingSuccess = { orderData, emailSent };
      setPaymentOverlayState("success", { orderId: orderData.order_id });
    } catch (err) {
      console.error("[Checkout] Error:", err);
      updatePayButton();
      setPaymentOverlayState("unknown");
    }
  }

  // ============================================
  // SUCCESS PAGE (route: #/success)
  // ============================================
  let lastOrderData = null;
  let lastEmailSent = false;

  function showSuccessPage(orderData, emailSent) {
    lastOrderData = orderData;
    lastEmailSent = emailSent;
    Router.navigate("#/success");
  }

  function populateSuccessPage() {
    if (!lastOrderData) return;
    const orderData = lastOrderData;
    const emailSent = lastEmailSent;

    $("#successOrderId").textContent = orderData.order_id;
    $("#successTransId").textContent = orderData.transaction_id;
    $("#successPaymentMethod").textContent = orderData.payment_method;
    $("#successEmail").textContent = orderData.email;
    $("#successTotal").textContent = `$${orderData.total}`;

    $("#successItems").innerHTML = orderData.items
      .map(
        (item) => `
      <div class="flex items-center justify-between py-1.5">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">${item.product}</p>
          <p class="text-xs text-gray-500">Qty ${item.quantity} &times; $${item.price}</p>
        </div>
        <span class="text-sm font-semibold text-gray-900 ml-3">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
      </div>
    `,
      )
      .join("");

    const emailStatus = $("#emailStatus");
    if (emailSent) {
      emailStatus.className = "text-center mb-8";
      emailStatus.innerHTML = `
        <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full border border-green-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Order confirmed — confirmation email sent to ${orderData.email}
        </div>`;
    } else {
      emailStatus.className = "text-center mb-8";
      emailStatus.innerHTML = `
        <div class="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium px-4 py-2 rounded-full border border-amber-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          Order confirmed — email could not be sent (check console for details)
        </div>`;
    }

    // Reset after rendering
    lastOrderData = null;
    lastEmailSent = false;
  }

  // ============================================
  // ROUTER INIT
  // ============================================
  Router.init((route) => {
    // Page-specific logic on route change
    switch (route) {
      case "/":
        renderProducts(getActiveSearch());
        break;
      case "/checkout":
        populateCheckout();
        break;
      case "/success":
        populateSuccessPage();
        break;
    }
  });

  // ============================================
  // INIT
  // ============================================
  updateCartBadge();
  renderCategoryFilters();
  renderProducts();

  // Safety fallback: re-render after a tick in case DOM wasn't ready
  setTimeout(() => {
    if (!productGrid || productGrid.children.length === 0) {
      renderProducts();
    }
  }, 100);

  // Expose methods for inline handlers
  window.app = { addToCart, removeFromCart, updateQuantity };
})();
