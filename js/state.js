// ============================================================
// state.js — Central application state management
// ============================================================

const State = (() => {
  let _state = {
    menuItems: [],
    filteredItems: [],
    favorites: JSON.parse(localStorage.getItem('rb_favorites') || '[]'),
    cart: JSON.parse(localStorage.getItem('rb_cart') || '[]'),
    theme: localStorage.getItem('rb_theme') || 'light',
    activeRoute: 'home',
    isAdmin: localStorage.getItem('rb_admin') === 'true',
    filters: {
      search: '',
      category: 'All',
      priceMin: 0,
      priceMax: 2000,
      rating: 0,
      tag: null,
    },
    sort: 'popularity',
    analytics: {
      totalOrders: 1284,
      totalRevenue: 487320,
      topItems: [],
      dailyStats: [],
    },
    isLoading: false,
    notifications: [],
  };

  const subscribers = [];

  function get() { return { ..._state }; }

  function set(partial) {
    _state = { ..._state, ...partial };
    subscribers.forEach(fn => fn(_state));
  }

  function subscribe(fn) {
    subscribers.push(fn);
    return () => {
      const idx = subscribers.indexOf(fn);
      if (idx !== -1) subscribers.splice(idx, 1);
    };
  }

  function persist(key, value) {
    localStorage.setItem('rb_' + key, JSON.stringify(value));
  }

  function toggleFavorite(id) {
    const favs = [..._state.favorites];
    const idx = favs.indexOf(id);
    if (idx === -1) favs.push(id); else favs.splice(idx, 1);
    set({ favorites: favs });
    persist('favorites', favs);
    return idx === -1;
  }

  function isFavorite(id) { return _state.favorites.includes(id); }

  function addToCart(item) {
    const cart = [..._state.cart];
    const existing = cart.find(c => c.id === item.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });
    set({ cart });
    persist('cart', cart);
  }

  function removeFromCart(id) {
    const cart = _state.cart.filter(c => c.id !== id);
    set({ cart });
    persist('cart', cart);
  }

  function updateCartQty(id, delta) {
    const cart = _state.cart
      .map(c => c.id !== id ? c : { ...c, qty: Math.max(0, c.qty + delta) })
      .filter(c => c.qty > 0);
    set({ cart });
    persist('cart', cart);
  }

  function cartTotal() { return _state.cart.reduce((s, c) => s + c.price * c.qty, 0); }
  function cartCount() { return _state.cart.reduce((s, c) => s + c.qty, 0); }
  function clearCart() { set({ cart: [] }); persist('cart', []); }

  function loginAdmin() {
    set({ isAdmin: true });
    localStorage.setItem('rb_admin', 'true');
  }

  function logoutAdmin() {
    set({ isAdmin: false });
    localStorage.removeItem('rb_admin');
  }

  return { get, set, subscribe, toggleFavorite, isFavorite, addToCart, removeFromCart, updateCartQty, cartTotal, cartCount, clearCart, loginAdmin, logoutAdmin };
})();

export default State;
