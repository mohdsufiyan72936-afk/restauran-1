// ============================================================
// api.js — Static JSON data layer + Google Sheets booking only
// ============================================================

import State from "./state.js";

// ─── CONFIG ───────────────────────────────────────────────
// Replace with your deployed Google Apps Script Web App URL
const SHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbwVqyeXQN0H39C-eyBNLFJYjjjO2YA7XN2C8FFauFhskDcwWHwYHf17_3JtdI_EPd3VOA/exec";

// ─── INTERNAL LOADER ─────────────────────────────────────
async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path} — HTTP ${res.status}`);
  return res.json();
}

// ─── MENU ─────────────────────────────────────────────────
export async function fetchMenu() {
  State.set({ isLoading: true });
  try {
    const data = await loadJson("./data/menu.json");
    State.set({ menuItems: data, filteredItems: data, isLoading: false });
    return data;
  } catch (err) {
    console.error("[API] menu.json load error:", err);
    State.set({ isLoading: false });
    throw err;
  }
}

// ─── REVIEWS ─────────────────────────────────────────────
/** Returns all reviews from reviews.json */
export async function fetchReviews() {
  try {
    return await loadJson("./data/reviews.json");
  } catch (err) {
    console.error("[API] reviews.json load error:", err);
    return [];
  }
}

/** Returns only the first `n` reviews — used on the home screen */
export async function fetchHomeReviews(n = 6) {
  const all = await fetchReviews();
  return all.slice(0, n);
}

// ─── OFFERS ──────────────────────────────────────────────
export async function fetchOffers() {
  try {
    return await loadJson("./data/offers.json");
  } catch (err) {
    console.error("[API] offers.json load error:", err);
    return [];
  }
}

// ─── GALLERY ─────────────────────────────────────────────
export async function fetchGallery() {
  try {
    return await loadJson("./data/gallery.json");
  } catch (err) {
    console.error("[API] gallery.json load error:", err);
    return [];
  }
}

// ─── SITE CONFIG (stats, team, hours, etc.) ──────────────
export async function fetchSiteConfig() {
  try {
    return await loadJson("./data/site.json");
  } catch (err) {
    console.error("[API] site.json load error:", err);
    return {};
  }
}

// ─── BOOKING → GOOGLE SHEETS ─────────────────────────────
/**
 * Sends a table booking to Google Sheets via Apps Script.
 * This is the ONLY function that hits a remote endpoint.
 *
 * @param {object} booking
 * @param {string} booking.name
 * @param {string} booking.phone
 * @param {string} booking.email
 * @param {string} booking.date      — ISO date string e.g. "2025-06-15"
 * @param {string} booking.time      — e.g. "7:30 PM"
 * @param {string} booking.guests    — e.g. "4" or "7+"
 * @param {string} booking.occasion  — e.g. "Anniversary"
 * @param {string} booking.notes     — special requests
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function submitBooking(booking) {
  try {
    const payload = {
      action: "booking",
      timestamp: new Date().toISOString(),
      ...booking,
    };
    const res = await fetch(SHEETS_API_URL, {
      method: "POST",
      // Google Apps Script requires text/plain for no-CORS mode.
      // If you deploy the script with CORS headers, switch to application/json.
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Sheets POST failed — HTTP ${res.status}`);
    const json = await res.json();
    return { success: true, ...json };
  } catch (err) {
    console.error("[API] submitBooking error:", err);
    // Return a soft failure — the UI will still show a success toast
    // but mark it as offline so you can retry / save locally if needed.
    return { success: false, offline: true, message: err.message };
  }
}

// ─── LEGACY STUBS (kept so existing app.js call-sites don't break) ─
/**
 * @deprecated  All data is now static. This stub always returns an empty object.
 *              Remove call-sites in app.js that use fetchData() for analytics.
 */
export async function fetchData(action = "getAnalytics") {
  console.warn(
    `[API] fetchData("${action}") called — no longer used. All data is static JSON.`,
  );
  return {};
}

/**
 * @deprecated  Non-booking postData calls are no-ops in the static build.
 *              Use submitBooking() for bookings.
 */
export async function postData(action, payload) {
  if (action === "booking") {
    return submitBooking(payload);
  }
  // All other actions (add_to_cart, review, analytics) are silently dropped
  // in the static build — no remote endpoint exists for them.
  console.info(`[API] postData("${action}") — static build, no-op.`);
  return { success: true, static: true };
}

// ─── GOOGLE APPS SCRIPT TEMPLATE ─────────────────────────
/*
─────────────────────────────────────────────────────────────
SETUP INSTRUCTIONS
─────────────────────────────────────────────────────────────

1. Open https://script.google.com and create a new project.
2. Replace the contents with the code below.
3. Change SHEET_ID to your Google Spreadsheet ID.
4. Click Deploy → New deployment → Web app.
   - Execute as: Me
   - Who has access: Anyone
5. Copy the deployment URL and paste it into SHEETS_API_URL above.

─────────────────────────────────────────────────────────────
Apps Script code (paste into script.google.com):
─────────────────────────────────────────────────────────────

const SHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'Bookings';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet with headers if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp', 'Name', 'Phone', 'Email',
        'Date', 'Time', 'Guests', 'Occasion', 'Notes'
      ]);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.name    || '',
      body.phone   || '',
      body.email   || '',
      body.date    || '',
      body.time    || '',
      body.guests  || '',
      body.occasion|| '',
      body.notes   || '',
    ]);

    // Optional: send email notification
    // MailApp.sendEmail('you@example.com', 'New Booking — ' + body.name, JSON.stringify(body, null, 2));

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health-check endpoint (GET)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', sheet: SHEET_NAME }))
    .setMimeType(ContentService.MimeType.JSON);
}
*/
