// ======= CONFIG =======
const CHECKOUT_URL = "https://exemplo-de-checkout.com"; // troque pelo seu link geral
const CALENDLY_URL = "https://calendly.com/seu-link";   // troque pelo seu link

// ======= DADOS DE EXEMPLO =======
const EBOOKS = [
  { id: "e1", title: "Narrativa de Marca Pessoal", price: 79.0, tag: "Marca Pessoal", rating: 4.8, checkoutUrl: CHECKOUT_URL },
  { id: "e2", title: "Playbook de Posicionamento", price: 97.0, tag: "Estratégia", rating: 4.9, checkoutUrl: CHECKOUT_URL },
  { id: "e3", title: "Storytelling para Apresentações", price: 69.0, tag: "Comunicação", rating: 4.7, checkoutUrl: CHECKOUT_URL },
  { id: "e4", title: "Rituais de Alta Performance", price: 59.0, tag: "Produtividade", rating: 4.6, checkoutUrl: CHECKOUT_URL },
  { id: "e5", title: "Liderança Consciente", price: 89.0, tag: "Liderança", rating: 4.8, checkoutUrl: CHECKOUT_URL },
  { id: "e6", title: "Conteúdo que Vende", price: 74.0, tag: "Vendas", rating: 4.7, checkoutUrl: CHECKOUT_URL },
  { id: "e7", title: "Guia ESG para Comunicação", price: 82.0, tag: "ESG", rating: 4.6, checkoutUrl: CHECKOUT_URL },
  { id: "e8", title: "Pitch Magnético", price: 54.0, tag: "Comunicação", rating: 4.5, checkoutUrl: CHECKOUT_URL },
];
const TAGS = ["Todos","Estratégia","Comunicação","Liderança","Produtividade","Marca Pessoal","ESG","Vendas"];

// ======= STATE =======
let CART = JSON.parse(localStorage.getItem("CART")||"[]");
let currentTag = "Todos";
let q = "";

// ======= HELPERS =======
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const money = n => n.toLocaleString('pt-BR',{style:'currency', currency:'BRL'});

function renderTags(){
  const wrap = $("#tag-pills"); wrap.innerHTML = "";
  TAGS.forEach(t => {
    const b = document.createElement("button");
    b.className = "pill" + (t===currentTag? " active": "");
    b.textContent = t;
    b.onclick = () => { currentTag = t; renderGrid(); renderTags(); };
    wrap.appendChild(b);
  });
}

function renderGrid(){
  const grid = $("#ebooks-grid"); grid.innerHTML = "";
  const list = EBOOKS.filter(e => (currentTag==="Todos" || e.tag===currentTag) && (!q || e.title.toLowerCase().includes(q.toLowerCase())));
  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="badge">${item.tag}</div>
      <h3 style="margin:10px 0 6px">${item.title}</h3>
      <div class="micro" style="margin-bottom:10px">⭐ ${item.rating.toFixed(1)}</div>
      <div style="font-size:20px; font-weight:600">${money(item.price)}</div>
      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
        <button class="btn btn-primary">Adicionar</button>
        <a class="btn" target="_blank" rel="noopener" href="${item.checkoutUrl}">Comprar agora</a>
      </div>
    `;
    card.querySelector("button").onclick = () => addToCart(item);
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
  const list = $("#cart-items");
  list.innerHTML = "";
  CART.forEach(it => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `<div><div style="font-weight:600">${it.title}</div><div class="micro">${money(it.price)}</div></div>
                     <button class="icon" aria-label="Remover">Remover</button>`;
    row.querySelector("button").onclick = () => removeFromCart(it.id);
    list.appendChild(row);
  });
  $("#cart-total").textContent = money(cartTotal());
}

function openCart(){ $("#cart").classList.add("open"); $("#cart").style.pointerEvents="auto"; }
function closeCart(){ $("#cart").classList.remove("open"); setTimeout(()=>$("#cart").style.pointerEvents="none",200); }

// ======= INIT =======
window.addEventListener("DOMContentLoaded", () => {
  // ano footer
  $("#year").textContent = new Date().getFullYear();
  // eventos
  $("#open-cart").onclick = openCart;
  $("#close-cart").onclick = closeCart;
  $("#cart-backdrop").onclick = closeCart;
  $("#checkout").onclick = (e)=>{
    if(!CHECKOUT_URL || CHECKOUT_URL.includes("exemplo")) { e.preventDefault(); alert("Defina seu link de checkout em app.js"); }
  };
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
  renderCart();
});
