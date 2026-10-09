const NS='http://www.w3.org/2000/svg',svg=document.getElementById('sky');
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const add=(t,a,p=svg)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e};
svg.insertAdjacentHTML('beforeend',`<defs>
<filter id="b1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
<filter id="b2"><feGaussianBlur stdDeviation="28"/></filter>
<linearGradient id="mw" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#1c2a55" stop-opacity="0"/><stop offset=".5" stop-color="#34437a" stop-opacity=".55"/><stop offset="1" stop-color="#1c2a55" stop-opacity="0"/></linearGradient></defs>`);
// Milky Way band
add('ellipse',{cx:215,cy:270,rx:70,ry:330,fill:'url(#mw)',transform:'rotate(32 215 270)',filter:'url(#b2)',opacity:.7});
add('ellipse',{cx:230,cy:250,rx:26,ry:260,fill:'#4a5a95',transform:'rotate(32 230 250)',filter:'url(#b2)',opacity:.22});
// chart grid
const GR=add('g',{});
[100,200,300].forEach((x,i)=>{add('line',{x1:x,y1:0,x2:x,y2:500,class:'gr'},GR);const t=add('text',{x:x+3,y:495,class:'gl'},GR);t.textContent=['5h 40m','5h 30m','5h 20m'][i]});
[100,200,300,400].forEach((y,i)=>{add('line',{x1:0,y1:y,x2:400,y2:y,class:'gr'},GR);const t=add('text',{x:4,y:y-3,class:'gl'},GR);t.textContent=['+32°','+30°','+28°','+26°'][i]});
add('path',{d:'M-5 440 Q200 350 405 420',class:'ec'},GR);
add('text',{x:300,y:424,class:'gl'},GR).textContent='ECLIPTIC';
add('path',{d:'M52 34 H372 V150 H388 V440 H252 V470 H84 V300 H52 Z',class:'bd'},GR);
// background stars
const cols=['#b7ccff','#dbe6ff','#ffffff','#fff3d6','#ffdca8','#ffbf8a'],wts=[.1,.2,.3,.2,.12,.08];
const pick=()=>{let r=rnd(),a=0;for(let i=0;i<6;i++){a+=wts[i];if(r<a)return cols[i]}return cols[2]};
for(let i=0;i<520;i++){
 let x=rnd()*400,y=rnd()*500;
 if(i%3==0){const u=(rnd()-.5)*2*300;x=215+u*Math.cos(1.16)*.55+(rnd()-.5)*60;y=270-u*Math.sin(1.16)*.9+(rnd()-.5)*40}
 const m=Math.pow(rnd(),3.2);
 add('circle',{cx:x,cy:y,r:.25+m*1.15,fill:pick(),opacity:.25+m*.7+rnd()*.15,class:rnd()<.12?'tw':'',style:`animation-delay:${rnd()*4}s`});}

/* ---------- constellation data ----------
 fields: bayer, name, note, x, y, mag, colour, spectral, distance(ly), label side
 bond: how Akshu is connected to that star. pull = how far it drifts toward α when "Draw closer" runs. */
const BOND={
 soulmate:{label:'Soulmate',pull:.30,strength:88,col:'#ffd98a',w:1.7,speed:.20,bulge:-34},
 sister:{label:'Sister',pull:.26,strength:85,col:'#ff9ec4',w:1.4,speed:.16,bulge:30},
 friend:{label:'Good friend',pull:.20,strength:77,col:'#ff9f72',w:1.1,speed:.12,bulge:-26}};
const S=[
['α','Aakansha','Akshu herself, the brightest star of the constellation. Aakansha means aspiration, and every bond on this chart leads back to her.',200,90,-0.4,'#a9c6ff','B2 V',87,'L'],
['β','Disha','Her friend Disha. The name means direction, and she holds up the left foot of the A.',112,372,1.6,'#ffe0ae','K1 III',142,'R'],
['γ','Harsh','Harsh, her partner and soulmate in this sky, and the one who made this chart. Of all the stars he is pulled closest to α.',292,362,0.9,'#fff1cf','G2 V',64,'R',BOND.soulmate],
['δ','Shruti','Her sister Shruti, on the left of the crossbar. Sisters share the same part of the sky.',158,238,2.1,'#d4e0ff','A1 V',118,'L',BOND.sister],
['ε','Sneha','Her friend Sneha, on the right of the crossbar.',246,244,1.9,'#cfdcff','A3 V',131,'R'],
['ι','Divyanshi','Her friend Divyanshi, the centre star of the crossbar.',204,296,2.8,'#ffe9c4','F8 V',96,'R'],
['ζ','Roshni','Her good friend Roshni, first star on the trail of sparks. Roshni means light.',322,168,3.2,'#ffd6a0','K3 V',172,'R',BOND.friend],
['η','Urvi','Her friend Urvi, on the trail of sparks.',350,108,2.5,'#c6d6ff','B8 V',205,'L'],
['θ','Chamak','The faintest and farthest star on the trail. Chamak means sparkle.',312,56,3.4,'#ffffff','A7 V',240,'R']];
const LN=[[0,3],[3,1],[0,4],[4,2],[3,5],[5,4],[4,6],[6,7],[7,8]];
const base=S.map(s=>({x:s[3],y:s[4]}));
const pos=base.map(p=>({...p}));

// constellation lines
const LG=add('g',{});
const lines=LN.map(([a,b],i)=>add('line',{class:'cl',pathLength:1,style:`animation-delay:${i*.22}s`},LG));

// bond lines + labels + pulses
const BG=add('g',{class:'bond','pointer-events':'none'});
const bonds=[];
S.forEach((s,i)=>{const b=s[10];if(!b)return;
 const path=add('path',{fill:'none',stroke:b.col,'stroke-width':b.w,opacity:.85,'stroke-linecap':'round',style:'filter:drop-shadow(0 0 3px '+b.col+')'},BG);
 const p1=add('circle',{r:1.9,fill:'#fff'},BG),p2=add('circle',{r:1.9,fill:b.col},BG);
 const lab=add('text',{class:'gl','text-anchor':'middle',style:'fill:'+b.col+';font-size:7.5px'},BG);lab.textContent=b.label.toUpperCase();
 bonds.push({i,b,path,p1,p2,lab});});

// stars
const info=document.getElementById('info');
const gs=S.map((s,i)=>{const g=add('g',{class:'s'});const r=Math.max(1.6,3.8-s[5]*.7);
 add('circle',{cx:0,cy:0,r:r*3.4,fill:s[6],opacity:.28,filter:'url(#b1)'},g);
 if(s[5]<1.5){add('line',{x1:-r*5,y1:0,x2:r*5,y2:0,stroke:s[6],'stroke-width':.4,opacity:.6},g);add('line',{x1:0,y1:-r*5,x2:0,y2:r*5,stroke:s[6],'stroke-width':.4,opacity:.6},g);}
 add('circle',{cx:0,cy:0,r,fill:s[6]},g);add('circle',{cx:0,cy:0,r:r*.45,fill:'#fff'},g);
 add('circle',{cx:0,cy:0,r:14,fill:'transparent'},g);
 const left=s[9]==='L';
 add('text',{x:left?-(r+5):r+5,y:3,'text-anchor':left?'end':'start',class:'nm'},g).textContent=s[0]+' '+s[1];
 g.addEventListener('click',()=>{const b=s[10];
  info.innerHTML=`<b>${s[0]} Akshuvii · ${s[1]}</b>${b?`<span class="badge" style="color:${b.col};border-color:${b.col}">${b.label.toUpperCase()} · BOND ${b.strength}%</span>`:''}<p>${s[2]}</p><span class="mono">MAG ${s[5].toFixed(1)} · SPECTRAL ${s[7]} · DISTANCE ${s[8]} ly</span>`});
 return g;});

// "draw closer" logic: bonded stars drift toward α in proportion to bond strength
let e=0,target=0,last=performance.now(),btn=document.getElementById('closer');
const quad=(p0,c,p1,t)=>({x:(1-t)*(1-t)*p0.x+2*(1-t)*t*c.x+t*t*p1.x,y:(1-t)*(1-t)*p0.y+2*(1-t)*t*c.y+t*t*p1.y});
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;
 e+=(target-e)*Math.min(1,dt*1.6);
 const A=base[0];
 S.forEach((s,i)=>{const pull=s[10]?s[10].pull:0;pos[i].x=base[i].x+e*pull*(A.x-base[i].x);pos[i].y=base[i].y+e*pull*(A.y-base[i].y);
  gs[i].setAttribute('transform',`translate(${pos[i].x.toFixed(2)} ${pos[i].y.toFixed(2)})`);});
 LN.forEach(([a,b],i)=>{lines[i].setAttribute('x1',pos[a].x);lines[i].setAttribute('y1',pos[a].y);lines[i].setAttribute('x2',pos[b].x);lines[i].setAttribute('y2',pos[b].y);});
 bonds.forEach((k,n)=>{const p0=pos[0],p1=pos[k.i];const mx=(p0.x+p1.x)/2,my=(p0.y+p1.y)/2;
  const dx=p1.x-p0.x,dy=p1.y-p0.y,len=Math.hypot(dx,dy)||1;
  const c={x:mx+(-dy/len)*k.b.bulge,y:my+(dx/len)*k.b.bulge};
  k.path.setAttribute('d',`M${p0.x} ${p0.y} Q${c.x} ${c.y} ${p1.x} ${p1.y}`);
  const t=now/1000*k.b.speed+n*.3;const a=quad(p0,c,p1,t%1),b=quad(p0,c,p1,1-(t%1));
  k.p1.setAttribute('cx',a.x);k.p1.setAttribute('cy',a.y);k.p2.setAttribute('cx',b.x);k.p2.setAttribute('cy',b.y);
  const m=quad(p0,c,p1,.5);k.lab.setAttribute('x',m.x+(k.b.bulge<0?10:-10)*1);k.lab.setAttribute('y',m.y);
  k.lab.setAttribute('text-anchor',k.b.bulge<0?'start':'end');});
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);
function setCloser(v){target=v?1:0;btn.textContent=v?'Back to the A':'Draw closer';}
btn.onclick=()=>setCloser(target===0);
setTimeout(()=>{if(target===0&&e===0)setCloser(true)},6500);

add('text',{x:200,y:488,'text-anchor':'middle',style:'font:9px ui-monospace,monospace;letter-spacing:.4em;fill:#6f80ad'}).textContent='AKSHUVIA';
add('text',{x:14,y:458,class:'gl'}).textContent='MAGNITUDE';
[0,1,2,3].forEach((m,i)=>{const x=32+i*16;add('circle',{cx:x,cy:468,r:Math.max(1.2,3.8-m*.7),fill:'#cdd9ff'});add('text',{x,y:480,'text-anchor':'middle',class:'gl'}).textContent=m});
document.querySelectorAll('.btns button[data-t]').forEach(b=>b.onclick=()=>{svg.classList.toggle('no'+b.dataset.t);b.classList.toggle('off')});
