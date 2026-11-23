/* Optional enhancements only: all portfolio content and links work without JavaScript. */
'use strict';
document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav-links');
toggle.hidden = false;
function closeMenu() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); } });
document.querySelector('.brief-enhancement').hidden = false;
document.querySelector('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const service = document.querySelector('#service').value;
  const brief = document.querySelector('#project-brief').value.trim();
  if (!brief) { document.querySelector('#project-brief').focus(); return; }
  const subject = `Unity enquiry: ${service}`;
  const body = `Hi Eric,\n\nI’m interested in ${service.toLowerCase()}.\n\n${brief}\n\nUnity version:\nTarget platform:\nDesired timeline:\nBudget / scope:\n\nThanks!`;
  window.location.href = `mailto:ericcollenickel@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
const copy = document.querySelector('#copy-email');
if (navigator.clipboard && window.isSecureContext) {
  copy.hidden = false;
  copy.addEventListener('click', async () => { const status = document.querySelector('#copy-status'); try { await navigator.clipboard.writeText('ericcollenickel@gmail.com'); status.textContent = 'Email copied.'; } catch { status.textContent = 'Select the email address to copy it.'; } });
}
document.querySelector('#year').textContent = new Date().getFullYear();

// Hero projects are derived from the project cards: edit each project once.
const slides = [...document.querySelectorAll('.project')].map(card => ({
  image: card.querySelector('img').getAttribute('src'),
  alt: card.querySelector('img').alt,
  title: card.querySelector('h3').textContent,
  category: card.querySelector('.eyebrow').textContent,
  description: [...card.querySelectorAll('.tags span')].map(tag => tag.textContent).join(' · '),
  href: card.querySelector('.project-body > a').href,
  link: card.querySelector('.project-body > a').textContent
}));
const hero = document.querySelector('.hero-project');
const controls = hero.querySelector('.hero-controls');
controls.hidden = false;
let slideIndex = 0;
let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer;
const pauseButton = document.querySelector('#hero-pause');
function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  const slide = slides[slideIndex];
  hero.querySelector('img').src = slide.image;
  hero.querySelector('img').alt = slide.alt;
  hero.querySelector('figcaption .eyebrow').textContent = slide.category;
  hero.querySelector('figcaption h2').textContent = slide.title;
  hero.querySelector('figcaption p').textContent = slide.description;
  const link = hero.querySelector('figcaption a');
  link.href = slide.href; link.textContent = slide.link;
  document.querySelector('#hero-position').textContent = `${slideIndex + 1} / ${slides.length}`;
}
function stopRotation() { clearInterval(timer); }
function startRotation() {
  stopRotation();
  if (!paused && !document.hidden && !hero.matches(':hover') && !hero.contains(document.activeElement)) timer = setInterval(() => showSlide(slideIndex + 1), 6000);
}
pauseButton.textContent = paused ? 'Play' : 'Pause';
pauseButton.setAttribute('aria-label', paused ? 'Start project rotation' : 'Pause project rotation');
pauseButton.addEventListener('click', () => {
  paused = !paused;
  pauseButton.textContent = paused ? 'Play' : 'Pause';
  pauseButton.setAttribute('aria-label', paused ? 'Start project rotation' : 'Pause project rotation');
  startRotation();
});
document.querySelector('#hero-prev').addEventListener('click', () => { showSlide(slideIndex - 1); startRotation(); });
document.querySelector('#hero-next').addEventListener('click', () => { showSlide(slideIndex + 1); startRotation(); });
hero.addEventListener('mouseenter', stopRotation);
hero.addEventListener('mouseleave', startRotation);
hero.addEventListener('focusin', stopRotation);
hero.addEventListener('focusout', () => setTimeout(startRotation, 0));
document.addEventListener('visibilitychange', startRotation);
showSlide(0);
startRotation();
