(function(){
 /* Entrance animations wait until their figure is on screen, and rewind once it has left, so
    scrolling back plays them again. Enough of a figure is on screen when 15% of it shows, or a
    third of the viewport's height of it does, so tall figures still count. Shared by every
    study through _layouts/study.html; a study's hero has its own script. */
 var TH=[0,.05,.1,.15,.2,.25,.3,.35];
 function seen(e,r){ var rh=(e.rootBounds&&e.rootBounds.height)||window.innerHeight; return e.isIntersecting&&(e.intersectionRatio>=r||e.intersectionRect.height>=0.3*rh); }
 var anim=document.querySelectorAll('figure .a');
 if(!anim.length) return;
 var figs=[]; for(var i=0;i<anim.length;i++){ var f=anim[i].closest('figure'); if(figs.indexOf(f)<0) figs.push(f); }
 var anims=function(f){ var out=[], els=f.querySelectorAll('.a'); for(var j=0;j<els.length;j++){ if(!els[j].getAnimations) break; var as=els[j].getAnimations(); for(var k=0;k<as.length;k++) if(as[k].animationName) out.push(as[k]); } return out; };
 var enter=function(f){ f.classList.add('in'); anims(f).forEach(function(a){ a.play(); }); };
 var leave=function(f){ f.classList.remove('in'); anims(f).forEach(function(a){ a.pause(); a.currentTime=0; }); };
 if(!('IntersectionObserver' in window)){ for(var i=0;i<figs.length;i++) figs[i].classList.add('in'); return; }
 var ao=new IntersectionObserver(function(es){ es.forEach(function(e){
   if(seen(e,0.15)){ if(!e.target.classList.contains('in')) enter(e.target); }
   else if(!e.isIntersecting&&e.target.classList.contains('in')) leave(e.target); }); },{threshold:TH});
 for(var i=0;i<figs.length;i++) ao.observe(figs[i]);
})();
