import { content } from './content.js';
import { renderPage, rolePanel } from './view.js';

let saved;
try { saved = localStorage.getItem('club-proposal-language'); } catch {}
const requested = new URL(location.href).searchParams.get('lang');
let lang = ['en', 'ar'].includes(requested) ? requested : ['en', 'ar'].includes(saved) ? saved : 'en';
let role = 'players';
let observer;
const app = document.querySelector('#app');

function observeSections() {
  observer?.disconnect();
  if (!('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      document.querySelectorAll('.main-nav a').forEach(a => {
        if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));
}
function render() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = content[lang].title;
  document.querySelector('meta[name="description"]').content = content[lang].heroDesc;
  app.innerHTML = renderPage(lang, role);
  observeSections();
}
function setMenu(open) {
  document.querySelector('.main-nav').classList.toggle('is-open', open);
  const button = document.querySelector('[data-action="menu"]');
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', content[lang][open ? 'closeMenu' : 'menu']);
}
function setRole(next, focus = false) {
  if (!(next in content[lang].roles)) return;
  role = next;
  document.querySelectorAll('[data-role]').forEach(tab => {
    const selected = tab.dataset.role === role;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  const panel = document.querySelector('#role-panel');
  panel.setAttribute('aria-labelledby', `tab-${role}`);
  panel.innerHTML = rolePanel(lang, role);
}
app.addEventListener('click', event => {
  const tab = event.target.closest('[data-role]');
  if (tab) return setRole(tab.dataset.role);
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'language') {
    const scroll = window.scrollY;
    lang = lang === 'en' ? 'ar' : 'en';
    try { localStorage.setItem('club-proposal-language', lang); } catch {}
    const url = new URL(location.href); url.searchParams.set('lang', lang); history.replaceState(null, '', url);
    render();
    window.scrollTo({ top: scroll, behavior: 'instant' });
    document.querySelector('[data-action="language"]').focus({ preventScroll: true });
  } else if (action === 'menu') setMenu(document.querySelector('[data-action="menu"]').getAttribute('aria-expanded') !== 'true');
  else if (action === 'print') window.print();
  if (event.target.closest('.main-nav a')) setMenu(false);
});
app.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.querySelector('.main-nav').classList.contains('is-open')) {
    setMenu(false); document.querySelector('[data-action="menu"]').focus();
  }
  if (!event.target.matches('[data-role]')) return;
  const keys = Object.keys(content[lang].roles), index = keys.indexOf(role);
  let next;
  if (event.key === 'Home') next = keys[0];
  if (event.key === 'End') next = keys.at(-1);
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    const direction = (event.key === 'ArrowRight' ? 1 : -1) * (lang === 'ar' ? -1 : 1);
    next = keys[(index + direction + keys.length) % keys.length];
  }
  if (next) { event.preventDefault(); setRole(next, true); }
});
let printedDetails = [];
window.addEventListener('beforeprint', () => { printedDetails = [...document.querySelectorAll('details:not([open])')]; printedDetails.forEach(d => d.open = true); });
window.addEventListener('afterprint', () => { printedDetails.forEach(d => d.open = false); printedDetails = []; });
render();
