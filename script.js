const C=document.getElementById('heartBg'),X=C.getContext('2d'),W=()=>window.innerWidth,H=()=>window.innerHeight,mouse={x:-999,y:-999},hearts=[],isMobile=/Mobi|Android/i.test(navigator.userAgent),maxH=isMobile?20:55;
function resize(){C.width=W();C.height=H()}
window.addEventListener('resize',resize);resize();
class Heart{
constructor(x,y,burst){this.x=x??Math.random()*W();this.y=y??Math.random()*H();this.s=burst?Math.random()*12+6:Math.random()*18+6;this.o=burst?1:Math.random()*.4+.1;this.vy=burst?-(Math.random()*6+3):Math.random()*.5+.15;this.vx=burst?(Math.random()-.5)*4:(Math.random()-.5)*.3;this.rot=Math.random()*Math.PI*2;this.vr=(Math.random()-.5)*.02;this.life=burst?1:Infinity;this.decay=burst?.015:0;this.layer=Math.random()<.3?0:Math.random()<.6?1:2;this.wobble=Math.random()*Math.PI*2;this.ws=Math.random()*.02+.01}
update(){this.wobble+=this.ws;this.x+=this.vx+Math.sin(this.wobble)*.3*(this.layer+1)*.3;this.y+=this.vy*(1+this.layer*.3);this.rot+=this.vr;if(this.life!==Infinity){this.life-=this.decay;this.o=this.life}let dx=this.x-mouse.x,dy=this.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<150&&dist>0){let f=(150-dist)/150*.8;this.x+=dx/dist*f;this.y+=dy/dist*f}if(this.y<-50)this.y=H()+50;if(this.x<-50)this.x=W()+50;if(this.x>W()+50)this.x=-50;return this.life>0}
draw(){X.save();X.translate(this.x,this.y);X.rotate(this.rot);X.scale(this.s/20,this.s/20);X.globalAlpha=Math.max(0,this.o);X.fillStyle=this.layer===0?'#FEC288':this.layer===1?'#FD8A6B':'#FA5C5C';X.beginPath();X.moveTo(0,-5);X.bezierCurveTo(-10,-18,-22,-5,0,10);X.moveTo(0,-5);X.bezierCurveTo(10,-18,22,-5,0,10);X.fill();X.restore()}
}
function spawnHearts(){if(hearts.length<maxH)hearts.push(new Heart())}
function burst(x,y){for(let i=0;i<15;i++)hearts.push(new Heart(x,y,true))}
function drawAmbient(){let t=Date.now()*.001,g=X.createRadialGradient(W()/2+Math.sin(t*.3)*100,H()/2+Math.cos(t*.2)*80,0,W()/2,H()/2,Math.max(W(),H())*.6);g.addColorStop(0,'rgba(250,92,92,0.03)');g.addColorStop(.5,'rgba(253,138,107,0.015)');g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.fillRect(0,0,W(),H())}
function animate(){X.clearRect(0,0,W(),H());drawAmbient();for(let i=hearts.length-1;i>=0;i--){if(!hearts[i].update())hearts.splice(i,1);else hearts[i].draw()}requestAnimationFrame(animate)}
setInterval(spawnHearts,isMobile?500:150);animate();
document.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;const g=document.getElementById('cursorGlow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
document.addEventListener('touchmove',e=>{if(e.touches[0]){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY}},{passive:true});
document.addEventListener('touchend',()=>{mouse.x=-999;mouse.y=-999});
document.addEventListener('click',e=>{if(e.target.closest('button,a,.gallery-item,.audio-btn,.tilt-card'))return;burst(e.clientX,e.clientY)});
let lastScroll=0,nav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>{let st=window.scrollY;nav.classList.toggle('show',st<100||st<lastScroll);lastScroll=st},{passive:true});
setTimeout(()=>nav.classList.add('show'),500);
function scrollToPage(i){document.querySelectorAll('.page')[i]?.scrollIntoView({behavior:'smooth'})}
const typeEl=document.querySelector('.typewriter'),typeText=typeEl?.dataset.text||'';
if(typeEl){let ci=0;typeEl.textContent='';setTimeout(()=>{let iv=setInterval(()=>{typeEl.textContent+=typeText[ci];ci++;if(ci>=typeText.length){clearInterval(iv);typeEl.classList.add('done')}},50)},800)}
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.closest('#story')){let tl=document.querySelector('.timeline-line');if(tl)tl.classList.add('grown')}if(e.target.classList.contains('letter-line')){let d=e.target.dataset.delay||0;e.target.style.transitionDelay=d*.3+'s'}}})},{threshold:.1,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.fade-reveal,.timeline-event,.letter-line,.gallery-item').forEach(el=>obs.observe(el));
document.querySelectorAll('.tilt-card').forEach(card=>{const handleMove=(cx,cy)=>{let r=card.getBoundingClientRect(),x=cx-r.left,y=cy-r.top,rx=(y-r.height/2)/(r.height/2)*-8,ry=(x-r.width/2)/(r.width/2)*8;card.style.transform='perspective(600px) rotateX('+rx+'deg) rotateY('+ry+'deg) scale(1.03)'};const handleEnd=()=>{card.style.transform='perspective(600px) rotateX(0) rotateY(0) scale(1)'};card.addEventListener('mousemove',e=>handleMove(e.clientX,e.clientY));card.addEventListener('touchmove',e=>{if(e.touches[0])handleMove(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});card.addEventListener('mouseleave',handleEnd);card.addEventListener('touchend',handleEnd)});
document.querySelectorAll('.magnetic-btn').forEach(btn=>{const handleMove=(cx,cy)=>{let r=btn.getBoundingClientRect(),x=cx-r.left-r.width/2,y=cy-r.top-r.height/2;btn.style.transform='translate('+x*.2+'px,'+y*.2+'px) scale(1.05)'};const handleEnd=()=>{btn.style.transform='translate(0,0) scale(1)'};btn.addEventListener('mousemove',e=>handleMove(e.clientX,e.clientY));btn.addEventListener('touchmove',e=>{if(e.touches[0])handleMove(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});btn.addEventListener('mouseleave',handleEnd);btn.addEventListener('touchend',handleEnd)});
document.querySelectorAll('.gallery-item').forEach(item=>{item.addEventListener('click',()=>{let img=item.querySelector('img'),viewer=document.getElementById('fullscreenViewer'),vImg=document.getElementById('viewerImg');vImg.src=img.src;viewer.classList.add('open')})});
function closeViewer(){document.getElementById('fullscreenViewer').classList.remove('open')}
document.getElementById('fullscreenViewer').addEventListener('click',e=>{if(e.target===e.currentTarget)closeViewer()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeViewer()});
let heartOpened=false;
function openHeart(){if(heartOpened)return;heartOpened=true;const h=document.getElementById('bigHeart'),btn=document.getElementById('openHeartBtn'),msg=document.getElementById('hiddenMessage');btn.style.opacity='0';btn.style.pointerEvents='none';setTimeout(()=>h.classList.add('glowing'),200);setTimeout(()=>h.classList.add('expanding'),900);setTimeout(()=>{h.classList.add('exploded');for(let i=0;i<(isMobile?25:50);i++)setTimeout(()=>burst(W()/2+(Math.random()-.5)*200,H()/2+(Math.random()-.5)*200),i*30)},1800);setTimeout(()=>msg.classList.add('visible'),3200)}
const audioBtn=document.getElementById('audioToggle'),bgMusic=document.getElementById('bgMusic');let audioPlaying=false;
audioBtn.addEventListener('click',()=>{if(audioPlaying){bgMusic.pause();audioBtn.classList.remove('playing')}else{bgMusic.volume=.4;bgMusic.play().catch(()=>{});audioBtn.classList.add('playing')}audioPlaying=!audioPlaying});
const pages=document.querySelectorAll('.page'),navLinks=document.querySelectorAll('.nav-link');
const pageObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('active');let idx=[...pages].indexOf(e.target);navLinks.forEach((l,i)=>l.classList.toggle('active',i===idx))}else{e.target.classList.remove('active')}})},{threshold:.2,rootMargin:'0px 0px -10% 0px'});
pages.forEach(p=>pageObs.observe(p));
function forceReveal(){document.querySelectorAll('.page').forEach(p=>{let r=p.getBoundingClientRect();if(r.top<window.innerHeight&&r.bottom>0){p.classList.add('active');p.querySelectorAll('.fade-reveal,.timeline-event,.section-title,.letter-line,.gallery-item').forEach(el=>{let er=el.getBoundingClientRect();if(er.top<window.innerHeight&&er.bottom>0)el.classList.add('visible')})}});if(document.querySelector('#story .visible'))document.querySelector('.timeline-line')?.classList.add('grown')}
setTimeout(forceReveal,150);
window.addEventListener('hashchange',()=>setTimeout(forceReveal,100));
