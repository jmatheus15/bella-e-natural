import { store, categories, products, promo } from './data.js';
import { money, waLink, productMessage } from './format.js';

const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const wa = (text) => waLink(store.whatsapp, text);
const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
// Roupas ficam na vitrine Feminino/Masculino e na seção Infantil; o resto em "Beleza e bem-estar".
const CLOTHING = new Set(['fitness', 'masculino', 'infantil']);
const sectionFor = (id) => ({ fitness: '#moda', masculino: '#moda', infantil: '#infantil' })[id] ?? '#bem-estar';

// Fotos reais quando houver; senão, espaço reservado identificado. A 2ª foto aparece no hover.
function media(images, alt, label, word = '') {
  const [first, second] = [].concat(images ?? []).filter(Boolean);
  if (!first) {
    return `<div class="ph" role="img" aria-label="${esc(label)}">
      <span class="ph__tag">Foto em breve</span>
      ${word ? `<span class="ph__word" aria-hidden="true">${esc(word)}</span>` : ''}
    </div>`;
  }
  return `<img src="${esc(first)}" alt="${esc(alt)}" loading="lazy" decoding="async">`
    + (second ? `<img class="media__alt" src="${esc(second)}" alt="" loading="lazy" decoding="async">` : '');
}

// Foto com caminho errado vira espaço reservado em vez de imagem quebrada.
document.addEventListener('error', (event) => {
  const img = event.target;
  if (img.tagName !== 'IMG' || !img.closest('.media')) return;
  if (img.classList.contains('media__alt')) { img.remove(); return; }
  img.outerHTML = `<div class="ph" role="img" aria-label="${esc(img.alt)}"><span class="ph__tag">Foto indisponível</span></div>`;
}, true);

function productCard(p) {
  const draft = !p.name;
  const category = categoryById[p.category] ?? { name: '', short: '' };
  const fullName = p.color ? `${p.name} ${p.color}` : p.name;
  const tags = [
    draft && '<span class="tag">Provisório</span>',
    p.promoPrice != null && '<span class="tag tag--promo">Promoção</span>',
    p.available === false && '<span class="tag tag--out">Esgotado</span>',
  ].filter(Boolean).join('');

  let price = 'Preço sob consulta';
  if (p.promoPrice != null && p.price != null) {
    price = `<s><span class="sr-only">De </span>${money(p.price)}</s> <span class="is-promo"><span class="sr-only">por </span>${money(p.promoPrice)}</span>`;
  } else if (p.promoPrice != null || p.price != null) {
    price = money(p.promoPrice ?? p.price);
  }

  // No celular só a primeira palavra aparece; o restante fica para leitores de tela.
  const label = `<span>${draft ? 'Consultar' : p.available === false ? 'Perguntar' : 'Pedir'}<span class="cta-long"> pelo WhatsApp</span></span>`;
  const href = p.buyUrl || wa(productMessage(p, category.name));

  return `<li>
    <article class="card">
      <div class="media">
        ${media(p.images, fullName, `Espaço para foto de produto: ${category.name}`, draft ? category.short : '')}
        ${tags ? `<div class="card__tags">${tags}</div>` : ''}
      </div>
      <div class="card__body">
        <h3 class="card__name">${esc(draft ? 'Produto em breve' : p.name)}</h3>
        <p class="card__meta">${esc(draft ? category.name : p.color)}</p>
        ${p.description ? `<p class="card__desc">${esc(p.description)}</p>` : ''}
        <p class="card__price">${price}</p>
        <a class="btn btn--line btn--sm card__cta" href="${esc(href)}" target="_blank" rel="noopener">${icon('wa')} ${label}</a>
      </div>
    </article>
  </li>`;
}

// Categorias: menu, rodapé e faixa usam a mesma lista.
const catLinks = categories.map((c) => `<li><a href="${sectionFor(c.id)}" data-cat="${c.id}">${esc(c.name)}</a></li>`).join('');
$('#menu-cats').innerHTML = catLinks;
$('#footer-cats').innerHTML = catLinks;
$('#cat-list').innerHTML = categories.map((c) => `<li>
  <a class="cat" href="${sectionFor(c.id)}" data-cat="${c.id}">
    <div class="media media--tall">${media(c.image, c.name, `Espaço para foto da categoria ${c.name}`, c.short)}</div>
    <span class="cat__name">${esc(c.name)}</span>
  </a>
</li>`).join('');

// Vitrine principal: feminino por padrão, botão troca para masculino. Mostra 8 peças por vez.
const modaGrid = $('#moda-grid');
const modaMore = $('#moda-more');
const MODA_PAGE = 8;
let gender = 'fitness';
let modaShown = MODA_PAGE;

function renderModa() {
  const list = products.filter((p) => p.name && p.category === gender);
  modaGrid.innerHTML = list.slice(0, modaShown).map(productCard).join('');
  modaMore.parentElement.hidden = list.length <= modaShown;
  document.querySelectorAll('.toggle [data-gender]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.gender === gender)));
}

function setGender(id) {
  gender = id;
  modaShown = MODA_PAGE;
  renderModa();
}

modaMore.addEventListener('click', () => { modaShown += MODA_PAGE; renderModa(); });
renderModa();

// Vitrines por categoria (Infantil): mesmo card das outras vitrines.
document.querySelectorAll('[data-category]').forEach((ul) => {
  ul.innerHTML = products.filter((p) => p.name && p.category === ul.dataset.category).map(productCard).join('');
});

// Setas das faixas roláveis.
const rails = [...document.querySelectorAll('.rail')];
function updateArrows(rail) {
  const atStart = rail.scrollLeft <= 2;
  const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  document.querySelectorAll(`[aria-controls="${rail.id}"][data-rail]`).forEach((b) => {
    b.disabled = b.dataset.rail === 'prev' ? atStart : atEnd;
  });
}
rails.forEach((rail) => rail.addEventListener('scroll', () => updateArrows(rail), { passive: true }));
window.addEventListener('resize', () => rails.forEach(updateArrows));
document.querySelectorAll('[data-rail]').forEach((b) => b.addEventListener('click', () => {
  const rail = document.getElementById(b.getAttribute('aria-controls'));
  rail.scrollBy({ left: (b.dataset.rail === 'prev' ? -1 : 1) * rail.clientWidth * 0.9, behavior: 'smooth' });
}));

// Destaques com filtro por categoria. "Todos" mostra só produtos cadastrados.
const productRail = $('#product-list');
let current = 'all';

function renderProducts() {
  const list = current === 'all'
    ? products.filter((p) => p.name && !CLOTHING.has(p.category))
    : products.filter((p) => p.category === current);
  productRail.innerHTML = list.length
    ? list.map(productCard).join('')
    : `<li class="empty">Ainda não há produtos cadastrados aqui. <a href="${esc(wa(`Olá! Quero conhecer os produtos de ${categoryById[current].name} da Bella e Natural.`))}" target="_blank" rel="noopener">Pergunte pelo WhatsApp</a>.</li>`;
  productRail.scrollLeft = 0;
  updateArrows(productRail);
}

function setFilter(id) {
  current = id;
  document.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === id)));
  renderProducts();
}

$('#filters').innerHTML = [{ id: 'all', name: 'Todos' }, ...categories.filter((c) => !CLOTHING.has(c.id))]
  .map((c) => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="${c.id === current}">${esc(c.name)}</button>`)
  .join('');
renderProducts();
rails.forEach(updateArrows);

// Kits e ofertas.
// Sem foto da campanha, a seção vira um bloco compacto em vez de um quadrado vazio.
if (promo.image) $('#promo-media').innerHTML = media(promo.image, promo.title, 'Foto da campanha de kits e ofertas');
else { $('#promo-media').hidden = true; $('#ofertas').classList.add('promo--compact'); }
$('#promo-content').innerHTML = `
  ${promo.title ? `<h3 class="promo__campaign">${esc(promo.title)}</h3>` : ''}
  <p class="promo__desc">${esc(promo.description || 'Os kits e as campanhas da loja aparecem aqui. Pergunte pelo WhatsApp quais estão disponíveis agora.')}</p>
  ${promo.price != null ? `<p class="promo__price">${money(promo.price)}</p>` : ''}
  ${promo.period ? `<p class="promo__period">${esc(promo.period)}</p>` : ''}
  <a class="btn btn--dark" href="${esc(wa(promo.title
    ? `Olá! Tenho interesse na oferta ${promo.title} da Bella e Natural.`
    : 'Olá! Quais kits e ofertas a Bella e Natural tem disponíveis agora?'))}" target="_blank" rel="noopener">${icon('wa')} Perguntar sobre os kits</a>`;

// Vídeo do banner: botão de pausa e respeito a "reduzir movimento" do sistema.
const heroVideo = $('.banner__video');
const heroPause = $('#hero-pause');
function setVideo(play) {
  if (play) heroVideo.play().catch(() => {}); else heroVideo.pause();
  heroPause.setAttribute('aria-label', play ? 'Pausar vídeo' : 'Reproduzir vídeo');
  heroPause.querySelector('use').setAttribute('href', play ? '#i-pause' : '#i-play');
}
if (matchMedia('(prefers-reduced-motion: reduce)').matches) setVideo(false);
heroPause.addEventListener('click', () => setVideo(heroVideo.paused));

// O vídeo começa sem som (exigência dos navegadores para tocar sozinho).
const heroSound = $('#hero-sound');
heroSound.addEventListener('click', () => {
  heroVideo.muted = !heroVideo.muted;
  heroSound.setAttribute('aria-label', heroVideo.muted ? 'Ativar som' : 'Desativar som');
  heroSound.querySelector('use').setAttribute('href', heroVideo.muted ? '#i-mute' : '#i-sound');
});

$('#year').textContent = new Date().getFullYear();

// Menu: gaveta no celular, barra no computador.
const menu = $('#menu');
const toggle = $('#menu-toggle');
const backdrop = $('#backdrop');
const catsToggle = $('#cats-toggle');
const catsList = $('#menu-cats');
const desktop = matchMedia('(min-width: 1024px)');

function setMenu(open, restoreFocus = true) {
  menu.classList.toggle('is-open', open);
  backdrop.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
  if (open) menu.querySelector('.menu__close').focus();
  else if (restoreFocus && !desktop.matches) toggle.focus();
}

function setCats(open) {
  catsToggle.setAttribute('aria-expanded', String(open));
  catsList.hidden = !open;
}

toggle.addEventListener('click', () => setMenu(true));
menu.querySelector('.menu__close').addEventListener('click', () => setMenu(false));
backdrop.addEventListener('click', () => setMenu(false));
catsToggle.addEventListener('click', () => setCats(catsList.hidden));
desktop.addEventListener('change', () => { setMenu(false, false); setCats(false); });

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (menu.classList.contains('is-open')) setMenu(false);
  else if (!catsList.hidden) { setCats(false); catsToggle.focus(); }
});

document.addEventListener('click', (e) => {
  const cat = e.target.closest('[data-cat]');
  const filter = e.target.closest('[data-filter]');
  const genderLink = e.target.closest('[data-gender]');
  if (genderLink) setGender(genderLink.dataset.gender);
  if (cat && (cat.dataset.cat === 'fitness' || cat.dataset.cat === 'masculino')) setGender(cat.dataset.cat);
  else if (cat && cat.dataset.cat !== 'infantil') setFilter(cat.dataset.cat);
  if (filter) setFilter(filter.dataset.filter);
  if (e.target.closest('#menu a')) { setMenu(false, false); setCats(false); }
  if (desktop.matches && !e.target.closest('.menu__item--cats')) setCats(false);
});
