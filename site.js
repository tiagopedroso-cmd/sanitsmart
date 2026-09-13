const toggle=document.querySelector('.nav-toggle'),nav=document.querySelector('.main-nav');
const sanitSmartWhatsapp='5511996105759';
const sanitSmartWhatsappMessage='Olá, quero falar com a SanitSmart sobre a conformidade sanitária da minha empresa.';
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link=>{
  const url=new URL(link.href);
  if(!url.pathname.replaceAll('/',''))url.pathname=`/${sanitSmartWhatsapp}`;
  if(!url.searchParams.has('text'))url.searchParams.set('text',sanitSmartWhatsappMessage);
  link.href=url.toString();
  if(link.closest('footer')&&link.textContent.trim()==='WhatsApp')link.textContent='Falar pelo WhatsApp';
});
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

const sharedWhatsappFloat=document.querySelector('.whatsapp-float');
const updateSharedWhatsappContrast=()=>{
  if(!sharedWhatsappFloat)return;
  const rect=sharedWhatsappFloat.getBoundingClientRect();
  const layers=document.elementsFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
  const backgroundLayer=layers.find(element=>!element.closest('.whatsapp-float')&&getComputedStyle(element).backgroundColor!=='rgba(0, 0, 0, 0)');
  if(!backgroundLayer)return;
  const rgb=getComputedStyle(backgroundLayer).backgroundColor.match(/[\d.]+/g);
  if(!rgb)return;
  const [r,g,b]=rgb.map(Number);
  const luminance=.2126*r+.7152*g+.0722*b;
  sharedWhatsappFloat.classList.toggle('on-dark',luminance<150);
};
addEventListener('scroll',updateSharedWhatsappContrast,{passive:true});
addEventListener('resize',updateSharedWhatsappContrast,{passive:true});
requestAnimationFrame(updateSharedWhatsappContrast);

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

const scrollMotionHeroes=document.querySelectorAll('.services-page .page-hero,.about-page .page-hero');
if(scrollMotionHeroes.length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  scrollMotionHeroes.forEach(hero=>hero.classList.add('scroll-motion-hero'));
  let heroMotionFrame=0;
  const updateHeroMotion=()=>{
    heroMotionFrame=0;
    scrollMotionHeroes.forEach(hero=>{
      const rect=hero.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,-rect.top/Math.max(rect.height,1)));
      hero.style.setProperty('--hero-scroll',progress.toFixed(4));
      hero.style.setProperty('--hero-bg-shift',`${(progress*24).toFixed(2)}px`);
    });
  };
  const requestHeroMotion=()=>{if(!heroMotionFrame)heroMotionFrame=requestAnimationFrame(updateHeroMotion)};
  addEventListener('scroll',requestHeroMotion,{passive:true});
  addEventListener('resize',requestHeroMotion,{passive:true});
  updateHeroMotion();
}

const contactModal=document.querySelector('#contact-form-modal');
const contactModalTrigger=document.querySelector('.contact-form-trigger');
const contactLeadForm=document.querySelector('#contact-lead-form');
const contactState=document.querySelector('#contact-state');
const contactCity=document.querySelector('#contact-city');
const contactCityStatus=document.querySelector('#contact-city-status');
if(contactModal&&contactModalTrigger&&contactLeadForm&&contactState&&contactCity){
  let modalReturnFocus=null;
  let cityRequest=null;
  const modalFocusable=()=>[...contactModal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')];
  const openContactModal=()=>{
    modalReturnFocus=document.activeElement;
    contactModal.hidden=false;
    document.body.classList.add('contact-modal-open');
    requestAnimationFrame(()=>contactModal.querySelector('input,button')?.focus());
  };
  const closeContactModal=()=>{
    contactModal.hidden=true;
    document.body.classList.remove('contact-modal-open');
    modalReturnFocus?.focus?.();
  };
  contactModalTrigger.addEventListener('click',openContactModal);
  contactModal.querySelectorAll('[data-modal-close]').forEach(element=>element.addEventListener('click',closeContactModal));
  contactModal.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();closeContactModal();return}
    if(event.key!=='Tab')return;
    const focusable=modalFocusable();
    if(!focusable.length)return;
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  contactState.addEventListener('change',async()=>{
    cityRequest?.abort();
    contactCity.innerHTML='<option value="">Selecione primeiro a UF</option>';
    contactCity.disabled=true;
    contactCityStatus.textContent='';
    contactCityStatus.classList.remove('error');
    if(!contactState.value)return;
    contactCity.innerHTML='<option value="">Carregando cidades…</option>';
    contactCityStatus.textContent='Consultando a lista oficial do IBGE…';
    cityRequest=new AbortController();
    try{
      const response=await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(contactState.value)}/municipios?orderBy=nome`,{signal:cityRequest.signal});
      if(!response.ok)throw new Error('Não foi possível consultar as cidades.');
      const cities=await response.json();
      contactCity.innerHTML='<option value="">Selecione a cidade</option>';
      cities.forEach(city=>contactCity.add(new Option(city.nome,city.nome)));
      contactCity.disabled=false;
      contactCityStatus.textContent=`${cities.length} cidades disponíveis.`;
    }catch(error){
      if(error.name==='AbortError')return;
      contactCity.innerHTML='<option value="">Selecione novamente a UF</option>';
      contactCityStatus.textContent='Não foi possível carregar as cidades. Selecione novamente a UF.';
      contactCityStatus.classList.add('error');
    }
  });
  contactLeadForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!contactLeadForm.reportValidity())return;
    const data=new FormData(contactLeadForm);
    const message=[
      'Olá, quero solicitar uma análise inicial da SanitSmart.',
      '',
      `Nome: ${data.get('nome')}`,
      `Telefone: ${data.get('telefone')}`,
      `E-mail: ${data.get('email')}`,
      `Razão Social: ${data.get('razao_social')}`,
      `Ramo de atividade: ${data.get('ramo_atividade')}`,
      `Localização: ${data.get('cidade')} - ${data.get('uf')}`,
      '',
      'O que está acontecendo:',
      data.get('situacao')
    ].join('\n');
    window.open(`https://wa.me/${sanitSmartWhatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
  });
}
