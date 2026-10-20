(() => {
"use strict";
const CONFIG = window.ARX_CONFIG || {};
const configured = CONFIG.supabaseUrl && !CONFIG.supabaseUrl.includes("YOUR-PROJECT") && CONFIG.supabaseAnonKey && !CONFIG.supabaseAnonKey.includes("YOUR_SUPABASE");
const supabase = configured && window.supabase ? window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey) : null;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const escapeHTML = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const localStories = [
{id:"demo-1",title:"The Enfield Poltergeist",category:"Real Paranormal Cases",label:"CASE FILE 001",reading_time:8,description:"A North London family, disturbing reports and a case that divided witnesses and investigators.",image:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",lead:"In the late 1970s, reports from a house in Enfield, North London, drew journalists, investigators and sceptics into a dispute over what a family said they experienced.",sections:[["The reports","The case became famous through claims of unexplained knocks, moving objects and unusual voices. Some events were witnessed by visitors; other claims were challenged or attributed to trickery."],["What can we conclude?","The case remains controversial. Witness testimony and recordings are part of the historical record, but they do not establish a paranormal cause. Keep reported claims separate from verified facts."],["Evidence check","This introductory demo is not a complete case file. Before publication, add reliable sources, dates, direct quotations with context, and counter-explanations."]],note:"A reported paranormal case is not proof of a supernatural explanation. This demo story is provided as starter content."},
{id:"demo-2",title:"The House That Wouldn't Stay Quiet",category:"Real Paranormal Cases",label:"CASE FILE 002",reading_time:6,description:"A fictional case-file format exploring how ordinary sounds can turn into an unsettling mystery.",image:"https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80",lead:"At 2:17 a.m., the same three knocks were heard from the empty room. At least, that's how the story begins.",sections:[["The first night","A resident starts keeping notes: time, weather, who was home and where the sound seemed to come from."],["The details","Pipes, building movement, neighbours and expectation can all shape how a sound is interpreted. A careful investigation checks these possibilities before reaching a conclusion."]],note:"This is a fictional demonstration story, not a verified real-world paranormal case."},
{id:"demo-3",title:"The Last Light on Platform Nine",category:"Nightmare Fuel",label:"NIGHTMARE FUEL 001",reading_time:5,description:"Every night, the last train passes a platform that closed twenty years ago. Tonight, the doors open.",image:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80",lead:"The station clock had been stopped for twenty years. At 12:04, its second hand moved.",sections:[["The announcement","A voice crackled through the empty station. No train was scheduled. No train was listed on the board."],["Platform nine","At the far end, a row of pale windows glowed in the dark. The doors opened without a sound. Something inside whispered her name."]],note:"ARX Originals: fictional horror."},
{id:"demo-4",title:"The Signal Beneath the Static",category:"Conspiracy Theories",label:"RED THREAD 001",reading_time:7,description:"A strange broadcast, fragments of recordings and a theory that grew faster than the evidence.",image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80",lead:"When a shortwave recording circulated online, listeners began hearing patterns in the static. A story followed the sound.",sections:[["The claim","Online communities proposed that the signal was a coded message. Copies of the recording spread, often without a clear source or original timestamp."],["Check the evidence","Audio artefacts, interference and selective pattern recognition can make random noise sound meaningful. The first questions are provenance, reproducibility and independent analysis."],["What remains unknown","Without an authenticated original recording and verifiable analysis, the bigger claims remain speculation."]],note:"This demo discusses a fictionalised theory format. Conspiracy claims should be labelled and tested against credible evidence."},
{id:"demo-5",title:"The Watcher at the Window",category:"Nightmare Fuel",label:"NIGHTMARE FUEL 002",reading_time:4,description:"A new apartment. A dark window. A silhouette that appears only when the room is empty.",image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80",lead:"The first photograph showed nothing. The second showed a figure in the glass, standing behind her.",sections:[["The reflection","She turned around. The room was empty. In the window, the figure lifted one hand."],["One rule","Never look at the window after midnight. Especially if the reflection is smiling."]],note:"ARX Originals: fictional horror."},
{id:"demo-6",title:"The Disappearing Blueprint",category:"Conspiracy Theories",label:"RED THREAD 002",reading_time:6,description:"A supposedly missing document fuels a theory. What can the public record actually confirm?",image:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",lead:"The story begins with a scan said to show a document that no archive can locate.",sections:[["The viral image","Screenshots and reposts can strip away the context needed to identify a document. A convincing image is not the same as an authenticated source."],["Follow the paper trail","Look for catalogue records, named institutions, contemporaneous reporting and independent copies. Until then, claims about the document remain unverified."]],note:"Demo content. No real person or institution is accused of wrongdoing."}
];
let stories = [...localStories], user = null, savedIds = new Set(), activeCategory = "All", authMode = "signup", toastTimer;
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800)}
function slug(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}
function categoryLabel(c){return c||"Unclassified"}
function render(){
 const q=$("#searchInput").value.trim().toLowerCase();
 const list=stories.filter(s=>(activeCategory==="All"||s.category===activeCategory)&&`${s.title} ${s.category} ${s.description}`.toLowerCase().includes(q));
 $("#storyCount").textContent=`${String(list.length).padStart(2,"0")} ${list.length===1?"FILE":"FILES"}`;
 $("#storyGrid").innerHTML=list.length?list.map(s=>`<article class="story-card" data-story="${escapeHTML(s.id)}"><div class="story-cover"><img loading="lazy" src="${escapeHTML(s.image||"")}" alt="" onerror="this.style.display='none'"><span class="story-tag">${escapeHTML(categoryLabel(s.category))}</span></div><div class="story-body"><div class="story-meta"><span>${escapeHTML(s.label||"ARX FILE")}</span><span>${Number(s.reading_time)||5} MIN READ</span></div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.description||"Open this file from the ARX archive.")}</p><div class="story-bottom"><span class="read-link">READ FILE <span>↗</span></span><button class="save-btn ${savedIds.has(String(s.id))?"saved":""}" data-save="${escapeHTML(s.id)}" aria-label="Save story">${savedIds.has(String(s.id))?"♥":"♡"}</button></div></div></article>`).join(""):`<div class="empty">No files found. Try another search or category.</div>`;
}
function setCategory(cat){activeCategory=cat;$$(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category===cat));render();if(cat!=="All")$("#collection").scrollIntoView({behavior:"smooth"})}
async function loadStories(){
 if(!supabase){render();return}
 const {data,error}=await supabase.from("stories").select("id,title,category,label,reading_time,description,image,lead,sections,note,created_at").eq("published",true).order("created_at",{ascending:false});
 if(!error&&data&&data.length)stories=data; else stories=[...localStories];
 render();
}
async function refreshSaved(){
 if(!user||!supabase){savedIds=new Set();render();return}
 const {data,error}=await supabase.from("bookmarks").select("story_id").eq("user_id",user.id);
 if(!error)savedIds=new Set((data||[]).map(x=>String(x.story_id)));
 render();
}
function openReader(id){
 const s=stories.find(x=>String(x.id)===String(id));if(!s)return;
 $("#readerContent").innerHTML=`<div class="eyebrow">${escapeHTML(categoryLabel(s.category))} / ${escapeHTML(s.label||"ARX FILE")}</div><h1>${escapeHTML(s.title)}</h1><div class="reader-meta">${Number(s.reading_time)||5} MIN READ · ARX STORIES</div><div class="reader-hero"><img src="${escapeHTML(s.image||"")}" alt="" onerror="this.style.display='none'"></div><p class="reader-lead">${escapeHTML(s.lead||s.description||"")}</p><div class="reader-text">${(Array.isArray(s.sections)?s.sections:[]).map(p=>`<h2>${escapeHTML(p[0])}</h2><p>${escapeHTML(p[1])}</p>`).join("")}<div class="reader-note">${escapeHTML(s.note||"Check sources and distinguish confirmed facts from claims.")}</div><div class="reader-actions"><button class="btn btn-red" id="readerSave">${savedIds.has(String(s.id))?"♥ Saved":"♡ Save this file"}</button><button class="btn btn-outline" id="readerShare">Share story ↗</button></div></div>`;
 $("#reader").hidden=false;document.body.style.overflow="hidden";$("#readerSave").onclick=()=>toggleSave(s.id);$("#readerShare").onclick=async()=>{const url=location.href.split("#")[0]+"#story-"+slug(s.title);try{if(navigator.share)await navigator.share({title:s.title,text:s.description,url});else{await navigator.clipboard.writeText(url);toast("Story link copied")}}catch{}};
}
function closeReader(){$("#reader").hidden=true;document.body.style.overflow=""}
function openAuth(mode="signup"){authMode=mode;$("#authTitle").innerHTML=mode==="signup"?"Your next rabbit hole<br>starts here.":"Welcome back<br>to the archive.";$("#authHint").textContent=mode==="signup"?"Create a free account to save stories across visits.":"Log in to access your saved files.";$("#authSubmit").textContent=mode==="signup"?"Create free account":"Log in";$("#switchText").textContent=mode==="signup"?"Already have an account?":"New to the archive?";$("#switchAuth").textContent=mode==="signup"?"Log in":"Create account";$("#authMessage").textContent="";$("#authPassword").value="";$("#authModal").hidden=false}
function closeModals(){$$(".modal-backdrop").forEach(x=>x.hidden=true)}
async function onAuth(e){e.preventDefault();if(!supabase){$("#authMessage").textContent="Account setup isn't connected yet. Follow SETUP.md to connect your free Supabase project.";return}
 const email=$("#authEmail").value.trim(),password=$("#authPassword").value;
 $("#authSubmit").disabled=true;$("#authMessage").textContent="Please wait…";
 try{
  if(authMode==="signup"){const {data,error}=await supabase.auth.signUp({email,password});if(error)throw error;$("#authMessage").textContent=data.session?"Account created. Welcome to ARX.":"Check your email for a confirmation link, then log in.";if(data.session){user=data.user;closeModals();updateAccount()}}
  else {const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;user=data.user;closeModals();await refreshSaved();updateAccount();toast("Welcome back to the archive")}
 }catch(err){$("#authMessage").textContent=err.message||"Couldn't complete sign in."}finally{$("#authSubmit").disabled=false}
}
function updateAccount(){const b=$("#accountBtn");b.textContent=user?(user.email?.split("@")[0]||"Profile"):"Log in";if(user)$("#profileEmail").textContent=user.email||""}
async function toggleSave(id){
 if(!user){openAuth("signup");toast("Log in to save stories");return}
 if(!supabase){toast("Connect Supabase to sync bookmarks across devices.");return}
 const key=String(id);
 if(savedIds.has(key)){
  const {error}=await supabase.from("bookmarks").delete().eq("story_id",key).eq("user_id",user.id);
  if(error){toast(error.message);return}savedIds.delete(key);toast("Removed from saved files");
 }else{
  const {error}=await supabase.from("bookmarks").insert({user_id:user.id,story_id:key});
  if(error){toast(error.message.includes("foreign key")?"Only published database stories can be bookmarked.":error.message);return}savedIds.add(key);toast("Saved to your archive");
 }
 render();if(!$("#reader").hidden){const b=$("#readerSave");if(b)b.textContent=savedIds.has(key)?"♥ Saved":"♡ Save this file"}
}
function showSaved(){if(!user){openAuth("signup");return}activeCategory="All";$$(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category==="All"));$("#searchInput").value="";render();const grid=$("#storyGrid");const keep=stories.filter(s=>savedIds.has(String(s.id)));grid.innerHTML=keep.length?keep.map(s=>`<article class="story-card" data-story="${escapeHTML(s.id)}"><div class="story-cover"><img src="${escapeHTML(s.image||"")}" alt=""><span class="story-tag">${escapeHTML(s.category)}</span></div><div class="story-body"><div class="story-meta"><span>${escapeHTML(s.label||"ARX FILE")}</span><span>${Number(s.reading_time)||5} MIN READ</span></div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.description||"")}</p><div class="story-bottom"><span class="read-link">READ FILE <span>↗</span></span><button class="save-btn saved" data-save="${escapeHTML(s.id)}">♥</button></div></div></article>`).join(""):`<div class="empty">No saved files yet. Open a story and tap ♡ to keep it here.</div>`;$("#collection").scrollIntoView({behavior:"smooth"})}
function wire(){
 $("#year").textContent=new Date().getFullYear();
 $("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b)setCategory(b.dataset.category)});
 $("[data-category]") && $$(".category-card").forEach(b=>b.addEventListener("click",()=>setCategory(b.dataset.category)));
 $("#searchInput").addEventListener("input",render);
 $("#storyGrid").addEventListener("click",e=>{const save=e.target.closest("[data-save]");if(save){e.stopPropagation();toggleSave(save.dataset.save);return}const card=e.target.closest("[data-story]");if(card)openReader(card.dataset.story)});
 $("#accountBtn").onclick=()=>user?($("#savedCount").textContent=savedIds.size,$("#profileModal").hidden=false):openAuth("signup");
 $("#joinBtn").onclick=()=>openAuth("signup");$("#switchAuth").onclick=()=>openAuth(authMode==="signup"?"login":"signup");$("#authForm").onsubmit=onAuth;
 $$("[data-close]").forEach(b=>b.onclick=closeModals);$$(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModals()}));
 $("#logoutBtn").onclick=async()=>{if(supabase)await supabase.auth.signOut();user=null;savedIds.clear();closeModals();updateAccount();render();toast("Logged out")};
 $("#profileSaved").onclick=()=>{closeModals();showSaved()};$("#bookmarkNav").onclick=showSaved;
 $("#readerClose").onclick=closeReader;$("#reader").addEventListener("click",e=>{if(e.target===$("#reader"))closeReader()});
 $("#featuredBtn").onclick=()=>openReader(stories[0]?.id);
 $("#menuBtn").onclick=()=>{$("nav").classList.toggle("open")};
 $$("nav a").forEach(a=>a.addEventListener("click",()=> $("nav").classList.remove("open")));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModals();closeReader()}});
}
async function init(){
 wire();
 if(supabase){
  const {data}=await supabase.auth.getSession();user=data.session?.user||null;updateAccount();
  supabase.auth.onAuthStateChange((_event,session)=>{user=session?.user||null;updateAccount();setTimeout(()=>refreshSaved(),0)});
 }
 await loadStories();await refreshSaved();
}
init();
})();