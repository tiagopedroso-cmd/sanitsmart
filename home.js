const menuButton=document.querySelector('.menu-button'),nav=document.querySelector('.nav');
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',open);menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');menuButton.textContent=open?'×':'☰'});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='☰'}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');menuButton.textContent='☰';menuButton.focus()}});
const desktopMenu=matchMedia('(min-width:1000px)');
const resetResponsiveMenu=event=>{if(event.matches){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');menuButton.textContent='☰'}};
desktopMenu.addEventListener?.('change',resetResponsiveMenu);
if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}

const whatsappFloat=document.querySelector('.whatsapp-float');
const heroCtaTrigger=document.querySelector('.hero-cta');
const updateWhatsappVisibility=()=>{
  if(!whatsappFloat||!heroCtaTrigger)return;
  const headerHeight=document.querySelector('.header')?.getBoundingClientRect().height||0;
  whatsappFloat.classList.toggle('visible',heroCtaTrigger.getBoundingClientRect().bottom<=headerHeight);
};
const updateWhatsappContrast=()=>{
  if(!whatsappFloat)return;
  const rect=whatsappFloat.getBoundingClientRect();
  const layers=document.elementsFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
  const backgroundLayer=layers.find(element=>!element.closest('.whatsapp-float')&&getComputedStyle(element).backgroundColor!=='rgba(0, 0, 0, 0)');
  if(!backgroundLayer)return;
  const rgb=getComputedStyle(backgroundLayer).backgroundColor.match(/[\d.]+/g);
  if(!rgb)return;
  const [r,g,b]=rgb.map(Number);
  const luminance=.2126*r+.7152*g+.0722*b;
  whatsappFloat.classList.toggle('on-dark',luminance<145);
};
let contrastFrame;
const scheduleWhatsappContrast=()=>{cancelAnimationFrame(contrastFrame);contrastFrame=requestAnimationFrame(()=>{updateWhatsappVisibility();updateWhatsappContrast()})};
addEventListener('scroll',scheduleWhatsappContrast,{passive:true});
addEventListener('resize',scheduleWhatsappContrast,{passive:true});
updateWhatsappVisibility();
updateWhatsappContrast();

const siteHeader=document.querySelector('.header');
const updateHeader=()=>siteHeader.classList.toggle('compact',scrollY>36);
addEventListener('scroll',updateHeader,{passive:true});
updateHeader();

const heroCta=document.querySelector('.hero-cta');
const updateHeroCtaTravel=()=>{
  const arrow=heroCta?.querySelector('span');
  if(!heroCta||!arrow)return;
  const distance=Math.max(0,heroCta.clientWidth-arrow.offsetWidth-7);
  heroCta.style.setProperty('--cta-travel',`${distance}px`);
};
updateHeroCtaTravel();
addEventListener('resize',updateHeroCtaTravel,{passive:true});
setTimeout(()=>heroCta?.classList.add('activated'),3000);

const serviceCarousel=document.querySelector('.service-carousel');
const serviceTrack=document.querySelector('.service-track');
if(serviceCarousel&&serviceTrack&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  let dragging=false,startX=0,startTime=0,moved=false;
  const getCarouselAnimation=()=>serviceTrack.getAnimations().find(animation=>animation.effect instanceof KeyframeEffect);
  const shiftCarousel=(pixels,baseTime)=>{
    const animation=getCarouselAnimation(),groupWidth=serviceTrack.querySelector('.service-card-group')?.offsetWidth||1;
    if(!animation)return;
    const duration=Number(getComputedStyle(serviceTrack).animationDuration.replace('s',''))*1000;
    animation.currentTime=baseTime-(pixels/groupWidth)*duration;
  };
  serviceCarousel.addEventListener('pointerdown',event=>{
    const animation=getCarouselAnimation();
    if(!animation)return;
    dragging=true;moved=false;startX=event.clientX;startTime=Number(animation.currentTime)||0;
    serviceCarousel.classList.add('dragging');serviceCarousel.setPointerCapture(event.pointerId);animation.pause();
  });
  serviceCarousel.addEventListener('pointermove',event=>{
    if(!dragging)return;
    const delta=event.clientX-startX;
    if(Math.abs(delta)>4)moved=true;
    shiftCarousel(delta,startTime);
  });
  const releaseCarousel=()=>{
    if(!dragging)return;
    dragging=false;serviceCarousel.classList.remove('dragging');getCarouselAnimation()?.play();
  };
  serviceCarousel.addEventListener('pointerup',releaseCarousel);
  serviceCarousel.addEventListener('pointercancel',releaseCarousel);
  serviceCarousel.addEventListener('click',event=>{if(moved){event.preventDefault();event.stopPropagation()}},true);
  serviceCarousel.addEventListener('wheel',event=>{
    event.preventDefault();
    const animation=getCarouselAnimation();
    if(!animation)return;
    shiftCarousel(-event.deltaY*.65,Number(animation.currentTime)||0);
  },{passive:false});
}

const processSection=document.querySelector('.process');
if(processSection){
  const processObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){processSection.classList.add('in-view');processObserver.disconnect()}}),{threshold:.35});
  processObserver.observe(processSection);
}

const riskSection=document.querySelector('.risk');
const lightSwitch=document.querySelector('.light-switch');
if(riskSection&&lightSwitch){
  const lightObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    lightObserver.disconnect();
    setTimeout(()=>lightSwitch.classList.add('lights-off'),5000);
  }),{threshold:.35});
  lightObserver.observe(riskSection);
}

const homeScrollHero=document.querySelector('.hero');
if(homeScrollHero&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  homeScrollHero.classList.add('scroll-motion-hero');
  let heroMotionFrame=0;
  const updateHomeHeroMotion=()=>{
    heroMotionFrame=0;
    const rect=homeScrollHero.getBoundingClientRect();
    const progress=Math.max(0,Math.min(1,-rect.top/Math.max(rect.height,1)));
    homeScrollHero.style.setProperty('--hero-scroll',progress.toFixed(4));
    homeScrollHero.style.setProperty('--hero-bg-shift',`${(progress*26).toFixed(2)}px`);
  };
  const requestHomeHeroMotion=()=>{if(!heroMotionFrame)heroMotionFrame=requestAnimationFrame(updateHomeHeroMotion)};
  addEventListener('scroll',requestHomeHeroMotion,{passive:true});
  addEventListener('resize',requestHomeHeroMotion,{passive:true});
  updateHomeHeroMotion();
}
