/* ARX Stories interaction and article renderer */
(() => {
const stories = window.ARX_STORIES || [];
const $ = (s) => document.querySelector(s);
const cards = $("#cards"), home = $("#home"), reader = $("#reader"), collection = $("#collection");
let active = "All", query = "";
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function draw() {
 const list = stories.filter(s => (active === "All" || s.category === active) && (`${s.title} ${s.category} ${s.description}`.toLowerCase().includes(query.toLowerCase())));
 cards.innerHTML = list.length ? list.map(s => `
 <article class="story" tabindex="0" role="button" aria-label="Read ${esc(s.title)}" data-story="${s.id}">
  <div class="cover"><img loading="lazy" src="${esc(s.image)}" alt="" onerror="this.style.display='none'"><span class="tag">${esc(s.category.toUpperCase())}</span></div>
  <div class="story-body"><div class="meta"><span>${esc(s.label)}</span><span>${esc(s.readingTime)}</span></div><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><span class="read-link">READ STORY <span>↗</span></span></div>
 </article>`).join("") : `<div class="empty">This section is waiting for its first story. Stories will appear here when you add and approve them.</div>`;
}
function setCategory(cat) {
 active = cat;
 $("#filters").querySelectorAll("[data-cat]").forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
 home.hidden = false; reader.hidden = true; draw();
 if (cat !== "All") collection.scrollIntoView({behavior:"smooth",block:"start"});
}
function openStory(id) {
 const s = stories.find(x => x.id === Number(id)); if (!s) return;
 home.hidden = true; reader.hidden = false;
 $("#article").innerHTML = `
 <div class="eyebrow">${esc(s.category.toUpperCase())} &nbsp; / &nbsp; ${esc(s.label)}</div>
 <h1>${esc(s.title)}</h1><div class="article-meta"><span>${esc(s.readingTime)}</span><span>ARX STORIES</span></div>
 <div class="article-hero"><img src="${esc(s.image)}" alt="" onerror="this.style.display='none'"></div>
 <p class="article-lead">${esc(s.lead)}</p><div class="article-text">
 ${s.sections.map(p => `<h2>${esc(p[0])}</h2><p>${esc(p[1])}</p>`).join("")}
 <div class="notice">${esc(s.note)}</div>
 <p style="color:#aaa;font-size:12px">You've reached the end of this story. More mysteries await in the ARX collection.</p>
 <div class="article-actions"><button class="btn btn-red" id="moreStories">EXPLORE MORE STORIES ↗</button><button class="btn btn-dark" id="copyLink">COPY PAGE LINK</button></div>
 </div>`;
 window.scrollTo({top:0,behavior:"smooth"});
 $("#moreStories").addEventListener("click", () => {reader.hidden=true;home.hidden=false;setCategory("All");window.scrollTo({top:collection.offsetTop-65,behavior:"smooth"});});
 $("#copyLink").addEventListener("click", async () => {
   const url = location.href.split("#")[0] + "#story-" + s.id;
   try { await navigator.clipboard.writeText(url); $("#copyLink").textContent="LINK COPIED ✓"; }
   catch { $("#copyLink").textContent=url; }
 });
}
document.addEventListener("click", e => {
 const card = e.target.closest("[data-story]");
 if (card) {openStory(card.dataset.story);return;}
 const filter = e.target.closest("[data-filter]");
 if (filter) {setCategory(filter.dataset.filter);return;}
 if (e.target.closest("[data-home]")) {active="All";query="";$("#search").value="";setCategory("All");window.scrollTo({top:0,behavior:"smooth"});}
});
cards.addEventListener("keydown", e => {if ((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-story]")){e.preventDefault();openStory(e.target.dataset.story);}});
$("#filters").addEventListener("click", e => {const b=e.target.closest("[data-cat]");if(b)setCategory(b.dataset.cat);});
$("#search").addEventListener("input", e => {query=e.target.value;draw();});
$("#searchJump").addEventListener("click", () => {home.hidden=false;reader.hidden=true;$("#search").focus();collection.scrollIntoView({behavior:"smooth",block:"start"});});
$("#explore").addEventListener("click", () => collection.scrollIntoView({behavior:"smooth",block:"start"}));
$("#back").addEventListener("click", () => {reader.hidden=true;home.hidden=false;draw();window.scrollTo({top:collection.offsetTop-55,behavior:"smooth"});});
if (location.hash.startsWith("#story-")) openStory(location.hash.slice(7));
draw();
})();