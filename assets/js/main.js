import { store, categories, products, promo } from './data.js';
import { money, waLink, productMessage, searchProducts } from './format.js';

const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const wa = (text) => waLink(store.whatsapp, text);
const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
// Roupas ficam na vitrine Feminino/Masculino e na seção Infantil; o resto em "Beleza e bem-estar".
const CLOTHING = new Set(['fitness', 'masculino', 'infantil']);
products.forEach((p, i) => { p.key = i; }); // referência estável para abrir os detalhes
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

function priceHtml(p) {
  if (p.promoPrice != null && p.price != null) {
    return `<s><span class="sr-only">De </span>${money(p.price)}</s> <span class="is-promo"><span class="sr-only">por </span>${money(p.promoPrice)}</span>`;
  }
  if (p.promoPrice != null || p.price != null) return money(p.promoPrice ?? p.price);
  return '<span class="price-ask">Preço sob consulta</span>';
}

const fullNameOf = (p) => (p.color ? `${p.name} ${p.color}` : p.name);

function productCard(p) {
  const draft = !p.name;
  const category = categoryById[p.category] ?? { name: '', short: '' };
  const fullName = fullNameOf(p);
  const tags = [
    draft && '<span class="tag">Provisório</span>',
    p.promoPrice != null && '<span class="tag tag--promo">Promoção</span>',
    p.available === false && '<span class="tag tag--out">Esgotado</span>',
  ].filter(Boolean).join('');
  const price = priceHtml(p);

  // No celular só a primeira palavra aparece; o restante fica para leitores de tela.
  const label = `<span>${draft ? 'Consultar' : p.available === false ? 'Perguntar' : 'Pedir'}<span class="cta-long"> pelo WhatsApp</span></span>`;
  const href = p.buyUrl || wa(productMessage(p, category.name));

  return `<li>
    <article class="card">
      ${draft ? '<div class="media">' : `<button class="media card__open" type="button" data-key="${p.key}" aria-label="Ver detalhes: ${esc(fullName)}">`}
        ${media(p.images, fullName, `Espaço para foto de produto: ${category.name}`, draft ? category.short : '')}
        ${tags ? `<div class="card__tags">${tags}</div>` : ''}
      ${draft ? '</div>' : '</button>'}
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
  modaMore.textContent = `Ver mais peças (${list.length - modaShown})`;
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

// Janelas (busca e detalhes): trava a rolagem da página enquanto abertas; fecham no X, no Esc ou fora.
function openSheet(dialog) {
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('no-scroll');
}
// Destrava na hora em que fecha (o evento "close" nem sempre chega a tempo em todos os navegadores).
function closeSheet(dialog) {
  dialog.close();
  if (!document.querySelector('dialog.sheet[open]')) document.body.classList.remove('no-scroll');
}
document.querySelectorAll('dialog.sheet').forEach((d) => {
  d.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(d); }); // tecla Esc
  d.addEventListener('click', (e) => { if (e.target === d) closeSheet(d); });
});

// Detalhes do produto: fotos maiores, descrição completa e pedido pelo WhatsApp.
const quickView = $('#quick-view');
function openQuickView(p) {
  const category = categoryById[p.category]?.name ?? '';
  const images = p.images.filter(Boolean);
  const href = p.buyUrl || wa(productMessage(p, category));
  $('#qv-content').innerHTML = `
    <button class="icon-btn sheet__close" type="button" data-close aria-label="Fechar detalhes">${icon('close')}</button>
    <div class="qv__gallery">
      <div class="media qv__main">${images.length
        ? `<img id="qv-img" src="${esc(images[0])}" alt="${esc(fullNameOf(p))}">`
        : media([], '', `Foto em breve: ${p.name}`)}</div>
      ${images.length > 1 ? `<div class="qv__thumbs">${images.map((src, i) => `
        <button class="qv__thumb" type="button" data-src="${esc(src)}" aria-label="Foto ${i + 1} de ${images.length}" aria-pressed="${i === 0}">
          <img src="${esc(src)}" alt="">
        </button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(category)}</p>
      <h2 class="qv__name" id="qv-title">${esc(p.name)}</h2>
      ${p.color ? `<p class="qv__meta">${esc(p.color)}</p>` : ''}
      <p class="qv__price">${priceHtml(p)}</p>
      ${p.description ? `<p class="qv__desc">${esc(p.description)}</p>` : ''}
      <a class="btn btn--dark qv__cta" href="${esc(href)}" target="_blank" rel="noopener">${icon('wa')} ${p.available === false ? 'Perguntar disponibilidade' : 'Pedir pelo WhatsApp'}</a>
      <p class="qv__note">Tamanho, cor e entrega são confirmados com a loja pelo WhatsApp.</p>
    </div>`;
  openSheet(quickView);
  quickView.querySelector('.sheet__close').focus();
}

// Busca: sem acento e sem diferenciar maiúsculas; mostra até 24 resultados.
const search = $('#search');
const searchInput = $('#search-input');
const SEARCH_LIMIT = 24;
function runSearch() {
  const q = searchInput.value.trim();
  const found = searchProducts(products, q, (id) => categoryById[id]?.name);
  $('#search-suggest').hidden = Boolean(q);
  $('#search-count').textContent = !q || !found.length ? ''
    : found.length > SEARCH_LIMIT ? `Mostrando ${SEARCH_LIMIT} de ${found.length} produtos`
    : `${found.length} ${found.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
  $('#search-results').innerHTML = q && !found.length
    ? `<li class="empty">Nada encontrado para “${esc(q)}”. <a href="${esc(wa(`Olá! Vocês têm ${q} na Bella e Natural?`))}" target="_blank" rel="noopener">Pergunte pelo WhatsApp</a>.</li>`
    : found.slice(0, SEARCH_LIMIT).map(productCard).join('');
}
searchInput.addEventListener('input', runSearch);
$('#search-open').addEventListener('click', () => { openSheet(search); runSearch(); searchInput.focus(); });

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
  const open = e.target.closest('[data-key]');
  if (open) openQuickView(products[open.dataset.key]);
  const close = e.target.closest('[data-close]');
  if (close) closeSheet(close.closest('dialog'));
  const thumb = e.target.closest('.qv__thumb');
  if (thumb) {
    $('#qv-img').src = thumb.dataset.src;
    quickView.querySelectorAll('.qv__thumb').forEach((b) => b.setAttribute('aria-pressed', String(b === thumb)));
  }
  const term = e.target.closest('[data-term]');
  if (term) { searchInput.value = term.dataset.term; runSearch(); searchInput.focus(); }
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
