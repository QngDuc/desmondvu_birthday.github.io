(() => {
  const experience = document.querySelector('.experience');
  const shell = document.querySelector('#focus-shell');
  const dismiss = document.querySelector('#focus-dismiss');
  const outside = [document.querySelector('header'), document.querySelector('.intro'), document.querySelector('footer')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let placeholder, animation, focused = false, closing = false, previousFocus;

  function center(rect) { return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; }
  function travel(from, to, entering) {
    const a = center(from), b = center(to);
    const transform = `translate(${a.x - b.x}px, ${a.y - b.y}px) scale(${from.height / to.height})`;
    const keyframes = entering ? [{ transform }, { transform: 'none' }] : [{ transform: 'none' }, { transform }];
    return experience.animate(keyframes, { duration: motion.matches ? 0 : 650, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  function enter() {
    if (focused || closing) return;
    previousFocus = document.activeElement;
    const from = experience.getBoundingClientRect();
    placeholder = document.createElement('div');
    placeholder.className = 'experience-placeholder';
    placeholder.style.width = `${from.width}px`;
    placeholder.style.height = `${from.height}px`;
    experience.before(placeholder);
    shell.hidden = false;
    shell.append(experience);
    document.body.classList.add('phone-focused');
    outside.forEach(element => element.inert = true);
    focused = true;
    animation = travel(from, experience.getBoundingClientRect(), true);
    dismiss.focus({ preventScroll: true });
  }
  async function exit() {
    if (!focused || closing) return;
    closing = true;
    animation?.cancel();
    document.body.classList.remove('phone-focused');
    const target = placeholder.getBoundingClientRect();
    // Preserve the focused dimensions until the phone reaches its landing position.
    shell.classList.add('is-closing');
    animation = travel(target, experience.getBoundingClientRect(), false);
    await animation.finished.catch(() => {});
    placeholder.replaceWith(experience);
    shell.hidden = true;
    shell.classList.remove('is-closing');
    outside.forEach(element => element.inert = false);
    focused = false;
    closing = false;
    if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
  }
  window.enterPhoneFocus = enter;
  dismiss.addEventListener('click', exit);
  for (const id of ['phone-display', 'cover-display']) document.getElementById(id).addEventListener('click', enter);
  shell.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); exit(); return; }
    if (event.key !== 'Tab') return;
    const buttons = [...shell.querySelectorAll('button, [tabindex="0"]')].filter(element => !element.disabled && !element.closest('[inert]') && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
    if (!buttons.length) return;
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
