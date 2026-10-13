(() => {
  'use strict';
  const t = (key, variables) => window.GeorgeI18n.t(key, variables);
  const field = document.querySelector('#sticker-field');
  const stickers = [
    ['flower',13,15,-11],['star',37,10,12],['rainbow',64,14,-8],['heart',87,17,13],
    ['leaf',8,36,-20],['sun',27,27,7],['checker',49,24,-9],['cloud',78,32,11],['spiral',94,42,-5],
    ['sparkle',13,58,12],['music',22,80,-14],['star',43,84,14],['flower',65,82,6],['pencil',84,65,-15],
    ['heart',8,89,11],['rainbow',87,88,-5],['sun',56,96,5],['leaf',72,55,-15],['checker',6,7,8],
    ['spiral',95,7,9],['sparkle',34,96,8],['music',93,60,10],['flower',4,74,-8],['cloud',71,97,12]
  ];
  const updateStickerLabels = () => field.querySelectorAll('.sticker').forEach((button) => {
    const name = t(button.dataset.sticker);
    button.setAttribute('aria-label', t('stickerMove', { name, number: button.dataset.number }));
    button.title = t('stickerTap', { name });
  });
  const jitter = (size) => Math.random() * size * 2 - size;
  const position = (button,x,y,rotation) => {
    button.style.left = `${Math.max(5,Math.min(94,x))}%`;
    button.style.top = `${Math.max(7,Math.min(93,y))}%`;
    button.style.setProperty('--rotation',`${rotation}deg`);
  };
  stickers.forEach(([id,x,y,rotation],index) => {
    const button=document.createElement('button');
    button.type='button'; button.className='sticker';
    button.dataset.sticker = id; button.dataset.number = String(index + 1);
    button.innerHTML=`<svg aria-hidden="true"><use href="assets/stickers.svg#${id}"></use></svg>`;
    position(button,x,y,rotation);
    button.addEventListener('click',()=>position(button,x+jitter(4),y+jitter(5),rotation+jitter(18)));
    field.append(button);
  });
  updateStickerLabels();
  document.querySelector('#shuffle-stickers').addEventListener('click',()=>{
    field.querySelectorAll('.sticker').forEach((button,index)=>{
      const [,x,y,rotation]=stickers[index];
      position(button,x+jitter(4),y+jitter(4),rotation+jitter(16));
    });
  });

  const palette=document.querySelector('#paper-palette');
  const toggle=document.querySelector('#paper-toggle');
  const paperColors={cream:'#fbf7ee',blue:'#eef5fa',pink:'#fcf0ee',green:'#f0f5e9'};
  const setPaper=(paper)=>{
    if(!Object.hasOwn(paperColors,paper))return;
    document.documentElement.style.setProperty('--paper',paperColors[paper]);
    document.querySelector('meta[name="theme-color"]').content=paperColors[paper];
    document.querySelectorAll('.paper-swatch').forEach(button=>{
      const selected=button.dataset.paper===paper;
      button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));
    });
  };
  try{setPaper(localStorage.getItem('iamgeorge-paper')||'cream');}catch{}
  const closePalette=()=>{palette.hidden=true;toggle.setAttribute('aria-expanded','false');};
  toggle.addEventListener('click',()=>{palette.hidden=!palette.hidden;toggle.setAttribute('aria-expanded',String(!palette.hidden));});
  document.querySelectorAll('.paper-swatch').forEach(button=>button.addEventListener('click',()=>{
    setPaper(button.dataset.paper);
    try{localStorage.setItem('iamgeorge-paper',button.dataset.paper);}catch{}
    closePalette();toggle.focus();
  }));
  document.addEventListener('click',(event)=>{if(!event.target.closest('.paper-control'))closePalette();});
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!palette.hidden){closePalette();toggle.focus();}});

  document.querySelector('#letter-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const textarea=document.querySelector('#letter-body');
    const text=textarea.value.trim();
    const status=document.querySelector('#letter-status');
    if(!text){textarea.setCustomValidity(t('letterRequired'));textarea.reportValidity();return;}
    textarea.setCustomValidity('');
    const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const blob=new Blob([`${t('letterFileTitle')}\n${date}\n\n${t('letterDear')}\n\n${text}\n`],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const download=document.createElement('a');download.href=url;download.download=`${date}-${t('letterFilename')}.txt`;
    document.body.append(download);download.click();download.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    status.dataset.message = 'letterDownloaded'; status.textContent=t('letterDownloaded');
  });
  document.querySelector('#letter-body').addEventListener('input',(event)=>{
    event.target.setCustomValidity('');document.querySelector('#letter-status').textContent=''; delete document.querySelector('#letter-status').dataset.message;
  });
  document.querySelector('#letter-body').addEventListener('invalid', (event) => {
    if (!event.target.value.trim()) event.target.setCustomValidity(t('letterRequired'));
  });
  document.addEventListener('iamgeorge:languagechange', () => {
    updateStickerLabels();
    document.querySelector('#letter-body').setCustomValidity('');
    const status = document.querySelector('#letter-status');
    if (status.dataset.message) status.textContent = t(status.dataset.message);
  });
})();
