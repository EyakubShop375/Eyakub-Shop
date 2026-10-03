const SUPABASE_URL="https://kefmyuyhbdkguayhclzz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="PASTE_YOUR_SB_PUBLISHABLE_KEY_HERE";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
let currentUser=null;
async function boot(){
 const {data}=await db.auth.getSession(); if(data.session){currentUser=data.session.user;await checkAdmin()}
}
async function login(e){e.preventDefault();const {data,error}=await db.auth.signInWithPassword({email:email.value,password:password.value});if(error){alert(error.message);return}currentUser=data.user;await checkAdmin()}
async function checkAdmin(){
 const {data,error}=await db.from("profiles").select("role").eq("id",currentUser.id).single();
 if(error||data?.role!=="admin"){alert("এই অ্যাকাউন্টের admin permission নেই।");await db.auth.signOut();return}
 loginBox.style.display="none";panel.style.display="block";loadProducts();
}
async function loadProducts(){const {data,error}=await db.from("products").select("*").order("created_at",{ascending:false});adminProducts.innerHTML=error?`<p>${error.message}</p>`:(data||[]).map(p=>`<article class="card"><div class="body"><h3>${esc(p.name)}</h3><p>৳${p.price} · Stock ${p.stock}</p><button onclick='editProduct(${JSON.stringify(p).replace(/'/g,"&#39;")})'>Edit</button> <button onclick="deleteProduct('${p.id}')">Delete</button></div></article>`).join("")}
function showAdd(){productModal.classList.remove("hidden");document.querySelector("form").reset();pid.value="";active.checked=true}
function hideAdd(){productModal.classList.add("hidden")}
function editProduct(p){showAdd();pid.value=p.id;pname.value=p.name||"";pdesc.value=p.description||"";pcat.value=p.category||"Men";price.value=p.price||0;oldprice.value=p.old_price||"";stock.value=p.stock||0;imageurl.value=p.image_url||"";flash.checked=!!p.is_flash_sale;active.checked=p.is_active!==false}
async function saveProduct(e){e.preventDefault();let url=imageurl.value.trim();const file=image.files[0];if(file){const path=`${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"")}`;const up=await db.storage.from("product-images").upload(path,file,{upsert:false});if(up.error){alert(up.error.message);return}url=db.storage.from("product-images").getPublicUrl(path).data.publicUrl}
 const obj={name:pname.value,description:pdesc.value,category:pcat.value,price:Number(price.value),old_price:oldprice.value?Number(oldprice.value):null,stock:Number(stock.value),image_url:url||null,is_flash_sale:flash.checked,is_active:active.checked};
 const id=pid.value; const r=id?await db.from("products").update(obj).eq("id",id):await db.from("products").insert(obj);if(r.error){alert(r.error.message);return}hideAdd();loadProducts()}
async function deleteProduct(id){if(!confirm("পণ্যটি মুছে ফেলবেন?"))return;const r=await db.from("products").delete().eq("id",id);if(r.error)alert(r.error.message);else loadProducts()}
async function logout(){await db.auth.signOut();location.reload()}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
boot();