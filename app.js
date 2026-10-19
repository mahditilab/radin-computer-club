const fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]).replace(".","٫");

// Two-choice sorting game: <div class="sorter" data-items='[["word","a"|"b"],...]' data-a="..." data-b="...">
document.querySelectorAll(".sorter").forEach(el=>{
  const items=JSON.parse(el.dataset.items),A=el.dataset.a,B=el.dataset.b;
  el.innerHTML='<div class="big"></div><div class="row"><button data-k="a">'+A+'</button><button data-k="b">'+B+'</button></div><p class="msg-line" aria-live="polite"></p><p class="muted" style="text-align:center"></p>';
  const [item,,msg,sc]=el.children;let i=0,score=0,tries=0;
  const show=()=>{item.textContent=i<items.length?items[i][0]:"🎉 تمام شد!";sc.textContent="امتیاز: "+fa(score)+" از "+fa(tries)};
  el.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    if(i>=items.length)return;
    const [name,ans]=items[i],label=ans==="a"?A:B;tries++;
    if(b.dataset.k===ans){score++;msg.className="msg-line good";msg.textContent="✅ آفرین! «"+name+"»: "+label}
    else{msg.className="msg-line bad";msg.textContent="❌ نه دقیقاً. «"+name+"»: "+label}
    i++;show();
  });
  show();
});

// Mouse practice: click the star 10 times
document.querySelectorAll(".star-game").forEach(el=>{
  el.innerHTML='<div class="pad"><button class="star" aria-label="ستاره" style="left:calc(50% - 28px);top:100px">★</button></div><p class="msg-line" aria-live="polite">برای شروع روی ستاره کلیک کن!</p>';
  const pad=el.firstChild,s=pad.firstChild,msg=el.lastChild;let hits=0,start=0,best=null;
  s.onclick=()=>{
    if(hits===0)start=performance.now();
    if(++hits>=10){
      const t=+((performance.now()-start)/1000).toFixed(1);
      if(best===null||t<best)best=t;
      msg.textContent="🎉 ۱۰ ستاره در "+fa(t)+" ثانیه! بهترین رکورد: "+fa(best)+" ثانیه. برای بازی دوباره کلیک کن.";
      hits=0;return;
    }
    msg.textContent=fa(hits)+" از ۱۰";
    s.style.left=Math.random()*(pad.clientWidth-56)+"px";
    s.style.top=Math.random()*(pad.clientHeight-56)+"px";
  };
});

// Typing practice: <div class="typing" data-words='["cat",...]'>
document.querySelectorAll(".typing").forEach(el=>{
  const words=JSON.parse(el.dataset.words);
  el.innerHTML='<div class="big"></div><div class="row"><input id="typeIn" autocomplete="off" spellcheck="false" aria-label="اینجا تایپ کن"></div><p class="msg-line" aria-live="polite"></p>';
  const [w,,msg]=el.children,inp=el.querySelector("input");let i=0,start=0;
  const show=()=>{w.textContent=words[i];inp.value=""};
  inp.oninput=()=>{
    if(!start)start=performance.now();
    if(inp.value!==words[i])return;
    if(++i<words.length){msg.textContent="✅ "+fa(i)+" از "+fa(words.length);show();return}
    msg.textContent="🎉 همه را در "+fa(Math.round((performance.now()-start)/1000))+" ثانیه تایپ کردی! دوباره؟ یک کلمه تایپ کن.";
    i=0;start=0;show();
  };
  show();
});

// Mouse lab, session 2. Each experiment shows what one mouse action does.
const say=(el,t,ok)=>{const m=el.querySelector(".msg-line");m.textContent=t;m.className="msg-line"+(ok?" good":"")};

// 1. Click: each box turns green
document.querySelectorAll(".lab-click").forEach(el=>{
  el.innerHTML='<div class="tiles">'+'<button class="tile" aria-label="جعبه"></button>'.repeat(6)+'</div><p class="msg-line" aria-live="polite">روی هر جعبه یک بار کلیک کن.</p>';
  const tiles=[...el.querySelectorAll(".tile")];
  tiles.forEach(t=>t.onclick=()=>{
    t.classList.add("on");t.textContent="✓";
    const n=tiles.filter(x=>x.classList.contains("on")).length;
    n===tiles.length?say(el,"🎉 همه سبز شدند! کلیک یعنی «این را انتخاب کن».",1):say(el,fa(n)+" از "+fa(tiles.length));
  });
  el.append(Object.assign(document.createElement("button"),{textContent:"دوباره",onclick:()=>{tiles.forEach(t=>{t.classList.remove("on");t.textContent=""});say(el,"روی هر جعبه یک بار کلیک کن.")}}));
});

// 2. Double-click: one click only selects, two quick clicks open
document.querySelectorAll(".lab-dbl").forEach(el=>{
  el.innerHTML='<div class="row"><button class="tile big-tile" aria-label="هدیه">🎁</button></div><p class="msg-line" aria-live="polite">هدیه را باز کن! (دو بار سریع کلیک کن)</p>';
  const g=el.querySelector(".tile");
  const gifts=["🧸","🚀","⚽","🐶","🎮","🍦"];
  g.onclick=()=>{if(g.textContent==="🎁"){g.classList.add("sel");say(el,"یک کلیک فقط انتخابش کرد. حالا دو بار سریع بزن!")}};
  g.ondblclick=()=>{
    if(g.textContent!=="🎁"){g.textContent="🎁";g.classList.remove("on","sel");say(el,"دوباره بسته شد. یک بار دیگر بازش کن!");return}
    g.textContent=gifts[Math.floor(Math.random()*gifts.length)];g.classList.add("on");g.classList.remove("sel");
    say(el,"🎉 باز شد! دابل‌کلیک یعنی «باز کن». (برای بستن دوباره دابل‌کلیک کن)",1);
  };
});

// 3. Right-click: opens a hidden menu to change the colour
document.querySelectorAll(".lab-right").forEach(el=>{
  const colors=[["قرمز","#e5484d"],["آبی","#2563c9"],["زرد","#f2b705"],["بنفش","#8e4ec6"]];
  el.innerHTML='<div class="row" style="position:relative"><div class="tile big-tile" tabindex="0">🐱</div><div class="ctx" hidden>'+colors.map(c=>'<button data-c="'+c[1]+'">'+c[0]+'</button>').join("")+'</div></div><p class="msg-line" aria-live="polite">روی گربه راست‌کلیک کن. یک منوی مخفی باز می‌شود!</p>';
  const cat=el.querySelector(".tile"),menu=el.querySelector(".ctx");
  cat.onclick=()=>say(el,"این کلیک چپ بود. دکمه‌ی راست ماوس را بزن!");
  cat.oncontextmenu=e=>{e.preventDefault();const r=cat.parentElement.getBoundingClientRect();menu.style.left=(e.clientX-r.left)+"px";menu.style.top=(e.clientY-r.top)+"px";menu.hidden=false;say(el,"منوی مخفی باز شد! یک رنگ انتخاب کن.",1)};
  menu.querySelectorAll("button").forEach(b=>b.onclick=()=>{cat.style.background=b.dataset.c;menu.hidden=true;say(el,"🎉 رنگ عوض شد! راست‌کلیک یعنی «چه کارهایی می‌توانم بکنم؟»",1)});
  document.addEventListener("click",e=>{if(!el.contains(e.target))menu.hidden=true});
});

// 4. Drag and drop: put the fruits in the basket
document.querySelectorAll(".lab-drag").forEach(el=>{
  const fruits=["🍎","🍌","🍇","🍓","🍊"];
  el.innerHTML='<div class="row fruits">'+fruits.map(f=>'<span class="fruit" draggable="true">'+f+'</span>').join("")+'</div><div class="basket">🧺<div class="in"></div></div><p class="msg-line" aria-live="polite">میوه را بگیر (دکمه را نگه دار)، ببر روی سبد و رها کن.</p>';
  const basket=el.querySelector(".basket"),inside=basket.querySelector(".in");let dragged=null;
  el.querySelectorAll(".fruit").forEach(f=>{f.ondragstart=e=>{dragged=f;e.dataTransfer.setData("text/plain",f.textContent);f.classList.add("lift")};f.ondragend=()=>f.classList.remove("lift")});
  basket.ondragover=e=>{e.preventDefault();basket.classList.add("over")};
  basket.ondragleave=()=>basket.classList.remove("over");
  basket.ondrop=e=>{
    e.preventDefault();basket.classList.remove("over");if(!dragged)return;
    inside.append(dragged);dragged.draggable=false;dragged=null;
    const n=inside.children.length;
    n===fruits.length?say(el,"🎉 همه‌ی میوه‌ها در سبد! کشیدن و رها کردن یعنی «جابجا کن».",1):say(el,fa(n)+" از "+fa(fruits.length)+" میوه در سبد");
  };
});

// Copy the Bale message
document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>{
  const src=document.getElementById(b.dataset.copy),note=b.nextElementSibling;
  navigator.clipboard.writeText(src.textContent).then(()=>note.textContent="کپی شد.").catch(()=>{
    const r=document.createRange();r.selectNodeContents(src);const s=getSelection();s.removeAllRanges();s.addRange(r);
    note.textContent="انتخاب شد. Ctrl+C یا Cmd+C را بزنید.";
  });
});
