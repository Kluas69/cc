/**
 * Router - Hash-based SPA routing
 *
 * Routes:
 *   #/        -> Shop (product grid)
 *   #/checkout -> Checkout page
 *   #/success  -> Order success page
 */
const Router = (() => {
  const routes = {
    '/': 'shopPage',
    '/checkout': 'checkoutPage',
    '/success': 'successPage',
  };

  let onRouteChange = null;

  function getRoute() {
    return (location.hash.replace(/^#/, '') || '/');
  }

  function navigate(path) {
    location.hash = path;
  }

  function handleRouteChange() {
    const route = getRoute();
    const pageId = routes[route] || routes['/'];

    // Hide all pages
    Object.values(routes).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    // Show target page
    const target = document.getElementById(pageId);
    if (target) target.classList.remove('hidden');

    // Update nav active states
    document.querySelectorAll('[data-route]').forEach(link => {
      link.classList.toggle('active', link.dataset.route === route);
    });

    // Scroll to top
    window.scrollTo(0, 0);

    // Notify listeners
    if (onRouteChange) onRouteChange(route, pageId);
  }

  function init(callback) {
    onRouteChange = callback || null;
    window.addEventListener('hashchange', handleRouteChange);

    // Set default route if none
    if (!location.hash || location.hash === '#') {
      location.hash = '#/';
    }

    handleRouteChange();
  }

  return { init, navigate, getRoute };
})();
