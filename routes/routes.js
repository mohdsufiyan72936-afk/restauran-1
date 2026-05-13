import State from "../js/state.js";
import {updateSidebarActive} from '../components/sidebar.js';


// pages
import { buildHomePage, bindHomeEvents } from "../pages/home.js";
import { buildMenuPage, bindMenuEvents } from "../pages/menu.js";
import { buildGalleryPage, bindGalleryEvents } from "../pages/gallery.js";
import { bindReviewEvents, buildReviewsPage } from "../pages/reviews.js";
import { bindBookingEvents, buildBookingPage } from "../pages/booking.js";
import { bindContactEvents, buildContactPage } from "../pages/contact.js";
import { buildAboutPage } from "../pages/about.js";
import { buildOffersPage, bindOfferEvents} from '../pages/offers.js';

export function renderRoute(route) {
  State.set({ activeRoute: route });
  updateSidebarActive(route);
  const main = document.getElementById("main-content");
  if (!main) return;
  main.style.opacity = "0";
  main.style.transform = "translateY(8px)";
  setTimeout(async () => {
    switch (route) {
      case "home":
        main.innerHTML = await buildHomePage();
        bindHomeEvents();
        break;
      case "menu":
        main.innerHTML = buildMenuPage();
        bindMenuEvents();
        break;
      case "gallery":
        main.innerHTML = buildGalleryPage();
        bindGalleryEvents();
        break;
      case "reviews":
        main.innerHTML = buildReviewsPage();
        bindReviewEvents();
        break;
      case "offers":
        main.innerHTML = buildOffersPage();
        bindOfferEvents();
        break;
      case "booking":
        main.innerHTML = buildBookingPage();
        bindBookingEvents();
        break;
      case "contact":
        main.innerHTML = buildContactPage();
        bindContactEvents();
        break;
      case "about":
        main.innerHTML = buildAboutPage();
        break;
      default:
        main.innerHTML = await buildHomePage();
        bindHomeEvents();
    }
  
    main.style.opacity = "1";
    main.style.transform = "translateY(0)";
  }, 150);
}
