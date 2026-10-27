const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Hero background: animated neuron network with local pointer interaction */
(()=>{
const c=$('#net'),x=c.getContext('2d'),cl=[['RAG',.4,.2],['VISION',.93,.2],['',.55,.88]];
let W,H,N=[],vis=true,raf,pointer=null;
function size(){const r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
N=[];const n=W<700?36:84,s=Math.min(W,H*1.3);
for(let i=0;i<n;i++){const k=cl[i%3],a=Math.random()*6.283,r=(Math.random()**.7)*s*.2+8;N.push({bx:k[1]*W+Math.cos(a)*r,by:k[2]*H+Math.sin(a)*r*.85,ph:Math.random()*6.283,z:.3+Math.random()*.7,px:0,py:0})}
if(RM)draw(0)}
function draw(t){
x.clearRect(0,0,W,H);
for(const p of N){p.px=p.bx+Math.sin(t*3e-4+p.ph)*5;p.py=p.by+Math.cos(t*2.6e-4+p.ph)*5;p.g=0;
if(pointer){const dx=p.px-pointer.x,dy=p.py-pointer.y,d=Math.hypot(dx,dy);if(d<115){p.g=1-d/115;p.px+=dx/(d||1)*p.g*11;p.py+=dy/(d||1)*p.g*11}}}
x.lineWidth=1;
for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const a=N[i],b=N[j],d=Math.hypot(a.px-b.px,a.py-b.py);
if(d<95){x.strokeStyle=`rgba(120,184,199,${.16*(1-d/95)+Math.max(a.g,b.g)*.24})`;x.beginPath();x.moveTo(a.px,a.py);x.lineTo(b.px,b.py);x.stroke()}}
for(const p of N){x.fillStyle=`rgba(232,229,222,${.3+p.z*.3+p.g*.35})`;x.beginPath();x.arc(p.px,p.py,1.3+p.z+p.g*1.5,0,6.283);x.fill()}
x.font='11px "IBM Plex Mono",monospace';x.fillStyle='rgba(133,138,141,.8)';
for(const k of cl)if(k[0])x.fillText(k[0],k[1]*W-14,k[2]*H-Math.min(W,H)*.2-12);
if(!RM&&vis)raf=requestAnimationFrame(draw)}
size();addEventListener('resize',()=>{cancelAnimationFrame(raf);size();if(!RM&&vis)raf=requestAnimationFrame(draw)});
if(!RM){
const hero=$('#home');
hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=c.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top}});
hero.addEventListener('pointerleave',()=>{pointer=null});
new IntersectionObserver(([e])=>{vis=e.isIntersecting;cancelAnimationFrame(raf);if(vis)raf=requestAnimationFrame(draw)}).observe(c);
raf=requestAnimationFrame(draw)}
})();

/* Contextual status line and active nav */
const lab={home:'PORTFOLIO // READY',work:'VIEWING // PROJECT REGISTRY',research:'ACCESSING // RESEARCH',experience:'VIEWING // EXPERIENCE',education:'VIEWING // EDUCATION & ACHIEVEMENTS',skills:'VIEWING // SKILLS',about:'VIEWING // ABOUT',contact:'OPEN // CONTACT'};
const rail=$('.rail ol'),navLinks=$$('.rail a');
function setActiveSection(id){
const link=navLinks.find(a=>a.getAttribute('href')==='#'+id);
if(!link)return;
navLinks.forEach(a=>a===link?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
$('#status').textContent=lab[id]||'PORTFOLIO // READY';
if(matchMedia('(min-width: 900px)').matches){const linkRect=link.getBoundingClientRect(),railRect=rail.getBoundingClientRect();rail.style.setProperty('--active-y',`${linkRect.top-railRect.top+linkRect.height/2-10}px`)}
}
const so=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
setActiveSection(e.target.id)}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>so.observe(s));
function syncBottomSection(){if(innerHeight+scrollY>=document.documentElement.scrollHeight-2)setActiveSection('contact')}
addEventListener('scroll',syncBottomSection,{passive:true});
addEventListener('resize',()=>{const active=$('.rail a[aria-current]');if(active)setActiveSection(active.hash.slice(1))});
setActiveSection('home');syncBottomSection();

/* Project records */
function setRec(r,open){const b=$('.rh',r),p=$('.rp',r);b.setAttribute('aria-expanded',open);$('.ar-label',b).textContent=open?'Hide details':'View project';p.hidden=!open;if(open)reveal(p)}
$$('.rec').forEach(r=>$('.rh',r).addEventListener('click',e=>setRec(r,e.currentTarget.getAttribute('aria-expanded')!=='true')));
function reveal(root){$$('.pipe,.bars,.road',root).forEach(el=>{if(RM)return el.classList.add('on');
new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){el.classList.add('on');o.disconnect()}}),{threshold:.3}).observe(el)})}
reveal(document);

/* Give each skill chip a faint brand-color hover tint. */
(()=>{
const colors={
Python:'255,205,58',PyTorch:'238,76,44',TensorFlow:'255,145,55',Keras:'210,55,55',
'Scikit-learn':'247,147,30',LLMs:'135,120,235',RAG:'120,184,199',Embeddings:'100,190,180',
'Hugging Face':'255,190,45',NLTK:'85,155,100',OpenCV:'90,185,75',MediaPipe:'50,190,150',
Pandas:'150,125,220',NumPy:'75,130,190',Qdrant:'220,65,65',MySQL:'0,117,143',
FastAPI:'0,150,136',Docker:'36,150,237',Git:'240,80,51',GitHub:'190,190,190',PowerBI:'245,190,40',PyQt5:'65,155,90',
English:'120,184,199',Hindi:'245,155,70',Telugu:'120,184,199',Marathi:'120,184,199'
};
$$('.chip').forEach(chip=>{const rgb=colors[chip.textContent.trim()];if(rgb)chip.style.setProperty('--glow-a',rgb)})
})();

/* Paper preview dialog */
(()=>{
const pd=$('#paperDialog'),po=$('#paperOpen'),pc=$('#paperClose');
if(!pd||!po)return;
po.addEventListener('click',()=>pd.showModal());
pc.addEventListener('click',()=>pd.close());
pd.addEventListener('click',e=>{if(e.target===pd)pd.close()});
})();