// ============================================================
// state.js — Central application state management
// ============================================================

const State = (() => {
  let _state = {
    menuItems: [],
    filteredItems: [],
    reviews: [],
    offers: [],
    gallery: [],
    site: null,
   
    theme: localStorage.getItem("rb_theme") || "light",
    activeRoute: "home",
   
    filters: {
      search: "",
      category: "All",
      priceMin: 0,
      priceMax: 2000,
      rating: 0,
      tag: null,
    },
    sort: "popularity",
    analytics: {
      totalOrders: 1284,
      totalRevenue: 487320,
      topItems: [],
      dailyStats: [],
    },
    isLoading: false,
   
  };


  function get() {
    return { ..._state };
  }

  function set(partial) {
    _state = { ..._state, ...partial };
    // subscribers.forEach((fn) => fn(_state));
  }

  

  function persist(key, value) {
    localStorage.setItem("rb_" + key, JSON.stringify(value));
  }






  return {
    get,
    set,
  
   
  };
})();

export default State;
