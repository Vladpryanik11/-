(function () {
  "use strict";

  // ---- Header shadow on scroll ----
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav toggle ----
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
      });
    });
  }

  // ---- Portfolio category filter ----
  var tabs = document.querySelectorAll(".tab-btn");
  var cards = document.querySelectorAll(".case-card");
  var portfolioEmpty = document.getElementById("portfolioEmpty");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      var filter = tab.getAttribute("data-filter");
      var visibleCount = 0;
      cards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !match;
        if (match) visibleCount++;
      });
      if (portfolioEmpty) {
        portfolioEmpty.hidden = visibleCount !== 0;
      }
    });
  });

  // ---- Services: category pills ----
  var svcTabs = document.querySelectorAll(".svc-tab");
  var svcRows = document.querySelectorAll(".service-row");
  svcTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      svcTabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      var cat = tab.getAttribute("data-cat");
      svcRows.forEach(function (row) {
        row.hidden = row.getAttribute("data-cat") !== cat;
      });
    });
  });

  // ---- Services: accordion rows (one open at a time) ----
  var svcHeads = document.querySelectorAll(".service-row-head");
  svcHeads.forEach(function (head) {
    head.addEventListener("click", function () {
      var row = head.closest(".service-row");
      var isOpen = row.classList.contains("open");
      svcRows.forEach(function (r) {
        r.classList.remove("open");
        r.querySelector(".service-row-head").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        row.classList.add("open");
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ---- Hero photo group: subtle cursor parallax ----
  // Moves the whole photo/blobs/badges cluster a few px toward the cursor.
  // Disabled on touch devices, small viewports (badges are hidden there
  // anyway) and prefers-reduced-motion; independent of the scroll-reveal
  // system since it only ever touches .hero-photo-wrap's own transform.
  var heroPhotoWrap = document.getElementById("heroPhotoWrap");
  var heroSection = document.getElementById("top");
  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointerQuery = window.matchMedia("(pointer: fine)");
  if (heroPhotoWrap && heroSection) {
    var parallaxTicking = false;
    var parallaxX = 0;
    var parallaxY = 0;

    function applyParallax() {
      parallaxTicking = false;
      heroPhotoWrap.style.transform =
        "translate3d(" + parallaxX.toFixed(2) + "px, " + parallaxY.toFixed(2) + "px, 0)";
    }

    function onHeroMouseMove(e) {
      if (reduceMotionQuery.matches || !finePointerQuery.matches || window.innerWidth <= 900) {
        return;
      }
      var rect = heroSection.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      var range = 14; // px, subtle
      parallaxX = relX * range;
      parallaxY = relY * range * 0.6;
      if (!parallaxTicking) {
        parallaxTicking = true;
        window.requestAnimationFrame(applyParallax);
      }
    }

    function resetParallax() {
      parallaxX = 0;
      parallaxY = 0;
      window.requestAnimationFrame(applyParallax);
    }

    if (!reduceMotionQuery.matches && finePointerQuery.matches) {
      heroSection.addEventListener("mousemove", onHeroMouseMove);
      heroSection.addEventListener("mouseleave", resetParallax);
    }
  }

  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });

    // Safety net: on a slow device, an odd viewport, or an observer that
    // never fires, content must never stay stuck invisible. Force-reveal
    // anything still hidden a couple seconds after load.
    window.setTimeout(function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains("is-visible")) {
          el.classList.add("is-visible");
        }
      });
    }, 2500);
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
