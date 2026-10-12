(() => {
  'use strict';
  const field = document.querySelector('#sticker-field');
  const stickers = [
    ['flower',13,15,-11],['star',37,10,12],['rainbow',64,14,-8],['heart',87,17,13],
    ['leaf',8,36,-20],['sun',27,27,7],['checker',49,24,-9],['cloud',78,32,11],['spiral',94,42,-5],
    ['sparkle',13,58,12],['music',22,80,-14],['star',43,84,14],['flower',65,82,6],['pencil',84,65,-15],
    ['heart',8,89,11],['rainbow',87,88,-5],['sun',56,96,5],['leaf',72,55,-15],['checker',6,7,8],
    ['spiral',95,7,9],['sparkle',34,96,8],['music',93,60,10],['flower',4,74,-8],['cloud',71,97,12]
  ];
  const names = {flower:'花朵',star:'星星',rainbow:'彩虹',heart:'爱心',sun:'太阳',cloud:'云朵',pencil:'铅笔',music:'音符',leaf:'叶子',checker:'彩色方格',spiral:'小旋涡',sparkle:'闪光'};
  const jitter = (size) => Math.random() * size * 2 - size;
  const position = (button,x,y,rotation) => {
    button.style.left = `${Math.max(5,Math.min(94,x))}%`;
    button.style.top = `${Math.max(7,Math.min(93,y))}%`;
    button.style.setProperty('--rotation',`${rotation}deg`);
  };
  stickers.forEach(([id,x,y,rotation],index) => {
    const button=document.createElement('button');
    button.type='button'; button.className='sticker';
    button.setAttribute('aria-label',`挪动${names[id]}贴纸 ${index+1}`);
    button.title=`轻点挪动${names[id]}贴纸`;
    button.innerHTML=`<svg aria-hidden="true"><use href="assets/stickers.svg#${id}"></use></svg>`;
    position(button,x,y,rotation);
    button.addEventListener('click',()=>position(button,x+jitter(4),y+jitter(5),rotation+jitter(18)));
    field.append(button);
  });
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

  const dialog=document.querySelector('#story-dialog');
  const openStory=document.querySelector('#read-story');
  const closeStory=()=>dialog.close();
  openStory.addEventListener('click',()=>dialog.showModal());
  document.querySelector('#close-story').addEventListener('click',closeStory);
  dialog.addEventListener('click',(event)=>{
    if(event.target!==dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeStory();
  });

  document.querySelector('#letter-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const textarea=document.querySelector('#letter-body');
    const text=textarea.value.trim();
    const status=document.querySelector('#letter-status');
    if(!text){textarea.setCustomValidity('先写下想对洋芋说的话。');textarea.reportValidity();return;}
    textarea.setCustomValidity('');
    const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const blob=new Blob([`写给洋芋\n${date}\n\n亲爱的洋芋：\n\n${text}\n`],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const download=document.createElement('a');download.href=url;download.download=`${date}-写给洋芋.txt`;
    document.body.append(download);download.click();download.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    status.textContent='已准备好文字文件，请在设备上确认下载。';
  });
  document.querySelector('#letter-body').addEventListener('input',(event)=>{
    event.target.setCustomValidity('');document.querySelector('#letter-status').textContent='';
  });
})();
