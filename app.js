const SUPABASE_URL="https://kefmyuyhbdkguayhclzz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="PASTE_YOUR_SB_PUBLISHABLE_KEY_HERE";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

const demo=[
 {id:1,name:"Classic Runner Black",price:149,old_price:199,stock:20,category:"Men",emoji:"👟",flash:true},
 {id:2,name:"Urban White Sneaker",price:179,old_price:249,stock:15,category:"Men",emoji:"👟",flash:true},
 {id:3,name:"Comfort Walk Pink",price:129,old_price:169,stock:30,category:"Women",emoji:"👟",flash:false},
 {id:4,name:"Kids Sport Pro",price:99,old_price:129,stock:25,category:"Kids",emoji:"👟",flash:true},
 {id:5,name:"Premium Casual",price:219,old_price:299,stock:12,category:"Men",emoji:"🥾",flash:false},
 {id:6,name:"Daily Soft Slip-on",price:119,old_price:149,stock:18,category:"Women",emoji:"👟",flash:false},
 {id:7,name:"Street Runner",price:159,old_price:219,stock:22,category:"Men",emoji:"👟",flash:true},
 {id:8,name:"Kids Color Pop",price:89,old_price:119,stock:40,category:"Kids",emoji:"👟",flash:false}
];
let products=[];

async function load(){
  const {data,error}=await db.from("products").select("*").eq("is_active",true).order("created_at",{ascending:false});
  products=(!error&&data&&data.length)?data:demo;
  renderCategories(); renderProducts(products); renderFlash(products.filter(x=>x.is_flash_sale||x.flash));
}
function renderCategories(){
 const cats=[["👞","Men"],["👠","Women"],["👟","Kids"],["🥾","Casual"]];
 document.querySelector("#categoryList").innerHTML=cats.map(c=>`<div class="cat" onclick="filterCat('${c[1]}')"><div class="icon">${c[0]}</div><b>${c[1]}</b></div>`).join("");
}
function card(p){
 const img=p.image_url?`<img src="${esc(p.image_url)}" alt="">`:`<div>${p.emoji||"👟"}</div>`;
 return `<article class="card"><div class="pic">${img}</div><div class="body"><h3>${esc(p.name)}</h3><div><span class="price">৳${Number(p.price||0).toLocaleString()}</span>${p.old_price?`<span class="old">৳${Number(p.old_price).toLocaleString()}</span>`:""}</div><div class="stock">স্টক: ${p.stock??0}</div><button class="buy" onclick="openProduct('${p.id}')">বিস্তারিত / অর্ডার</button></div></article>`;
}
function renderProducts(list){document.querySelector("#productsGrid").innerHTML=list.length?list.map(card).join(""):"<p>কোনো পণ্য পাওয়া যায়নি।</p>"}
function renderFlash(list){document.querySelector("#flashProducts").innerHTML=list.length?list.slice(0,4).map(card).join(""):"<p>এই মুহূর্তে কোনো ফ্ল্যাশ সেল নেই।</p>"}
function filterCat(c){renderProducts(products.filter(p=>(p.category||"").toLowerCase()===c.toLowerCase()))}
document.querySelector("#search").addEventListener("input",e=>{let q=e.target.value.toLowerCase();renderProducts(products.filter(p=>(p.name||"").toLowerCase().includes(q)))});
async function openProduct(id){
 const p=products.find(x=>String(x.id)===String(id)); if(!p)return;
 document.querySelector("#modalContent").innerHTML=`<img class="detail-img" src="${esc(p.image_url||"https://placehold.co/800x500?text=Eyakub+Shop")}" alt=""><h2>${esc(p.name)}</h2><p>${esc(p.description||"ভালো মানের জুতা।")}</p><p><b class="price">৳${Number(p.price||0).toLocaleString()}</b></p><form class="form" onsubmit="placeOrder(event,'${p.id}')"><label>নাম</label><input name="name" required><label>ফোন</label><input name="phone" required><label>ঠিকানা</label><textarea name="address" required></textarea><label>সাইজ</label><input name="size" placeholder="যেমন: 41"><label>রং</label><input name="color" placeholder="যেমন: Black"><label>পরিমাণ</label><input name="qty" type="number" min="1" max="${p.stock||1}" value="1" required><button class="btn" type="submit">অর্ডার কনফার্ম করুন</button></form>`;
 document.querySelector("#modal").classList.remove("hidden");
}
function closeModal(){document.querySelector("#modal").classList.add("hidden")}
async function placeOrder(e,id){
 e.preventDefault(); const p=products.find(x=>String(x.id)===String(id)); const f=new FormData(e.target);
 const qty=Number(f.get("qty")); const order={customer_name:f.get("name"),phone:f.get("phone"),address:f.get("address"),status:"pending",total:Number(p.price)*qty};
 const {data,error}=await db.from("orders").insert(order).select().single();
 if(error){alert("অর্ডার নেওয়া যায়নি। আগে SQL সেটআপ সম্পন্ন করুন।");return}
 await db.from("order_items").insert({order_id:data.id,product_id:p.id,quantity:qty,unit_price:p.price,size:f.get("size"),color:f.get("color")});
 alert("অর্ডার সফল হয়েছে। আপনার অর্ডার নম্বর: "+data.id);closeModal();
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
load();