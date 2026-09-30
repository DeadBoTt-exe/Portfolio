const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Hero network: three loose clusters (RAG, vision, NLP) with gentle cursor response */
(()=>{
const c=$('#net'),x=c.getContext('2d'),cl=[['RAG',.4,.2],['VISION',.93,.2],['NLP',.55,.88]];
let W,H,N=[],vis=true,raf,pt={x:0,y:0},tg={x:0,y:0},cur=null;
function size(){const r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
N=[];const n=W<700?36:84,s=Math.min(W,H*1.3);
for(let i=0;i<n;i++){const k=cl[i%3],a=Math.random()*6.283,r=(Math.random()**.7)*s*.2+8;N.push({bx:k[1]*W+Math.cos(a)*r,by:k[2]*H+Math.sin(a)*r*.85,ph:Math.random()*6.283,z:.3+Math.random()*.7,px:0,py:0})}
if(RM)draw(0)}
function draw(t){
x.clearRect(0,0,W,H);pt.x+=(tg.x-pt.x)*.05;pt.y+=(tg.y-pt.y)*.05;
for(const p of N){p.px=p.bx+Math.sin(t*3e-4+p.ph)*5+pt.x*p.z*16;p.py=p.by+Math.cos(t*2.6e-4+p.ph)*5+pt.y*p.z*16;p.g=0;
if(cur){const d=Math.hypot(p.px-cur.x,p.py-cur.y);if(d<130){p.g=1-d/130;p.px+=(p.px-cur.x)/(d||1)*p.g*7;p.py+=(p.py-cur.y)/(d||1)*p.g*7}}}
x.lineWidth=1;
for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const a=N[i],b=N[j],d=Math.hypot(a.px-b.px,a.py-b.py);
if(d<95){x.strokeStyle=`rgba(120,184,199,${(.16*(1-d/95))+Math.max(a.g,b.g)*.25})`;x.beginPath();x.moveTo(a.px,a.py);x.lineTo(b.px,b.py);x.stroke()}}
for(const p of N){x.fillStyle=`rgba(232,229,222,${.3+p.z*.3+p.g*.4})`;x.beginPath();x.arc(p.px,p.py,1.3+p.z+p.g*1.2,0,6.283);x.fill()}
x.font='11px "IBM Plex Mono",monospace';x.fillStyle='rgba(133,138,141,.8)';
for(const k of cl)x.fillText(k[0],k[1]*W-14,k[2]*H-Math.min(W,H)*.2-12);
if(!RM&&vis)raf=requestAnimationFrame(draw)}
size();addEventListener('resize',()=>{cancelAnimationFrame(raf);size();if(!RM&&vis)raf=requestAnimationFrame(draw)});
if(!RM){
const h=$('#home');
h.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=c.getBoundingClientRect();cur={x:e.clientX-r.left,y:e.clientY-r.top};tg={x:(cur.x/W-.5)*2,y:(cur.y/H-.5)*2}});
h.addEventListener('pointerleave',()=>{cur=null;tg={x:0,y:0}});
new IntersectionObserver(([e])=>{vis=e.isIntersecting;cancelAnimationFrame(raf);if(vis)raf=requestAnimationFrame(draw)}).observe(c);
raf=requestAnimationFrame(draw)}
})();

/* Contextual status line and active nav */
const lab={home:'PORTFOLIO // READY',work:'VIEWING // PROJECT REGISTRY',research:'ACCESSING // RESEARCH',experience:'VIEWING // EXPERIENCE',achievements:'VIEWING // ACHIEVEMENTS',education:'VIEWING // EDUCATION',skills:'VIEWING // SKILLS',about:'VIEWING // ABOUT',contact:'OPEN // CONTACT'};
const so=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
$('#status').textContent=lab[e.target.id];
$$('.rail a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>so.observe(s));

/* Project records */
function setRec(r,open){const b=$('.rh',r),p=$('.rp',r);b.setAttribute('aria-expanded',open);p.hidden=!open;if(open)reveal(p)}
$$('.rec').forEach(r=>$('.rh',r).addEventListener('click',e=>setRec(r,e.currentTarget.getAttribute('aria-expanded')!=='true')));
function reveal(root){$$('.pipe,.bars,.road',root).forEach(el=>{if(RM)return el.classList.add('on');
new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){el.classList.add('on');o.disconnect()}}),{threshold:.3}).observe(el)})}
reveal(document);

/* Paper preview dialog */
(()=>{
const pd=$('#paperDialog'),po=$('#paperOpen'),pc=$('#paperClose');
if(!pd||!po)return;
po.addEventListener('click',()=>pd.showModal());
pc.addEventListener('click',()=>pd.close());
pd.addEventListener('click',e=>{if(e.target===pd)pd.close()});
})();

/* Command palette (navigate and search) */
(()=>{
const d=$('#pal'),q=$('#palq'),l=$('#pall'),btn=$('#palbtn');
$('#kbd').textContent=/Mac|iPhone|iPad/.test(navigator.platform)?'⌘ K':'Ctrl K';
const I=[['Go to projects','projects work selected','#work'],['Go to research','research paper ieee publication','#research'],['Go to experience','experience drdo jrf nda','#experience'],['Go to achievements','achievements hackathons space lab vitronix leadership','#achievements'],['Go to education','education degree btech vit','#education'],['Go to skills','skills tools stack','#skills'],['Go to about','about','#about'],['Go to contact','contact email resume','#contact'],['DocuMind AI','documind rag qdrant gemini','#r1','r1'],['TarangAI','tarangai vision mediapipe dance','#r2','r2'],['SentimentR','sentimentr nlp sentiment llm','#r3','r3']];
let vis=I,ix=0;
const draw=()=>{l.innerHTML=vis.length?'':'<li class="none">No match. Try "projects" or "research".</li>';
vis.forEach((v,i)=>{const li=document.createElement('li');li.id='po'+i;li.setAttribute('role','option');li.setAttribute('aria-selected',i===ix);li.textContent=v[0];
li.onclick=()=>go(v);li.onmousemove=()=>{ix=i;sel()};l.appendChild(li)});
q.setAttribute('aria-activedescendant',vis.length?'po'+ix:'')};
const sel=()=>$$('#pall li').forEach((li,i)=>li.setAttribute('aria-selected',i===ix));
function go(v){d.close();if(v[3])setRec($('#'+v[3]),true);
$(v[2]).scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});history.replaceState(null,'',v[2])}
function open(){q.value='';vis=I;ix=0;draw();d.showModal();q.focus()}
btn.onclick=open;
addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();d.open?d.close():open()}});
q.oninput=()=>{const t=q.value.trim().toLowerCase();vis=I.filter(v=>(v[0]+' '+v[1]).toLowerCase().includes(t));ix=0;draw()};
q.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();ix=Math.min(ix+1,vis.length-1);sel()}
else if(e.key==='ArrowUp'){e.preventDefault();ix=Math.max(ix-1,0);sel()}
else if(e.key==='Enter'&&vis[ix]){e.preventDefault();go(vis[ix])}};
d.addEventListener('click',e=>{if(e.target===d)d.close()});
})();