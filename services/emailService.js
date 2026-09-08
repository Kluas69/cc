/**
 * EmailService - Isolated email sending via EmailJS
 *
 * Uses EmailJS free tier for order confirmation emails.
 * Public key is safe to expose in frontend code (it's a PUBLIC key, not private).
 *
 * Interface: sendOrderConfirmation(orderData) -> Promise<{ success, error? }>
 */
const EmailService = (() => {

  const CONFIG = {
    serviceID:  window.EmailServiceConfig?.serviceID  || 'cardingccofficial',
    templateID: window.EmailServiceConfig?.templateID || 'template_d6mc2z4',
    publicKey:  window.EmailServiceConfig?.publicKey  || 'zH4nL9MuX2A_oYq7W',
  };

  let emailjsReady = false;
  let loadPromise = null;

  function loadEmailJS() {
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve, reject) => {
      if (emailjsReady && window.emailjs) { resolve(window.emailjs); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = () => {
        if (!window.emailjs) {
          reject(new Error('EmailJS SDK loaded but window.emailjs is undefined'));
          return;
        }
        window.emailjs.init({ publicKey: CONFIG.publicKey });
        emailjsReady = true;
        console.log('[EmailJS] Initialized');
        console.log('[EmailJS] Service ID:', CONFIG.serviceID);
        console.log('[EmailJS] Template ID:', CONFIG.templateID);
        resolve(window.emailjs);
      };
      script.onerror = () => reject(new Error('Failed to load EmailJS SDK from CDN'));
      document.head.appendChild(script);
    });
    return loadPromise;
  }

  async function sendOrderConfirmation(orderData) {
    // Validate runtime config
    if (!CONFIG.serviceID || !CONFIG.templateID || !CONFIG.publicKey) {
      console.error('[EmailJS] Missing config:', {
        serviceID: !!CONFIG.serviceID,
        templateID: !!CONFIG.templateID,
        publicKey: !!CONFIG.publicKey
      });
      return { success: false, error: 'EmailJS configuration incomplete — missing Service ID, Template ID, or Public Key' };
    }

    // Validate customer email
    if (!orderData.email || !String(orderData.email).trim()) {
      return { success: false, error: 'Customer email is missing' };
    }

    try {
      const emailjs = await loadEmailJS();

      const items = orderData.items || [];
      const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

      const templateParams = {
        order_id: orderData.order_id,
        email: orderData.email,
        items: items,
        item_count: totalQuantity,
        total: orderData.total,
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_status,
        cards: orderData.cards || []
      };

      console.log('[EmailJS] Sending order confirmation');
      console.log('[EmailJS] Recipient:', orderData.email);
      console.log('[EmailJS] Order ID:', orderData.order_id);
      console.log('[EmailJS] Total quantity:', totalQuantity, '| Items:', items.length);
      console.log('[EmailJS] Total:', templateParams.total);

      const response = await emailjs.send(
        CONFIG.serviceID,
        CONFIG.templateID,
        templateParams
      );

      console.log('[EmailJS] SUCCESS — status:', response.status, '| text:', response.text);
      return { success: true };

    } catch (error) {
      console.error('[EmailJS] FAILED');
      console.error('[EmailJS] Status:', error?.status);
      console.error('[EmailJS] Text:', error?.text);
      console.error('[EmailJS] Message:', error?.message);

      let errorMsg = 'Email sending failed';
      if (error?.text) {
        errorMsg = error.text;
      } else if (error?.status === 400) {
        errorMsg = 'Bad request — check template ID and service connection in EmailJS dashboard';
      } else if (error?.status === 401) {
        errorMsg = 'Unauthorized — check public key in EmailJS dashboard';
      } else if (error?.status === 404) {
        errorMsg = 'Template or service not found — verify Service ID and Template ID in EmailJS dashboard';
      } else if (error?.message) {
        errorMsg = error.message;
      }

      return { success: false, error: errorMsg };
    }
  }

  return { sendOrderConfirmation };

})();
