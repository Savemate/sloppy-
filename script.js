/* ================================================================
   SLOPPY® STORE — CORE JAVASCRIPT
   ================================================================ */

const WHATSAPP = '27794874559';
const CURRENCY = 'R';
const FREE_SHIPPING = 800;
const CART_KEY = 'sloppy_cart_v4';
const WISH_KEY = 'sloppy_wish_v4';
const NL_KEY = 'sloppy_nl_v2';

/* ---------- PRODUCTS ---------- */
const PRODUCTS = [
  {
    id: 'umduvulo-tee',
    name: 'Umduvulo T-Shirt',
    price: 449.99,
    category: 'Umduvulo',
    stock: 30,
    description: 'The Umduvulo tee — a considered cut in premium cotton. Clean lines, comfortable drape, and a fit made to be worn every day. Available in Black, Cream, and Olive.',
    images: [
      'https://i.imgur.com/qJhz2pc.png', // Black
      'https://i.imgur.com/HDqf9Si.png', // Cream
      'https://i.imgur.com/ELcOhd8.png'  // Olive
    ],
    sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'umduvulo-ls',
    name: 'Umduvulo Long Sleeve',
    price: 549.99,
    category: 'Umduvulo',
    stock: 22,
    description: 'Long sleeve Umduvulo in heavyweight cotton. Ribbed cuffs, relaxed fit, and a clean finish that wears in beautifully.',
    images: [
      'https://i.imgur.com/gijOyRs.png'
    ],
    sizes: ['S','M','L','XL']
  },
  {
    id: 'umduvulo-signature',
    name: 'Umduvulo Signature Shirt',
    price: 599.99,
    category: 'Umduvulo',
    stock: 15,
    description: 'The Umduvulo signature shirt — a refined take on the everyday piece. Structured collar, considered stitching, and a fit that holds its shape.',
    images: [
      'https://i.imgur.com/bqd0Fqx.png'
    ],
    sizes: ['S','M','L','XL']
  },
  {
    id: 'umduvulo-rugby',
    name: 'Umduvulo Rugby Jersey',
    price: 1199.99,
    category: 'Pre-order',
    tag: 'Pre-order',
    stock: 0,
    preorder: true,
    description: 'The Umduvulo rugby jersey — available on pre-order only. Heavyweight construction, woven collar, and a made-to-last build. Place your pre-order on WhatsApp.',
    images: [
      'https://i.imgur.com/sabBn7T.png'
    ],
    sizes: ['S','M','L','XL']
  },
  {
    id: 'sloppy-royal-tee',
    name: 'Sloppy Umduvulo Royal Blue T-Shirt',
    price: 699.99,
    category: 'Sloppy',
    tag: 'Limited Edition',
    stock: 10,
    description: 'The Sloppy Umduvulo Royal Blue T-Shirt. A limited edition release in premium cotton. Available in Royal Blue and Natural Ecru.',
    images: [
      'https://i.imgur.com/2N1RuWW.png', // Royal Blue
      'https://i.imgur.com/mGc9Orv.png'  // Natural Ecru
    ],
    sizes: ['S','M','L','XL']
  },
  {
    id: 'sloppy-s-tee-black',
    name: 'Sloppy "S" Symbol T-Shirt',
    price: 749.99,
    category: 'Sloppy',
    tag: 'Signature',
    stock: 18,
    description: 'The Sloppy "S" symbol tee — our mark in full. Premium cotton, refined print, and a fit that carries the signature quietly. Available in Black.',
    images: [
      'https://i.imgur.com/2hEDoLP.png'
    ],
    sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'sloppy-s-tee-white',
    name: 'Sloppy "S" Symbol T-Shirt',
    price: 749.99,
    category: 'Sloppy',
    tag: 'Signature',
    stock: 18,
    description: 'The Sloppy "S" symbol tee — our mark in full. Premium cotton, refined print, and a fit that carries the signature quietly. Available in White.',
    images: [
      'https://i.imgur.com/nijjv0A.png'
    ],
    sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'sloppy-tee',
    name: 'Sloppy T-Shirt',
    price: 599.99,
    category: 'Sloppy',
    stock: 25,
    description: 'The Sloppy tee — clean, considered, and quietly confident. A staple piece in the Sloppy wardrobe. Available in Black and White.',
    images: [
      'https://i.imgur.com/ffhvDMe.png', // Black
      'https://i.imgur.com/bEQj1iz.png'  // White
    ],
    sizes: ['S','M','L','XL']
  }
];

/* ---------- STATE ---------- */
let cart = load(CART_KEY, []);
let wishlist = load(WISH_KEY, []);
let state = {
  filter: 'All',
  sort: 'featured',
  search: '',
  modal: null,
  modalImg: 0,
  modalSize: null,
  modalQty: 1
};

/* ---------- STORAGE ---------- */
function load(key, fallback){
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch(e){ return fallback; }
}
function save(key, val){
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){}
}

/* ---------- HELPERS ---------- */
function money(n){ return CURRENCY + Number(n).toLocaleString('en-ZA', {minimumFractionDigits:2, maximumFractionDigits:2}); }
function getProduct(id){ return PRODUCTS.find(p => p.id === id); }
function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

/* ================================================================
   SHOP RENDERING
   ================================================================ */
function getVisibleProducts(){
  let list = PRODUCTS.slice();
  if (state.filter !== 'All') list = list.filter(p => p.category === state.filter);
  if (state.search.trim()){
    const q = state.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }
  switch(state.sort){
    case 'price-asc': list.sort((a,b) => a.price - b.price); break;
    case 'price-desc': list.sort((a,b) => b.price - a.price); break;
    case 'name': list.sort((a,b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}

function renderShop(){
  const grid = document.getElementById('productGrid');
  const list = getVisibleProducts();

  if (list.length === 0){
    grid.innerHTML = `<div class="empty-results"><h3>Nothing here yet.</h3><p>Try a different search or filter.</p></div>`;
    return;
  }

  grid.innerHTML = list.map((p, i) => {
    const inWish = wishlist.includes(p.id);
    const soldOut = p.stock === 0 && !p.preorder;
    const badge = p.preorder
      ? `<span class="badge pre">Pre-order</span>`
      : soldOut
        ? `<span class="badge sold">Sold out</span>`
        : (p.tag ? `<span class="badge">${esc(p.tag)}</span>` : '');
        
    // Fallback image if Imgur blocks it
    const imgFallback = `onerror="this.style.display='none'; this.parentElement.style.background='var(--grey-soft)';"`;

    return `
      <article class="card" style="animation-delay:${i*0.05}s" onclick="openModal('${p.id}')">
        <div class="card-media">
          ${badge}
          <img class="img-1" src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy" ${imgFallback}>
          <img class="img-2" src="${p.images[1] || p.images[0]}" alt="${esc(p.name)} detail" loading="lazy" ${imgFallback}>
          <button class="wish-btn ${inWish?'active':''}" onclick="event.stopPropagation();toggleWishlist('${p.id}')" aria-label="Wishlist">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${inWish?'currentColor':'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          ${!soldOut ? `<div class="card-quick">${p.preorder?'Pre-order · View':'View · Add to Bag'}</div>` : ''}
        </div>
        <div class="card-info">
          <span class="card-cat">${esc(p.category)}</span>
          <span class="card-name">${esc(p.name)}</span>
          <span class="card-price">${money(p.price)}</span>
        </div>
      </article>`;
  }).join('');
}

/* ================================================================
   FILTER / SORT / SEARCH
   ================================================================ */
document.getElementById('filterChips').addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.filter = btn.dataset.filter;
  renderShop();
});

function onSort(v){ state.sort = v; renderShop(); }
function onSearch(v){ state.search = v; renderShop(); }

function focusSearch(){
  document.getElementById('shop').scrollIntoView({ behavior:'smooth' });
  setTimeout(() => document.getElementById('searchInput').focus(), 500);
}

/* ================================================================
   WISHLIST
   ================================================================ */
function toggleWishlist(id){
  const i = wishlist.indexOf(id);
  if (i > -1){ wishlist.splice(i, 1); showToast('Removed from wishlist'); }
  else { wishlist.push(id); showToast('Added to wishlist'); }
  save(WISH_KEY, wishlist);
  renderShop();
  renderWishlist();
  updateBadges();
  if (state.modal) renderModal();
}

function renderWishlist(){
  const body = document.getElementById('wishBody');
  if (wishlist.length === 0){
    body.innerHTML = `
      <div class="empty-state">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        <p>Your wishlist is empty.</p>
        <button onclick="closeWishlist();document.getElementById('shop').scrollIntoView({behavior:'smooth'})">Browse the collection</button>
      </div>`;
    return;
  }
  body.innerHTML = wishlist.map(id => {
    const p = getProduct(id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${p.images[0]}" alt="${esc(p.name)}"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${esc(p.name)}</div>
          <div class="cart-item-meta">${esc(p.category)}</div>
          <div class="cart-item-price">${money(p.price)}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.5rem;align-items:flex-end">
          <button class="remove" onclick="toggleWishlist('${p.id}')">Remove</button>
          <button class="remove" style="color:var(--blue)" onclick="closeWishlist();openModal('${p.id}')">View →</button>
        </div>
      </div>`;
  }).join('');
}

/* ================================================================
   CART
   ================================================================ */
function addToCart(productId, size, qty){
  const product = getProduct(productId);
  if (!product) return;
  if (product.preorder){
    orderViaWhatsApp(product, size, qty, true);
    return;
  }
  if (product.stock === 0) return;
  const existing = cart.find(i => i.id === productId && i.size === size);
  if (existing) existing.qty += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, size: size, image: product.images[0], qty: qty });
  save(CART_KEY, cart);
  renderCart();
  updateBadges();
  pulse('cartCount');
  showToast(`${product.name} (${size}) added to bag`);
}

function changeQty(index, delta){
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  save(CART_KEY, cart);
  renderCart();
  updateBadges();
}

function removeItem(index){
  cart.splice(index, 1);
  save(CART_KEY, cart);
  renderCart();
  updateBadges();
}

function cartSubtotal(){ return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function renderCart(){
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const shipBar = document.getElementById('shipBar');
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartDrawerCount').textContent = `(${totalQty})`;

  if (cart.length === 0){
    body.innerHTML = `
      <div class="empty-state">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your bag is empty.</p>
        <button onclick="closeCart();document.getElementById('shop').scrollIntoView({behavior:'smooth'})">Start shopping</button>
      </div>`;
    foot.style.display = 'none';
    shipBar.style.display = 'none';
    return;
  }

  const sub = cartSubtotal();
  const remaining = Math.max(0, FREE_SHIPPING - sub);
  const pct = Math.min(100, (sub / FREE_SHIPPING) * 100);
  shipBar.style.display = 'block';
  document.getElementById('shipFill').style.width = pct + '%';
  document.getElementById('shipText').innerHTML = remaining > 0
    ? `You're <strong>${money(remaining)}</strong> away from free shipping`
    : `<strong>You've unlocked free shipping ◆</strong>`;

  body.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.image}" alt="${esc(item.name)}"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${esc(item.name)}</div>
        <div class="cart-item-meta">Size: ${esc(item.size)}</div>
        <div class="qty">
          <button onclick="changeQty(${i},-1)" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${i},1)" aria-label="Increase">+</button>
        </div>
        <div class="cart-item-price">${money(item.price * item.qty)}</div>
      </div>
      <button class="remove" onclick="removeItem(${i})">Remove</button>
    </div>`).join('');

  document.getElementById('subtotal').textContent = money(sub);
  foot.style.display = 'block';
}

function updateBadges(){
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const c = document.getElementById('cartCount');
  c.textContent = cartCount;
  c.dataset.empty = cartCount === 0 ? 'true' : 'false';
  const w = document.getElementById('wishCount');
  w.textContent = wishlist.length;
  w.dataset.empty = wishlist.length === 0 ? 'true' : 'false';
  document.getElementById('wishDrawerCount').textContent = `(${wishlist.length})`;
}

function pulse(id){
  const el = document.getElementById(id);
  el.classList.add('pulse');
  setTimeout(() => el.classList.remove('pulse'), 320);
}

/* ================================================================
   DRAWERS
   ================================================================ */
function openCart(){
  closeWishlist();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden','false');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden','true');
  maybeUnlock();
}
function openWishlist(){
  closeCart();
  renderWishlist();
  document.getElementById('wishDrawer').classList.add('open');
  document.getElementById('wishDrawer').setAttribute('aria-hidden','false');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeWishlist(){
  document.getElementById('wishDrawer').classList.remove('open');
  document.getElementById('wishDrawer').setAttribute('aria-hidden','true');
  maybeUnlock();
}
function closeAll(){ closeCart(); closeWishlist(); closeModal(); }
function maybeUnlock(){
  const cartOpen = document.getElementById('cartDrawer').classList.contains('open');
  const wishOpen = document.getElementById('wishDrawer').classList.contains('open');
  const modalOpen = document.getElementById('productModal').classList.contains('open');
  if (!cartOpen && !wishOpen && !modalOpen){
    document.getElementById('overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ================================================================
   PRODUCT MODAL
   ================================================================ */
function openModal(id){
  const p = getProduct(id);
  if (!p) return;
  state.modal = p;
  state.modalImg = 0;
  state.modalSize = p.sizes[0];
  state.modalQty = 1;
  closeCart(); closeWishlist();
  renderModal();
  document.getElementById('productModal').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  document.getElementById('productModal').classList.remove('open');
  state.modal = null;
  maybeUnlock();
}

function renderModal(){
  const p = state.modal;
  if (!p) return;
  const soldOut = p.stock === 0 && !p.preorder;
  const inWish = wishlist.includes(p.id);
  const lowStock = p.stock > 0 && p.stock <= 10;

  let stockHTML;
  if (p.preorder) stockHTML = `<span class="modal-stock pre"><span class="dot"></span>Available on pre-order</span>`;
  else if (soldOut) stockHTML = `<span class="modal-stock out"><span class="dot"></span>Sold out</span>`;
  else if (lowStock) stockHTML = `<span class="modal-stock low"><span class="dot"></span>Only ${p.stock} left</span>`;
  else stockHTML = `<span class="modal-stock"><span class="dot"></span>In stock</span>`;

  const thumbsHTML = p.images.length > 1
    ? `<div class="modal-thumbs">${p.images.map((img, i) =>
        `<button class="modal-thumb ${i===state.modalImg?'active':''}" onclick="setModalImg(${i})"><img src="${img}" alt="thumb ${i+1}" onerror="this.style.display='none';this.parentElement.style.background='var(--grey-soft)';"></button>`
      ).join('')}</div>`
    : '';

  let actionHTML;
  if (p.preorder){
    actionHTML = `<button class="modal-add whatsapp" onclick="preorderFromModal()">
      Pre-order on WhatsApp — ${money(p.price * state.modalQty)}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </button>`;
  } else {
    actionHTML = `<button class="modal-add" id="modalAddBtn" onclick="addFromModal()" ${soldOut?'disabled':''}>
      ${soldOut ? 'Sold out' : `Add to Bag — ${money(p.price * state.modalQty)}`}
    </button>`;
  }

  document.getElementById('modalInner').innerHTML = `
    <button class="modal-close" onclick="closeModal()" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal-gallery">
      <div class="modal-main-img"><img src="${p.images[state.modalImg]}" alt="${esc(p.name)}" onerror="this.style.display='none';this.parentElement.style.background='var(--grey-soft)';"></div>
      ${thumbsHTML}
    </div>
    <div class="modal-info">
      <span class="modal-tag">${esc(p.tag || p.category)}</span>
      <h2 class="modal-name">${esc(p.name)}</h2>
      <div class="modal-price">${money(p.price)}</div>
      <p class="modal-desc">${esc(p.description)}</p>
      ${stockHTML}
      <div cla