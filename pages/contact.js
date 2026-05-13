import State from "../js/state.js";
export  function buildContactPage() {
  const site = State.get().site?.restaurant || {};
  return `
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-black text-gray-900 dark:text-white">📞 Contact Us</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">We'd love to hear from you</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="space-y-4">
        ${[
          {
            icon: "📞",
            label: "Call Us",
            value: site.phone || "+91 99999 99999",
            sub: "Mon–Sun, 10 AM – 10 PM",
            href: `tel:${site.phone || "+919999999999"}`,
            btnText: "Call Now",
            btnClass: "bg-blue-500 hover:bg-blue-600",
          },
          {
            icon: "💬",
            label: "WhatsApp",
            value: site.phone || "+91 99999 99999",
            sub: "Instant response, quick orders",
            href: `https://wa.me/${site.whatsapp || "919999999999"}?text=Hi RubanCore!`,
            btnText: "Open WhatsApp",
            btnClass: "bg-green-500 hover:bg-green-600",
          },
          {
            icon: "📧",
            label: "Email",
            value: site.email || "hello@rubancore.com",
            sub: "We reply within 24 hours",
            href: `mailto:${site.email || "hello@rubancore.com"}`,
            btnText: "Send Email",
            btnClass: "bg-violet-500 hover:bg-violet-600",
          },
        ]
          .map(
            (c) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl flex-shrink-0">${c.icon}</div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5">${c.label}</div>
              <div class="font-bold text-gray-900 dark:text-white text-sm">${c.value}</div>
              <div class="text-xs text-gray-400 dark:text-gray-500">${c.sub}</div>
            </div>
            <a href="${c.href}" ${c.href.startsWith("https") ? 'target="_blank"' : ""} class="px-3 py-2 ${c.btnClass} text-white font-semibold rounded-xl text-xs transition-colors flex-shrink-0">${c.btnText}</a>
          </div>`,
          )
          .join("")}
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl flex-shrink-0">📍</div>
            <div>
              <div class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5">Address</div>
              <div class="font-bold text-gray-900 dark:text-white text-sm mb-1">${site.name || "RubanCore"} Restaurant</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">${site.address?.line1 || ""}<br>${site.address?.line2 || ""}<br>${site.address?.line3 || ""}</div>
              <a href="${site.mapsUrl || "https://maps.google.com"}" target="_blank" class="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-xs mt-2 transition-colors">Get Directions →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 class="font-bold text-gray-900 dark:text-white">📍 Find Us</h3>
        <a href="${site.mapsUrl || "https://maps.google.com"}" target="_blank" class="text-sm font-semibold text-orange-500 hover:text-orange-600">Open in Maps →</a>
      </div>
      <div class="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
        <div class="text-center">
          <div class="text-5xl mb-3">🗺️</div>
          <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">${site.address?.line1 || "123 Foodie Lane, MG Road"}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${site.address?.line2 || "Bengaluru, Karnataka 560001"}</p>
          <a href="${site.mapsUrl || "https://maps.google.com"}" target="_blank"
            class="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
            📍 Get Directions
          </a>
        </div>
      </div>
    </div>
  </div>`;
}

export  function bindContactEvents() {
  /* no form in contact page */
}