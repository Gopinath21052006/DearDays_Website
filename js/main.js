(function(){
var b=document.getElementById('burger'),m=document.getElementById('menu');
b.onclick=function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)};
m.addEventListener('click',function(e){if(e.target.tagName==='A')m.classList.remove('open')});

/* Continuous Hann-window oscilloscope (matching in-app recording screen) */
var cvs=document.getElementById('oscilloscopeCanvas'),box=document.getElementById('oscilloscopeBox');
if(cvs&&box){
  var ctx=cvs.getContext('2d'),t=0,amp=1;
  function rsz(){
    var dpr=window.devicePixelRatio||1;
    cvs.width=box.clientWidth*dpr;
    cvs.height=box.clientHeight*dpr;
  }
  rsz();
  window.addEventListener('resize',rsz);
  box.addEventListener('mouseenter',function(){amp=1.35});
  box.addEventListener('mouseleave',function(){amp=1});

  function drawOscilloscope(){
    requestAnimationFrame(drawOscilloscope);
    var w=cvs.width,h=cvs.height,mid=h/2,dpr=window.devicePixelRatio||1;
    ctx.clearRect(0,0,w,h);
    t+=0.038;

    // Subtle baseline
    ctx.strokeStyle='rgba(184,139,69,0.14)';
    ctx.lineWidth=1*dpr;
    ctx.beginPath();
    ctx.moveTo(0,mid);
    ctx.lineTo(w,mid);
    ctx.stroke();

    // Wave 2: Warm coral / terracotta wave
    ctx.beginPath();
    for(var x=0;x<=w;x+=3*dpr){
      var nx=x/w;
      var hann=0.5*(1-Math.cos(2*Math.PI*nx));
      var y=mid+(Math.sin(nx*7-t*1.7+1.2)*0.55+Math.cos(nx*15+t*2.2)*0.35+Math.sin(nx*23-t)*0.1)*(h*0.38)*hann*amp;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='#E57373';
    ctx.lineWidth=2.2*dpr;
    ctx.shadowColor='#FF5252';
    ctx.shadowBlur=10*dpr;
    ctx.stroke();
    ctx.shadowBlur=0;

    // Wave 1: Primary glowing gold wave (exact match to green box)
    ctx.beginPath();
    for(var x=0;x<=w;x+=3*dpr){
      var nx=x/w;
      var hann=0.5*(1-Math.cos(2*Math.PI*nx));
      var y=mid+(Math.sin(nx*9+t*2.3)*0.5+Math.sin(nx*17-t*1.6)*0.35+Math.cos(nx*5+t*0.8)*0.15)*(h*0.44)*hann*amp;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='#FFCA28';
    ctx.lineWidth=3.4*dpr;
    ctx.shadowColor='#FFB300';
    ctx.shadowBlur=16*dpr;
    ctx.stroke();
    ctx.shadowBlur=0;

    // Wave 3: Core luminous cream trace
    ctx.beginPath();
    for(var x=0;x<=w;x+=3*dpr){
      var nx=x/w;
      var hann=0.5*(1-Math.cos(2*Math.PI*nx));
      var y=mid+(Math.sin(nx*11+t*2.7)*0.45+Math.cos(nx*19-t*1.9)*0.25)*(h*0.28)*hann*amp;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='#FFFDE7';
    ctx.lineWidth=1.6*dpr;
    ctx.shadowColor='#FFE082';
    ctx.shadowBlur=6*dpr;
    ctx.stroke();
    ctx.shadowBlur=0;
  }
  drawOscilloscope();
}

var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(rm||!window.gsap){return}
gsap.registerPlugin(ScrollTrigger);
var lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.1});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){
 m.classList.remove('open');b.setAttribute('aria-expanded',false);var tg=document.querySelector(a.getAttribute('href'));
 if(tg&&lenis){e.preventDefault();lenis.scrollTo(tg,{offset:-60,duration:1.4})}})});
/* progress bar */
var bar=document.createElement('div');bar.id='bar';document.body.appendChild(bar);
gsap.to(bar,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});
/* page-load veil */
var v=document.createElement('div');v.id='veil';v.textContent='DearDays';document.body.appendChild(v);
gsap.timeline().to(v,{opacity:0,duration:.9,delay:.7,ease:'power2.inOut',onComplete:function(){v.remove()}})
 .from('.h',{y:40,opacity:0,duration:1,stagger:.15,ease:'power3.out'},'-=.5')
 .from('.stage .phone',{y:80,opacity:0,duration:1.1,ease:'power3.out'},'-=.9')
 .from('.pol',{scale:.5,opacity:0,duration:.8,stagger:.2,ease:'back.out(1.7)'},'-=.5');
/* always on: floating, reels, waveform, reveals */
gsap.utils.toArray('.floaty').forEach(function(e,i){gsap.to(e,{y:-12,rotation:'+=1.2',duration:3+i*.4,yoyo:true,repeat:-1,ease:'sine.inOut'})});
document.querySelectorAll('.reel').forEach(function(r){r.style.animation='none'});
var spin=gsap.to('.reel',{rotation:360,duration:5,repeat:-1,ease:'none'});
var art=document.querySelector('.hero .floaty');
art.addEventListener('mouseenter',function(){gsap.to(spin,{timeScale:4,duration:.5})});
art.addEventListener('mouseleave',function(){gsap.to(spin,{timeScale:1,duration:.8})});
gsap.utils.toArray('.rv').forEach(function(e,i){
 if(e.closest('.three')||e.closest('#download'))return;
 gsap.to(e,{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:e,start:'top 90%'},delay:(i%3)*.08})});
/* experience cards: tape first, then card settles with tilt */
var tilts=[-1.6,1,-.8];
gsap.utils.toArray('.three .card').forEach(function(c,i){
 var tp=c.querySelector('.tape');
 var tl=gsap.timeline({scrollTrigger:{trigger:c,start:'top 88%'},delay:i*.12});
 tl.set(c,{opacity:1}).from(tp,{scaleX:0,duration:.35,ease:'power2.out'})
   .fromTo(c,{y:60,rotation:0,opacity:0},{y:i==1?24:0,rotation:tilts[i],opacity:1,duration:.8,ease:'back.out(1.4)'},'-=.1');
 c.addEventListener('mouseenter',function(){gsap.to(c,{y:(i==1?24:0)-10,rotation:0,duration:.4})});
 c.addEventListener('mouseleave',function(){gsap.to(c,{y:i==1?24:0,rotation:tilts[i],duration:.5})});
});
/* diary: paper writes itself, badge stamps */
var ps=document.querySelectorAll('.paper p'),bd=document.querySelector('.badge');
ps.forEach(function(p){p.dataset.t=p.textContent;p.textContent=''});
gsap.set(bd,{scale:0,rotation:-12});
var wt=gsap.timeline({paused:true});
ps.forEach(function(p){var o={n:0},L=p.dataset.t.length;wt.to(o,{n:L,duration:L*.045,ease:'none',onUpdate:function(){p.textContent=p.dataset.t.slice(0,Math.round(o.n))}})});
wt.to(bd,{scale:1,rotation:-3,duration:.5,ease:'back.out(3)'});
ScrollTrigger.create({trigger:'.paper',start:'top 75%',once:true,onEnter:function(){wt.play()}});
/* calendar legend pulse */
gsap.to('.legend span',{scale:1.12,duration:.5,yoyo:true,repeat:-1,repeatDelay:1.2,stagger:.5,ease:'sine.inOut'});
/* privacy tiles: border draws itself */
gsap.utils.toArray('.grid6 div').forEach(function(d,i){gsap.fromTo(d,{'--s':0},{'--s':1,duration:.9,delay:i*.1,ease:'power2.out',scrollTrigger:{trigger:d,start:'top 92%'}})});
/* CTA headline word by word */
var h=document.querySelector('#download h2');h.classList.remove('rv');h.style.opacity=1;h.style.transform='none';
h.innerHTML=h.textContent.split(' ').map(function(x){return '<span class="w">'+x+'</span>'}).join(' ');
gsap.from('#download .w',{y:40,opacity:0,duration:.8,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 85%'}});
/* responsive */
var mm=gsap.matchMedia();
mm.add('(min-width:821px)',function(){
 gsap.to('.stage .art',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}});
 gsap.to('.pol',{y:-60,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}});
 gsap.utils.toArray('.stack').forEach(function(s){gsap.from(s.querySelectorAll('.phone'),{x:0,rotation:0,y:0,ease:'none',scrollTrigger:{trigger:s,start:'top 85%',end:'top 30%',scrub:.6}})});
});
mm.add('(max-width:820px)',function(){
 gsap.from('.stack .phone',{y:50,opacity:0,duration:.8,stagger:.15,ease:'power3.out',scrollTrigger:{trigger:'.stack',start:'top 85%'}});
});
})();
