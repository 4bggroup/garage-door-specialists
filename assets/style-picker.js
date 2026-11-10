'use strict';
(() => {
  const choices = {
    charcoal: {image:'door-charcoal',title:'Understated charcoal',label:'01 / CONTEMPORARY CHARCOAL',count:'01 / 03',alt:'Charcoal sectional garage door with pale sandstone framing and native planting',caption:'Clean horizontal lines and a dark, contemporary finish. A starting point for your new-door conversation.',description:'Clean horizontal lines. A quietly confident finish. Charcoal makes a considered statement against light brick and natural stone.'},
    timber: {image:'door-timber',title:'The warmth of timber',label:'02 / WARM TIMBER LOOK',count:'02 / 03',alt:'Warm timber-look garage door on a cream Melbourne-style home',caption:'Warm timber-look tones add texture and character. Ask about available finishes and profiles for your opening.',description:'Warm tones. A softer welcome. A timber-look finish brings texture and character to both contemporary and traditional homes.'},
    classic: {image:'door-classic',title:'Always a classic',label:'03 / TIMELESS & TRADITIONAL',count:'03 / 03',alt:'Classic cream panelled garage door on a leafy red-brick Melbourne-style home',caption:'A light panelled finish that sits comfortably with traditional brick homes. Discuss colours, profiles and a suitable door type.',description:'A light finish with familiar character. Traditional panel detailing sits comfortably alongside brickwork and established gardens.'}
  };
  const main = document.getElementById('featured-door');
  const image = document.getElementById('featured-door-img');
  const status = document.getElementById('filter-status');
  const buttons = [...document.querySelectorAll('.style-option')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let requestNumber = 0;
  let current = 'charcoal';
  buttons.forEach(button => button.addEventListener('click', async () => {
    const key = button.dataset.styleKey;
    if (!choices[key] || (key === current && !main.hasAttribute('aria-busy'))) return;
    const selection = choices[key];
    const thisRequest = ++requestNumber;
    status.textContent = 'Loading style: ' + selection.title + '.';
    main.setAttribute('aria-busy', 'true'); main.disabled = true;
    const source = 'assets/images/' + selection.image + '.webp';
    try {
      const candidate = new Image(); candidate.src = source;
      await candidate.decode();
      if (thisRequest !== requestNumber) return;
      image.src = source; image.alt = selection.alt;
      main.dataset.image = selection.image;
      main.dataset.title = selection.title;
      main.dataset.caption = selection.caption;
      main.setAttribute('aria-label', 'Enlarge selected door style: ' + selection.title.toLowerCase());
      document.getElementById('style-image-label').textContent = selection.label;
      document.getElementById('style-count').textContent = selection.count;
      document.getElementById('featured-style-title').textContent = selection.title;
      document.getElementById('featured-style-description').textContent = selection.description;
      document.getElementById('featured-enquire').dataset.style = selection.title;
      buttons.forEach(other => {const selected = other === button;other.classList.toggle('is-selected',selected);other.setAttribute('aria-pressed',String(selected));});
      if (!reduced.matches) image.animate([{opacity:.35,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}],{duration:460,easing:'cubic-bezier(.2,.7,.2,1)'});
      current = key;
      status.textContent = 'Selected style: ' + selection.title + '.';
    } catch (_) {
      if (thisRequest === requestNumber) status.textContent = 'The style image could not load. Please try again.';
    } finally {
      if (thisRequest === requestNumber) { main.removeAttribute('aria-busy'); main.disabled = false; }
    }
  }));
})();
