(()=>{'use strict';
const C=window.BIRTHDAY;
const $=id=>document.getElementById(id);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const names=['intro','wishes','cake','story','home','korea','final'];
const chapterNames=['THE FIRST SURPRISE','A LETTER TO MY QUEEN','THE BIRTHDAY CELEBRATION','OUR LITTLE MEMORY BOOK','OUR MURREE DREAM','OUR SOUTH KOREA DREAM','FOREVER, MY QUEEN'];
let active='intro',cakeStep=0,storyPage=0,audioOn=false,birthdayPlaying=false,transitionLock=false;
const audio=$('music'),birthdayAudio=$('birthdayMusic');
audio.src=C.audio.romantic;birthdayAudio.src=C.audio.birthday;
audio.volume=.35;birthdayAudio.volume=.85;
const setText=(id,value)=>$(id).textContent=value;
const labelScene=()=>{setText('chapterLabel',chapterNames[names.indexOf(active)]);setText('sceneCount',`${String(names.indexOf(active)+1).padStart(2,'0')} / 07`)};
const visible=(elem,v)=>{elem.hidden=!v};
const playQuietly=async()=>{
 if(!audioOn||birthdayPlaying)return;
 try{await audio.play();$('audioIcon').textContent='♫';setText('audioLabel','Playing')}catch(e){audioOn=false;$('audioIcon').textContent='♪';setText('audioLabel','Tap for music')}
};
function toggleAudio(){audioOn=!audioOn;if(audioOn){if(birthdayPlaying){birthdayAudio.play().catch(()=>{});}else playQuietly();}else{audio.pause();birthdayAudio.pause()}$('audioToggle').setAttribute('aria-pressed',String(audioOn));$('audioIcon').textContent=audioOn?'♫':'♪';setText('audioLabel',audioOn?'Music on':'Sound off')}
function playBirthday(){audio.pause();birthdayPlaying=true;birthdayAudio.currentTime=0;if(audioOn){birthdayAudio.play().catch(()=>{})}}
birthdayAudio.addEventListener('ended',()=>{birthdayPlaying=false;if(audioOn)playQuietly()});
function goto(scene){if(!names.includes(scene)||transitionLock)return;transitionLock=true;stopTour();const next=$('scene-'+scene),prev=$('scene-'+active);prev.classList.remove('active');prev.setAttribute('aria-hidden','true');active=scene;next.classList.add('active');next.setAttribute('aria-hidden','false');labelScene();if(scene==='home')startTour('home');if(scene==='korea')startTour('korea');setTimeout(()=>{transitionLock=false},reduced?20:850)}
// Narrative opening and personal wishes.
// Allow her name to be personalized without editing HTML.
const hero=document.querySelector('.intro-title'),parts=(C.herName||'My Queen').trim().split(/\s+/);hero.firstChild.textContent=(parts.length>1?parts.slice(0,-1).join(' '):'My')+' ';hero.querySelector('em').textContent=parts.length>1?parts.at(-1):parts[0];
setText('openingLine',C.opening);setText('wishTitle',C.wishTitle);setText('wishSignature',C.yourSignature);
C.wishes.forEach(line=>{const p=document.createElement('p');p.textContent=line;$('wishParagraphs').append(p)});
C.urduPoetry.forEach(line=>{const p=document.createElement('p');p.textContent=line;$('urduPoetry').append(p)});
setText('cakeEmotion',C.cakeAfter);setText('finalLetter',C.finalLetter);setText('finalSignature',C.yourSignature);
function unwrap(){if(active!=='intro'||$('unwrapGift').classList.contains('opened'))return;$('unwrapGift').classList.add('opened');$('openGift').disabled=true;if(C.startMusicAfterUnwrap){audioOn=true;$('audioToggle').setAttribute('aria-pressed','true');$('audioIcon').textContent='♫';setText('audioLabel','Music on');playQuietly()}setTimeout(()=>goto('wishes'),reduced?100:1050)}
$('unwrapGift').addEventListener('click',unwrap);$('openGift').addEventListener('click',unwrap);
$('openLetter').addEventListener('click',()=>{visible($('envelopeStage'),false);visible($('letterPaper'),true)});
$('toCake').addEventListener('click',()=>{resetCake();goto('cake')});
// Fully real DOM-driven candle extinguishing / cake split animation.
function resetCake(){cakeStep=0;$('cakeStage').classList.remove('extinguished','cut');$('confetti').replaceChildren();visible($('cakeReplay'),false);visible($('cakeEmotion'),false);visible($('toStory'),false);visible($('cakeNext'),true);setText('cakeHeading','Our little celebration');setText('cakeLine',`This little cake is for you, ${C.herName}.`);setText('cakeInstruction','Five little flames. One beautiful wish.');$('cakeNext').innerHTML='Make a Wish <span>✧</span>';birthdayAudio.pause();birthdayAudio.currentTime=0;if(birthdayPlaying){birthdayPlaying=false;if(audioOn)playQuietly()}}
function createConfetti(){const panel=$('confetti'),cols=['#ffefc1','#ffa5ac','#c1e2bf','#c0d6ef','#ecc16d'];panel.replaceChildren();for(let i=0;i<68;i++){let b=document.createElement('b');b.style.setProperty('--x',Math.round(Math.random()*100)+'%');b.style.setProperty('--size',(4+Math.random()*7).toFixed(1)+'px');b.style.setProperty('--color',cols[i%cols.length]);b.style.setProperty('--dur',(2.4+Math.random()*2.2).toFixed(2)+'s');b.style.setProperty('--delay',(Math.random()*.9).toFixed(2)+'s');b.style.setProperty('--dx',(Math.random()*200-100).toFixed(1)+'px');b.style.setProperty('--rot',(Math.random()*240).toFixed(1)+'deg');panel.append(b)}}
function advanceCake(){if(active!=='cake')return;if(cakeStep===0){cakeStep=1;setText('cakeLine','Close your eyes, my Queen…');setText('cakeInstruction','For a little moment, make your sweetest wish.');$('cakeNext').innerHTML='Blow the Candles <span>✧</span>'}else if(cakeStep===1){cakeStep=2;$('cakeStage').classList.add('extinguished');setText('cakeLine','May every beautiful wish of yours come true.');setText('cakeInstruction','The candles are out. Now our celebration begins!');$('cakeNext').innerHTML="Now let's cut our cake <span>♡</span>"}else if(cakeStep===2){cakeStep=3;$('cakeStage').classList.add('cut');setText('cakeLine',`Happy Birthday, ${C.herName}! 🎂❤️`);setText('cakeInstruction','Your cake is cut! Happy Birthday, meri jaan!');visible($('cakeNext'),false);visible($('cakeReplay'),true);createConfetti();playBirthday();setTimeout(()=>{if(active==='cake'&&cakeStep===3){visible($('cakeEmotion'),true);visible($('toStory'),true)}},reduced?100:1600)}}
$('cakeNext').addEventListener('click',advanceCake);$('cakeReplay').addEventListener('click',resetCake);$('toStory').addEventListener('click',()=>{birthdayAudio.pause();birthdayPlaying=false;if(audioOn)playQuietly();storyPage=0;renderBook();goto('story')});
// Scrapbook: one physical "page" at a time, 3 memories + ten reasons + a letter.
const storyLength=C.memories.length+C.reasons.length+1;
function renderBook(){const wrap=$('bookContent');wrap.replaceChildren();const root=document.createElement('div');root.className='book-content';const h=document.createElement('h2'),p=document.createElement('p');const idx=storyPage;
 if(idx<C.memories.length){const m=C.memories[idx];h.textContent=m.title;const photo=document.createElement('img');photo.className='memory-photo'+(m.photo?.includes('memory-')?' demo':'');photo.src=m.photo||'assets/memory-1.svg';photo.alt=m.photo?.includes('memory-')?'Decorative placeholder: replace with your own photograph':m.title;photo.onerror=()=>{photo.onerror=null;photo.src='assets/memory-1.svg'};root.append(h,photo);p.textContent=m.caption;root.append(p);setText('pageCaption','A tiny chapter, kept safe in our hearts.');}
 else if(idx<C.memories.length+C.reasons.length){const n=idx-C.memories.length;const num=document.createElement('span');num.className='reason-number';num.textContent=`ONE OF TEN LITTLE REASONS · ${n+1} / 10`;const heart=document.createElement('span');heart.className='reason-heart';heart.textContent='♥';h.textContent='Why I love you';const phrase=document.createElement('div');phrase.className='reason-phrase';phrase.textContent=C.reasons[n];root.append(h,num,heart,phrase);setText('pageCaption','Tap to uncover another reason.');}
 else{h.textContent='A secret in my source code';const code=document.createElement('span');code.className='reason-number';code.textContent='IF (HEART.BELONGS_TO === YOU)';p.className='book-letter';p.textContent=C.storyLetter;root.append(h,code,p);setText('pageCaption','My favourite constant will always be you.');}
 wrap.append(root);setText('pageNumber',`${String(idx+1).padStart(2,'0')} / ${storyLength}`);$('pageTurn').innerHTML=idx===storyLength-1?'Open our next dream <span>⌂</span>':'Turn the page <span>↗</span>'}
$('pageTurn').addEventListener('click',()=>{if(storyPage>=storyLength-1){goto('home');return}const pg=$('bookPage');pg.classList.remove('turning');void pg.offsetWidth;pg.classList.add('turning');storyPage++;setTimeout(()=>{renderBook();pg.scrollTop=0},reduced?0:230)});
// Images: always attempt online real photograph first, use bundled local
// artistic fallback if network cannot retrieve an external photo.
function showImage(elem,scene){const id=(Number(elem.dataset.loadId)||0)+1;elem.dataset.loadId=String(id);elem.src=scene.fallback;elem.alt=scene.title+'. '+scene.credit;const test=new Image();test.onload=()=>{if(elem.dataset.loadId===String(id))elem.src=scene.photo};test.onerror=()=>{};test.src=scene.photo;}
const tours={home:{list:C.murreeScenes,frame:0,playing:false,time:0,last:0,raf:0},korea:{list:C.koreaScenes,frame:0,playing:false,time:0,last:0,raf:0}};
const TOUR_DURATION=reduced?3900:5500;
function stopTour(){Object.values(tours).forEach(t=>{t.playing=false;cancelAnimationFrame(t.raf)})}
function renderTour(type){const t=tours[type],s=t.list[t.frame],prefix=type;
 showImage($(prefix+'Image'),s);setText(prefix+'Kicker',s.label);setText(prefix+'Title',s.title);setText(prefix+'Description',s.description);
 setText(prefix+'Position',`${String(t.frame+1).padStart(2,'0')} / ${String(t.list.length).padStart(2,'0')}`);
 const box=$(prefix+'Copy');box.classList.remove('reveal');void box.offsetWidth;box.classList.add('reveal');
 const img=$(prefix+'Image');img.style.animation='none';void img.offsetWidth;img.style.animation='';
 $(prefix+'Bar').style.width='0%';visible($(prefix+'End'),false);
}
function finishTour(type){const t=tours[type];t.playing=false;cancelAnimationFrame(t.raf);$(type+'PlayPause').textContent='▶';$(type+'Bar').style.width='100%';visible($(type+'End'),true)}
function tourNext(type){const t=tours[type];if(t.frame>=t.list.length-1){finishTour(type);return}t.frame++;t.time=0;renderTour(type)}
function tourBack(type){const t=tours[type];t.frame=Math.max(0,t.frame-1);t.time=0;renderTour(type);t.last=performance.now()}
function frameLoop(type,now){const t=tours[type];if(!t.playing||active!==type)return;if(t.last){t.time+=Math.min(now-t.last,100)}t.last=now;$(type+'Bar').style.width=Math.min(100,t.time/TOUR_DURATION*100)+'%';if(t.time>=TOUR_DURATION){if(t.frame===t.list.length-1){finishTour(type);return}tourNext(type)}t.raf=requestAnimationFrame(n=>frameLoop(type,n))}
function startTour(type){const t=tours[type];t.frame=0;t.time=0;t.last=0;t.playing=true;renderTour(type);$(type+'PlayPause').textContent='❚❚';t.raf=requestAnimationFrame(n=>frameLoop(type,n))}
for(const type of ['home','korea']){
 $(type+'PlayPause').addEventListener('click',()=>{const t=tours[type];if(t.playing){t.playing=false;cancelAnimationFrame(t.raf);$(type+'PlayPause').textContent='▶'}else{visible($(type+'End'),false);t.playing=true;t.last=0;$(type+'PlayPause').textContent='❚❚';t.raf=requestAnimationFrame(n=>frameLoop(type,n))}});
 $(type+'Next').addEventListener('click',()=>{tourNext(type);tours[type].last=0});
 $(type+'Previous').addEventListener('click',()=>tourBack(type));
 $(type+'Replay').addEventListener('click',()=>{stopTour();startTour(type)});
}
$('toKorea').addEventListener('click',()=>goto('korea'));
C.bucketList.forEach((line,i)=>{const lb=document.createElement('label');lb.className='bucket-item';const input=document.createElement('input');input.type='checkbox';input.setAttribute('aria-label',line);const span=document.createElement('span');span.textContent=line;lb.append(input,span);$('bucketList').append(lb)});
$('toFinal').addEventListener('click',()=>goto('final'));
$('lastSecret').addEventListener('click',()=>{visible($('lastMessage'),true);visible($('lastSecret'),false)});
$('replayFilm').addEventListener('click',()=>{visible($('lastMessage'),false);visible($('lastSecret'),true);$('unwrapGift').classList.remove('opened');$('openGift').disabled=false;visible($('envelopeStage'),true);visible($('letterPaper'),false);resetCake();goto('intro')});
$('audioToggle').addEventListener('click',toggleAudio);$('helpButton').addEventListener('click',()=>visible($('helpBox'),$('helpBox').hidden));$('helpClose').addEventListener('click',()=>visible($('helpBox'),false));document.addEventListener('keydown',e=>{if(e.key==='Escape')visible($('helpBox'),false)});
// Honor explicit media preference and make the play control readable.
$('audioToggle').setAttribute('aria-pressed','false');labelScene();
window.__filmTest={get active(){return active},get cakeStep(){return cakeStep},get storyPage(){return storyPage},get homeFrame(){return tours.home.frame},get koreaFrame(){return tours.korea.frame},goto,advanceCake,startTour,finishTour};
})();
