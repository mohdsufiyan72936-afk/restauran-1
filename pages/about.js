import State from "../js/state.js";


export  function buildAboutPage() {
  const site = State.get().site || {};
  const stats = site.stats || [];
  const team = site.team || [];
  const timeline = site.timeline || [];
  const awards = site.awards || [];

  return `
  <div>
    <div class="relative overflow-hidden rounded-3xl min-h-[260px] flex items-center mb-8"
      style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)">
      <div class="absolute inset-0 opacity-30" style="background-image:url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=60');background-size:cover;background-position:center"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
      <div class="relative z-10 p-8 md:p-12 max-w-xl">
        <div class="text-xs font-bold text-orange-400 mb-3 tracking-widest">EST. ${site.restaurant?.established || "2012"}</div>
        <h1 class="text-3xl md:text-5xl font-black text-white mb-4">Our Story</h1>
        <p class="text-gray-300">Born from a family kitchen in Bengaluru, RubanCore has been serving authentic Indian flavours for over 12 years — one plate at a time.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      ${[
        {
          icon: "🌿",
          title: "Our Mission",
          desc: "To bring the authentic taste of Indian home cooking to every table — with freshness, integrity, and love in every dish we serve.",
        },
        {
          icon: "👨‍🍳",
          title: "Our Vision",
          desc: "To be the most loved restaurant in the city, celebrated not just for our food, but for the memories we help create.",
        },
        {
          icon: "💛",
          title: "Our Values",
          desc: "Quality ingredients. No shortcuts. Genuine hospitality. Every guest leaves happier than they arrived — that's our promise.",
        },
      ]
        .map(
          (v) => `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-center">
          <div class="text-4xl mb-3">${v.icon}</div>
          <h3 class="font-black text-gray-900 dark:text-white mb-2">${v.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${v.desc}</p>
        </div>`,
        )
        .join("")}
    </div>

    <div class="bg-gradient-to-r from-orange-500 to-rose-600 rounded-3xl p-8 text-white mb-8">
      <h2 class="text-2xl font-black text-center mb-8">By the Numbers</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        ${stats
          .map(
            (s) => `
          <div>
            <div class="text-4xl font-black mb-1">${s.value}</div>
            <div class="text-white/80 text-sm">${s.label}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-black text-gray-900 dark:text-white mb-6 text-center">👨‍🍳 Meet the Team</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${team
          .map(
            (t) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">${t.emoji}</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">${t.name}</h3>
            <p class="text-orange-500 text-xs font-semibold mt-0.5">${t.role}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${t.specialty}</p>
            <p class="text-xs text-gray-400 mt-0.5">${t.exp}</p>
          </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-8">
      <h2 class="text-xl font-black text-gray-900 dark:text-white mb-6">Our Journey</h2>
      <div class="space-y-0">
        ${timeline
          .map(
            (ev, i) => `
          <div class="flex gap-5 ${i < timeline.length - 1 ? "pb-6" : ""}">
            <div class="flex flex-col items-center flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-xs font-black shadow-md">${ev.year.slice(2)}</div>
              ${i < timeline.length - 1 ? '<div class="w-0.5 flex-1 bg-gradient-to-b from-orange-400 to-gray-200 dark:to-gray-700 mt-1 min-h-8"></div>' : ""}
            </div>
            <div class="flex-1 pb-1">
              <div class="text-xs font-bold text-orange-500 mb-0.5">${ev.year}</div>
              <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-1">${ev.title}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${ev.desc}</p>
            </div>
          </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 class="font-bold text-gray-900 dark:text-white mb-4">🏆 Awards & Certifications</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        ${awards
          .map(
            (a) => `
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
            <div class="text-2xl mb-2">${a.icon}</div>
            <div class="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">${a.title}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${a.body}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>
  </div>`;
}

