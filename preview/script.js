// Najaح — preview shared JS
// Language toggle (FR ↔ AR with RTL switch)

(function () {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  const body = document.body;
  let isAr = body.getAttribute('dir') === 'rtl';

  btn.addEventListener('click', () => {
    isAr = !isAr;
    body.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    body.setAttribute('lang', isAr ? 'ar' : 'fr');
    btn.textContent = isAr ? 'FR' : 'عربي';
    // Toggle visibility of [data-fr] / [data-ar] pairs
    document.querySelectorAll('[data-fr]').forEach((el) => { el.style.display = isAr ? 'none' : ''; });
    document.querySelectorAll('[data-ar]').forEach((el) => { el.style.display = isAr ? '' : 'none'; });
  });
})();
