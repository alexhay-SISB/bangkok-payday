const $ = (id) => document.getElementById(id);
const bookingTime = new Date('2026-11-27T18:30:00+07:00').getTime();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hearts(amount = 24) {
  if (reducedMotion) return;
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart-particle';
    heart.textContent = i % 4 ? '♥' : '✧';
    heart.style.cssText = `left:${10 + Math.random() * 80}%;top:${35 + Math.random() * 25}%;font-size:${15 + Math.random() * 22}px;--drift:${(Math.random() - .5) * 260}px;--fall:${-200 - Math.random() * 300}px;--twist:${(Math.random() - .5) * 100}deg;animation-delay:${Math.random() * .3}s;`;
    $('confetti-layer').appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}

const invitation = $('envelope');
if (typeof invitation.showModal === 'function') invitation.showModal();
$('open-invitation').addEventListener('click', () => { invitation.close(); window.scrollTo(0, 0); $('hero-title').setAttribute('tabindex', '-1'); $('hero-title').focus({preventScroll: true}); hearts(); });

function updateCountdown(now = Date.now()) {
  const total = Math.max(0, Math.ceil((bookingTime - now) / 1000));
  $('hours').textContent = String(Math.floor(total / 3600)).padStart(2, '0');
  $('minutes').textContent = String(Math.floor(total / 60) % 60).padStart(2, '0');
  $('seconds').textContent = String(total % 60).padStart(2, '0');
  if (now >= bookingTime) {
    const sameEvening = now < new Date('2026-11-28T03:00:00+07:00').getTime();
    $('countdown-title').textContent = sameEvening ? 'It’s our date o’clock. ♡' : 'A lovely little memory. ♡';
    $('countdown-message').textContent = sameEvening ? 'The wait is over. Now for the good part: you + me.' : '27 November 2026. Two people, forty floors up.';
  }
}
updateCountdown();
setInterval(() => updateCountdown(), 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateCountdown(); });

const venueSource = 'https://www.kimptonmaalaibangkok.com/bangkok-restaurants/baryard-rooftop-bar/';
const slides = [
  {file:'venue-0.webp', alt:'The colourful interior and illuminated bar at Bar.Yard', caption:'A little colour. A lot of atmosphere.', source:venueSource},
  {file:'venue-4.webp', alt:'The open-air Bar.Yard terrace and Bangkok skyline at dusk', caption:'Forty floors above the everyday.', source:venueSource},
  {file:'ig-5.webp', alt:'Orchid-topped cocktails at Bar.Yard, photographed by @bar.yard', caption:'Pretty cocktails. Even prettier company.', source:'https://www.instagram.com/bar.yard/p/DfmN2d-E34L/', instagram:true, portrait:true},
  {file:'venue-1.webp', alt:'The red-lit bar, tropical decor and curved seating at Bar.Yard', caption:'The city can be our background music.', source:venueSource},
  {file:'ig-0.webp', alt:'An intimate rooftop table at night at Bar.Yard, photographed by @bar.yard', caption:'A table, a view, and a little main-character energy.', source:'https://www.instagram.com/bar.yard/p/Df9ZBHmClCU/', instagram:true, portrait:true},
  {file:'venue-3.webp', alt:'Warm lighting and a welcoming lounge area in Bar.Yard', caption:'For the “we should do this again” part.', source:venueSource},
  {file:'ig-6.webp', alt:'A smiling Bar.Yard bartender serving a cocktail, photographed by @bar.yard', caption:'Here’s to a very good evening.', source:'https://www.instagram.com/bar.yard/p/DfhEQmKDZAk/', instagram:true, portrait:true}
];
let slideIndex = 0;
const dotButtons = slides.map((slide, index) => {
  const button = document.createElement('button');
  button.setAttribute('aria-label', `View photo ${index + 1}: ${slide.caption}`);
  button.setAttribute('aria-current', String(index === 0));
  button.addEventListener('click', () => showSlide(index));
  $('gallery-dots').appendChild(button);
  return button;
});
function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  const slide = slides[slideIndex];
  $('gallery-image').src = `assets/${slide.file}`;
  $('gallery-image').alt = slide.alt;
  $('gallery-image').classList.toggle('portrait', !!slide.portrait);
  $('gallery-caption').textContent = slide.caption;
  $('gallery-label').textContent = `${String(slideIndex + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  $('photo-source').href = slide.source;
  $('photo-source').textContent = slide.instagram ? 'Photo: @bar.yard · View Instagram post ↗' : 'Photo: Kimpton Maa-Lai Bangkok ↗';
  dotButtons.forEach((button, i) => button.setAttribute('aria-current', String(i === slideIndex)));
}
$('gallery-prev').addEventListener('click', () => showSlide(slideIndex - 1));
$('gallery-next').addEventListener('click', () => showSlide(slideIndex + 1));
$('gallery-stage').addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showSlide(slideIndex + (event.key === 'ArrowRight' ? 1 : -1)); } });
let touchStart = null;
$('gallery-stage').addEventListener('touchstart', (event) => { touchStart = {x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY}; }, {passive:true});
$('gallery-stage').addEventListener('touchend', (event) => { if (!touchStart) return; const x = event.changedTouches[0].clientX - touchStart.x; const y = event.changedTouches[0].clientY - touchStart.y; if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) showSlide(slideIndex + (x < 0 ? 1 : -1)); touchStart = null; }, {passive:true});

const colourLines = {black:'Black? Classic. My ability to act normal? Less certain.',white:'White? Lovely. I shall try not to spill anything near you.',grey:'Grey? Understated. Unlike the effort I put into this invitation.',brown:'Brown? Warm, elegant, and very much my cup of tea.',gold:'Gold? Excellent. Now the skyline has some competition.'};
document.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', String(b === button))); $('colour-reply').textContent = colourLines[button.dataset.colour]; hearts(8); }));

const compliments = [
  'I picked a rooftop with a view. Then remembered I’d mostly be looking at you.',
  'You’re the reason a perfectly sensible man has made an entire website.',
  'I was going to play it cool. The pink hearts may have given me away.',
  'Tonight’s best accessory? Your smile. The heels are a strong runner-up.',
  'The booking is for two. My excitement is doing the work of at least five people.',
  'You’ve already made my Friday better. And you haven’t even arrived yet.',
  'Some people bring flowers. Apparently I bring a fully functioning countdown.',
  'If I lose my train of thought tonight, please consider it a compliment.'
];
let complimentIndex = 0;
$('compliment-button').addEventListener('click', () => { $('compliment').textContent = compliments[complimentIndex++ % compliments.length]; $('compliment-button').textContent = 'Okay, one more ♡'; hearts(14); });
$('excited-button').addEventListener('click', () => { $('excited-reply').textContent = 'Good. That was the whole point. See you at 6:30 ♡'; $('excited-button').textContent = 'Mission: make you smile ✓'; hearts(40); });

$('copy-address').addEventListener('click', async () => {
  const address = 'Kimpton Maa-Lai Bangkok, 78 Soi Ton Son, Lumphini, Pathum Wan, Bangkok 10330. Bar.Yard, 40th floor. โรงแรมคิมป์ตัน มาลัย กรุงเทพฯ 78 ซอยต้นสน';
  try { await navigator.clipboard.writeText(address); $('copy-status').textContent = 'Copied! One step closer to our date. ♡'; }
  catch { $('copy-status').textContent = address; }
});
