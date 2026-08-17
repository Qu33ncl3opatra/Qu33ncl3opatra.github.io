/* ===========================
   CONTACT.JS — Form Handling
=========================== */

document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const success = document.querySelector('.contact-success');
  if (success) {
    success.classList.add('show');
    this.reset();
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => success.classList.remove('show'), 5000);
  }
});
