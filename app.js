// ======= CONFIG =======
// Checkout e agenda
const CHECKOUT_URL = "https://exemplo-de-checkout.com"; // troque pelo seu link geral
const CALENDLY_URL = "https://calendly.com/seu-link";   // troque pelo seu link

// CMS externo gratuito (Contentful) — habilite quando tiver Space/Token
const USE_CONTENTFUL   = true; // mude para true quando quiser usar CMS
const CONTENTFUL_SPACE = "1kgxkf37biiv";    // ex.: "abcd1234xyz"
const CONTENTFUL_TOKEN = "PlMk2iNRamJ_kmWCyJ4cyFX3-Hkqeiy0ucaPi_jQGxc";    // Content Delivery (só leitura)

// ======= DADOS DE EXEMPLO (fallback local) =======
const EBOOKS = [
  { id: "e1", title: "Narrativa de Marca Pessoal", price: 79.0, tag: "Marca Pessoal", rating: 4.8, checkoutUrl: CHECKOUT_URL, image: "https://picsum.photos/seed/e1/800/500" },
  { id: "e2", title: "Playbook de Posicionamento", price: 97.0, tag: "Estratégia",     rating: 4.9, checkoutUrl: CHECKOUT_URL, image: "https://picsum.photos/seed/e2/800/500" },
  { id: "e3", title: "Storytelling para Apresentações", price: 69.0, tag: "Comunicação", rating: 4.7, checkoutUrl: CHECKOUT_URL, image: "https://picsum.photos/seed/e3/800/500" },
  { id: "e4", title: "Rituais de Alta Performance", price: 59.0, tag: "Produtividade",  rating: 4.6, checkoutUrl: CHECKOUT_URL, image: "https://picsum.photos/seed/e4/800/500" },
  { id: "e5", title: "Liderança Consciente", price: 89.0, tag: "Liderança",            rating: 4.8, checkoutUrl: CHECKOUT_URL, image: "https://picsum.photos/seed/e5/800/500" },
  { id: "e6", title: "Conteúdo que Vende", price: 74.0, tag: "Vendas",                 rating: 4.7, checkoutUrl: CHECKOUT_URL, image: "https://picsum.photos/seed/e6/800/500" },
  { id: "e7", title: "Guia ESG para Comunicação", price: 82.0, tag: "ESG",             rating: 4.6, checkoutUrl: CHECKOUT_URL, image: "https://picsum.photos/seed/e7/800/500" },
  { id: "e8", title: "Pitch Magnético", price: 54.0, tag: "Comunicação",               rating: 4.5, checkoutUrl: CHECKOUT_URL, image: "https://picsum.photos/seed/e8/800/500" },
];
const TAGS = ["Todos","Estratégia","Comunicação","Liderança","Produtividade","Marca Pessoal","ESG","Vendas"];

// ======= THEME (Light/Night) =======
const THEME_KEY = "THEME";
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = t === 'light' ? '🌙' : '☀️';
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return applyTheme(saved);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark');
}
function toggleTheme(){
  const curr = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = curr === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next); applyTheme(next);
}

// ======= STATE =======
let CART = JSON.parse(localStorage.getItem("CART")||"[]");
let currentTag = "Todos";
let q = "";

// ======= HELPERS =======
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const money = n => n.toLocaleString('pt-BR',{style:'currency', currency:'BRL'});

function coverHtml(item){
  return item.image
    ? `<div class="cover"><img src="${item.image}" alt="Capa do eBook ${item.title}"></div>`
    : `<div class="cover"></div>`;
}

function renderTags(){
  const wrap = $("#tag-pills"); if (!wrap) return;
  wrap.innerHTML = "";
  TAGS.forEach(t => {
    const b = document.createElement("button");
    b.className = "pill" + (t===currentTag? " active": "");
    b.textContent = t;
    b.onclick = () => { currentTag = t; renderGrid(); renderTags(); };
    wrap.appendChild(b);
  });
}

function renderGrid(){
  const grid = $("#ebooks-grid"); if (!grid) return;
  grid.innerHTML = "";
  const list = EBOOKS.filter(e =>
    (currentTag==="Todos" || e.tag===currentTag) &&
    (!q || e.title.toLowerCase().includes(q.toLowerCase()))
  );
  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${coverHtml(item)}
      <div class="badge">${item.tag}</div>
      <h3 style="margin:10px 0 6px">${item.title}</h3>
      <div class="micro" style="margin-bottom:10px">⭐ ${item.rating.toFixed(1)}</div>
      <div style="font-size:20px; font-weight:700">${money(item.price)}</div>
      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
        <button class="btn btn-primary">Adicionar</button>
        <a class="btn" target="_blank" rel="noopener" href="${item.checkoutUrl}">Comprar agora</a>
      </div>
    `;
    // Destaque extra ao focar o CTA primário
    const addBtn = card.querySelector("button");
    addBtn.onmouseenter = () => card.style.boxShadow = "0 14px 36px rgba(124,58,237,.35)";
    addBtn.onmouseleave = () => card.style.boxShadow = "";
    addBtn.onclick = () => addToCart(item);
    grid.appendChild(card);
  });
}

function addToCart(item){
  if(!CART.find(i=>i.id===item.id)) CART.push(item);
  localStorage.setItem("CART", JSON.stringify(CART));
  openCart();
  renderCart();
}

function removeFromCart(id){
  CART = CART.filter(i => i.id !== id);
  localStorage.setItem("CART", JSON.stringify(CART));
  renderCart();
}

function cartTotal(){
  return CART.reduce((a,b)=>a+b.price,0);
}

function renderCart(){
  const list = $("#cart-items"); if (!list) return;
  list.innerHTML = "";
  CART.forEach(it => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <div style="font-weight:700">${it.title}</div>
        <div class="micro">${money(it.price)}</div>
      </div>
      <button class="icon" aria-label="Remover">Remover</button>
    `;
    row.querySelector("button").onclick = () => removeFromCart(it.id);
    list.appendChild(row);
  });
  $("#cart-total").textContent = money(cartTotal());
}

function openCart(){ $("#cart").classList.add("open"); $("#cart").style.pointerEvents="auto"; }
function closeCart(){ $("#cart").classList.remove("open"); setTimeout(()=>$("#cart").style.pointerEvents="none",200); }

// ======= CMS: Contentful (opcional) =======
async function fetchContentfulEbooks(){
  const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE}/environments/master/entries?content_type=ebook&order=fields.title&include=1`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${CONTENTFUL_TOKEN}` }});
  if(!res.ok) throw new Error("Falha ao carregar do Contentful");
  const data = await res.json();
  const assets = Object.fromEntries((data.includes?.Asset || []).map(a => [a.sys.id, a]));
  return data.items.map(e => {
    const imgId = e.fields.cover?.sys?.id;
    const file  = imgId ? assets[imgId]?.fields?.file?.url : null;
    return {
      id: e.sys.id,
      title: e.fields.title,
      price: e.fields.price,
      tag: e.fields.tag,
      rating: e.fields.rating ?? 4.8,
      image: file ? `https:${file}` : null,
      checkoutUrl: e.fields.checkoutUrl || CHECKOUT_URL
    };
  });
}

// ======= INIT =======
window.addEventListener("DOMContentLoaded", async () => {
  // ano footer
  $("#year").textContent = new Date().getFullYear();

  // tema
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.onclick = toggleTheme;
  initTheme();

  // eventos carrinho/CTAs
  $("#open-cart").onclick = openCart;
  $("#close-cart").onclick = closeCart;
  $("#cart-backdrop").onclick = closeCart;
  $("#checkout").onclick = (e)=>{
    if(!CHECKOUT_URL || CHECKOUT_URL.includes("exemplo")) {
      e.preventDefault(); alert("Defina seu link de checkout em app.js");
    }
  };
  $("#cta-calendly").href = CALENDLY_URL;
  $("#cta-mentoria").href = CALENDLY_URL;
  $("#cta-proposta").href = CALENDLY_URL;
  $("#cta-cohort").href = CALENDLY_URL;
  $("#cta-bootcamp").href = CALENDLY_URL;

  // busca
  const input = $("#search-input");
  input.addEventListener("input", (ev)=>{ q = ev.target.value; renderGrid(); });

  // Tenta CMS (Contentful); se falhar, usa mock local
  try {
    if (USE_CONTENTFUL && CONTENTFUL_SPACE && CONTENTFUL_TOKEN) {
      const items = await fetchContentfulEbooks();
      if (Array.isArray(items) && items.length) {
        EBOOKS.length = 0; EBOOKS.push(...items); // sobrescreve o mock
      }
    }
  } catch (e) { console.warn("[CMS]", e); }

  renderTags();
  renderGrid();
  renderCart();
});
