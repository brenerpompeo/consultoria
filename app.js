// ======= CONFIG =======
const CHECKOUT_URL = ""; // não usado quando cada eBook tem seu próprio link
// (Sem consultoria/programas neste momento)

// ======= EBOOKS até R$ 29,90 (links Hotmart por eBook) =======
// Troque checkoutUrl pelos seus links reais.
const EBOOKS = [
  { id:"e1", title:"WhatsApp que Vende: 7 Mensagens-Prontas", price:19.90, tag:"Vendas", rating:4.8,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E1", image:"https://picsum.photos/seed/wpp/800/500" },

  { id:"e2", title:"IA pra Conteúdo: 50 Prompts Úteis", price:24.90, tag:"IA", rating:4.9,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E2", image:"https://picsum.photos/seed/ai/800/500" },

  { id:"e3", title:"SEO Essencial 2025: Guia Prático", price:24.90, tag:"SEO", rating:4.7,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E3", image:"https://picsum.photos/seed/seo/800/500" },

  { id:"e4", title:"Roteiros de Reels/TikTok (30 dias)", price:29.90, tag:"Redes Sociais", rating:4.6,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E4", image:"https://picsum.photos/seed/short/800/500" },

  { id:"e5", title:"Copy Essencial para Landing Pages", price:24.90, tag:"Conteúdo", rating:4.7,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E5", image:"https://picsum.photos/seed/copy/800/500" },

  { id:"e6", title:"LinkedIn B2B: Autoridade e Pipeline", price:29.90, tag:"Redes Sociais", rating:4.6,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E6", image:"https://picsum.photos/seed/linkedin/800/500" },

  { id:"e7", title:"Calendário Editorial de 90 Dias", price:19.90, tag:"Conteúdo", rating:4.6,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E7", image:"https://picsum.photos/seed/cal/800/500" },

  { id:"e8", title:"Fluxos de E-mail p/ Vendas (5 prontos)", price:24.90, tag:"Vendas", rating:4.5,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E8", image:"https://picsum.photos/seed/email/800/500" },

  { id:"e9", title:"Design Essencial no Canva (rápido)", price:19.90, tag:"Conteúdo", rating:4.6,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E9", image:"https://picsum.photos/seed/canva/800/500" },

  { id:"e10", title:"Rotina de Execução: 45′ por dia", price:19.90, tag:"Produtividade", rating:4.5,
    checkoutUrl:"https://pay.hotmart.com/SEU_LINK_E10", image:"https://picsum.photos/seed/ritual/800/500" },
];

const TAGS = ["Todos","Vendas","Conteúdo","IA","SEO","Redes Sociais","Produtividade"];

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

// ---------- Tags ----------
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

// ---------- Grid ----------
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
      <div class="meta"><strong>${money(item.price)}</strong><span class="dot"></span><span>Entrega imediata</span></div>
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

// ---------- Carrinho ----------
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

// ---------- Checkout (Hotmart por item) ----------
function setupCheckout(){
  const checkoutBtn = $("#checkout");
  const multi = $("#multi-checkout");
  checkoutBtn.onclick = (e) => {
    if (!CART.length) { e.preventDefault(); alert("Seu carrinho está vazio."); return; }

    if (CART.length === 1) {
      const only = CART[0];
      checkoutBtn.href = only.checkoutUrl;
      return; // segue o link
    }

    // 2+ itens → cada um tem seu link próprio
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

// ---------- INIT ----------
window.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  // Tema
  const themeBtn = $("#theme-toggle");
  if (themeBtn) themeBtn.onclick = toggleTheme;
  initTheme();

  // Carrinho
  $("#open-cart").onclick = openCart;
  $("#close-cart").onclick = closeCart;
  $("#cart-backdrop").onclick = closeCart;

  // Busca
  const input = $("#search-input");
  input.addEventListener("input", (ev)=>{ q = ev.target.value; renderGrid(); });

  renderTags();
  renderGrid();
  renderCart();
  setupCheckout();
});
