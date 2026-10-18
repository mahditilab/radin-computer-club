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

// Copy the Bale message
document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>{
  const src=document.getElementById(b.dataset.copy),note=b.nextElementSibling;
  navigator.clipboard.writeText(src.textContent).then(()=>note.textContent="کپی شد.").catch(()=>{
    const r=document.createRange();r.selectNodeContents(src);const s=getSelection();s.removeAllRanges();s.addRange(r);
    note.textContent="انتخاب شد. Ctrl+C یا Cmd+C را بزنید.";
  });
});
