'use strict';
(() => {
  const config = window.SITE_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const form = $('#enquiry-form');
  const status = $('#form-status');
  const submit = $('#submit-button');
  const photos = $('#photos');
  const photoList = $('#selected-files');
  let selectedFiles = [];
  let enquiryText = '';
  let pending = false;
  let referringStyle = '';
  let automaticStyleMessage = '';

  const businessName = String(config.businessName || 'Balwyn Garage Doors').trim();
  $$('[data-business-name]').forEach(el => { el.textContent = businessName; });
  if (businessName !== 'Balwyn Garage Doors') {
    const firstWord = businessName.split(/\s+/)[0];
    $$('[data-brand-short]').forEach(el => { el.textContent = firstWord || businessName; });
    const rest = businessName.split(/\s+/).slice(1).join(' ');
    $$('[data-brand-rest]').forEach(el => { el.textContent = rest; });
    $$('.brand').forEach(el => { el.setAttribute('aria-label', businessName + ' home'); });
    document.title = 'Garage Door Repairs & Installation in Balwyn | ' + businessName;
  }
  if (config.address) $$('[data-address]').forEach(el => { el.textContent = config.address; });
  if (config.showConceptNote === false) $$('.concept-note').forEach(el => { el.hidden = true; });
  $('#year').textContent = String(new Date().getFullYear());
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email.trim() : '';
  const phone = String(config.phone || '').trim();
  if (phone && /^[+\d() .-]{8,24}$/.test(phone)) {
    $$('.contact-phone').forEach(el => {
      el.href = 'tel:' + phone.replace(/[^+\d]/g, '');
      $('span', el).textContent = phone;
      el.hidden = false;
    });
  }
  if (email) $$('.contact-email').forEach(el => {
    el.href = 'mailto:' + email;
    $('span', el).textContent = email;
    el.hidden = false;
  });

  let endpoint = '';
  if (config.formEndpoint) {
    try {
      const url = new URL(config.formEndpoint, location.href);
      if (url.protocol === 'https:' || (url.origin === location.origin && url.protocol === 'http:')) endpoint = url.href;
    } catch (_) { /* Keep the offline fallback if the configured URL is invalid. */ }
  }
  if (endpoint) {
    $('span', submit).textContent = 'Send my enquiry';
    $('#form-mode-note').textContent = 'Your details and any photos will be sent to the business’s configured enquiry service.';
    $('#upload-help').textContent = 'Selected photos will be included with your enquiry.';
    $('#privacy-mode-text').textContent = 'When you send this form, your details and selected photos are sent to the business’s configured enquiry service to handle your request.';
  } else if (email) {
    $('span', submit).textContent = 'Prepare email enquiry';
    $('#form-mode-note').textContent = 'Your enquiry opens in your email app for you to review and send. Attach selected photos there.';
    $('#privacy-mode-text').textContent = 'Your form details are used to prepare an email to the business. Review it in your email app and send it yourself. Selected photos must be attached there.';
  }

  const menuToggle = $('.menu-toggle');
  const nav = $('#main-nav');
  function closeMenu() {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  const desktopMedia = matchMedia('(min-width:1001px)');
  desktopMedia.addEventListener('change', () => { if (desktopMedia.matches) closeMenu(); });

  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('a[aria-current]', nav).forEach(a => a.removeAttribute('aria-current'));
        const a = $('a[href="#' + entry.target.id + '"]', nav);
        if (a && !a.classList.contains('button')) a.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-18% 0px -65% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }

  function openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  $$('dialog').forEach(dialog => {
    $('[data-close-dialog]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { if (!$('dialog[open]')) document.body.classList.remove('dialog-open'); });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  });
  $$('[data-open-privacy]').forEach(button => button.addEventListener('click', () => openDialog($('#privacy-dialog'))));

  const galleryDialog = $('#gallery-dialog');
  $$('.gallery-open').forEach(button => button.addEventListener('click', () => {
    const image = $('#gallery-image');
    image.src = 'assets/images/' + button.dataset.image + '.webp';
    image.alt = $('img', button).alt;
    $('#gallery-title').textContent = button.dataset.title;
    $('#gallery-caption').textContent = button.dataset.caption;
    $('#gallery-enquire').dataset.style = button.dataset.title;
    openDialog(galleryDialog);
  }));

  $$('.service-select').forEach(link => link.addEventListener('click', () => {
    $('#service').value = link.dataset.service;
    if (link.dataset.style) {
      referringStyle = link.dataset.style;
      const message = $('#message');
      const prefix = 'I’m interested in this door style: ' + referringStyle + '.';
      if (!message.value.trim() || message.value.trim() === automaticStyleMessage) message.value = prefix + '\n';
      automaticStyleMessage = prefix;
    }
    if (!link.dataset.style && !['New door installation', 'Door replacement'].includes($('#service').value)) {
      referringStyle = '';
      if ($('#message').value.trim() === automaticStyleMessage) $('#message').value = '';
      automaticStyleMessage = '';
    }
    if (galleryDialog.open) galleryDialog.close();
  }));
  $('#service').addEventListener('change', () => {
    if (!['New door installation', 'Door replacement'].includes($('#service').value)) {
      referringStyle = '';
      if ($('#message').value.trim() === automaticStyleMessage) $('#message').value = '';
      automaticStyleMessage = '';
    }
  });

  function showStatus(message, success = false) {
    status.textContent = message;
    status.classList.toggle('success', success);
  }
  function renderFiles() {
    photoList.replaceChildren();
    selectedFiles.forEach((file, index) => {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(1) + ' MB)';
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'file-remove'; remove.textContent = '×';
      remove.setAttribute('aria-label', 'Remove ' + file.name);
      remove.addEventListener('click', () => { selectedFiles.splice(index, 1); renderFiles(); });
      li.append(label, remove); photoList.append(li);
    });
  }
  function addFiles(files) {
    const errors = [];
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { errors.push(file.name + ': please use JPG, PNG or WebP.'); continue; }
      if (file.size > 5 * 1024 * 1024) { errors.push(file.name + ': larger than 5 MB.'); continue; }
      if (selectedFiles.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) continue;
      if (selectedFiles.length >= 3) { errors.push('A maximum of 3 photos can be selected.'); break; }
      selectedFiles.push(file);
    }
    renderFiles();
    showStatus(errors.join(' '));
    photos.value = '';
  }
  photos.addEventListener('change', () => addFiles([...photos.files]));
  const dropZone = $('#upload-zone');
  ['dragenter', 'dragover'].forEach(type => dropZone.addEventListener(type, event => { event.preventDefault(); dropZone.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach(type => dropZone.addEventListener(type, event => { event.preventDefault(); dropZone.classList.remove('dragover'); }));
  dropZone.addEventListener('drop', event => { if (event.dataTransfer) addFiles([...event.dataTransfer.files]); });

  function buildSummary(data) {
    return [
      businessName + ' — website enquiry', '',
      'Name: ' + data.get('name').trim(),
      'Phone: ' + data.get('phone').trim(),
      'Email: ' + data.get('email').trim(),
      'Suburb / postcode: ' + data.get('suburb').trim(),
      'Service: ' + data.get('service'),
      'Preferred contact: ' + data.get('contact_time'),
      referringStyle ? 'Door style inspiration: ' + referringStyle : '', '',
      'Project details:', data.get('message').trim(), '',
      selectedFiles.length ? 'Selected photos: ' + selectedFiles.map(file => file.name).join(', ') : 'No photos selected.',
      selectedFiles.length && !endpoint ? 'Please attach these photos manually when sending your email.' : '', '',
      'Contact consent: Yes — regarding this enquiry.'
    ].filter(line => line !== null).join('\n');
  }
  function prepareSummary(data) {
    enquiryText = buildSummary(data);
    $('#enquiry-summary').textContent = enquiryText;
    $('#summary-status').textContent = '';
    const emailLink = $('#email-enquiry');
    if (email) {
      $('#summary-explanation').textContent = 'Review your details, then open your email app to send them to ' + email + '. Attach any selected photos there. Nothing has been sent yet.';
      emailLink.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Garage door enquiry — ' + data.get('suburb')) + '&body=' + encodeURIComponent(enquiryText);
      emailLink.hidden = false;
    } else {
      $('#summary-explanation').textContent = 'This preview is not connected to a business inbox. Copy or download your enquiry below. Nothing has been sent.';
      emailLink.hidden = true;
    }
    openDialog($('#enquiry-dialog'));
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('website')) { showStatus('Please leave the extra website field empty.'); return; }
    // HTML required fields also reject whitespace-only text.
    for (const name of ['name', 'suburb', 'message']) {
      const field = form.elements.namedItem(name);
      if (!String(data.get(name)).trim()) { field.setCustomValidity('Please add a few details here.'); field.reportValidity(); return; }
    }
    const phoneDigits = String(data.get('phone')).replace(/\D/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      const field = form.elements.namedItem('phone');
      field.setCustomValidity('Please enter a phone number with 8–15 digits.'); field.reportValidity(); return;
    }
    showStatus('');
    if (!endpoint) { prepareSummary(data); return; }
    data.delete('photos');
    selectedFiles.forEach(file => data.append('photos', file, file.name));
    data.set('business_name', businessName);
    if (referringStyle) data.set('door_style', referringStyle);
    pending = true; submit.disabled = true;
    const oldLabel = $('span', submit).textContent;
    $('span', submit).textContent = 'Sending your enquiry…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error('The enquiry service did not accept the request.');
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const result = await response.json();
        if (result.success === false || result.ok === false || result.error) throw new Error('The enquiry service reported a problem.');
      }
      showStatus('Thank you — your enquiry has been sent. The business can now follow up using the details you provided.', true);
      form.reset(); selectedFiles = []; referringStyle = ''; automaticStyleMessage = ''; renderFiles();
    } catch (error) {
      showStatus((error.name === 'AbortError' ? 'The enquiry service took too long to respond. ' : 'Your enquiry could not be sent. ') + 'Your details are still here. Please try again, or copy your enquiry from the summary.');
      prepareSummary(data);
      $('#summary-explanation').textContent = 'The enquiry service did not confirm delivery. Keep a copy of your details below, or send them using your email app if an address is available.';
    } finally {
      clearTimeout(timer); pending = false; submit.disabled = false; $('span', submit).textContent = oldLabel;
    }
  });
  ['name', 'phone', 'suburb', 'message'].forEach(name => form.elements.namedItem(name).addEventListener('input', event => event.target.setCustomValidity('')));

  $('#copy-enquiry').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(enquiryText);
      else {
        const field = document.createElement('textarea');
        field.value = enquiryText; field.style.cssText = 'position:fixed;opacity:0;left:0;top:0';
        $('#enquiry-dialog').append(field); field.select();
        const copied = document.execCommand('copy'); field.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      $('#summary-status').textContent = 'Enquiry copied. You can paste it into an email or message.';
    } catch (_) {
      const range = document.createRange(); range.selectNodeContents($('#enquiry-summary'));
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      $('#summary-status').textContent = 'Use your device’s Copy command on the selected enquiry, or download the text file.';
    }
  });
  $('#download-enquiry').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([enquiryText], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'garage-door-enquiry.txt'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('#summary-status').textContent = 'Your enquiry text file is ready to save.';
  });
})();
