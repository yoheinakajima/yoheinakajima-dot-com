(function(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const objline = document.getElementById('objline');
  const tasks = [...document.querySelectorAll('.task')];
  const sections = tasks.map(t => document.getElementById(t.dataset.target));
  const logtail = document.getElementById('logtail');
  const rerun = document.getElementById('rerun');
  const OBJ = 'introduce yohei nakajima';
  let timers = [];
  let idleTimer = null;

  const IDLE_LINES = [
    'idle... watching for new ideas',
    'idle... resisting a rewrite in rust',
    'idle... checking pypi downloads',
    'idle... sketching pixel art (off the clock)',
    'idle... reading a founder deck',
    'idle... consolidating memory'
  ];

  function clearTimers(){ timers.forEach(clearTimeout); timers = []; clearInterval(idleTimer); }
  function wait(fn, ms){ timers.push(setTimeout(fn, ms)); }

  function typeObjective(done){
    objline.innerHTML = '<span class="caret"></span>';
    let i = 0;
    (function tick(){
      if(i <= OBJ.length){
        objline.innerHTML = OBJ.slice(0, i) + '<span class="caret"></span>';
        i++;
        wait(tick, 34);
      } else {
        wait(done, 350);
      }
    })();
  }

  function tail(msg){
    const s = document.createElement('span');
    s.className = 'idleline';
    s.textContent = msg;
    logtail.appendChild(s);
    while(logtail.children.length > 3) logtail.removeChild(logtail.firstChild);
  }

  function runTask(i){
    if(i >= tasks.length){ finish(); return; }
    const t = tasks[i];
    t.classList.add('running');
    t.querySelector('.box').textContent = '[~]';
    tail('> task ' + String(i+1).padStart(2,'0') + ': ' + t.querySelector('.tt').textContent);
    wait(() => {
      t.classList.remove('running');
      t.classList.add('done');
      t.querySelector('.box').textContent = '[✓]';
      sections[i].classList.add('on');
      wait(() => runTask(i+1), 260);
    }, i === 0 ? 700 : 480);
  }

  function finish(){
    tail('> objective complete · 0 errors · 1 flex');
    rerun.hidden = false;
    let k = 0;
    idleTimer = setInterval(() => {
      tail(IDLE_LINES[k % IDLE_LINES.length]);
      k++;
    }, 9000);
  }

  function showAllInstant(){
    objline.textContent = OBJ;
    tasks.forEach(t => { t.classList.add('done'); t.querySelector('.box').textContent = '[✓]'; });
    sections.forEach(s => s.classList.add('on'));
    tail('> objective complete · 0 errors · 1 flex');
    rerun.hidden = false;
  }

  function run(){
    clearTimers();
    logtail.innerHTML = '';
    rerun.hidden = true;
    tasks.forEach(t => { t.className = 'task'; t.querySelector('.box').textContent = '[ ]'; });
    sections.forEach(s => s.classList.remove('on'));
    if(reduced){ showAllInstant(); return; }
    typeObjective(() => { tail('> planning tasks...'); wait(() => runTask(0), 500); });
  }

  /* click a completed task -> scroll to its section */
  tasks.forEach((t, i) => {
    t.addEventListener('click', () => {
      if(t.classList.contains('done')) sections[i].scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block:'start'});
    });
  });

  /* scroll-spy: highlight the log line of the section in view */
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const idx = sections.indexOf(e.target);
      if(idx > -1) tasks[idx].classList.toggle('active-scroll', e.isIntersecting);
    });
  }, { rootMargin:'-40% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  rerun.addEventListener('click', () => {
    window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'});
    wait(run, reduced ? 0 : 400);
  });

  run();
})();
