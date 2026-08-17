const toggle=document.querySelector('.nav-toggle'),nav=document.querySelector('.main-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');toggle.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}))}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');toggle.textContent='☰';toggle.focus()}});
const desktopNav=matchMedia('(min-width:1100px)');
desktopNav.addEventListener?.('change',event=>{if(event.matches&&nav){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}});
document.querySelectorAll('.faq-q').forEach(button=>button.addEventListener('click',()=>{const item=button.closest('.faq'),open=item.classList.toggle('open');button.setAttribute('aria-expanded',open);button.querySelector('span').textContent=open?'−':'+'}));
if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}

const internalHeader=document.querySelector('.site-header');
const updateInternalHeader=()=>internalHeader?.classList.toggle('compact',scrollY>36);
addEventListener('scroll',updateInternalHeader,{passive:true});
updateInternalHeader();

const servicesCarousel=document.querySelector('.services-page-carousel');
const servicesTrack=document.querySelector('.services-page-track');
if(servicesCarousel&&servicesTrack&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  let dragging=false,startX=0,startTime=0,moved=false;
  const carouselAnimation=()=>servicesTrack.getAnimations()[0];
  const moveCarousel=(pixels,baseTime)=>{const animation=carouselAnimation(),groupWidth=servicesTrack.querySelector('.services-page-group')?.offsetWidth||1;if(!animation)return;const duration=parseFloat(getComputedStyle(servicesTrack).animationDuration)*1000;animation.currentTime=baseTime-(pixels/groupWidth)*duration};
  servicesCarousel.addEventListener('pointerdown',event=>{const animation=carouselAnimation();if(!animation)return;dragging=true;moved=false;startX=event.clientX;startTime=Number(animation.currentTime)||0;servicesCarousel.classList.add('dragging');servicesCarousel.setPointerCapture(event.pointerId);animation.pause()});
  servicesCarousel.addEventListener('pointermove',event=>{if(!dragging)return;const delta=event.clientX-startX;if(Math.abs(delta)>4)moved=true;moveCarousel(delta,startTime)});
  const release=()=>{if(!dragging)return;dragging=false;servicesCarousel.classList.remove('dragging');carouselAnimation()?.play()};
  servicesCarousel.addEventListener('pointerup',release);servicesCarousel.addEventListener('pointercancel',release);
  servicesCarousel.addEventListener('click',event=>{if(moved){event.preventDefault();event.stopPropagation()}},true);
}

document.querySelectorAll('.services-segments .segment-card').forEach(card=>{
  card.addEventListener('pointermove',event=>{
    const rect=card.getBoundingClientRect();
    const x=event.clientX-rect.left-rect.width/2;
    const y=event.clientY-rect.top-rect.height/2;
    card.style.setProperty('--rotation',`${Math.atan2(y,x)}rad`);
  });
  card.addEventListener('pointerleave',()=>card.style.setProperty('--rotation','0deg'));
});
