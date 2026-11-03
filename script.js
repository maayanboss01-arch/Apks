const CHANNEL_URL = "https://www.youtube.com/@ch_aayan_07";

const verifyScreen=document.getElementById("verifyScreen");
const appsScreen=document.getElementById("appsScreen");
const subscribeBtn=document.getElementById("subscribeBtn");
const verifyBtn=document.getElementById("verifyBtn");
const verifyMessage=document.getElementById("verifyMessage");
const appsList=document.getElementById("appsList");

let subscribedButtonClicked=localStorage.getItem("aayan_subscribe_clicked")==="true";

subscribeBtn.addEventListener("click",()=>{
localStorage.setItem("aayan_subscribe_clicked","true");
subscribedButtonClicked=true;
window.open(CHANNEL_URL,"_blank","noopener,noreferrer");
verifyMessage.textContent="YouTube opened. Come back here and press Verify.";
});

verifyBtn.addEventListener("click",()=>{
if(subscribedButtonClicked){verifyScreen.classList.add("hidden");appsScreen.classList.remove("hidden");renderApps();}
else verifyMessage.textContent="Please press Subscribe first.";
});

function renderApps(){
if(!Array.isArray(APPS)||APPS.length===0){appsList.innerHTML='<div class="card" style="padding:20px;text-align:center">No APKs added yet.</div>';return;}
appsList.innerHTML=APPS.map((app,i)=>`
<article class="app-card">
<div class="app-top"><img class="icon" src="${escapeHtml(app.icon||"icons/default.png")}" alt="">
<div><h3>${escapeHtml(app.name)}</h3><div class="meta">Version ${escapeHtml(app.version||"—")} • ${escapeHtml(app.size||"—")}</div></div></div>
<p class="desc">${escapeHtml(app.description||"")}</p>
<a class="download-btn" href="${escapeHtml(app.file)}" target="_blank" rel="noopener">Download APK</a>
<div class="counter" id="counter-${i}">Downloads: —</div>
</article>`).join("");
APPS.forEach((app,i)=>updateCounter(app,i));
}

async function updateCounter(app,index){
const el=document.getElementById(`counter-${index}`);
if(!el)return;
if(!app.releaseApi){el.textContent="Downloads: counter not configured";return;}
try{
const r=await fetch(app.releaseApi,{cache:"no-store"});
if(!r.ok)throw new Error();
const d=await r.json();
el.textContent=`Downloads: ${Number(d.download_count||0).toLocaleString()}`;
}catch{el.textContent="Downloads: unavailable";}
}
setInterval(()=>APPS.forEach((a,i)=>updateCounter(a,i)),60000);

function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
