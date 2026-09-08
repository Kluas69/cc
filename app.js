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
      id: 13,
      name: "PUBG UC Card - 60 UC",
      desc: "60 Unknown Cash for PUBG",
      price: 1,
      color: "from-yellow-500 to-orange-600",
      icon: "🔫",
      category: "gaming",
      card_type: "PUBG",
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
      id: 15,
      name: "PUBG UC Card - 660 UC",
      desc: "660 Unknown Cash for PUBG",
      price: 10,
      color: "from-yellow-500 to-orange-600",
      icon: "🔫",
      category: "gaming",
      card_type: "PUBG",
    },
    {
      id: 16,
      name: "PUBG UC Card - 1800 UC",
      desc: "1800 Unknown Cash for PUBG",
      price: 25,
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
    {
      id: 18,
      name: "PUBG UC Card - 8100 UC",
      desc: "8100 Unknown Cash for PUBG",
      price: 100,
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

  // ============================================
  // RENDER PRODUCTS
  // ============================================
  function renderProducts(filter = "") {
    const query = filter.toLowerCase().trim();
    const filtered = query
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.desc.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query),
        )
      : products;

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
        <div class="product-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
          <div class="card-visual h-44 flex items-center justify-center relative" style="background: linear-gradient(to bottom right, ${getGradientColors(p.color)})">
            <span class="text-6xl drop-shadow-lg">${p.icon}</span>
            <div class="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              ${p.category}
            </div>
          </div>
          <div class="p-5 flex flex-col flex-1">
            <h3 class="font-bold text-gray-900 text-lg mb-1">${p.name}</h3>
            <p class="text-gray-500 text-sm mb-4 flex-1">${p.desc}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-2xl font-bold text-brand-600">$${p.price.toFixed(2)}</span>
              ${
                qty > 0
                  ? `
                <div class="flex items-center gap-2">
                  <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onclick="event.stopPropagation(); app.updateQuantity(${p.id}, -1)" class="px-3 py-2 text-gray-600 hover:bg-gray-100 transition text-sm font-bold" aria-label="Decrease quantity">-</button>
                    <span class="px-3 py-2 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">${qty}</span>
                    <button onclick="event.stopPropagation(); app.updateQuantity(${p.id}, 1)" class="px-3 py-2 text-gray-600 hover:bg-gray-100 transition text-sm font-bold" ${qty >= MAX_QTY ? "disabled" : ""} aria-label="Increase quantity">+</button>
                  </div>
                  <button onclick="event.stopPropagation(); app.addToCart(${p.id})" class="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">
                    Add
                  </button>
                </div>
              `
                  : `
                <button onclick="event.stopPropagation(); app.addToCart(${p.id})" class="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm">
                  Add to Cart
                </button>
              `
              }
            </div>
          </div>
        </div>
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
      <div class="flex gap-3 bg-gray-50 rounded-xl p-3">
        <div class="w-14 h-14 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0">
          <span class="text-2xl">${item.icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <p class="font-semibold text-gray-900 text-sm truncate">${item.product}</p>
            <button onclick="app.removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 transition flex-shrink-0" title="Remove" aria-label="Remove ${item.product}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 mb-2">${item.card_type}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <button onclick="app.updateQuantity(${item.id}, -1)" class="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition text-xs font-bold" aria-label="Decrease quantity">-</button>
              <span class="px-2.5 py-1 text-xs font-semibold text-gray-900 min-w-[1.75rem] text-center">${item.quantity}</span>
              <button onclick="app.updateQuantity(${item.id}, 1)" class="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition text-xs font-bold" ${item.quantity >= MAX_QTY ? "disabled" : ""} aria-label="Increase quantity">+</button>
            </div>
            <span class="font-bold text-sm text-gray-900">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
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
    payNowBtn.textContent = `Pay $${total.toFixed(2)}`;
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
    const originalText = payNowBtn.textContent;
    payNowBtn.textContent = "Processing...";

    // Show processing overlay
    processingOverlay.classList.remove("hidden");

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
        processingOverlay.classList.add("hidden");
        payNowBtn.disabled = false;
        payNowBtn.textContent = originalText;
        alert(paymentResult.error || "Payment failed. Please try again.");
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
        card_name: paymentResult.dummy_card.name,
        card_number: paymentResult.dummy_card.number,
        card_expiry: paymentResult.dummy_card.expiry,
        card_cvv: paymentResult.dummy_card.cvv
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

      // Hide processing, navigate to success
      processingOverlay.classList.add("hidden");
      showSuccessPage(orderData, emailSent);
    } catch (err) {
      console.error("[Checkout] Error:", err);
      processingOverlay.classList.add("hidden");
      payNowBtn.disabled = false;
      payNowBtn.textContent = originalText;
      alert("Something went wrong. Please try again.");
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
