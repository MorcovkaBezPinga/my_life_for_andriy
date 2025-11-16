// Ukrainian slideshow "video" for Andriy
const images = [
  {src:'images/IMG_6034.JPG', caption_uk:'Спільна прогулянка взимку — теплі спогади', info_uk:'Дата: 2023, парк. Андрій сміється.', caption_en:'Winter walk — warm memories', info_en:'Date: 2023, park. Andriy is smiling.'},
  {src:'images/IMG_6065.JPG', caption_uk:'Улюблена мить — щира усмішка', info_uk:'Підпис: посмішка, що дарує надію.', caption_en:'Favorite moment — a sincere smile', info_en:'Caption: a smile that gives hope.'},
  {src:'images/photo_2025-11-16_11-44-20.jpg', caption_uk:'Ранкове сонце і настрій', info_uk:'Сфотографовано на світанку.', caption_en:'Morning sun and mood', info_en:'Taken at sunrise.'},
  {src:'images/photo_2025-11-16_11-44-33.jpg', caption_uk:'Незабутній вечір', info_uk:'Світлини з вечірки.', caption_en:'Unforgettable evening', info_en:'Photos from the party.'},
  {src:'images/photo_2025-11-16_11-44-36.jpg', caption_uk:'Кава і розмова', info_uk:'Момент щирого діалогу.', caption_en:'Coffee and conversation', info_en:'A moment of sincere talk.'},
  {src:'images/photo_2025-11-16_11-44-39.jpg', caption_uk:'Друзі поруч', info_uk:'Ті, хто цінує Андрія.', caption_en:'Friends nearby', info_en:'Those who appreciate Andriy.'},
  {src:'images/photo_2025-11-16_11-45-06.jpg', caption_uk:'Маленькі пригоди', info_uk:'Кадр з подорожі.', caption_en:'Little adventures', info_en:'A shot from a trip.'},
  {src:'images/photo_2025-11-16_11-45-08.jpg', caption_uk:'Момент натхнення', info_uk:'Коли з’являється ідея.', caption_en:'A moment of inspiration', info_en:'When an idea appears.'},
  {src:'images/photo_2025-11-16_11-45-13.jpg', caption_uk:'Теплі зустрічі', info_uk:'Родинні зустрічі та обійми.', caption_en:'Warm gatherings', info_en:'Family meetings and hugs.'},
  {src:'images/photo_2025-11-16_11-45-21.jpg', caption_uk:'Посмішка для тебе', info_uk:'Кадр, що нагадує про щастя.', caption_en:'A smile for you', info_en:'A frame that reminds of happiness.'},
  {src:'images/photo_2025-11-16_11-46-00.jpg', caption_uk:'До нових звершень, Андрій!', info_uk:'Побажання удачі і натхнення.', caption_en:'To new achievements, Andriy!', info_en:'Wishes of luck and inspiration.'}
];

const stage = document.getElementById('stage');
const wrap = document.querySelector('.slide-wrap');
const captionEl = document.getElementById('caption');
const infoEl = document.getElementById('photoInfo');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const confettiCanvas = document.getElementById('confetti');
const bgCanvas = document.getElementById('bgCanvas');

let slides = [];
let idx = 0;
let timer = null;
let playing = false;
let interval = 2800; // швидкість "відео"
let currentLang = 'uk';

const langUaBtn = document.getElementById('langUa');
const langEnBtn = document.getElementById('langEn');

const translations = {
  uk: {
    title: 'З Днем народження, Андрій! 🎉',
    subtitle: 'Нехай кожен кадр дарує тепло і посмішку — це маленьке відео з наших фото.',
    play: 'Запустити привітання',
    pause: 'Пауза',
    fullscreen: 'Повноекранно',
    footer: "Створено з любов'ю ❤️ — Привітання для Андрія"
  },
  en: {
    title: "Happy Birthday, Andriy! 🎉",
    subtitle: 'May each frame bring warmth and a smile — a little video of our photos.',
    play: 'Play greeting',
    pause: 'Pause',
    fullscreen: 'Fullscreen',
    footer: 'Made with love ❤️ — A greeting for Andriy'
  }
};

function setLangButtons(lang){
  if(lang==='uk'){
    langUaBtn.classList.add('active'); langEnBtn.classList.remove('active');
  } else {
    langEnBtn.classList.add('active'); langUaBtn.classList.remove('active');
  }
}

function applyLanguage(lang){
  currentLang = lang;
  setLangButtons(lang);
  // update static texts
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
  });
  // update slides text (in DOM and footer caption elements)
  slides.forEach((s,i)=>{
    const txt = s.querySelector('.text-col');
    if(txt){
      const h = txt.querySelector('h2');
      const p = txt.querySelector('p');
      h.textContent = images[i][lang==='uk' ? 'caption_uk' : 'caption_en'] || '';
      p.textContent = images[i][lang==='uk' ? 'info_uk' : 'info_en'] || '';
    }
  });
  // update caption/footer for current slide
  updateCaption(idx);
}

// створити слайди
function buildSlides(){
  images.forEach((it,i)=>{
    const s = document.createElement('div');
    s.className = 'slide';
    if(i===0) s.classList.add('active');

    // content: left text + right image
    const content = document.createElement('div');
    content.className = 'slide-content';

    const textCol = document.createElement('div');
    textCol.className = 'text-col';
  const h = document.createElement('h2');
  h.textContent = it[currentLang==='uk' ? 'caption_uk' : 'caption_en'] || `Фото ${i+1}`;
  const p = document.createElement('p');
  p.textContent = it[currentLang==='uk' ? 'info_uk' : 'info_en'] || '';
    textCol.appendChild(h);
    textCol.appendChild(p);

    const imgCol = document.createElement('div');
    imgCol.className = 'img-col';
  const img = document.createElement('img');
  img.src = it.src;
  img.alt = it[currentLang==='uk' ? 'caption_uk' : 'caption_en'] || `Фото ${i+1}`;
    imgCol.appendChild(img);

    content.appendChild(textCol);
    content.appendChild(imgCol);
    s.appendChild(content);
    wrap.appendChild(s);
    slides.push(s);
  });

  // начальный caption/footer
  updateCaption(0);
}

function updateCaption(i){
  const it = images[i];
  if(!it) return;
  const captionKey = currentLang==='uk' ? 'caption_uk' : 'caption_en';
  const infoKey = currentLang==='uk' ? 'info_uk' : 'info_en';
  captionEl.textContent = it[captionKey] || '';
  infoEl.textContent = it[infoKey] || '';
}

function showSlide(next){
  // переключение активного слайда с плавной анімацією
  if(slides[idx]) slides[idx].classList.remove('active');
  idx = (next + slides.length) % slides.length;
  if(slides[idx]){
    slides[idx].classList.add('active');
    // оновити футери/підписи
    updateCaption(idx);
  }
}

function nextSlide(){ showSlide(idx+1); }
function prevSlide(){ showSlide(idx-1); }

function play(){
  if(playing) return;
  playing = true;
  triggerConfetti();
  timer = setInterval(nextSlide, interval);
}
function pause(){
  playing = false;
  clearInterval(timer);
}

// простий конфетті-ефект (легка реалізація)
function triggerConfetti(){
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const pieces = [];
  for(let i=0;i<120;i++){
    pieces.push({x:Math.random()*confettiCanvas.width,y:Math.random()*-confettiCanvas.height, r:Math.random()*6+2, d:Math.random()*4+1, color:randomColor()});
  }
  let t = 0;
  function frame(){
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    for(let p of pieces){
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r, p.r*0.6, Math.PI/4, 0, Math.PI*2);
      ctx.fill();
      p.y += p.d + Math.sin(t+p.d);
      p.x += Math.sin(t+p.d*0.5);
      if(p.y>confettiCanvas.height+20) p.y = Math.random()*-confettiCanvas.height;
    }
    t += 0.02;
    if(t < 8) requestAnimationFrame(frame);
    else ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  }
  frame();
}
function randomColor(){
  const cols = ['#ff4d6d','#ffd166','#06d6a0','#4d96ff','#9b5de5','#ff7ab6'];
  return cols[Math.floor(Math.random()*cols.length)];
}

// --- background particles: stars + snowflakes (subtle, few) ---
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
let bgParticles = [];
function resizeBg(){
  if(!bgCanvas) return;
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function initBgParticles(){
  if(!bgCtx) return;
  bgParticles = [];
  const starsCount = Math.max(8, Math.floor(window.innerWidth / 160)); // few
  const snowCount = Math.max(3, Math.floor(window.innerWidth / 800));
  for(let i=0;i<starsCount;i++){
    bgParticles.push({
      type:'star',
      x: Math.random()*bgCanvas.width,
      y: Math.random()*bgCanvas.height,
      r: Math.random()*1.6+0.6,
      vy: 0.2 + Math.random()*0.6,
      alpha: 0.3 + Math.random()*0.7,
      twinkle: Math.random()*Math.PI*2
    });
  }
  for(let i=0;i<snowCount;i++){
    bgParticles.push({
      type:'snow',
      x: Math.random()*bgCanvas.width,
      y: Math.random()*bgCanvas.height,
      r: Math.random()*2+0.8,
      vy: 0.3 + Math.random()*0.8,
      vx: (Math.random()-0.5)*0.4,
      alpha: 0.6 + Math.random()*0.4
    });
  }
}

let bgT = 0;
function frameBg(){
  if(!bgCtx) return;
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  bgT += 0.01;
  for(let p of bgParticles){
    if(p.type==='star'){
      // star-shaped particle with twinkle
      p.y += p.vy * (0.3 + Math.sin(bgT + p.twinkle)*0.3);
      p.twinkle += 0.06;
      if(p.y > bgCanvas.height + 10) p.y = -10;
      if(p.x > bgCanvas.width + 10) p.x = -10;
      // draw a simple 5-point star
      const sides = 5;
      const outerR = p.r * 3.5;
      const innerR = outerR * 0.45;
      const rot = (bgT + p.twinkle) * 0.3;
      bgCtx.save();
      bgCtx.translate(p.x,p.y);
      bgCtx.rotate(rot);
      bgCtx.beginPath();
      for(let a=0;a<sides;a++){
        const ang = (a*(Math.PI*2))/sides;
        const x = Math.cos(ang) * outerR;
        const y = Math.sin(ang) * outerR;
        bgCtx.lineTo(x,y);
        const ang2 = ang + Math.PI/sides;
        bgCtx.lineTo(Math.cos(ang2)*innerR, Math.sin(ang2)*innerR);
      }
      bgCtx.closePath();
      bgCtx.fillStyle = `rgba(255,255,255,${0.45 + Math.sin(p.twinkle)*0.25})`;
      bgCtx.fill();
      bgCtx.restore();
    } else if(p.type==='snow'){
      p.y += p.vy;
      p.x += p.vx * (0.8 + Math.sin(bgT)*0.5);
      if(p.y > bgCanvas.height + 6) p.y = -6;
      if(p.x > bgCanvas.width + 6) p.x = -6;
      // small white circle
      bgCtx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      bgCtx.beginPath();
      bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
      bgCtx.fill();
    }
  }
  requestAnimationFrame(frameBg);
}

// init bg on load
window.addEventListener('load', ()=>{
  resizeBg();
  initBgParticles();
  requestAnimationFrame(frameBg);
});

window.addEventListener('resize', ()=>{
  resizeBg();
  initBgParticles();
});

// події
playBtn.addEventListener('click', ()=>{ play(); });
pauseBtn.addEventListener('click', ()=>{ pause(); });
fullscreenBtn.addEventListener('click', ()=>{
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen();
  } else document.exitFullscreen();
});

langUaBtn.addEventListener('click', ()=> applyLanguage('uk'));
langEnBtn.addEventListener('click', ()=> applyLanguage('en'));

// клавіатура
document.addEventListener('keydown', e=>{
  if(e.code==='Space'){
    e.preventDefault(); playing ? pause() : play();
  } else if(e.key==='ArrowRight') nextSlide();
  else if(e.key==='ArrowLeft') prevSlide();
});

// старт
buildSlides();
// застосувати початкову мову до всього UI
applyLanguage(currentLang);

// невеликий автозапуск через 1.2s (щоб дозволити користувачу натиснути "Стоп")
setTimeout(()=>{ play(); }, 1200);

// підлаштування canvas
window.addEventListener('resize', ()=>{
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

// просте поворотне автозаливання зображень (preload)
images.forEach(it=>{ const im=new Image(); im.src=it.src; });
