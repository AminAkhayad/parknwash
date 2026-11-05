(function () {
  var WA = "32468411593";
  var MAIL = "lahdhirilouay21@gmail.com";

  // Header-rand bij scrollen
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobiel menu
  var toggle = document.querySelector(".menu-toggle");
  var mnav = document.querySelector(".mobile-nav");
  if (toggle && mnav) {
    toggle.addEventListener("click", function () {
      var open = mnav.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.innerHTML = open
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mnav.classList.contains("open")) toggle.click();
    });
  }

  // Voor/na-schuif
  document.querySelectorAll(".ba").forEach(function (el) {
    var input = el.querySelector("input");
    if (!input) return;
    function set() { el.style.setProperty("--pos", input.value + "%"); }
    input.addEventListener("input", set);
    set();
  });

  // Verschijnen bij scrollen
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (i) { io.observe(i); });
  } else {
    items.forEach(function (i) { i.classList.add("in"); });
  }

  // Jaar in footer
  document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  // Formulieren: bouwen een WhatsApp- of e-mailbericht op
  function val(form, name) {
    var f = form.elements[name];
    if (!f) return "";
    if (f.length && f[0] && f[0].type === "radio") {
      for (var i = 0; i < f.length; i++) if (f[i].checked) return f[i].value;
      return "";
    }
    if (f.length && f[0] && f[0].type === "checkbox") {
      var out = [];
      for (var j = 0; j < f.length; j++) if (f[j].checked) out.push(f[j].value);
      return out.join(", ");
    }
    if (f.type === "checkbox") return f.checked ? f.value : "";
    return (f.value || "").trim();
  }

  document.querySelectorAll("form[data-message]").forEach(function (form) {
    var err = form.querySelector(".form-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.dataset.via) || "wa";
      var missing = [];
      form.querySelectorAll("[required]").forEach(function (r) { if (!r.value.trim()) missing.push(r); });
      if (missing.length) {
        if (err) err.classList.add("show");
        missing[0].focus();
        return;
      }
      if (err) err.classList.remove("show");

      var type = form.dataset.message;
      var lines = [];
      var subject = "Prijsaanvraag via de website";

      if (type === "particulier") {
        lines.push("Dag Louay,");
        lines.push("");
        lines.push("Ik wil graag een prijs.");
        lines.push("Dienst: " + (val(form, "dienst") || "nog niet zeker"));
        var ex = val(form, "extra");
        if (ex) lines.push("Extra: " + ex);
        lines.push("Wagen: " + val(form, "wagen"));
        lines.push("Gemeente: " + val(form, "gemeente"));
        if (val(form, "naam")) lines.push("Naam: " + val(form, "naam"));
        if (val(form, "bericht")) { lines.push(""); lines.push(val(form, "bericht")); }
        subject = "Prijsaanvraag " + (val(form, "dienst") || "") + " - " + val(form, "wagen");
      } else {
        lines.push("Dag Louay,");
        lines.push("");
        lines.push("Ik wil graag een offerte.");
        lines.push("Bedrijf: " + val(form, "bedrijf"));
        lines.push("Type: " + (val(form, "type") || "-"));
        lines.push("Aantal wagens: " + val(form, "aantal"));
        lines.push("Standplaats: " + val(form, "standplaats"));
        if (val(form, "frequentie")) lines.push("Frequentie: " + val(form, "frequentie"));
        if (val(form, "contact")) lines.push("Contact: " + val(form, "contact"));
        if (val(form, "bericht")) { lines.push(""); lines.push(val(form, "bericht")); }
        subject = "Offerte " + val(form, "bedrijf");
      }

      var text = lines.join("\n");
      var url = via === "mail"
        ? "mailto:" + MAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text + "\n\nMet vriendelijke groeten")
        : "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
      if (via === "mail") window.location.href = url; else window.open(url, "_blank", "noopener");
    });
  });

  // Dienst voorselecteren via ?dienst=
  var params = new URLSearchParams(window.location.search);
  var d = params.get("dienst");
  if (d) {
    var r = document.querySelector('input[name="dienst"][value="' + d.replace(/"/g, "") + '"]');
    if (r) r.checked = true;
  }
})();
