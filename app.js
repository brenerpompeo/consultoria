// ======= CONFIG =======
const CHECKOUT_URL = ""; // não é usado quando cada eBook tem seu próprio link
const CALENDLY_URL = "https://calendly.com/seu-link";

// ======= LISTA DE EBOOKS (Hotmart por eBook) =======
// Substitua checkoutUrl pelo link real de cada produto na Hotmart.
const EBOOKS = [
  // 1) WhatsApp Sales (tendência forte no BR)
  { id:"e1", title:"Playbook de Vendas no WhatsApp (2025)", price:89.0, tag:"Vendas", rating:4.8,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E1", image:"https://picsum.photos/seed/wpp/800/500" },

  // 2) IA generativa aplicada a conteúdo/marketing
  { id:"e2", title:"IA Generativa na Prática: Prompts & Fluxos para Conteúdo", price:97.0, tag:"Comunicação", rating:4.9,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E2", image:"https://picsum.photos/seed/ai/800/500" },

  // 3) SEO & Conteúdo para a era da IA
  { id:"e3", title:"SEO em 2025: Conteúdo para a era da IA (guia tático)", price:79.0, tag:"Estratégia", rating:4.7,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E3", image:"https://picsum.photos/seed/seo/800/500" },

  // 4) Live commerce e short video
  { id:"e4", title:"Shorts & Lives: Storytelling e Conversão (Reels, TikTok, Live Commerce)", price:74.0, tag:"Comunicação", rating:4.6,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E4", image:"https://picsum.photos/seed/short/800/500" },

  // 5) ESG na comunicação
  { id:"e5", title:"ESG na Comunicação: do discurso à prática (2025)", price:82.0, tag:"ESG", rating:4.6,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E5", image:"https://picsum.photos/seed/esg/800/500" },

  // 6) LinkedIn B2B para autoridade e pipeline
  { id:"e6", title:"LinkedIn B2B: Autoridade, Conteúdo e Pipeline", price:84.0, tag:"Estratégia", rating:4.7,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E6", image:"https://picsum.photos/seed/linkedin/800/500" },

  // 7) Automação leve: WhatsApp + Email
  { id:"e7", title:"Automação Leve: WhatsApp + E-mail para leads e vendas", price:78.0, tag:"Vendas", rating:4.6,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E7", image:"https://picsum.photos/seed/auto/800/500" },

  // 8) Storytelling imersivo (tendência de narrativas envolventes)
  { id:"e8", title:"Brand Storytelling Imersivo: roteiros e rituais", price:69.0, tag:"Comunicação", rating:4.5,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E8", image:"https://picsum.photos/seed/story/800/500" },
];

const TAGS = ["Todos","Estratégia","Comunicação","Liderança","Produtividade","Marca Pessoal","ESG","Vendas"];

// ======= CONTEÚDOS (Medium) =======
// Troque pelas suas URLs reais do Medium
const MEDIUM_POSTS = [
  { id:"m1", title:"WhatsApp que converte: 7 atalhos de jornada", tag:"Vendas",
    url:"https://medium.com/@seuusuario/whatsapp-atalhos", image:"https://picsum.photos/seed/med1/800/500", reading:"6 min" },
  { id:"m2", title:"IA no conteúdo: 5 prompts que viram post em 15min", tag:"Comunicação",
    url:"https://medium.com/@seuusuario/ia-prompts-conteudo", image:"https://picsum.photos/seed/med2/800/500", reading:"7 min" },
  { id:"m3", title:"Lives que vendem: roteiro de 20 minutos", tag:"Comunicação",
    url:"https://medium.com/@seuusuario/lives-roteiro", image:"https://picsum.photos/seed/med3/800/500", reading:"5 min" },
];

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

function coverHtml(item, alt){
  return item?.image
    ? `<div class="cover"><img src="${item.image}" alt="${alt}"></div>`
    : `<div class="cover"></div>`;
}

/* ---------- RENDER: EBOOKS ---------- */
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
      ${coverHtml(item, `Capa do eBook ${item.title}`)}
      <div class="meta"><span>${item.tag}</span><span class="dot"></span><span>⭐ ${item.rating.toFixed(1)}</span></div>
      <h3 style="margin:8px 0 6px">${item.title}</h3>
      <div class="meta"><strong>${money(item.price)}</strong></div>
      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
        <button class="btn btn-primary" aria-label="Adicionar ${item.title} ao carrinho">Adicionar</button>
        <a class="btn" target="_blank" rel="noopener" href="${item.checkoutUrl}" aria-label="Comprar ${item.title} agora">Comprar agora</a>
      </div>
    `;
    const addBtn = card.querySelector("button");
    addBtn.onmouseenter = () => card.style.boxShadow = "0 14px 30px rgba(124,58,237,.28)";
    addBtn.onmouseleave = () => card.style.boxShadow = "";
    addBtn.onclick = () => addToCart(item);
    grid.appendChild(card);
  });
}

/* ---------- RENDER: CONTEÚDOS (Medium) ---------- */
function renderContent(){
  const grid = $("#content-grid"); if (!grid) return;
  grid.innerHTML = "";
  MEDIUM_POSTS.forEach(post => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${coverHtml(post, `Capa do artigo ${post.title}`)}
      <div class="meta"><span>${post.tag}</span><span class="dot"></span><span>${post.reading}</span></div>
      <h3 style="margin:8px 0 10px">${post.title}</h3>
      <div style="display:flex; gap:8px; flex-wrap:wrap">
        <a class="btn" href="${post.url}" target="_blank" rel="noopener" aria-label="Abrir Medium: ${post.title}">Ler no Medium ↗</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- CART ---------- */
function addToCart(item){
  if(!CART.find(i=>i.id===item.id)) CART.push(item);
  localStorage.setItem("CART", JSON.stringify(CART));
  openCart(); renderCart();
}
function removeFromCart(id){
  CART = CART.filter(i => i.id !== id);
  localStorage.setItem("CART", JSON.stringify(CART));
  renderCart();
}
function cartTotal(){ return CART.reduce((a,b)=>a+b.price,0); }
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

/* ---------- CHECKOUT (Hotmart por item) ---------- */
function setupCheckout(){
  const checkoutBtn = $("#checkout");
  const multi = $("#multi-checkout");
  checkoutBtn.onclick = (e) => {
    if (!CART.length) { e.preventDefault(); alert("Seu carrinho está vazio."); return; }

    if (CART.length === 1) {
      // 1 item → vai direto para o link do item
      const only = CART[0];
      checkoutBtn.href = only.checkoutUrl;
      return; // deixa seguir
    }

    // 2+ itens → lista de checkouts (Hotmart não consolida múltiplos produtos por padrão)
    e.preventDefault();
    multi.innerHTML = `
      <div class="micro">Você tem ${CART.length} itens. Conclua cada compra separadamente na Hotmart:</div>
      ${CART.map(it => `<a class="btn btn-primary" target="_blank" rel="noopener" href="${it.checkoutUrl}">Comprar "${it.title}" agora</a>`).join("")}
      <button class="btn" id="open-all">Abrir todos</button>
    `;
    const openAll = $("#open-all");
    if (openAll) openAll.onclick = () => CART.forEach(it => window.open(it.checkoutUrl, "_blank"));
  };
}

/* ---------- INIT ---------- */
window.addEventListener("DOMContentLoaded", () => {
  // ano footer
  $("#year").textContent = new Date().getFullYear();

  // tema
  const themeBtn = $("#theme-toggle");
  if (themeBtn) themeBtn.onclick = toggleTheme;
  initTheme();

  // carrinho/CTAs
  $("#open-cart").onclick = openCart;
  $("#close-cart").onclick = closeCart;
  $("#cart-backdrop").onclick = closeCart;
  $("#cta-calendly").href = CALENDLY_URL;
  $("#cta-mentoria").href = CALENDLY_URL;
  $("#cta-proposta").href = CALENDLY_URL;
  $("#cta-cohort").href = CALENDLY_URL;
  $("#cta-bootcamp").href = CALENDLY_URL;

  // busca
  const input = $("#search-input");
  input.addEventListener("input", (ev)=>{ q = ev.target.value; renderGrid(); });

  renderTags();
  renderGrid();
  renderContent();
  renderCart();
  setupCheckout();
});
