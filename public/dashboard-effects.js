/* StegoVault dashboard presentation effects. No app logic, no state. */
(function(){
 function setup(){
  const r0=document.querySelector('.sv-dash');
  if(!r0) return false;
  
  // ensure all reveal elements get 'in' class immediately for full visibility
  document.querySelectorAll('.sv-dash .rv').forEach(e => e.classList.add('in'));

  // scroll progress
  let bar=document.querySelector('.sv-bar2');
  if(!bar){
   bar=document.createElement('div');
   bar.className='sv-bar2';
   document.body.appendChild(bar);
  }
  
  const updateBar=()=>{
   const h=document.documentElement;
   if(bar) bar.style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%';
  };
  window.removeEventListener('scroll',updateBar);
  window.addEventListener('scroll',updateBar,{passive:true});

  return true;
 }

 if(!setup()){
  const observer = new MutationObserver(()=>{
   if(setup()) observer.disconnect();
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});
 }

 // Cursor glow inside cards + magnetic primary buttons + parallax circles
 document.addEventListener('pointermove',e=>{
  const r0=document.querySelector('.sv-dash');
  if(!r0)return;
  const card=e.target.closest&&e.target.closest('.sv-dash .card');
  if(card){const r=card.getBoundingClientRect();card.style.setProperty('--cx',e.clientX-r.left+'px');card.style.setProperty('--cy',e.clientY-r.top+'px')}
  const b=e.target.closest&&e.target.closest('.sv-dash .btn.p');
  if(b){const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.08)+'px '+((e.clientY-r.top-r.height/2)*.18)+'px'}
  const as=e.target.closest&&e.target.closest('.sv-dash aside');
  if(as){const r=as.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,o1=as.querySelector('.o1'),o2=as.querySelector('.o2');
   if(o1)o1.style.translate=(x*-50)+'px '+(y*-40)+'px';if(o2)o2.style.translate=(x*-90)+'px '+(y*-70)+'px'}
 });
 document.addEventListener('pointerout',e=>{const b=e.target.closest&&e.target.closest('.sv-dash .btn.p');if(b)b.style.translate='0 0'});

 // Fallback reveal observer for dynamically added .rv cards
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.01});
 const scan=()=>document.querySelectorAll('.sv-dash .rv').forEach(e=>{ e.classList.add('in'); io.observe(e); });
 scan();
 new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();
