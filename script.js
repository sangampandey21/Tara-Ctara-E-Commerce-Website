const products = [
  {id:1,name:"Sunday Linen Shirt",category:"Fashion",price:899,oldPrice:1199,emoji:"👚",tone:"#d9c7b2",badge:"BESTSELLER",rating:"4.9",description:"An easy, breathable staple for slow mornings."},
  {id:2,name:"Everyday Tote",category:"Accessories",price:549,emoji:"👜",tone:"#d2bca2",badge:"FAN FAVOURITE",rating:"4.8",description:"Room for all the little things you carry."},
  {id:3,name:"Soft Glow Lamp",category:"Home",price:1299,emoji:"💡",tone:"#d7cbb5",badge:"",rating:"4.7",description:"A warm glow for your cosy corner."},
  {id:4,name:"Petal Hair Clip Set",category:"Accessories",price:299,emoji:"🌸",tone:"#e8c4bd",badge:"UNDER ₹300",rating:"4.8",description:"Small details that make the whole look."},
  {id:5,name:"Weekend Co-ord",category:"Fashion",price:1499,oldPrice:1799,emoji:"👗",tone:"#c7c9b4",badge:"NEW",rating:"4.9",description:"Your one-and-done outfit for easy plans."},
  {id:6,name:"Ceramic Coffee Cup",category:"Home",price:449,emoji:"☕",tone:"#d8b7a2",badge:"",rating:"4.6",description:"Make your everyday coffee feel like a ritual."},
  {id:7,name:"Golden Hour Earrings",category:"Accessories",price:699,emoji:"✨",tone:"#e8d9a9",badge:"",rating:"4.9",description:"A little shimmer, from day to dinner."},
  {id:8,name:"Cloud Knit Cardigan",category:"Fashion",price:1199,emoji:"🧥",tone:"#d5c9bd",badge:"JUST IN",rating:"4.8",description:"Soft layers for cooler days and late evenings."}
];
const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const emptyState = document.getElementById("empty-state");
let activeCategory = "All";
let cart = JSON.parse(localStorage.getItem("taraCtaraCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("taraCtaraWishlist") || "[]");
let toastTimer;

const money = amount => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(amount);
function saveCart(){localStorage.setItem("taraCtaraCart",JSON.stringify(cart));}
function saveWishlist(){localStorage.setItem("taraCtaraWishlist",JSON.stringify(wishlist));}
function showToast(message){const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2100);}
function renderProducts(){
  let shown=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(searchInput.value.trim().toLowerCase()));
  if(sortSelect.value==="low")shown.sort((a,b)=>a.price-b.price);
  if(sortSelect.value==="high")shown.sort((a,b)=>b.price-a.price);
  grid.innerHTML=shown.map(p=>`<article class="product-card">
    <div class="product-image" style="background:${p.tone}">
      <span class="product-emoji" role="img" aria-label="${p.name} illustration">${p.emoji}</span>
      ${p.badge?`<span class="product-badge">${p.badge}</span>`:""}
      <button class="heart-button ${wishlist.includes(p.id)?"liked":""}" data-wish="${p.id}" aria-label="${wishlist.includes(p.id)?"Remove from":"Add to"} wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button>
      <button class="quick-add" data-add="${p.id}">Add to bag +</button>
    </div>
    <div class="product-info"><span class="product-category">${p.category}</span><h3 class="product-name">${p.name}</h3>
      <div class="product-bottom"><span class="product-price">${money(p.price)} ${p.oldPrice?`<del style="color:#aaa;font-weight:400;margin-left:5px">${money(p.oldPrice)}</del>`:""}</span><span class="product-rating">★ ${p.rating}</span></div>
    </div>
  </article>`).join("");
  emptyState.hidden=shown.length!==0;
}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById("cart-count").textContent=count;
  document.getElementById("drawer-count").textContent=`(${count})`;
  const items=document.getElementById("cart-items");
  if(!cart.length){items.innerHTML='<div class="empty-cart"><div style="font-size:42px;margin-bottom:12px">♡</div><p>Your bag is taking a little break.</p><small>Find something lovely to bring home.</small></div>';}
  else{items.innerHTML=cart.map(item=>{const p=products.find(product=>product.id===item.id);if(!p)return "";return `<div class="cart-row"><div class="cart-thumb" style="background:${p.tone}">${p.emoji}</div><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="qty-control"><button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">+</button></div><button class="remove-button" data-remove="${p.id}">Remove</button></div><strong>${money(p.price*item.qty)}</strong></div>`}).join("");}
  document.getElementById("cart-subtotal").textContent=money(cart.reduce((sum,item)=>{const p=products.find(product=>product.id===item.id);return sum+(p?p.price*item.qty:0)},0));
}
function addToCart(id){const item=cart.find(i=>i.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();renderCart();showToast("Added to your bag ♡");}
function openCart(){document.getElementById("overlay").hidden=false;document.getElementById("cart-drawer").hidden=false;document.body.style.overflow="hidden";}
function closeCart(){document.getElementById("overlay").hidden=true;document.getElementById("cart-drawer").hidden=true;document.body.style.overflow="";}
grid.addEventListener("click",e=>{const add=e.target.closest("[data-add]");const wish=e.target.closest("[data-wish]");if(add)addToCart(Number(add.dataset.add));if(wish){const id=Number(wish.dataset.wish);wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];saveWishlist();renderProducts();showToast(wishlist.includes(id)?"Saved to favourites ♡":"Removed from favourites");}});
document.querySelectorAll(".category-tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".category-tab").forEach(b=>b.classList.toggle("active",b===btn));activeCategory=btn.dataset.category;renderProducts();}));
document.querySelectorAll("[data-jump-category]").forEach(link=>link.addEventListener("click",()=>{activeCategory=link.dataset.jumpCategory;document.querySelectorAll(".category-tab").forEach(b=>b.classList.toggle("active",b.dataset.category===activeCategory));renderProducts();document.querySelector(".desktop-nav").classList.remove("open");}));
searchInput.addEventListener("input",renderProducts);sortSelect.addEventListener("change",renderProducts);
document.getElementById("search-toggle").addEventListener("click",()=>{document.getElementById("shop").scrollIntoView({behavior:"smooth"});setTimeout(()=>searchInput.focus(),350);});
document.getElementById("open-cart").addEventListener("click",openCart);document.getElementById("close-cart").addEventListener("click",closeCart);document.getElementById("overlay").addEventListener("click",closeCart);
document.getElementById("cart-items").addEventListener("click",e=>{const qty=e.target.closest("[data-qty]");const remove=e.target.closest("[data-remove]");if(qty){const id=Number(qty.dataset.qty),item=cart.find(i=>i.id===id);if(item){item.qty+=Number(qty.dataset.change);if(item.qty<=0)cart=cart.filter(i=>i.id!==id);}saveCart();renderCart();}if(remove){cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));saveCart();renderCart();}});
document.getElementById("checkout-button").addEventListener("click",()=>{if(!cart.length){showToast("Your bag is empty — find a favourite first.");return;}showToast("Demo checkout only — no payment was taken.");});
document.getElementById("newsletter-form").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletter-message").textContent="Thanks for joining us! This demo does not send emails.";e.target.reset();});
document.getElementById("menu-toggle").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("open"));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
