const usuario = localStorage.getItem("usuario");
if (usuario) {
  document.body.insertAdjacentHTML("afterbegin", `<p style="text-align:right; padding:10px;">👤 Bienvenido, ${usuario}</p>`);
} else {
  window.location.href = "login.html"; // si no está logueado, lo manda al login
}
// Datos de ejemplo
const PRODUCTS = [
    { id: 'l1', name: 'Laptop Ultra 14', desc: 'i5 • 8GB • 256GB SSD', price: 2499.00, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' },
    { id: 'p1', name: 'Smartphone X10', desc: '6.5\" • 128GB • 5G', price: 1499.00, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop' },
    { id: 'a1', name: 'Auriculares Pro', desc: 'ANC • Bluetooth', price: 299.00, img: 'https://http2.mlstatic.com/D_NQ_NP_631240-MLA48697556561_122021-O.webp' },
    { id: 'm1', name: 'Monitor 24\" FHD', desc: '144Hz • IPS', price: 799.00, img: 'https://www.lg.com/content/dam/channel/wcms/pa/images/monitores/24mk430h-b_awp_esps_pa_c/gallery/large01.jpg' },
    { id: 'k1', name: 'Teclado Mecánico', desc: 'Switches Red • RGB', price: 199.00, img: 'https://m.media-amazon.com/images/I/71FSIp+tDNL._AC_SL1500_.jpg' },
    { id: 'r1', name: 'Laptop HP OmniBook 5', desc: ' i5 • RAM 16 GB • SSD 512 GB', price: 2699.00, img: 'https://pe-files.hptiendaenlinea.com/promo/hp_pe_w04-082525_nb-cons-omni-16ba1051la_promo_01.jpg' },
    { id: 'd1', name: 'HP Smart Tank 720', desc: ' Hasta 12k p. negro y 8k p. color • Recarga libre de derrames • Garantía extd. de 2 años', price: 759.00, img: 'https://pe-files.hptiendaenlinea.com/promo/hp_pe_q4-w02-080225_pt-cons-stank-720_promo-01.jpg' },
    { id: 'g1', name: 'Botella de Tinta HP GT53 Negra Original', desc: ' Negro • Inyección térmica de tinta HP • ~4.000 páginas • Cartuchos de tinta de capacidad estándar', price: 45.00, img: 'https://pe-media.hptiendaenlinea.com/catalog/product/cache/314dec89b3219941707ad62ccc90e585/1/v/1vv22al_imagenprincipalsintexto.jpg' }
    
  ];
  
  // Estado simple del carrito (id -> {product, qty})
  let cart = JSON.parse(localStorage.getItem('cart-simple')) || {};
  
  const productsEl = document.getElementById('products');
  const cartListEl = document.getElementById('cartList');
  const subtotalEl = document.getElementById('subtotal');
  const openCartBtn = document.getElementById('openCart');
  const cartPanel = document.getElementById('cartPanel');
  const closeCartBtn = document.getElementById('closeCart');
  const checkoutBtn = document.getElementById('checkout');
  const searchInput = document.getElementById('search');
  
  function formatPrice(v){ return 'S/ ' + v.toFixed(2); }
  
  function renderProducts(filter = ''){
    productsEl.innerHTML = '';
    const list = PRODUCTS.filter(p => (p.name + ' ' + p.desc).toLowerCase().includes(filter.toLowerCase()));
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <div class="price-row">
          <div style="font-weight:700">${formatPrice(p.price)}</div>
          <button class="btn" data-id="${p.id}">Agregar</button>
        </div>
      `;
      productsEl.appendChild(card);
    });
  
    document.querySelectorAll('.card button.btn').forEach(btn => 
      btn.addEventListener('click', e => addToCart(e.target.dataset.id))
    );
  }
  
  function saveCart(){ localStorage.setItem('cart-simple', JSON.stringify(cart)); }
  
  function addToCart(id){
    const product = PRODUCTS.find(p => p.id === id);
    if(!product) return;
    if(!cart[id]) cart[id] = { product, qty: 0 };
    cart[id].qty += 1;
    saveCart();
    renderCart();
    updateCartButton();
  }
  
  function updateQty(id, delta){
    if(!cart[id]) return;
    cart[id].qty += delta;
    if(cart[id].qty <= 0) delete cart[id];
    saveCart();
    renderCart();
    updateCartButton();
  }
  
  function renderCart(){
    cartListEl.innerHTML = '';
    const entries = Object.values(cart);
    if(entries.length === 0){ 
      cartListEl.innerHTML = '<div class="muted">El carrito está vacío</div>'; 
      subtotalEl.textContent = formatPrice(0); 
      return; 
    }
  
    let total = 0;
    entries.forEach(entry => {
      const { product, qty } = entry;
      total += product.price * qty;
      const item = document.createElement('div');
      item.className = 'cart-item';
      item.innerHTML = `
        <img src="${product.img}" alt="${product.name}" />
        <div style="flex:1">
          <div style="font-weight:600">${product.name}</div>
          <div class="muted" style="font-size:0.85rem">${product.desc}</div>
          <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between">
            <div class="controls">
              <button class="qty-btn" data-action="dec" data-id="${product.id}">-</button>
              <div style="min-width:28px;text-align:center">${qty}</div>
              <button class="qty-btn" data-action="inc" data-id="${product.id}">+</button>
            </div>
            <div style="font-weight:700">${formatPrice(product.price * qty)}</div>
          </div>
        </div>
      `;
      cartListEl.appendChild(item);
    });
  
    subtotalEl.textContent = formatPrice(total);
  
    cartListEl.querySelectorAll('.qty-btn').forEach(b => {
      b.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;
        updateQty(id, action === 'inc' ? 1 : -1);
      });
    });
  }
  
  function updateCartButton(){
    const totalItems = Object.values(cart).reduce((s,i) => s + i.qty, 0);
    openCartBtn.textContent = `Carrito (${totalItems})`;
  }
  
  openCartBtn.addEventListener('click', () => { 
    cartPanel.classList.add('open'); 
    cartPanel.setAttribute('aria-hidden','false'); 
  });
  closeCartBtn.addEventListener('click', () => { 
    cartPanel.classList.remove('open'); 
    cartPanel.setAttribute('aria-hidden','true'); 
  });
  checkoutBtn.addEventListener('click', () => {
    const total = Object.values(cart).reduce((s,i) => s + i.qty * i.product.price, 0);
    if(total === 0){ alert('El carrito está vacío'); return; }
    alert('Gracias por tu compra! Total: ' + formatPrice(total));
    cart = {}; 
    saveCart(); 
    renderCart(); 
    updateCartButton(); 
    cartPanel.classList.remove('open');
  });
  
  searchInput.addEventListener('input', (e) => renderProducts(e.target.value));
  
  // init
  renderProducts(); 
  renderCart(); 
  updateCartButton();
  