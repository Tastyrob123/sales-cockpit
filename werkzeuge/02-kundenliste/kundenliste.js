/* kundenliste.js · das Werkzeug «Kundenliste» von Tasty Studios (07.11.2026, Neubau im Kleid).
   Umgebaut aus website.js von «Website bearbeiten» (vorlage/culinarium-demo/werkzeuge/bureau/werkzeuge/website/website.js): dieselben Bausteine
   (Kopf, Rand, Startbild, Lage, «Häufig gebraucht», Bereich-Kacheln, Leiste, Quittung, Fenster, Auswahl, Umschalter), derselbe Ablauf:
   Eingaben warten gelb in Z.offen (die Leiste unten zählt sie), «Speichern» legt sie ab und antwortet mit einer Quittung (vorher, nachher, «Rückgängig»).
   Inhalt aus auftraege/02-kundenliste.md und der ersten Fassung: jedes Haus mit Ort, Art, Ansprechpartner, Website, Entwurf, Stand, nächstem Schritt,
   Notizen mit Verlauf, Kürzel für «Besuche auf dem Entwurf» (Werkzeug 03). Liste (sortierbar, filterbar) und Brett (Stände als Spalten, Karten ziehen).
   Server: api.py unter /api/02-kundenliste/…; die Zentrale liest /api/02-kundenliste/heute.
   Fehler landen zusätzlich im Browser (localStorage «kl-fehler»), dort liest sie die Prüfung (pruefung.html). */
(() => {
'use strict';
const W = '02-kundenliste';
const X = weg => '/sales-cockpit/api/' + W + '/' + weg;
const H = window.WO_HAUS || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const PF = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg>';
const HAKEN = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7"/></svg>';
const ZU = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13"/></svg>';
const WINKEL = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';

const STAENDE = ['offen', 'gefunden', 'geprüft', 'angeschrieben', 'Entwurf geschickt', 'Gespräch', 'Angebot', 'Vertrag', 'abgesagt'];
/* Je Stand ein Satz und ein Foto der Agentur-Seite (für die Kacheln «Stand für Stand») */
const STAND_INFO = {
  'offen': ['Übernommen, noch nicht eingeordnet.', 'haus'], 'gefunden': ['Aufgefallen, noch nicht angesehen.', 'aussen'],
  'geprüft': ['Website und Haus angesehen, passt.', 'bildschirm'], 'angeschrieben': ['Brief oder Mail ist unterwegs.', 'empfang'],
  'Entwurf geschickt': ['Der Entwurf liegt beim Haus.', 'plan'], 'Gespräch': ['Wir reden miteinander.', 'tafel'],
  'Angebot': ['Das Angebot liegt vor.', 'studio'], 'Vertrag': ['Unterschrieben, wir bauen.', 'terrasse'], 'abgesagt': ['Diesmal nicht, vielleicht später.', 'faehre']
};
const FELDNAME = { name: 'Name', ort: 'Ort', art: 'Art', ansprechpartner: 'Ansprechpartner', website: 'Website', entwurf: 'Entwurf', stand: 'Stand', naechster_schritt: 'Nächster Schritt', kuerzel: 'Kürzel' };
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

const Z = { d: null, ansicht: 'start', offen: {}, gesp: 0, zl: 0, filter: { q: '', stand: 'alle', faellig: 'alle', art: 'alle', sort: 'reihe' }, letzte: null };

// ---------------------------------------------------------------- kleine Helfer (wie in der Vorlage)
function el(tag, attrs, ...kinder) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kinder.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(String(k)));
  return e;
}
const leere = e => { e.textContent = ''; return e; };
const kn = (text, tun, art = '', attrs = {}) => el('button', Object.assign({ class: 'kn ' + art, type: 'button', onclick: tun }, attrs), el('span', {}, text), el('i', { 'aria-hidden': 'true', html: PF }));
const taste = (text, tun, attrs = {}) => el('button', Object.assign({ class: 'ws-taste', type: 'button', onclick: tun }, attrs), text);
const link = (text, tun, attrs = {}) => el('button', Object.assign({ class: 'ws-link', type: 'button', onclick: tun }, attrs), text);
const mono = text => el('span', { class: 'ws-mono' }, text);
const mz = (n, eins, viele) => n + ' ' + (n === 1 ? eins : viele);
const kurz = (t, n = 90) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
const anf = t => '«' + t + '»';
function zeit(iso) { const m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(iso || ''); return m ? `${m[3]}.${m[2]}.${m[1]}, ${m[4]}:${m[5]} Uhr` : datumZeigen(iso); }
function datumZeigen(iso) { const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(iso || ''); return m ? `${m[3]}.${m[2]}.${m[1]}` : (iso || ''); }
const wer = () => H.wer || 'Robert';
const E = s => WO.esc(s);
const foto = k => (H.fotos || {})[k] || H.foto;

function merke(text, stichwort) {
  try {
    const l = JSON.parse(localStorage.getItem('kl-fehler') || '[]');
    l.push({ zeit: new Date().toISOString(), text: String(text).slice(0, 400), stichwort: stichwort || '', wo: Z.ansicht });
    localStorage.setItem('kl-fehler', JSON.stringify(l.slice(-30)));
  } catch (e) { /* voller oder gesperrter Speicher: die Meldung steht trotzdem auf der Seite */ }
}
let unterwegs = 0;   // laufende Anfragen, steht als data-ws-laeuft am <html> (der Prüflauf wartet darauf)
function zaehle(n) { unterwegs += n; document.documentElement.setAttribute('data-ws-laeuft', unterwegs); }
async function ruf(methode, weg, daten) {
  let r, j = null;
  zaehle(1);
  try {
    const vorab = methode === 'GET' && !daten && window.__vorab && window.__vorab[weg]; if (vorab) delete window.__vorab[weg];
    r = await (vorab || fetch(weg, { method: methode, headers: daten ? { 'Content-Type': 'application/json' } : {}, body: daten ? JSON.stringify(Object.assign({ wer: wer() }, daten)) : undefined, cache: 'no-store' }));
    try { j = await r.json(); } catch (e) { /* keine lesbare Antwort */ }
  } catch (e) { throw { stichwort: 'keine-verbindung', fehler: 'Der Server des Werkzeugs antwortet nicht.' }; } finally { zaehle(-1); }
  if (!r.ok || j == null) throw Object.assign({ status: r.status, stichwort: r.status === 404 ? 'nicht-gefunden' : r.status === 400 ? 'eingabe' : 'unerwartet', fehler: 'Unerwartete Antwort des Servers (' + r.status + ').' }, j || {});
  return j;
}

// ---------------------------------------------------------------- Daten und Zeiten
const haeuser = () => (Z.d ? Z.d.haeuser : []);
const haus = id => haeuser().find(h => h.id === id);
const heute = () => (Z.d && Z.d.heute) || new Date().toISOString().slice(0, 10);
/* Ein Haus, wie es nach den offenen Eingaben aussähe (für Anzeige und Sortierung) */
function sicht(h) {
  const v = JSON.parse(JSON.stringify(h));
  Object.entries(Z.offen).forEach(([k, op]) => {
    const [id, feld, teil] = k.split('|');
    if (id !== h.id) return;
    if (teil) v[feld] = Object.assign({}, v[feld], { [teil]: op });
    else v[feld] = op;
  });
  return v;
}
function lage(h) {   // 'ueber' (überfällig), 'heute', 'bald' (7 Tage), 'spaeter', 'ohne'
  const d = (h.naechster_schritt || {}).datum;
  if (!d || h.stand === 'abgesagt') return 'ohne';
  const t = heute();
  if (d < t) return 'ueber';
  if (d === t) return 'heute';
  const diff = (new Date(d) - new Date(t)) / 864e5;
  return diff <= 7 ? 'bald' : 'spaeter';
}
const faellig = h => ['ueber', 'heute'].includes(lage(h));
function wann(h) {
  const d = (h.naechster_schritt || {}).datum, l = lage(h);
  if (!d) return 'ohne Datum';
  const tage = Math.round((new Date(heute()) - new Date(d)) / 864e5);
  if (l === 'ueber') return 'seit ' + mz(tage, 'Tag', 'Tagen') + ' überfällig';
  if (l === 'heute') return 'heute';
  if (tage === -1) return 'morgen';
  return 'in ' + mz(-tage, 'Tag', 'Tagen');
}
function langDatum(iso) { const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso || ''); if (!m) return ''; const d = new Date(+m[1], +m[2] - 1, +m[3]); return TAGE[d.getDay()] + ', ' + d.getDate() + '. ' + MONATE[d.getMonth()] + ' ' + d.getFullYear(); }
function feldText(feld, w) {
  if (w && typeof w === 'object') {
    if (feld === 'naechster_schritt') return [w.text, w.datum ? 'bis ' + datumZeigen(w.datum) : ''].filter(Boolean).join(' ');
    return [w.name, w.rolle, w.mail, w.telefon].filter(Boolean).join(', ');
  }
  return String(w || '');
}

// ---------------------------------------------------------------- Meldung, Quittung, Fenster (wie in der Vorlage)
function pruefLink(stichwort) { return 'pruefung.html' + (stichwort ? '#lex-' + stichwort : ''); }
function quit(titel, text, knoepfe = [], attrs = {}) {
  const k = el('div', Object.assign({ class: 'ws-quit', role: 'status' }, attrs),
    el('div', { class: 'ws-quit__t' }, el('b', {}, titel), text ? el('span', {}, text) : null), knoepfe,
    el('button', { class: 'ws-rund', type: 'button', 'aria-label': 'Schliessen', html: ZU, onclick: () => k.remove() }));
  leere($('#ws-quittung')).append(k);
  return k;
}
function melde(text, opt = {}) {
  return quit(text, opt.mehr || '', opt.stichwort ? [el('a', { class: 'ws-taste', href: pruefLink(opt.stichwort) }, 'Was tun?')] : [], { 'data-ws-meldung': opt.stichwort || 'hinweis', role: opt.fehler ? 'alert' : 'status' });
}
function fehler(e) {
  const text = (e && e.fehler) || (e && e.message) || String(e);
  merke(text, e && e.stichwort);
  melde(text, { fehler: true, stichwort: (e && e.stichwort) || 'unerwartet' });
}
/* Quittung: «Was · Wo: «vorher» wird «nachher»» und die Zahl weiterer Stellen; «Vorher/nachher ansehen» und «Rückgängig» */
function quittung(titel, zeilen, rueck, ziel) {
  const z = zeilen[0];
  const wert = (t, q) => el('span', { 'data-ws-q': q }, kurz(t, 170) || 'nichts');
  const text = z ? el('span', {}, z.was + ' · ' + z.wo + ': «', wert(z.vorher, 'vorher'), '» wird «', wert(z.nachher, 'nachher'), '»',
    zeilen.length > 1 ? ' und ' + mz(zeilen.length - 1, 'weitere Änderung', 'weitere Änderungen') : '') : null;
  const k = quit(titel, '', [
    zeilen.length ? taste('Vorher/nachher ansehen', () => vergleichFenster(zeilen)) : null,
    ziel ? taste('Ansehen', () => { k.remove(); geh(ziel); }) : null,
    rueck ? taste('Rückgängig', () => rueckgaengig(rueck, k)) : null], { 'data-ws-quittung': zeilen.length || 1 });
  if (text) $('.ws-quit__t', k).append(text);
  return k;
}
function fenster(titel, akzent, inhalt, knoepfe, opt = {}) {
  const ort = $('#ws-fenster');
  const zu = () => { leere(ort); document.removeEventListener('keydown', taste_); };
  const taste_ = ev => { if (ev.key === 'Escape') zu(); };
  const blatt = el('div', { class: 'ws-fenster__blatt', role: 'dialog', 'aria-modal': 'true', 'aria-label': titel + ' ' + akzent, 'data-ws-fenster': opt.name || '1' },
    el('h2', {}, titel + ' ', el('span', { class: 't-akzent' }, akzent)), inhalt,
    el('div', { class: 'ws-fenster__kn' }, knoepfe.filter(Boolean).map(k => k.haupt ? kn(k.text, () => k.tun(zu), 'kn--d kn--klein', k.attrs || {}) : link(k.text, () => (k.tun ? k.tun(zu) : zu()), k.attrs || {}))));
  leere(ort).append(el('div', { class: 'ws-fenster' }, el('button', { class: 'ws-fenster__grund', type: 'button', 'aria-label': 'Schliessen', onclick: zu }), blatt));
  document.addEventListener('keydown', taste_);
  const erst = blatt.querySelector('input,textarea,select'); if (erst) setTimeout(() => erst.focus(), 30);
  return zu;
}

// ---------------------------------------------------------------- Auswahl und Wahl im Stil des Hauses (wie in der Vorlage)
function auswahl(optionen, wert, beiWahl, name, dunkel) {
  const jetzt = () => optionen.find(o => o.wert === wert) || optionen[0] || { text: '' };
  const kopf_ = el('span', {}, jetzt().text);
  const knopf = el('button', { class: 'ws-auswahl__knopf', type: 'button', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', 'aria-label': name }, kopf_, el('span', { html: WINKEL, 'aria-hidden': 'true' }));
  const liste = el('div', { class: 'ws-auswahl__liste', role: 'listbox', hidden: true, 'aria-label': name });
  const k = el('div', { class: 'ws-auswahl' + (dunkel ? ' ws-auswahl--dunkel' : ''), 'data-ws-auswahl': name }, knopf, liste);
  let zeiger = -1;
  const zeig = i => { zeiger = Math.max(0, Math.min(optionen.length - 1, i)); [...liste.children].forEach((c, n) => c.classList.toggle('ws-zeiger', n === zeiger)); liste.children[zeiger].scrollIntoView({ block: 'nearest' }); };
  const zu = () => { liste.hidden = true; knopf.setAttribute('aria-expanded', 'false'); document.removeEventListener('click', aussen, true); };
  const aussen = ev => { if (!k.contains(ev.target)) zu(); };
  const waehle = i => { const o = optionen[i]; zu(); knopf.focus(); if (o.wert !== wert) { wert = o.wert; kopf_.textContent = o.text; beiWahl(o.wert); } };
  const auf = () => {
    leere(liste);
    optionen.forEach((o, i) => liste.append(el('div', { role: 'option', 'aria-selected': o.wert === wert ? 'true' : 'false', 'data-wert': o.wert, onclick: () => waehle(i) },
      el('span', {}, o.text), o.zusatz ? mono(o.zusatz) : null)));
    liste.hidden = false; knopf.setAttribute('aria-expanded', 'true');
    zeig(Math.max(0, optionen.findIndex(o => o.wert === wert)));
    document.addEventListener('click', aussen, true);
  };
  knopf.addEventListener('click', () => (liste.hidden ? auf() : zu()));
  k.addEventListener('keydown', ev => {
    if (liste.hidden) { if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); auf(); } return; }
    if (ev.key === 'Escape') { ev.stopPropagation(); zu(); knopf.focus(); }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); zeig(zeiger + 1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); zeig(zeiger - 1); }
    else if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); waehle(zeiger); }
  });
  return k;
}
function wahl2(optionen, wert, beiWahl, name, hell) {
  const k = el('div', { class: 'ws-wahl2' + (hell ? ' ws-wahl2--hell' : ''), role: 'group', 'aria-label': name, 'data-ws-wahl': name });
  optionen.forEach(o => k.append(el('button', { type: 'button', 'aria-pressed': o.wert === wert ? 'true' : 'false', 'data-wert': o.wert, onclick: ev => {
    if (o.wert === wert) return;
    wert = o.wert;
    [...k.children].forEach(c => c.setAttribute('aria-pressed', c === ev.currentTarget ? 'true' : 'false'));
    beiWahl(o.wert);
  } }, o.text)));
  return k;
}
/* Datum im Stil des Hauses (wie die Termine der Vorlage): Tag, Monat, Jahr als Auswahl, nie die des Betriebssystems; dazu «kein Datum» */
function datumWahl(iso, beiWahl) {
  const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso || '');
  const jetzt = new Date(heute());
  let t = m ? +m[3] : 0, mo = m ? +m[2] : jetzt.getMonth() + 1, j = m ? +m[1] : jetzt.getFullYear();
  const melde_ = () => { if (!t) return beiWahl(''); const max = new Date(j, mo, 0).getDate(); if (t > max) t = max; beiWahl(`${j}-${String(mo).padStart(2, '0')}-${String(t).padStart(2, '0')}`); };
  const jahre = [jetzt.getFullYear() - 1, jetzt.getFullYear(), jetzt.getFullYear() + 1, jetzt.getFullYear() + 2];
  return el('div', { class: 'cu-datum' },
    auswahl([{ wert: 0, text: 'kein' }].concat(Array.from({ length: 31 }, (_, i) => ({ wert: i + 1, text: (i + 1) + '.' }))), t, x => { t = x; melde_(); }, 'Tag'),
    auswahl(MONATE.map((n, i) => ({ wert: i + 1, text: n })), mo, x => { mo = x; melde_(); }, 'Monat'),
    auswahl(jahre.map(x => ({ wert: x, text: String(x) })), j, x => { j = x; melde_(); }, 'Jahr'));
}

// ---------------------------------------------------------------- Kopf, Rand, Leiste (wie in der Vorlage)
const TITEL = { start: 'Übersicht', liste: 'Alle Häuser', brett: 'Brett', heute: 'Heute fällig', verlauf: 'Frühere Änderungen', bestand: 'Bestand übernehmen' };
function ansichtName(a) {
  if (a.startsWith('haus:')) return (haus(a.slice(5)) || {}).name || '';
  if (a.startsWith('pflege:')) return ((haus(a.slice(7)) || {}).name || '') + ' bearbeiten';
  if (a.startsWith('stand:')) return STAENDE.includes(a.slice(6)) ? 'Stand ' + anf(a.slice(6)) : '';
  return TITEL[a] || '';
}
const offenZahl = () => Object.keys(Z.offen).length;
function kopf() {
  const k = $('#ws-kopf'), n = haeuser().length, f = haeuser().filter(faellig).length;
  k.innerHTML = WO.kopf({ werkzeug: W, unter: 'Kunden', titel: ansichtName(Z.ansicht) || WO.name(W), stand: f ? f + ' heute fällig' : mz(n, 'Haus', 'Häuser'),
    pruefung: pruefLink(''), anleitung: 'anleitung.html', website: (H.wege || {}).website || '/', marke: 'data-ws-marke', markeHref: '?ansicht=start' });
  const m = k.querySelector('[data-ws-marke]');
  if (m) m.addEventListener('click', ev => { ev.preventDefault(); if (Z.d) geh('start'); });
  const rk = k.querySelector('[data-wo-rand-knopf]'); if (rk) rk.setAttribute('aria-expanded', document.documentElement.classList.contains('wo-rand-auf') ? 'true' : 'false');
}
/* Seitenleiste ein- oder ausgeklappt, je Gerät gemerkt (Kopie aus dem Sales Cockpit, cockpit.js randKlapp, Stand 16.11.2026) */
try { Z.randZu = localStorage.getItem('tasty-kl-rand') === 'zu'; } catch (e) { /* privat */ }
document.documentElement.classList.toggle('kl-rand-zu', !!Z.randZu);
const RUHIG = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Hält den sichtbaren Inhalt auf seiner Höhe, während sich die Breite ändert (Safari rückt sonst alles nach oben oder unten) */
function haltHoehe() {
  const h = $('#ws-mitte'); if (!h) return { lauf() {}, ende() {} };
  const hb = h.getBoundingClientRect();
  let a = document.elementFromPoint(Math.min(hb.left + 60, innerWidth - 1), Math.round(innerHeight * .45));
  while (a && a.parentElement && a.parentElement !== h && a.parentElement.getBoundingClientRect().height < innerHeight * .8) a = a.parentElement;
  if (!a || !h.contains(a) || a === h) return { lauf() {}, ende() {} };
  const y0 = a.getBoundingClientRect().top, html = document.documentElement; html.style.overflowAnchor = 'none';
  const zieh = () => { const d = a.getBoundingClientRect().top - y0; if (Math.abs(d) > .5) scrollBy(0, d); };
  let an = true; const lauf = () => { if (!an) return; zieh(); requestAnimationFrame(lauf); };
  return { lauf() { requestAnimationFrame(lauf); }, ende() { an = false; zieh(); html.style.overflowAnchor = ''; } };
}
/* Eine einzige Bewegung: die Spalte wird schmal oder breit, die weisse Fläche wird wie ein Vorhang beschnitten, der Inhalt behält seine Breite, der Knopf gleitet mit */
function randKlapp() {
  const r = $('#ws-rand'), kn = $('#ws-rand [data-rand-kn]'), app = document.body; if (!r || r._laeuft) return; r._laeuft = true;
  Z.randZu = !Z.randZu; try { localStorage.setItem('tasty-kl-rand', Z.randZu ? 'zu' : 'auf'); } catch (e) { /* privat */ }
  const an = !Z.randZu, html = document.documentElement, setze = v => html.classList.toggle('kl-rand-zu', !v);
  if (kn) kn.setAttribute('aria-expanded', an ? 'true' : 'false');
  if (RUHIG() || !matchMedia('(min-width:901px)').matches) { setze(an); r._laeuft = false; return; }
  const EA = 'cubic-bezier(.65,0,.35,1)', D = 720;
  const spalten = () => getComputedStyle(app).gridTemplateColumns;
  const fest = [...r.querySelectorAll(':scope > .kl-rand-kopf, :scope > .kl-rand-inhalt')];
  const mitte = x => { const b = x.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; };
  const halt = haltHoehe();
  const sVor = spalten(), hVor = r.getBoundingClientRect().height, kVor = kn ? mitte(kn) : [0, 0];
  setze(an); const sNach = spalten(), hNach = r.getBoundingClientRect().height, kNach = kn ? mitte(kn) : [0, 0];
  setze(true);
  const hOffen = r.getBoundingClientRect().height;
  fest.forEach(x => { x.style.width = x.getBoundingClientRect().width + 'px'; });
  const kOffen = kn ? mitte(kn) : [0, 0];
  const zuClip = `inset(0px 0px ${Math.max(0, hOffen - Math.min(hVor, hNach))}px 0px round 32px)`, aufClip = 'inset(0px 0px 0px 0px round 18px)';
  const anims = [app.animate([{ gridTemplateColumns: sVor }, { gridTemplateColumns: sNach }], { duration: D, easing: EA, fill: 'forwards' }),
    r.animate([{ clipPath: an ? zuClip : aufClip }, { clipPath: an ? aufClip : zuClip }], { duration: D, easing: EA, fill: 'forwards' })];
  if (kn) { const zu = an ? kVor : kNach, d = [zu[0] - kOffen[0], zu[1] - kOffen[1]], t = `translate(${d[0]}px,${d[1]}px)`;
    anims.push(kn.animate([{ transform: an ? t : 'none' }, { transform: an ? 'none' : t }], { duration: D, easing: EA, fill: 'forwards' })); }
  if (!an) r.querySelectorAll(':scope > .kl-rand-kopf > .wo-mk, :scope > .kl-rand-inhalt').forEach(x =>   /* Schrift verschwindet, bevor die Kante sie erreicht */
    anims.push(x.animate([{ opacity: 1 }, { opacity: 0 }], { duration: Math.round(D * .26), easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' })));
  halt.lauf();
  Promise.all(anims.map(a => a.finished)).catch(() => {}).then(() => {
    setze(an); fest.forEach(x => { x.style.width = ''; }); anims.forEach(a => a.cancel()); halt.ende(); r._laeuft = false;
  });
}
function rand() {
  const r = leere($('#ws-rand')), hs = haeuser().map(sicht);
  const nw = (a, name, zahl, extra) => ({ text: name || ansichtName(a), zahl: zahl || 0, an: Z.ansicht === a, attr: `data-ws-nav="${a}"`, extra: extra ? `<em class="wo-rand__z">${E(extra)}</em>` : '' });
  const kd = hs.filter(istKunde);
  const g = [{ eintraege: [nw('start')] },
    kd.length ? { titel: 'Unsere Kunden', eintraege: kd.map(h => nw('haus:' + h.id, h.name, 0, String(arbeitenZahl(h)))) } : null,
    { titel: 'Die Häuser', eintraege: [nw('liste'), nw('brett')] },
    { titel: 'Heute', eintraege: [nw('heute', '', hs.filter(faellig).length)] },
    { titel: 'Nach Stand', eintraege: STAENDE.filter(s => hs.some(h => h.stand === s)).map(s => nw('stand:' + s, s.charAt(0).toUpperCase() + s.slice(1), 0, String(hs.filter(h => h.stand === s).length))) },
    { titel: 'Bestand', eintraege: [nw('bestand'), nw('verlauf')] }];
  r.innerHTML = WO.rand(g.filter(Boolean), { website: (H.wege || {}).website || '/', pruefung: pruefLink(''), anleitung: 'anleitung.html' });
  {   /* Seitenleiste ein- und ausklappbar wie im Sales Cockpit (16.11.2026): Kopfzeile mit dem Knopf steht, nur der Teil darunter rollt */
    const inhalt = el('div', { class: 'kl-rand-inhalt' }), rk = el('div', { class: 'kl-rand-kopf' });
    while (r.firstChild) inhalt.appendChild(r.firstChild);
    rk.append(el('p', { class: 'wo-mk' }, WO.name(W)));
    rk.insertAdjacentHTML('beforeend', `<button type="button" class="kl-rand-kn" data-rand-kn aria-expanded="${Z.randZu ? 'false' : 'true'}" aria-label="Seitenleiste ein- oder ausklappen" title="Seitenleiste ein- oder ausklappen"><i>${WO.ic('links')}</i><i>${WO.ic('menue')}</i></button>`);
    r.append(rk, inhalt);
    rk.querySelector('[data-rand-kn]').addEventListener('click', randKlapp);
    r.querySelectorAll('.wo-re, .wo-zw, h2, h3').forEach(x => x.setAttribute('data-wo-bw-nie', ''));   /* Einträge stehen ruhig, nichts schiebt sich beim Laden übereinander (wie im Cockpit) */
    const an = r.querySelector('[aria-current="true"], .wo-an'); if (an) { const b = an.getBoundingClientRect(), rb = inhalt.getBoundingClientRect(); if (b.top < rb.top || b.bottom > rb.bottom) inhalt.scrollTop += b.top - rb.top - rb.height / 3; }
  }
  r.querySelectorAll('button[data-ws-nav]').forEach(b => b.addEventListener('click', () => { const a = b.getAttribute('data-ws-nav'), h = /^haus:/.test(a) && haus(a.slice(5)); geh(a, h && ARBEITEN[h.id] ? { zu: 'arbeiten' } : {}); }));
}
/* Unsere Kunden = Häuser mit Vertrag (Robert 16.11.2026: «bei Kunden sind Bestandskunden»); ihre Arbeiten aus arbeiten.js, übernommen aus dem Sales Cockpit */
const ARBEITEN = window.KUNDEN_ARBEITEN || {};
const istKunde = h => h.stand === 'Vertrag';
const arbeitenZahl = h => { const k = ARBEITEN[h.id]; return k ? k.arbeiten.length + (k.buehne ? 1 : 0) + (k.ausserdem || []).length : (Array.isArray(h.adressen) ? h.adressen.length : 0); };
function leiste() {
  const l = $('#ws-leiste');
  if (!Z.d) return;
  const n = offenZahl(), gesp = !n && Z.gesp > Date.now(), z = Z.letzte;
  l.setAttribute('data-ws-offen', String(n));
  l.innerHTML = WO.leiste({
    titel: n ? mz(n, 'Eingabe', 'Eingaben') + ' noch nicht gespeichert' : gesp ? 'Gespeichert' : 'Alles ist gespeichert',
    satz: n ? 'Speichern legt sie in die Liste, mit Quittung und «Rückgängig». Cmd + S geht auch.' : z ? 'Zuletzt ' + z.was + ', ' + zeit(z.wann) + ' von ' + z.wer + '.' : 'Jede Änderung zeigt eine Quittung mit vorher und nachher.',
    entwurf: false,
    knoepfe: (n ? WO.knopf('Vorher, nachher', 'auge', 'glas', { id: 'ws-vgl', klein: true }) + WO.knopf('Verwerfen', 'zurueck', 'glas', { id: 'ws-verwerfen', klein: true }) : '')   // wie die Vorlage (leiste_klar): ohne Offenes nur «Speichern»
      + WO.knopf(gesp ? 'Gespeichert' : 'Speichern', gesp ? 'haken' : 'pfeil', n ? 'wartet' : gesp ? 'fertig' : 'glas', { id: 'ws-speichern', klein: true, attr: `data-ws-lage="${n ? 'offen' : gesp ? 'gespeichert' : 'ruhig'}"` })
  });
  $('#ws-speichern').addEventListener('click', speichern);
  if ($('#ws-vgl')) $('#ws-vgl').addEventListener('click', () => vergleichFenster(offeneZeilen()));
  if ($('#ws-verwerfen')) $('#ws-verwerfen').addEventListener('click', verwerfen);
}
function allesNeu() { kopf(); rand(); leiste(); }

// ---------------------------------------------------------------- Vormerken, Speichern, Rückgängig
function vormerken(key, wert, gleichWie) {
  if (JSON.stringify(wert) === JSON.stringify(gleichWie)) delete Z.offen[key]; else Z.offen[key] = wert;
  leiste(); rand();
}
function offeneZeilen() {
  return Object.entries(Z.offen).map(([k, neu]) => {
    const [id, feld, teil] = k.split('|'), h = haus(id) || {};
    const alt = teil ? (h[feld] || {})[teil] : h[feld];
    const tn = { text: 'Schritt', datum: 'Datum', name: 'Name', rolle: 'Rolle', mail: 'Mail', telefon: 'Telefon' };
    return { was: FELDNAME[feld] + (teil ? ' · ' + tn[teil] : ''), wo: h.name || id, vorher: teil === 'datum' ? datumZeigen(alt) : feldText(feld, alt), nachher: teil === 'datum' ? datumZeigen(neu) : feldText(feld, neu), id };
  });
}
async function speichern() {
  const ops = Object.entries(Z.offen);
  if (!ops.length) { melde('Nichts geändert, nichts gespeichert.'); return; }
  const je = {};
  ops.forEach(([k, v]) => {
    const [id, feld, teil] = k.split('|');
    je[id] = je[id] || {};
    if (teil) je[id][feld] = Object.assign({}, je[id][feld] || {}, { [teil]: v }); else je[id][feld] = v;
  });
  const vorher = [], zeilen = [];
  for (const [id, felder] of Object.entries(je)) {
    let a;
    try { a = await ruf('PUT', X('haeuser/' + encodeURIComponent(id)), felder); } catch (e) { fehler(e); await neuLaden(); return; }
    vorher.push(a.vorher);
    a.aenderungen.forEach(x => zeilen.push({ was: x.feld, wo: a.nachher.name, vorher: x.vorher, nachher: x.nachher, id }));
    Object.keys(Z.offen).filter(k => k.startsWith(id + '|')).forEach(k => delete Z.offen[k]);
  }
  Z.gesp = Date.now() + 6000; setTimeout(leiste, 6100);
  await neuLaden();
  quittung('Gespeichert', zeilen, { haeuser: vorher }, zeilen.length && Z.ansicht !== 'haus:' + zeilen[0].id ? 'haus:' + zeilen[0].id : null);
}
function verwerfen() {
  const n = offenZahl();
  fenster('Eingaben', 'verwerfen?', el('div', { class: 'ws-form' }, el('p', {}, mz(n, 'Eingabe ist', 'Eingaben sind') + ' noch nicht gespeichert. Verwerfen stellt jedes Feld zurück, wie es gespeichert ist.')),
    [{ text: 'Behalten' }, { text: 'Verwerfen', haupt: true, tun: zu => { zu(); Z.offen = {}; allesNeu(); zeichne({ halten: true }); melde('Verworfen', { mehr: 'Alle Felder stehen wieder wie gespeichert.' }); } }], { name: 'verwerfen' });
}
/* Rückgängig: {haeuser: [vorher …]} legt Häuser zurück, {weg: id} löscht ein eben angelegtes, {alle: […], quelle} ersetzt die ganze Liste */
async function rueckgaengig(r, karte) {
  try {
    if (r.haeuser) for (const h of r.haeuser) await ruf('POST', X('wiederherstellen'), { haus: h });
    if (r.weg) await ruf('DELETE', X('haeuser/' + encodeURIComponent(r.weg)), {});
    if (r.alle) await ruf('POST', X('alle'), { haeuser: r.alle, quelle: r.quelle });
  } catch (e) { fehler(e); return; }
  if (karte) karte.remove();
  Z.gesp = 0;
  await neuLaden();
  melde('Rückgängig gemacht', { mehr: 'Die Liste ist wie vor dieser Änderung.' });
}
function vergleichFenster(zeilen) {
  const inhalt = el('div', { class: 'ws-form', 'data-ws-form': 'vergleich' },
    zeilen.length ? zeilen.map(z => el('section', { class: 'kl-vgl' }, el('div', { class: 'ws-karte__kopf' }, el('b', {}, z.was), mono(z.wo)), werte(z)))
      : el('p', {}, 'Nichts wartet. Sobald du ein Feld änderst, steht hier vorher und nachher.'));
  fenster('Vorher,', 'nachher.', inhalt, [{ text: 'Schliessen' }], { name: 'vergleich' });
}
function werte(a) {
  return el('div', { class: 'ws-zwei-werte' },
    el('div', {}, mono('Vorher'), el('div', { class: 'ws-wert', 'data-ws-vorher': '1' }, a.vorher || '(nichts)')),
    el('div', {}, mono('Nachher'), el('div', { class: 'ws-wert ws-wert--neu', 'data-ws-nachher': '1' }, a.nachher || '(nichts)')));
}
async function neuLaden() {
  try { Z.d = await ruf('GET', X('haeuser')); } catch (e) { fehler(e); return; }
  letzteAenderung();
  allesNeu();
  await zeichne({ halten: true });
}
function letzteAenderung() {
  let z = null;
  haeuser().forEach(h => (h.verlauf || []).concat((h.notizen || []).map(n => ({ wann: n.wann, wer: n.wer, was: 'Notiz' }))).forEach(v => { if (!z || v.wann > z.wann) z = { wann: v.wann, wer: v.wer, was: v.was + ' bei ' + h.name, id: h.id }; }));
  if (z) z.was = kurz(z.was, 60);
  Z.letzte = z;
}

// ---------------------------------------------------------------- Navigation und Titel (wie in der Vorlage)
async function geh(ansicht, opt = {}) {
  Z.ansicht = ansicht;
  try { localStorage.setItem('kl-ort', ansicht); } catch (e) { /* ohne Merken */ }
  try { const u = new URL(location.href); u.searchParams.delete('haus'); u.searchParams.delete('ansicht'); u.searchParams.delete('rundgang'); history.replaceState(null, '', u.pathname + u.search); } catch (e) { /* ohne Adresse */ }
  allesNeu();
  await zeichne(opt);
  if (!opt.halten) window.scrollTo(0, 0);
}
function titel(klein, a, b, satz, knoepfe, art, bildFoto) {
  const h = el('div', { class: 'ws-titel ws-titel--wo', html: WO.startbild({ werkzeug: W, zier: E(klein), h1: E(a ? a + ' ' : '') + (b ? '<em>' + E(b) + '</em>' : ''), satz: satz ? E(satz) : '',
    knoepfe: knoepfe && knoepfe.length ? ' ' : '', art: art || (Z.ansicht === 'start' ? 'voll' : 'buehne'), foto: bildFoto || foto(H.fotoJe && H.fotoJe[W]) }) });
  const k = h.querySelector('.wo-sb__kn'); if (k) { k.textContent = ''; k.append(...knoepfe.filter(Boolean)); }
  return h;
}
/* Knöpfe im Startbild wie in der Vorlage: Links (der erste golden, die weiteren leise), Klick bleibt im Werkzeug */
const woKn = (text, z, art, tun, attrs = {}) => el('a', Object.assign({ class: 'wo-kn' + (art ? ' wo-kn--' + art : ''), href: '#', role: 'button', html: '<span>' + E(text) + '</span><i>' + WO.ic(z) + '</i>', onclick: ev => { ev.preventDefault(); tun(ev); } }, attrs));

// ---------------------------------------------------------------- Übersicht
function zeichneStart() {
  const m = leere($('#ws-mitte')), hs = haeuser().map(sicht), h = new Date().getHours();
  const gruss = h >= 5 && h < 11 ? 'Guten Morgen.' : h >= 11 && h < 18 ? 'Guten Tag.' : 'Guten Abend.';
  const f = hs.filter(faellig), ueber = hs.filter(x => lage(x) === 'ueber'), imGespraech = hs.filter(x => ['Entwurf geschickt', 'Gespräch', 'Angebot'].includes(x.stand));
  const naechst = hs.filter(x => lage(x) === 'bald').sort((a, b) => a.naechster_schritt.datum.localeCompare(b.naechster_schritt.datum))[0];
  const z = Z.letzte;
  m.append(titel(WO.name(W) + ' · ' + H.name, gruss, 'Wer ist heute dran?',
    'Hier steht jedes Hotel und Restaurant, mit dem Tasty Studios im Gespräch ist oder das es anschreiben will: wie weit es ist, was als Nächstes zu tun ist und bis wann. Jede Änderung zeigt eine Quittung mit vorher und nachher und lässt sich zurücknehmen.',
    [el('a', { class: 'wo-kn wo-kn--gold', href: 'anleitung.html', 'data-ws-anleitung': '1', html: '<span>Anleitung</span><i>' + WO.ic('buch') + '</i>' }),
     el('a', { class: 'wo-kn', href: pruefLink(''), html: '<span>Prüfung</span><i>' + WO.ic('schild') + '</i>' })]));
  const AUFG = [
    ['neu', 'Neues Haus', 'Name, Ort, Art und Stand. Alles andere später.', 'plus', 'empfang'],
    ['heute', 'Heute fällig', f.length ? mz(f.length, 'Haus wartet', 'Häuser warten') + ' auf den nächsten Schritt.' : 'Heute ist nichts fällig.', 'glocke', 'studio'],
    ['brett', 'Stand weiterschieben', 'Auf dem Brett eine Karte in die nächste Spalte ziehen.', 'rechts', 'plan'],
    ['liste', 'Haus suchen', 'Nach Name, Ort oder Person, sortiert nach Fälligkeit.', 'suche', 'bildschirm'],
    ['notiz', 'Notiz schreiben', 'Was besprochen wurde, mit Name und Zeit.', 'stift', 'tafel'],
    ['schritt', 'Nächsten Schritt setzen', 'Was als Nächstes kommt und bis wann.', 'uhr', 'terrasse'],
    ['bestand', 'Echte Häuser übernehmen', 'Einmal aus den Unterlagen, mit Bericht und «Rückgängig».', 'kopie', 'speicherstadt']];
  const rest = el('div', { class: 'ws-wo-start', html:
    `<div class="wo-lage">
      <div class="wo-lg"><i class="wo-lg__z">${WO.ic('glocke')}</i><span class="wo-mk">Heute</span><b>${f.length ? E(mz(f.length, 'Haus fällig', 'Häuser fällig')) : 'Nichts fällig'}</b><p>${f.length ? (ueber.length ? E(mz(ueber.length, 'davon überfällig', 'davon überfällig')) + '. ' : '') + 'Steht auch in der Zentrale unter «Heute».' : naechst ? 'Als Nächstes: ' + E(naechst.name) + ', ' + E(wann(naechst)) + '.' : 'Kein Datum in den nächsten Tagen.'}</p>${f.length ? '<button class="wo-lk" type="button" data-gehe="heute">Fällige ansehen</button>' : ''}</div>
      <div class="wo-lg"><i class="wo-lg__z">${WO.ic('chat')}</i><span class="wo-mk">Im Gespräch</span><b>${E(mz(imGespraech.length, 'Haus', 'Häuser'))}</b><p>${E(mz(hs.length, 'Haus', 'Häuser'))} in der Liste, ${E(String(hs.filter(x => x.stand === 'Vertrag').length))} mit Vertrag.</p><button class="wo-lk" type="button" data-gehe="brett">Zum Brett</button></div>
      <div class="wo-lg"><i class="wo-lg__z">${WO.ic('verlauf')}</i><span class="wo-mk">Zuletzt</span><b>${z ? E(zeit(z.wann).split(',')[0]) : 'Noch nichts'}</b><p>${z ? E(z.was) + ' (' + E(z.wer) + ').' : 'Jede Änderung steht im Verlauf des Hauses.'}</p><button class="wo-lk" type="button" data-gehe="verlauf">Frühere Änderungen</button></div>
    </div>
    <h2 class="wo-zw">Häufig <em>gebraucht</em></h2>
    <div class="wo-aufg ws-aufgaben">${AUFG.map(([ziel, tt, s, ic, fk]) => `<button class="wo-ag ws-ag" type="button" data-aufgabe="${E(ziel)}"><span class="wo-ag__b"><img src="${E(foto(fk))}" alt="" loading="lazy" decoding="async"></span><span class="wo-ag__t"><i class="wo-ag__z">${WO.ic(ic)}</i><b>${E(tt)}</b><span>${E(s)}</span></span></button>`).join('')}</div>
    <h2 class="wo-zw">Die Häuser, <em>Stand für Stand</em></h2>
    <div class="wo-ber ws-bereiche">${STAENDE.map(s => { const n = hs.filter(x => x.stand === s), fs = n.filter(faellig).length;
      return `<button class="wo-bk ws-bk" type="button" title="${E(STAND_INFO[s][0])}" data-ws-bk="${E(s)}" data-gehe="stand:${E(s)}"><span class="wo-bk__b"><img src="${E(foto(STAND_INFO[s][1]))}" alt="" loading="lazy" decoding="async"></span><span class="wo-bk__t"><b>${E(s.charAt(0).toUpperCase() + s.slice(1))}</b><small>${E(mz(n.length, 'Haus', 'Häuser'))}${fs ? ' · ' + fs + ' fällig' : ''}</small><span>${E(n.length ? n.slice(0, 3).map(x => x.name).join(', ') + (n.length > 3 ? ' und weitere.' : '.') : STAND_INFO[s][0])}</span></span><i class="wo-bk__p">${WO.ic('pfeil')}</i></button>`; }).join('')}</div>` });
  rest.querySelectorAll('[data-gehe]').forEach(b => b.addEventListener('click', () => geh(b.getAttribute('data-gehe'))));
  rest.querySelectorAll('[data-aufgabe]').forEach(b => b.addEventListener('click', () => aufgabe(b.getAttribute('data-aufgabe'))));
  m.append(rest);
}
function aufgabe(a) {
  if (a === 'neu') return neuesHaus();
  if (a === 'notiz' || a === 'schritt') return hausWaehlen(a === 'notiz' ? 'Notiz' : 'Nächster Schritt', a === 'notiz' ? 'für welches Haus?' : 'für welches Haus?', id => {
    if (a === 'notiz') { geh('haus:' + id).then(() => notizFenster(haus(id))); } else geh('pflege:' + id, { zeige: 'schritt' });
  });
  return geh(a);
}
function hausWaehlen(t, akzent, weiter) {
  let id = (haeuser().filter(faellig)[0] || haeuser()[0] || {}).id;
  const inhalt = el('div', { class: 'ws-form' }, el('div', { class: 'feld' }, el('span', {}, 'Haus'),
    auswahl(haeuser().slice().sort((a, b) => a.name.localeCompare(b.name, 'de')).map(h => ({ wert: h.id, text: h.name, zusatz: h.ort })), id, x => { id = x; }, 'Haus')));
  fenster(t, akzent, inhalt, [{ text: 'Abbrechen' }, { text: 'Weiter', haupt: true, tun: zu => { zu(); weiter(id); } }], { name: 'haus-waehlen' });
}

// ---------------------------------------------------------------- Ein Haus als Karte (wie die Termine der Vorlage: links die Tafel, rechts die Felder)
function tafel(h) {   // das «Plakat» eines Hauses: Art und Ort oben, das Datum des nächsten Schritts gross, der Stand unten
  const d = (h.naechster_schritt || {}).datum, m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(d || ''), l = lage(h);
  return el('figure', { class: 'cu-pl kl-pl kl-pl--' + l, 'aria-hidden': 'true' },
    el('span', { class: 'cu-pl__zeile' }, (h.art || '') + (h.ort ? ' · ' + h.ort : '')),
    m ? el('span', { class: 'cu-pl__tag' }, String(+m[3]) + '.') : el('span', { class: 'cu-pl__tag kl-pl__ohne' }, '–'),
    el('span', { class: 'cu-pl__monat' }, m ? MONATE[+m[2] - 1] : 'kein Datum'),
    el('span', { class: 'cu-pl__frei' }, h.stand));
}
// Statt der Datums-Tafel: die Startseite des Hauses im Blender-Laptop (Robert 08.11.2026: «schnelleren Grip als … leere Kacheln»)
function geraetKlein(h, sofort) {   // sofort: in den Familienblöcken gleich laden, kein leerer Bildschirm beim Hinscrollen
  const laden = sofort ? 'eager' : 'lazy';
  return el('button', { type: 'button', class: 'kl-mini', title: h.name + ' öffnen', 'aria-label': h.name + ' öffnen', onclick: () => geh('haus:' + h.id) },
    el('span', { class: 'kl-mini__schirm' }, h.schirm ? el('img', { src: h.schirm, alt: '', loading: laden, decoding: 'async' }) : el('b', {}, h.name)),
    el('img', { class: 'kl-mini__haus', src: '/sales-cockpit/zentrale/img/laptop.webp', alt: '', loading: laden, decoding: 'async' }));
}
function karte(h0) {
  const h = sicht(h0), l = lage(h), offen = Object.keys(Z.offen).some(k => k.startsWith(h.id + '|'));
  const s = h.naechster_schritt || {};
  const k = el('article', { class: 'cu-t kl-t' + (offen ? ' cu-t--offen' : '') + (h.stand === 'abgesagt' ? ' kl-t--aus' : ''), 'data-kl-haus': h.id },
    el('div', { class: 'cu-t__bild' }, geraetKlein(h)),
    el('div', { class: 'cu-t__felder' },
      el('div', { class: 'cu-t__kopf' }, el('h3', { class: 'cu-t__wann' }, el('button', { class: 'kl-name', type: 'button', onclick: () => geh('haus:' + h.id) }, h.name)),
        l === 'ueber' || l === 'heute' ? el('span', { class: 'cu-t__marke kl-marke--' + l }, l === 'ueber' ? 'überfällig' : 'heute') : null, h.probe ? el('span', { class: 'cu-t__marke kl-marke--probe' }, 'Probe') : null),
      el('p', { class: 'cu-t__frei' }, [h.ort, h.art, (h.ansprechpartner || {}).name].filter(Boolean).join(' · ')),
      el('div', { class: 'cu-t__reihe kl-reihe' },
        el('label', { class: 'cu-f kl-f--schritt' }, el('span', { class: 'cu-f__l' }, 'Nächster Schritt'),
          el('span', { class: 'kl-schritt' + (l === 'ueber' ? ' kl-schritt--ueber' : '') }, s.text ? s.text + (s.datum ? ', ' + wann(h) : '') : 'Noch kein Schritt gesetzt.')),
        el('div', { class: 'cu-f' }, el('span', { class: 'cu-f__l' }, 'Stand'),
          auswahl(STAENDE.map(x => ({ wert: x, text: x })), h.stand, x => { vormerken(h.id + '|stand', x, h0.stand); neuKarte(h.id); }, 'Stand von ' + h.name))),
      el('div', { class: 'cu-t__kn' },
        link('Öffnen', () => geh('haus:' + h.id)), link('Notiz', () => notizFenster(h0)),
        h.entwurf ? el('a', { class: 'ws-link', href: h.entwurf, target: '_blank', rel: 'noopener' }, 'Entwurf ansehen') : null)));
  return k;
}
function neuKarte(id) { const alt = $(`[data-kl-haus="${CSS.escape(id)}"]`); if (!alt) return; if (alt.classList.contains('cu-t')) alt.replaceWith(karte(haus(id))); else if (alt.classList.contains('kl-ast')) alt.replaceWith(spalte(haus(id))); }

// Familien wie im Atelier (Robert 09.11.2026: «dass man sieht, wie die Zusammenhänge zwischen den jeweiligen Häusern sind»):
// oben die gemeinsame Startseite im Laptop, darunter die Linie hinunter zu jedem Haus der Familie. Liste der Familien: familien.js
const FAMILIEN = window.TASTY_FAMILIEN || [];
const familieVon = h => FAMILIEN.find(f => f.ids.includes(h.id)) || null;
function familienStart(f) {
  const a = f.ids.map(haus).filter(Boolean).map(h => (h.adressen || []).find(x => x.gruppe === 'Familie')).find(Boolean);
  return a ? a.url : (f.start || '');
}
// Ein Haus der Familie als Spalte unter der gemeinsamen Startseite (wie im Atelier: Laptop, Ort, Name, darunter Stand und Knöpfe)
function spalte(h0) {
  const h = sicht(h0), s = h.naechster_schritt || {}, offen = Object.keys(Z.offen).some(k => k.startsWith(h.id + '|'));
  return el('article', { class: 'kl-ast' + (offen ? ' kl-ast--offen' : '') + (h.stand === 'abgesagt' ? ' kl-t--aus' : ''), 'data-kl-haus': h.id },
    geraetKlein(h, true),
    el('span', { class: 'kl-ast__ort' }, h.ort || h.art || ''),
    el('h4', { class: 'kl-ast__name' }, el('button', { class: 'kl-name', type: 'button', onclick: () => geh('haus:' + h.id) }, h.name)),
    el('p', { class: 'kl-ast__schritt' }, s.text ? kurz(s.text, 110) : 'Noch kein Schritt gesetzt.'),
    el('div', { class: 'cu-f kl-ast__stand' }, el('span', { class: 'cu-f__l' }, 'Stand'),
      auswahl(STAENDE.map(x => ({ wert: x, text: x })), h.stand, x => { vormerken(h.id + '|stand', x, h0.stand); neuKarte(h.id); }, 'Stand von ' + h.name)),
    el('div', { class: 'kl-ast__kn' },
      link('Öffnen', () => geh('haus:' + h.id)), link('Notiz', () => notizFenster(h0)),
      h.entwurf ? el('a', { class: 'ws-link', href: h.entwurf, target: '_blank', rel: 'noopener' }, 'Entwurf') : null));
}
function familieBlock(f, mitglieder) {
  const start = familienStart(f), name = f.t[0].replace(/\.$/, '');
  const laptop = [el('span', { class: 'kl-mini__schirm' }, el('img', { src: '/sales-cockpit/werkzeuge/13-sales-cockpit/familien/schirm-familie-' + f.k + '.webp', alt: 'Gemeinsame Startseite ' + name, loading: 'eager', decoding: 'async' })),
    el('img', { class: 'kl-mini__haus', src: '/sales-cockpit/zentrale/img/laptop.webp', alt: '', loading: 'eager', decoding: 'async' })];
  return el('section', { class: 'kl-fam', 'data-kl-familie': f.k },
    el('header', { class: 'kl-fam__kopf' },
      el('h3', { class: 'kl-fam__titel' }, el('span', {}, f.t[0]), el('span', { class: 'kl-fam__gold' }, f.t[1] || '')),
      el('p', { class: 'kl-fam__satz' }, f.s)),
    el('div', { class: 'kl-fam__oben' },
      start ? el('a', { class: 'kl-mini kl-fam__geraet', href: start, target: '_blank', rel: 'noopener', title: 'Gemeinsame Startseite ' + name + ' öffnen' }, ...laptop)
            : el('span', { class: 'kl-mini kl-fam__geraet' }, ...laptop),
      start ? el('a', { class: 'kl-fam__link', href: start, target: '_blank', rel: 'noopener' }, el('span', {}, 'Die gemeinsame Startseite'), el('span', {}, 'ansehen'), el('i', { 'aria-hidden': 'true', html: PF }))
            : el('span', { class: 'kl-fam__link' }, el('span', {}, 'Die gemeinsame Startseite'))),
    el('div', { class: 'kl-fam__haeuser', 'data-n': String(mitglieder.length), style: '--n:' + mitglieder.length }, ...mitglieder.map(h => spalte(haus(h.id)))));
}

// ---------------------------------------------------------------- Liste: alle Häuser, filterbar und sortierbar
function gefiltert(vor) {
  const f = Object.assign({}, Z.filter, vor || {}), q = f.q.trim().toLowerCase();
  let l = haeuser().map(sicht).filter(h =>
    (f.stand === 'alle' || h.stand === f.stand) &&
    (f.art === 'alle' || h.art === f.art) &&
    (f.faellig === 'alle' || (f.faellig === 'faellig' ? faellig(h) : f.faellig === 'woche' ? ['ueber', 'heute', 'bald'].includes(lage(h)) : lage(h) === 'ohne')) &&
    (!q || [h.name, h.ort, (h.ansprechpartner || {}).name, h.kuerzel].join(' ').toLowerCase().includes(q)));
  // Unsere Reihenfolge (Robert 08.11.2026): Angelina, Culinarium, Wild Side, Salt & Silver, Rivage, Familie Maeder, Familie Zurbriggen, Schlössli, Schäfli; Neue danach
  const REIHE = ['angelina', 'culinarium', 'wildside', 'saltandsilver', 'beau-rivage', 'carlton', 'doldenhorn', 'ruedihus', 'gasterntal', 'monte-moro', 'zermatt', 'wellness', 'schloessli', 'schaefli'];
  const platz = h => { const i = REIHE.indexOf(h.id); return i < 0 ? 999 : i; };
  const nach = {
    reihe: (a, b) => platz(a) - platz(b) || a.name.localeCompare(b.name, 'de'),
    faellig: (a, b) => ((a.naechster_schritt || {}).datum || '9999').localeCompare((b.naechster_schritt || {}).datum || '9999') || a.name.localeCompare(b.name, 'de'),
    name: (a, b) => a.name.localeCompare(b.name, 'de'), ort: (a, b) => (a.ort || '').localeCompare(b.ort || '', 'de') || a.name.localeCompare(b.name, 'de'),
    stand: (a, b) => STAENDE.indexOf(a.stand) - STAENDE.indexOf(b.stand) || a.name.localeCompare(b.name, 'de'),
    geaendert: (a, b) => (b.geaendert || '').localeCompare(a.geaendert || '')
  };
  return l.sort(nach[f.sort] || nach.reihe);
}
function zeichneListe(vor, kopfText) {
  const m = leere($('#ws-mitte'));
  const fest = vor || {};
  const ort = el('div', { class: 'cu-liste', 'data-kl-liste': '1' });
  const zahl = el('span', { class: 'ws-leise kl-zahl' });
  const fuelle = () => {
    const l = gefiltert(fest);
    leere(ort);
    zahl.textContent = mz(l.length, 'Haus', 'Häuser');
    if (!l.length) ort.append(el('p', { class: 'kuhle ws-leer' }, haeuser().length ? 'Kein Haus passt zu dieser Auswahl.' : 'Noch kein Haus in der Liste. «Neues Haus» legt das erste an.'));
    // In unserer Reihenfolge stehen die Häuser einer Familie zusammen in einem Block, an der Stelle ihres ersten Hauses
    const gezeigt = new Set();
    l.forEach(h => {
      if (gezeigt.has(h.id)) return;
      const f = Z.filter.sort === 'reihe' ? familieVon(h) : null;
      if (!f) { gezeigt.add(h.id); ort.append(karte(haus(h.id))); return; }
      const mit = l.filter(x => f.ids.includes(x.id));
      mit.forEach(x => gezeigt.add(x.id));
      ort.append(familieBlock(f, mit));
    });
  };
  const such = el('input', { type: 'search', id: 'kl-such', class: 'kl-such', placeholder: 'Haus, Ort oder Person suchen', value: Z.filter.q, autocomplete: 'off', 'aria-label': 'Suchen' });
  such.addEventListener('input', () => { Z.filter.q = such.value; fuelle(); });
  const reiter = el('div', { class: 'ws-reiter kl-reiter' }, such,
    fest.stand ? null : auswahl([{ wert: 'alle', text: 'Jeder Stand' }].concat(STAENDE.map(s => ({ wert: s, text: s, zusatz: String(haeuser().filter(h => sicht(h).stand === s).length) }))), Z.filter.stand, x => { Z.filter.stand = x; fuelle(); }, 'Stand'),
    fest.faellig ? null : auswahl([{ wert: 'alle', text: 'Jede Fälligkeit' }, { wert: 'faellig', text: 'Heute und überfällig' }, { wert: 'woche', text: 'In den nächsten 7 Tagen' }, { wert: 'ohne', text: 'Ohne Datum' }], Z.filter.faellig, x => { Z.filter.faellig = x; fuelle(); }, 'Fälligkeit'),
    wahl2([{ wert: 'alle', text: 'Alle' }, { wert: 'Hotel', text: 'Hotels' }, { wert: 'Restaurant', text: 'Restaurants' }], Z.filter.art, x => { Z.filter.art = x; fuelle(); }, 'Art'),
    auswahl([{ wert: 'reihe', text: 'Unsere Reihenfolge' }, { wert: 'faellig', text: 'Nach Fälligkeit' }, { wert: 'name', text: 'Nach Name' }, { wert: 'ort', text: 'Nach Ort' }, { wert: 'stand', text: 'Nach Stand' }, { wert: 'geaendert', text: 'Zuletzt geändert' }], Z.filter.sort, x => { Z.filter.sort = x; fuelle(); }, 'Sortierung', true),
    zahl);
  m.append(kopfText, reiter, ort);
  fuelle();
}
function knNeu() { return woKn('Neues Haus', 'plus', 'gold', neuesHaus, { 'data-kl-neu': '1' }); }
function knBrett() { return woKn('Als Brett', 'balken', '', () => geh('brett')); }

// ---------------------------------------------------------------- Brett: die Stände als Spalten, Karten verschieben
function zeichneBrett() {
  const m = leere($('#ws-mitte')), hs = haeuser().map(sicht);
  m.append(titel('Die Häuser', 'Das', 'Brett.', 'Jeder Stand eine Spalte. Eine Karte in eine andere Spalte ziehen ändert den Stand; er wartet gelb, bis du speicherst. Am Handy den Stand über das Haus wählen.',
    [knNeu(), woKn('Als Liste', 'menue', '', () => geh('liste'))]));
  const brett = el('div', { class: 'kl-brett', 'data-kl-brett': '1' });
  let gezogen = null;
  STAENDE.forEach(s => {
    const drin = hs.filter(h => h.stand === s).sort((a, b) => ((a.naechster_schritt || {}).datum || '9999').localeCompare((b.naechster_schritt || {}).datum || '9999'));
    const sp = el('section', { class: 'kl-sp', 'data-kl-stand': s, 'aria-label': 'Stand ' + s },
      el('header', { class: 'kl-sp__kopf' }, el('b', {}, s.charAt(0).toUpperCase() + s.slice(1)), el('small', {}, String(drin.length))),
      el('div', { class: 'kl-sp__karten' }, drin.length ? drin.map(h => {
        const l = lage(h), offen = Object.keys(Z.offen).some(k => k.startsWith(h.id + '|stand'));
        const c = el('button', { class: 'kl-k' + (offen ? ' kl-k--offen' : '') + (l === 'ueber' ? ' kl-k--ueber' : l === 'heute' ? ' kl-k--heute' : ''), type: 'button', draggable: 'true', 'data-kl-karte': h.id, onclick: () => geh('haus:' + h.id) },
          el('b', {}, h.name), el('small', {}, [h.ort, h.art].filter(Boolean).join(' · ')),
          (h.naechster_schritt || {}).text ? el('span', { class: 'kl-k__s' }, kurz(h.naechster_schritt.text, 70)) : null,
          (h.naechster_schritt || {}).datum ? el('span', { class: 'kl-k__d' }, wann(h)) : null);
        c.addEventListener('dragstart', ev => { gezogen = h.id; ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', h.id); c.classList.add('kl-k--zieht'); });
        c.addEventListener('dragend', () => { c.classList.remove('kl-k--zieht'); $$('.kl-sp--ziel').forEach(x => x.classList.remove('kl-sp--ziel')); });
        return c;
      }) : el('p', { class: 'kl-sp__leer' }, STAND_INFO[s][0])));
    sp.addEventListener('dragover', ev => { if (!gezogen) return; ev.preventDefault(); sp.classList.add('kl-sp--ziel'); });
    sp.addEventListener('dragleave', ev => { if (!sp.contains(ev.relatedTarget)) sp.classList.remove('kl-sp--ziel'); });
    sp.addEventListener('drop', ev => {
      ev.preventDefault(); sp.classList.remove('kl-sp--ziel');
      const id = gezogen || ev.dataTransfer.getData('text/plain'); gezogen = null;
      const h0 = haus(id); if (!h0) return;
      vormerken(id + '|stand', s, h0.stand);
      zeichneBrett();
      if (s !== h0.stand) melde(h0.name + ': ' + anf(h0.stand) + ' wird ' + anf(s), { mehr: 'Wartet gelb, bis du speicherst.' });
    });
    brett.append(sp);
  });
  m.append(el('div', { class: 'kl-brett__huelle' }, brett));
}

// ---------------------------------------------------------------- Ein Haus: alle Felder, Notizen, Verlauf (wie «Angaben des Hauses» der Vorlage)
function zeichneHaus(id, opt) {
  const m = leere($('#ws-mitte')), h0 = haus(id);
  if (!h0) { m.append(titel('Die Häuser', 'Dieses Haus', 'gibt es nicht.', 'Vielleicht wurde es gelöscht. Die Liste zeigt alle, die es gibt.', [woKn('Zur Liste', 'menue', 'gold', () => geh('liste'))])); return; }
  const h = sicht(h0), l = lage(h);
  m.append(titel((h.art || 'Haus') + (h.ort ? ' · ' + h.ort : ''), h.name, '', h.stand === 'abgesagt' ? 'Abgesagt. Alles bleibt hier stehen, falls es später weitergeht.' :
    ((h.naechster_schritt || {}).text ? 'Nächster Schritt: ' + h.naechster_schritt.text + ((h.naechster_schritt || {}).datum ? ', ' + langDatum(h.naechster_schritt.datum) + ' (' + wann(h) + ').' : '.') : 'Noch kein nächster Schritt gesetzt.'),
    [woKn('Notiz schreiben', 'stift', 'gold', () => notizFenster(h0)), h.entwurf ? el('a', { class: 'wo-kn', href: h.entwurf, target: '_blank', rel: 'noopener', html: '<span>Entwurf ansehen</span><i>' + WO.ic('auge') + '</i>' }) : null]));

  const feld = (label, wert, key, alt, art = 'text', hilfe) => {
    const f = el('input', { type: art, id: 'kl-' + key.replace(/\|/g, '-'), value: wert || '', autocomplete: 'off', spellcheck: 'false', 'data-kl-feld': key });
    f.addEventListener('input', () => { vormerken(id + '|' + key, f.value.trim(), alt || ''); f.closest('.ws-ang__zeile').classList.toggle('kl-offen', (id + '|' + key) in Z.offen); });
    return el('div', { class: 'ws-ang__zeile feld' + ((id + '|' + key) in Z.offen ? ' kl-offen' : '') }, el('label', { for: f.id }, label), f, hilfe ? el('p', { class: 'ws-klein ws-ang__lage' }, hilfe) : null);
  };
  const ap = h.ansprechpartner || {}, ap0 = h0.ansprechpartner || {}, s = h.naechster_schritt || {}, s0 = h0.naechster_schritt || {};
  const zeile = (label, inhalt, key) => el('div', { class: 'ws-ang__zeile feld' + (key && Object.keys(Z.offen).some(k => k.startsWith(id + '|' + key)) ? ' kl-offen' : '') }, el('span', { class: 'kl-l' }, label), inhalt);

  const schrittText = el('input', { type: 'text', id: 'kl-schritt', value: s.text || '', autocomplete: 'off', placeholder: 'zum Beispiel: Anrufen, ob der Entwurf angekommen ist', 'data-kl-feld': 'naechster_schritt|text' });
  schrittText.addEventListener('input', () => vormerken(id + '|naechster_schritt|text', schrittText.value.trim(), s0.text || ''));
  const stand = el('section', { class: 'platte ws-karte ws-form ws-ang kl-ang', 'data-ws-form': 'stand', id: 'kl-stand' },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Stand und nächster Schritt'), l === 'ueber' || l === 'heute' ? el('span', { class: 'cu-t__marke kl-marke--' + l }, l === 'ueber' ? 'überfällig' : 'heute fällig') : mono(wann(h))),
    zeile('Stand', auswahl(STAENDE.map(x => ({ wert: x, text: x })), h.stand, x => { vormerken(id + '|stand', x, h0.stand); zeichneHaus(id, { halten: true }); }, 'Stand'), 'stand'),
    zeile('Nächster Schritt', schrittText, 'naechster_schritt|text'),
    zeile('Bis wann', datumWahl(s.datum, x => { vormerken(id + '|naechster_schritt|datum', x, s0.datum || ''); }), 'naechster_schritt|datum'));
  const angaben = el('section', { class: 'platte ws-karte ws-form ws-ang kl-ang', 'data-ws-form': 'angaben' },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Das Haus'), mono(h.quelle || '')),
    feld('Name', h.name, 'name', h0.name),
    feld('Ort', h.ort, 'ort', h0.ort),
    zeile('Art', wahl2([{ wert: 'Hotel', text: 'Hotel' }, { wert: 'Restaurant', text: 'Restaurant' }], h.art, x => vormerken(id + '|art', x, h0.art), 'Art', true), 'art'),
    feld('Website', h.website, 'website', h0.website, 'url'),
    feld('Link zum Entwurf', h.entwurf, 'entwurf', h0.entwurf, 'url'),
    feld('Kürzel', h.kuerzel, 'kuerzel', h0.kuerzel, 'text', 'Damit findet «Wer hat den Entwurf geöffnet» die Besuche auf dem Entwurf dieses Hauses.'));
  const person = el('section', { class: 'platte ws-karte ws-form ws-ang kl-ang', 'data-ws-form': 'person' },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Ansprechpartner'), ap.mail ? el('a', { class: 'ws-link', href: 'mailto:' + ap.mail }, 'Mail schreiben') : null),
    feld('Name', ap.name, 'ansprechpartner|name', ap0.name), feld('Rolle', ap.rolle, 'ansprechpartner|rolle', ap0.rolle),
    feld('Mail', ap.mail, 'ansprechpartner|mail', ap0.mail, 'email'), feld('Telefon', ap.telefon, 'ansprechpartner|telefon', ap0.telefon, 'tel'));
  const b = h.besuche || {};
  const besuche = el('section', { class: 'platte ws-karte kl-besuche', 'data-kl-besuche': h.kuerzel || '' },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Besuche auf dem Entwurf'), mono('Kürzel ' + (h.kuerzel || '–'))),
    el('p', {}, b.anzahl != null ? mz(b.anzahl, 'Besuch', 'Besuche') + (b.letzter ? ', zuletzt ' + zeit(b.letzter) : '') + '.' : 'Noch keine Zahlen. Das Werkzeug «' + (WO.name('03-entwurf-besuche')) + '» trägt sie hier ein, sobald es das Kürzel kennt.'));
  const notizen = (h0.notizen || []).slice().reverse();
  const nz = el('section', { class: 'platte ws-karte kl-notizen', id: 'kl-notizen' },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Notizen'), taste('Notiz schreiben', () => notizFenster(h0))),
    notizen.length ? notizen.map(n => el('div', { class: 'cu-vl__z kl-n' }, el('b', {}, zeit(n.wann)), el('p', {}, n.text), mono(n.wer))) : el('p', { class: 'ws-leise' }, 'Noch keine Notiz. Was besprochen wurde, steht hier mit Name und Zeit.'));
  const verlauf = (h0.verlauf || []).slice().reverse();
  const vl = el('section', { class: 'platte ws-karte kl-verlauf' },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Verlauf'), mono(mz(verlauf.length, 'Eintrag', 'Einträge'))),
    verlauf.length ? verlauf.slice(0, 30).map(v => el('div', { class: 'cu-vl__z' }, el('b', {}, zeit(v.wann)), el('p', {}, v.was), mono(v.wer))) : el('p', { class: 'ws-leise' }, 'Noch keine Änderung.'));
  const weg = el('section', { class: 'platte ws-karte kl-weg' },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Haus aus der Liste nehmen'), mono('mit Rückfrage')),
    el('p', {}, 'Statt zu löschen genügt meist der Stand «abgesagt»: dann bleibt alles stehen. Löschen fragt vorher nach und lässt sich mit der Quittung zurücknehmen.'),
    el('div', { class: 'ws-reihe', style: 'padding-top:12px' }, taste('Auf «abgesagt» setzen', () => { vormerken(id + '|stand', 'abgesagt', h0.stand); zeichneHaus(id, { halten: true }); }), taste('Haus löschen …', () => loeschen(h0))));
  m.append(el('div', { class: 'kl-tafel' }, el('div', { class: 'kl-tafel__l' }, stand, angaben, person), el('div', { class: 'kl-tafel__r' }, nz, besuche, vl, weg)));
  if (opt && opt.zeige === 'schritt') setTimeout(() => { $('#kl-stand').scrollIntoView({ block: 'center' }); schrittText.focus(); }, 60);
}


// ---------------------------------------------------------------- Ein Kunde auf einen Blick (Robert 08.11.2026): Website im Laptop, Weg der Zusammenarbeit,
// Werkzeuge, Preis, nächster Schritt. Keine Felder und Auswahllisten; gepflegt wird unter «Bearbeiten» (Ansicht pflege:<id>).
const WEG = ['gefunden', 'angeschrieben', 'Entwurf geschickt', 'Gespräch', 'Angebot', 'Vertrag'];
const WEG_NAME = { 'gefunden': 'Gefunden', 'angeschrieben': 'Angeschrieben', 'Entwurf geschickt': 'Entwurf', 'Gespräch': 'Gespräch', 'Angebot': 'Angebot', 'Vertrag': 'Kunde' };
function wegStufe(stand) { if (stand === 'geprüft' || stand === 'offen') return 0; const i = WEG.indexOf(stand); return i < 0 ? -1 : i; }
function betrag(p) {
  if (p && p.gross) return p.gross;
  if (!p || p.betrag == null || p.betrag === '') return '';
  const z = Number(p.betrag); const t = Number.isFinite(z) ? z.toLocaleString('de-CH', { maximumFractionDigits: 0 }).replace(/,/g, '’') : String(p.betrag);
  return (p.waehrung ? p.waehrung + ' ' : '') + t;
}
function zeichneUeberblick(id, opt) {
  const m = leere($('#ws-mitte')), h0 = haus(id);
  if (!h0) { m.append(titel('Die Häuser', 'Dieses Haus', 'gibt es nicht.', 'Vielleicht wurde es gelöscht. Die Liste zeigt alle, die es gibt.', [woKn('Zur Liste', 'menue', 'gold', () => geh('liste'))])); return; }
  const h = sicht(h0), s = h.naechster_schritt || {}, ap = h.ansprechpartner || {}, p = h.preis || {}, stufe = wegStufe(h.stand);
  const satz = h.kurz || (h.partner ? 'Partner von Tasty Studios.' : '') ;
  m.append(titel((h.partner ? 'Partner' : (h.art || 'Haus')) + (h.ort ? ' · ' + h.ort : ''), h.name, '', satz || 'Die Zusammenarbeit auf einen Blick.',
    [h.entwurf ? el('a', { class: 'wo-kn wo-kn--gold', href: h.entwurf, target: '_blank', rel: 'noopener', html: '<span>Entwurf ansehen</span><i>' + WO.ic('auge') + '</i>' }) : null,
     woKn('Notiz schreiben', 'stift', 'hell', () => notizFenster(h0)), woKn('Bearbeiten', 'menue', '', () => geh('pflege:' + id))], 'buehne', h.bild || undefined));

  // 1 Bühne: die Website im Laptop, daneben Website, Preis und Werkzeuge
  const geraet = el('figure', { class: 'kl-ue__geraet' },
    h.schirm ? el('span', { class: 'kl-ue__schirm' }, el('img', { src: h.schirm, alt: 'Website von ' + h.name, loading: 'lazy', decoding: 'async' }))
             : el('span', { class: 'kl-ue__schirm kl-ue__schirm--leer' }, el('b', {}, 'Noch keine Website'), el('small', {}, h.website ? 'Heute: ' + h.website.replace(/^https?:\/\//, '') : '')),
    el('img', { class: 'kl-ue__haus', src: '/sales-cockpit/zentrale/img/laptop.webp', alt: '', loading: 'lazy', decoding: 'async' }));
  const wz = Array.isArray(h.werkzeuge) ? h.werkzeuge : [];
  const bg = Array.isArray(h.beigaben) ? h.beigaben : [];

  const angaben = el('div', { class: 'kl-ue__angaben' },
    el('div', { class: 'kl-ue__block' }, el('span', { class: 'kl-ue__k' }, 'Die Website'),
      el('b', { class: 'kl-ue__gross' }, h.schirm ? (h.seiten ? mz(h.seiten, 'Seite', 'Seiten') : 'Gebaut') : 'Noch nicht gebaut'),
      el('div', { class: 'kl-ue__links' },
        h.live ? el('a', { href: h.live, target: '_blank', rel: 'noopener' }, 'Online ansehen') : null,
        h.entwurf ? el('a', { href: h.entwurf, target: '_blank', rel: 'noopener' }, 'Entwurf') : null,
        h.website ? el('a', { href: h.website, target: '_blank', rel: 'noopener' }, 'Heutige Seite') : null)),
    h.preis === null ? null : el('div', { class: 'kl-ue__block' }, el('span', { class: 'kl-ue__k' }, 'Preis'),
      el('b', { class: 'kl-ue__gross' }, betrag(p) || 'Noch kein Angebot'),
      el('p', { class: 'kl-ue__fein' }, p.monatlich ? 'Monatlich: ' + kurz(p.monatlich, 120) : (p.text ? kurz(p.text, 110) : ' '))),
    el('div', { class: 'kl-ue__block kl-ue__zwei' },
      el('div', {}, el('span', { class: 'kl-ue__k' }, wz.length ? mz(wz.length, 'Werkzeug', 'Werkzeuge') : 'Werkzeuge'),
        wz.length ? el('ul', { class: 'kl-ue__wz' }, ...wz.map(w => el('li', {}, typeof w === 'string' ? w : w.name)))
                  : el('p', { class: 'kl-ue__fein' }, 'Noch keine Werkzeuge gebaut.')),
      el('div', {}, el('span', { class: 'kl-ue__k' }, bg.length ? mz(bg.length, 'Beigabe', 'Beigaben') : 'Beigaben'),
        bg.length ? el('ul', { class: 'kl-ue__wz kl-ue__wz--leise' }, ...bg.map(w => el('li', {}, w)))
                  : el('p', { class: 'kl-ue__fein' }, 'Noch keine Beigaben.'))));
  const buehne = el('section', { class: 'kl-ue', 'aria-label': 'Website, Preis und Werkzeuge' }, geraet, angaben);

  // 2 Der Weg der Zusammenarbeit
  const weg = el('section', { class: 'kl-weg2', 'aria-label': 'Weg der Zusammenarbeit' },
    el('span', { class: 'kl-ue__k' }, h.stand === 'abgesagt' ? 'Abgesagt' : 'Wo wir stehen'),
    el('ol', { class: 'kl-weg2__reihe', style: '--n:' + WEG.length + ';--an:' + Math.max(0, stufe) },
      ...WEG.map((w, i) => el('li', { class: i < stufe ? 'war' : i === stufe ? 'jetzt' : '' }, el('i', {}), el('b', {}, WEG_NAME[w]), i === stufe && h.stand_seit ? el('small', {}, 'seit ' + datumZeigen(h.stand_seit)) : null))));

  // 3 Nächster Schritt, Ansprechpartner, zuletzt
  const notizen = (h0.notizen || []).slice(-3).reverse();
  const unten = el('section', { class: 'kl-ue__unten' },
    el('div', { class: 'kl-ue__block kl-ue__block--rahmen' }, el('span', { class: 'kl-ue__k' }, 'Nächster Schritt'),
      el('b', { class: 'kl-ue__mittel' }, s.text || 'Noch nicht gesetzt'),
      el('p', { class: 'kl-ue__fein' }, s.datum ? langDatum(s.datum) + ' · ' + wann(h) : ' '),
      el('div', { class: 'kl-ue__links' }, el('button', { type: 'button', onclick: () => geh('pflege:' + id, { zeige: 'schritt' }) }, 'Schritt ändern'))),
    el('div', { class: 'kl-ue__block kl-ue__block--rahmen' }, el('span', { class: 'kl-ue__k' }, 'Ansprechpartner'),
      el('b', { class: 'kl-ue__mittel' }, ap.name || 'Noch offen'),
      el('p', { class: 'kl-ue__fein' }, [ap.rolle, ap.mail].filter(Boolean).join(' · ') || ' ')),
    el('div', { class: 'kl-ue__block kl-ue__block--rahmen' }, el('span', { class: 'kl-ue__k' }, 'Zuletzt'),
      notizen.length ? el('ul', { class: 'kl-ue__notizen' }, ...notizen.map(n => el('li', {}, el('small', {}, zeit(n.wann) + ' · ' + (n.wer || '')), el('span', {}, kurz(n.text, 140)))))
                     : el('p', { class: 'kl-ue__fein' }, 'Noch keine Notiz.')));
  // Eine lange Seite (Robert 08.11.2026: «nach unten scrollen … die Informationen direkt alle haben … der Balken wandert automatisch mit»)
  const TEILE = [['ueberblick', 'Überblick', () => [buehne, seitenBlock(h), weg, unten].filter(Boolean)], ...(ARBEITEN[id] ? [['arbeiten', 'Was wir gemacht haben', () => reiterArbeiten(h, ARBEITEN[id])]] : []), ['weg', 'Von Anfang bis Ende', () => [reiterWeg(h)]], ['angebot', 'Preis und Angebot', () => [reiterAngebot(h)]],
    ['besuche', 'Besuche', () => [reiterBesuche(h)]], ['notizen', 'Notizen', () => [reiterNotizen(h0)]]];
  const knoepfe = {};
  const leiste = el('nav', { class: 'kl-tabs', 'aria-label': 'Bereiche dieses Kunden' }, ...TEILE.map(([k, t]) => (knoepfe[k] = el('button', { type: 'button', class: k === 'ueberblick' ? 'an' : '', onclick: () => {
    const z = document.getElementById('kl-teil-' + k); if (z) window.scrollTo({ top: z.getBoundingClientRect().top + scrollY - 150, behavior: 'smooth' }); } }, t))));
  m.append(leiste);
  TEILE.forEach(([k, t, bau], n) => m.append(el('section', { class: 'kl-teil', id: 'kl-teil-' + k, 'aria-label': t }, n ? el('h2', { class: 'kl-teil__titel' }, t) : null, ...bau())));
  const markiere = () => {
    let jetzt = 'ueberblick';
    TEILE.forEach(([k]) => { const z = document.getElementById('kl-teil-' + k); if (z && z.getBoundingClientRect().top < 220) jetzt = k; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) jetzt = TEILE[TEILE.length - 1][0];
    Object.entries(knoepfe).forEach(([k, b]) => { b.classList.toggle('an', k === jetzt); b.setAttribute('aria-current', k === jetzt ? 'true' : 'false'); });
  };
  if (Z.markiere) removeEventListener('scroll', Z.markiere);
  Z.markiere = markiere; addEventListener('scroll', markiere, { passive: true }); markiere();
  if (opt && opt.zu) requestAnimationFrame(() => requestAnimationFrame(() => { const z = document.getElementById('kl-teil-' + opt.zu); if (z) window.scrollTo({ top: z.getBoundingClientRect().top + scrollY - 150 }); markiere(); }));
}
/* Was wir gemacht haben: Sales-Unterlagen (wenn es sie gibt) und jede Arbeit im Laptop, ein Klick öffnet sie */
function laptop(src, alt, href) {
  return el('a', { class: 'kl-ue__geraet kl-arb__geraet', href, target: '_blank', rel: 'noopener', 'aria-label': alt + ' öffnen' },
    el('span', { class: 'kl-ue__schirm' }, el('img', { src, alt, loading: 'lazy', decoding: 'async' })),
    el('img', { class: 'kl-ue__haus', src: '/sales-cockpit/zentrale/img/laptop.webp', alt: '', loading: 'lazy', decoding: 'async' }));
}
function oeffnen(href) { return el('a', { class: 'kl-arb__auf', href, target: '_blank', rel: 'noopener', html: '<span>Öffnen</span><i>' + WO.ic('pfeil') + '</i>' }); }
function reiterArbeiten(h, K) {
  const B = K.buehne, teile = [];
  if (B) teile.push(el('section', { class: 'kl-arb__sales kl-breit', 'aria-label': 'Sales-Unterlagen' },
    laptop(B.bild.replace(/\.webp$/, '-900.webp'), B.t.join(''), B.url),
    el('div', { class: 'kl-arb__text' }, el('span', { class: 'kl-ue__k' }, 'Sales-Unterlagen'), el('h3', {}, B.t.join('')), el('p', {}, B.lead),
      el('ul', { class: 'kl-arb__teile' }, ...B.teile.map(t => el('li', {}, el('a', { href: B.url + t[2], target: '_blank', rel: 'noopener' }, el('b', {}, t[1]), el('small', {}, t[0]))))),
      oeffnen(B.url))));
  teile.push(el('div', { class: 'kl-arb kl-breit' }, ...K.arbeiten.map(a => el('article', { class: 'kl-arb__k' },
    el('div', { class: 'kl-arb__buehne' }, laptop('/sales-cockpit/werkzeuge/02-kundenliste/arbeiten/kunde-' + a[4] + '-900.webp', a[1], a[3])),
    el('div', { class: 'kl-arb__text' }, el('span', { class: 'kl-ue__k' }, a[0]), el('h3', {}, a[1]), el('p', {}, a[2]), oeffnen(a[3]))))));
  if ((K.ausserdem || []).length) teile.push(el('div', { class: 'kl-arb__dazu kl-breit' }, el('span', { class: 'kl-ue__k' }, 'Ausserdem'), ...K.ausserdem.map(x => el('span', { class: 'kl-arb__chip' }, x))));
  return teile;
}
// Alle Seiten eines Hauses mit Adresse (Robert 09.11.2026: «Die Seiten müssen … auch noch in die Sales-Folder … und Kundenübersichten»): Website, Werkbank, Werkzeuge, Familienseite
function seitenBlock(h) {
  const a = Array.isArray(h.adressen) ? h.adressen : [];
  if (!a.length && !h.werkbank_stand) return null;
  const zeile = x => el('li', {}, el('a', { href: x.url, target: '_blank', rel: 'noopener' }, el('b', {}, x.name), el('small', {}, x.zu || x.url.replace(/^https?:\/\//, '').replace(/\/(index\.html)?$/, ''))));
  const gr = g => a.filter(x => x.gruppe === g);
  const haupt = gr('Website').concat(gr('Werkbank'), gr('Familie'));
  const wz = gr('Werkzeug');
  return el('section', { class: 'kl-seiten', 'aria-label': 'Alle Seiten' },
    el('span', { class: 'kl-ue__k' }, 'Alle Seiten'),
    el('ul', { class: 'kl-seiten__liste' }, ...haupt.map(zeile),
      !gr('Werkbank').length && h.werkbank_stand ? el('li', { class: 'kl-seiten__bald' }, el('span', {}, el('b', {}, 'Werkbank'), el('small', {}, h.werkbank_stand))) : null),
    wz.length ? el('span', { class: 'kl-ue__k kl-seiten__k2' }, mz(wz.length, 'Werkzeug', 'Werkzeuge')) : null,
    wz.length ? el('ul', { class: 'kl-seiten__liste kl-seiten__liste--wz' }, ...wz.map(zeile)) : null);
}
// Von Anfang bis Ende: jede Station mit Ergebnis und Datum der Unterlage (aus dem Projektordner, echte_kunden.py)
function reiterWeg(h) {
  const st = Array.isArray(h.verlauf_weg) ? h.verlauf_weg : [];
  if (!st.length) return el('section', { class: 'kl-ue__block kl-ue__block--rahmen kl-breit' }, el('span', { class: 'kl-ue__k' }, 'Von Anfang bis Ende'), el('p', { class: 'kl-ue__fein' }, 'Für dieses Haus sind noch keine Schritte hinterlegt.'));
  const fertig = st.filter(x => x.erledigt).length;
  return el('section', { class: 'kl-zeit kl-breit', 'aria-label': 'Schritte der Zusammenarbeit' },
    el('div', { class: 'kl-zeit__kopf' }, el('span', { class: 'kl-ue__k' }, 'Von Anfang bis Ende'), el('b', { class: 'kl-ue__mittel' }, fertig + ' von ' + st.length + ' Schritten erledigt')),
    el('ol', { class: 'kl-zeit__liste' }, ...st.map((x, i) => el('li', { class: x.erledigt ? 'da' : '' },
      el('i', { class: 'kl-zeit__punkt' }, x.erledigt ? el('span', { html: WO.ic('haken') }) : String(i + 1)),
      el('div', { class: 'kl-zeit__t' }, el('b', {}, x.station), el('p', {}, x.erledigt ? (x.ergebnis || 'Erledigt') : 'Noch offen')),
      el('div', { class: 'kl-zeit__r' }, x.datum ? el('small', {}, datumZeigen(x.datum)) : null, x.link ? el('a', { href: x.link, target: '_blank', rel: 'noopener' }, 'Ansehen') : null)))),
    el('p', { class: 'kl-ue__fein kl-zeit__fuss' }, 'Gelesen aus den Unterlagen im Projektordner des Hauses. Das Datum ist der Stand der jeweiligen Unterlage.'));
}
function reiterAngebot(h) {
  const p = h.preis || {}, box = el('section', { class: 'kl-zwei kl-breit' });
  if (h.preis !== null) box.append(el('div', { class: 'kl-ue__block kl-ue__block--rahmen' }, el('span', { class: 'kl-ue__k' }, 'Wo wir preislich stehen'),
    el('b', { class: 'kl-ue__gross kl-dunkel' }, betrag(p) || 'Noch kein Angebot'),
    p.monatlich ? el('p', { class: 'kl-ue__fein' }, 'Monatlich: ' + p.monatlich) : null,
    p.datum_text ? el('p', { class: 'kl-ue__fein' }, 'Stand: ' + p.datum_text) : null,
    p.text ? el('p', { class: 'kl-ue__fein' }, p.text) : null));
  const liste = el('div', { class: 'kl-ue__block kl-ue__block--rahmen' }, el('span', { class: 'kl-ue__k' }, 'Angebote'), el('p', { class: 'kl-ue__fein' }, 'Einen Moment …'));
  box.append(liste);
  fetch('/sales-cockpit/api/05-angebot/angebote', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject()).then(d => {
    const name = h.name.toLowerCase(), a = (d.angebote || d || []).filter(x => String(x.haus_name || x.haus || '').toLowerCase().includes(name));
    liste.replaceChildren(el('span', { class: 'kl-ue__k' }, 'Angebote'),
      a.length ? el('ul', { class: 'kl-ue__notizen' }, ...a.map(x => el('li', {}, el('small', {}, (x.nummer || '') + ' · ' + (x.datum || '')), el('span', {}, x.titel || x.kurz || '')))) : el('p', { class: 'kl-ue__fein' }, 'Im Angebots-Studio liegt noch kein Angebot für dieses Haus.'),
      el('div', { class: 'kl-ue__links' }, el('a', { href: '/sales-cockpit/werkzeuge/05-angebot/?wer=' + encodeURIComponent(wer()), target: '_blank', rel: 'noopener' }, 'Angebot schreiben')));
  }).catch(() => liste.replaceChildren(el('span', { class: 'kl-ue__k' }, 'Angebote'), el('p', { class: 'kl-ue__fein' }, 'Das Angebots-Studio antwortet gerade nicht.')));
  return box;
}
// Besuche auf dem Entwurf: aus dem Besucherzähler (früher eigenes Werkzeug), gefunden über das Kürzel des Hauses
function reiterBesuche(h) {
  const box = el('section', { class: 'kl-ue__block kl-ue__block--rahmen kl-breit' }, el('span', { class: 'kl-ue__k' }, 'Wer hat den Entwurf geöffnet'), el('p', { class: 'kl-ue__fein' }, 'Einen Moment …'));
  fetch('/sales-cockpit/api/03-entwurf-besuche/haeuser', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject()).then(d => {
    const z = (d.zeilen || []).find(x => x.kuerzel === h.kuerzel || (x.name || '').toLowerCase() === h.name.toLowerCase());
    const kopf = el('span', { class: 'kl-ue__k' }, 'Wer hat den Entwurf geöffnet');
    if (!z) { box.replaceChildren(kopf, el('b', { class: 'kl-ue__mittel' }, 'Noch keine Besuche erfasst'), el('p', { class: 'kl-ue__fein' }, d.quelle === 'probe' ? 'Der Besucherzähler ist noch nicht mit den echten Entwürfen verbunden; bis dahin gibt es hier keine Zahlen.' : 'Für den Entwurf dieses Hauses ist noch kein Besuch gezählt.')); return; }
    const l = z.letzter || {};
    box.replaceChildren(kopf, el('b', { class: 'kl-ue__gross kl-dunkel' }, z.geoeffnet ? mz(z.besuche || 0, 'Besuch', 'Besuche') : 'Noch niemand'),
      l.wer ? el('p', { class: 'kl-ue__fein' }, 'Zuletzt ' + (l.tagwort || '') + ' ' + (l.z || '') + ' · ' + (l.wer.name || '') + (l.von ? ', ' + l.von : '') + ' · ' + (l.seiten || 0) + ' Seiten') : null,
      l.weg ? el('ol', { class: 'kl-besuch' }, ...l.weg.map(w => el('li', {}, el('small', {}, w.z), el('span', {}, w.seite)))) : null);
  }).catch(() => box.replaceChildren(el('span', { class: 'kl-ue__k' }, 'Wer hat den Entwurf geöffnet'), el('p', { class: 'kl-ue__fein' }, 'Der Besucherzähler antwortet gerade nicht.')));
  return box;
}
function reiterNotizen(h0) {
  const n = (h0.notizen || []).slice().reverse();
  return el('section', { class: 'kl-ue__block kl-ue__block--rahmen kl-breit' }, el('span', { class: 'kl-ue__k' }, mz(n.length, 'Notiz', 'Notizen')),
    n.length ? el('ul', { class: 'kl-ue__notizen' }, ...n.map(x => el('li', {}, el('small', {}, zeit(x.wann) + ' · ' + (x.wer || '')), el('span', {}, x.text)))) : el('p', { class: 'kl-ue__fein' }, 'Noch keine Notiz.'),
    el('div', { class: 'kl-ue__links' }, el('button', { type: 'button', onclick: () => notizFenster(h0) }, 'Notiz schreiben')));
}

// ---------------------------------------------------------------- Fenster: Neues Haus, Notiz, Löschen
function neuesHaus() {
  const name = el('input', { type: 'text', id: 'kl-neu-name', autocomplete: 'off', placeholder: 'zum Beispiel: Hotel Sonne', 'data-ws-feld': 'name' });
  const ort = el('input', { type: 'text', id: 'kl-neu-ort', autocomplete: 'off', placeholder: 'zum Beispiel: Hamburg', 'data-ws-feld': 'ort' });
  const schritt = el('input', { type: 'text', id: 'kl-neu-schritt', autocomplete: 'off', placeholder: 'zum Beispiel: Website ansehen', 'data-ws-feld': 'schritt' });
  let art = 'Hotel', stand = 'gefunden', datum = '';
  const warn = el('p', { class: 'ws-ang__warn', role: 'alert', hidden: true });
  const inhalt = el('div', { class: 'ws-form', 'data-ws-form': 'neu' },
    el('p', { class: 'ws-klein' }, 'Name genügt. Ort, Ansprechpartner, Website und Entwurf lassen sich danach im Haus nachtragen.'),
    el('div', { class: 'feld' }, el('label', { for: name.id }, 'Name des Hauses'), name, warn),
    el('div', { class: 'feld' }, el('label', { for: ort.id }, 'Ort'), ort),
    el('div', { class: 'feld' }, el('span', {}, 'Art'), wahl2([{ wert: 'Hotel', text: 'Hotel' }, { wert: 'Restaurant', text: 'Restaurant' }], art, x => { art = x; }, 'Art', true)),
    el('div', { class: 'feld' }, el('span', {}, 'Stand'), auswahl(STAENDE.map(x => ({ wert: x, text: x })), stand, x => { stand = x; }, 'Stand')),
    el('div', { class: 'feld' }, el('label', { for: schritt.id }, 'Nächster Schritt'), schritt),
    el('div', { class: 'feld' }, el('span', {}, 'Bis wann'), datumWahl('', x => { datum = x; })));
  fenster('Neues', 'Haus.', inhalt, [{ text: 'Abbrechen' }, { text: 'Anlegen', haupt: true, attrs: { 'data-kl-anlegen': '1' }, tun: async zu => {
    if (!name.value.trim()) { warn.hidden = false; warn.textContent = 'Ein Haus braucht einen Namen.'; name.focus(); return; }
    let a;
    try { a = await ruf('POST', X('haeuser'), { name: name.value.trim(), ort: ort.value.trim(), art, stand, naechster_schritt: { text: schritt.value.trim(), datum } }); } catch (e) { return fehler(e); }
    zu();
    await neuLaden();
    quittung('Angelegt', [{ was: 'Neues Haus', wo: a.haus.name, vorher: '', nachher: a.haus.name + (a.haus.ort ? ', ' + a.haus.ort : '') + ' · ' + a.haus.stand }], { weg: a.haus.id }, 'haus:' + a.haus.id);
  } }], { name: 'neu' });
}
function notizFenster(h) {
  const t = el('textarea', { id: 'kl-notiz', rows: 5, placeholder: 'Was wurde besprochen? Wer hat angerufen?', 'data-ws-feld': 'notiz' });
  const inhalt = el('div', { class: 'ws-form', 'data-ws-form': 'notiz' }, el('p', { class: 'ws-klein' }, h.name + '. Die Notiz steht mit deinem Namen (' + wer() + ') und der Zeit im Haus.'),
    el('div', { class: 'feld' }, el('label', { for: t.id }, 'Notiz'), t));
  fenster('Notiz', 'schreiben.', inhalt, [{ text: 'Abbrechen' }, { text: 'Speichern', haupt: true, attrs: { 'data-kl-notiz-speichern': '1' }, tun: async zu => {
    if (!t.value.trim()) { t.focus(); return; }
    let a;
    try { a = await ruf('POST', X('haeuser/' + encodeURIComponent(h.id) + '/notiz'), { text: t.value.trim() }); } catch (e) { return fehler(e); }
    zu();
    Z.gesp = Date.now() + 6000; setTimeout(leiste, 6100);
    await neuLaden();
    quittung('Notiz gespeichert', [{ was: 'Notiz', wo: h.name, vorher: '', nachher: t.value.trim() }], { haeuser: [a.vorher] }, Z.ansicht !== 'haus:' + h.id ? 'haus:' + h.id : null);
  } }], { name: 'notiz' });
}
function loeschen(h) {
  const inhalt = el('div', { class: 'ws-form', 'data-ws-form': 'loeschen' },
    el('p', {}, anf(h.name) + ' mit ' + mz((h.notizen || []).length, 'Notiz', 'Notizen') + ' und dem ganzen Verlauf wird aus der Liste genommen.'),
    el('p', { class: 'ws-klein' }, 'Die Quittung danach hat «Rückgängig». Soll es nur ruhen: Stand «abgesagt» statt löschen.'));
  fenster('Haus', 'löschen?', inhalt, [{ text: 'Behalten' }, { text: 'Löschen', haupt: true, attrs: { 'data-kl-loeschen': '1' }, tun: async zu => {
    let a;
    try { a = await ruf('DELETE', X('haeuser/' + encodeURIComponent(h.id)), {}); } catch (e) { return fehler(e); }
    zu();
    Object.keys(Z.offen).filter(k => k.startsWith(h.id + '|')).forEach(k => delete Z.offen[k]);
    Z.ansicht = 'liste';
    await neuLaden();
    quittung('Gelöscht', [{ was: 'Haus', wo: h.name, vorher: h.name + ' · ' + h.stand, nachher: '' }], { haeuser: [a.vorher] });
  } }], { name: 'loeschen' });
}

// ---------------------------------------------------------------- Frühere Änderungen: der Verlauf aller Häuser (wie «Frühere Fassungen» der Vorlage)
function zeichneVerlauf() {
  const m = leere($('#ws-mitte'));
  const alle = [];
  haeuser().forEach(h => (h.verlauf || []).forEach(v => alle.push(Object.assign({ haus: h }, v))));
  haeuser().forEach(h => (h.notizen || []).forEach(n => alle.push({ haus: h, wann: n.wann, wer: n.wer, was: 'Notiz: ' + kurz(n.text, 120) })));
  alle.sort((a, b) => (b.wann || '').localeCompare(a.wann || ''));
  m.append(titel('Bestand', 'Frühere', 'Änderungen.', 'Jede Änderung und jede Notiz, mit Name und Zeit, die neueste zuerst. Ein Klick öffnet das Haus. Zurücknehmen geht mit der Quittung gleich nach dem Speichern.', []));
  if (!alle.length) { m.append(el('p', { class: 'kuhle ws-leer' }, 'Noch keine Änderung. Sobald etwas gespeichert ist, steht es hier.')); return; }
  const tage = {};
  alle.slice(0, 120).forEach(v => { const t = (v.wann || '').slice(0, 10); (tage[t] = tage[t] || []).push(v); });
  Object.entries(tage).forEach(([t, l]) => m.append(el('section', { class: 'platte ws-karte', 'data-kl-tag': t },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, langDatum(t) || 'ohne Datum'), mono(mz(l.length, 'Eintrag', 'Einträge'))),
    l.map(v => el('div', { class: 'cu-vl__z' }, el('b', {}, (zeit(v.wann).split(', ')[1] || '').replace(' Uhr', '') || '–'),
      el('p', {}, el('button', { class: 'ws-link', type: 'button', onclick: () => geh('haus:' + v.haus.id) }, v.haus.name), ': ' + v.was), mono(v.wer || ''))))));
}

// ---------------------------------------------------------------- Bestand: echte Häuser übernehmen, Probedaten
function zeichneBestand() {
  const m = leere($('#ws-mitte')), hs = haeuser(), probe = hs.filter(h => h.probe).length;
  m.append(titel('Bestand', 'Echte Häuser', 'übernehmen.', 'Einmal aus den Unterlagen von Tasty Studios: Projektliste, verschickte Briefe und Projekte. Ein Stand wird nur gesetzt, wo er belegt ist; sonst steht «offen». Nichts wird geraten.',
    [woKn('Echte Häuser übernehmen', 'kopie', 'gold', importieren, { 'data-kl-import': '1' })]));
  m.append(el('section', { class: 'platte ws-karte', 'data-kl-bestand': '1' },
    el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Was gerade in der Liste steht'), mono(Z.d.quelle === 'probedaten' ? 'Probedaten' : 'eigene Daten')),
    el('p', {}, mz(hs.length, 'Haus', 'Häuser') + (probe ? ', davon ' + mz(probe, 'erfundenes Probehaus', 'erfundene Probehäuser') + ' zum Ausprobieren' : '') + '.'),
    el('p', { class: 'ws-klein' }, 'Beim Übernehmen fallen die Probehäuser weg; was von Hand angelegt ist, bleibt. Danach zeigt ein Bericht, was übernommen ist und was die Unterlagen nicht hergeben.')),
    el('section', { class: 'platte ws-karte', id: 'kl-bericht', hidden: true }),
    el('section', { class: 'platte ws-karte' },
      el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Probedaten laden'), mono('ersetzt die ganze Liste')),
      el('p', {}, 'Zehn erfundene, glaubwürdige Häuser, damit sich alles gefahrlos ausprobieren lässt. Die jetzige Liste lässt sich mit der Quittung zurückholen.'),
      el('div', { class: 'ws-reihe', style: 'padding-top:12px' }, taste('Probedaten laden …', probedaten))));
}
async function importieren() {
  let a;
  try { a = await ruf('POST', X('import'), {}); } catch (e) { return fehler(e); }
  await neuLaden();
  if (Z.ansicht !== 'bestand') await geh('bestand');
  const b = $('#kl-bericht');
  if (b) { b.hidden = false; leere(b).append(el('div', { class: 'ws-karte__kopf' }, el('b', {}, 'Bericht'), mono(mz(a.neu, 'Haus neu', 'Häuser neu'))), el('div', { class: 'ws-liste-klein' }, (a.bericht || []).map(t => el('p', {}, t)))); }
  quittung('Übernommen', [{ was: 'Bestand', wo: 'Kundenliste', vorher: mz(a.vorher_alle.length, 'Haus', 'Häuser'), nachher: mz(haeuser().length, 'Haus', 'Häuser') }], { alle: a.vorher_alle, quelle: a.vorher_quelle });
}
function probedaten() {
  fenster('Probedaten', 'laden?', el('div', { class: 'ws-form' }, el('p', {}, 'Die Liste wird durch zehn erfundene Häuser ersetzt. Mit «Rückgängig» in der Quittung kommt die jetzige Liste zurück.')),
    [{ text: 'Abbrechen' }, { text: 'Laden', haupt: true, attrs: { 'data-kl-probe': '1' }, tun: async zu => {
      let a;
      try { a = await ruf('POST', X('probedaten'), {}); } catch (e) { return fehler(e); }
      zu(); Z.offen = {};
      await neuLaden();
      quittung('Probedaten geladen', [{ was: 'Bestand', wo: 'Kundenliste', vorher: mz(a.vorher_alle.length, 'Haus', 'Häuser'), nachher: mz(a.anzahl, 'Probehaus', 'Probehäuser') }], { alle: a.vorher_alle, quelle: a.vorher_quelle });
    } }], { name: 'probedaten' });
}

// ---------------------------------------------------------------- Zeichnen und Start (wie in der Vorlage)
async function zeichne(opt = {}) {
  const lauf = ++Z.zl, a = Z.ansicht, m = $('#ws-mitte');
  m.removeAttribute('data-ws-bereit');
  m.setAttribute('data-ws-ansicht', a);
  try {
    if (a === 'start') zeichneStart();
    else if (a === 'liste') zeichneListe(null, titel('Die Häuser', 'Alle', 'Häuser.', 'Jedes Hotel und Restaurant mit Stand und nächstem Schritt. Suchen, nach Stand oder Fälligkeit filtern, sortieren. Den Stand gleich hier ändern; er wartet gelb, bis du speicherst.', [knNeu(), knBrett()]));
    else if (a === 'brett') zeichneBrett();
    else if (a === 'heute') zeichneListe({ faellig: 'faellig', stand: 'alle' }, titel('Heute', 'Heute', 'fällig.', 'Was heute ansteht oder überfällig ist, das Älteste zuerst. Dieselben Punkte stehen in der Zentrale unter «Heute».', [knNeu()]));
    else if (a.startsWith('stand:')) { const s = a.slice(6); zeichneListe({ stand: s }, titel('Nach Stand', s.charAt(0).toUpperCase() + s.slice(1), '', STAND_INFO[s] ? STAND_INFO[s][0] : '', [knNeu(), knBrett()], 'buehne', foto((STAND_INFO[s] || [])[1]))); }
    else if (a.startsWith('haus:')) { if (Z.reiterHaus !== a) { Z.reiter = 'ueberblick'; Z.reiterHaus = a; } zeichneUeberblick(a.slice(5), opt); }
    else if (a.startsWith('pflege:')) zeichneHaus(a.slice(7), opt);
    else if (a === 'verlauf') zeichneVerlauf();
    else if (a === 'bestand') zeichneBestand();
  } catch (e) { fehler(e); }
  if (lauf === Z.zl) m.setAttribute('data-ws-bereit', a);
}
function startFehler(e) {
  const text = (e && e.fehler) || (e && e.message) || String(e);
  merke('Start: ' + text, e && e.stichwort);
  $('#ws-rand').hidden = true;
  $('#ws-kopf').innerHTML = WO.kopf({ werkzeug: W, unter: 'Kunden', titel: 'Startet nicht', stand: 'Prüfung öffnen', pruefung: pruefLink(e && e.stichwort), website: (H.wege || {}).website || '/' });
  leere($('#ws-leiste')).innerHTML = WO.leiste({ titel: 'Das Werkzeug startet nicht', satz: 'Nichts ist verloren: die Liste liegt auf dem Server.', knoepfe: WO.knopf('Speichern', 'pfeil', 'glas', { id: 'ws-speichern', klein: true, disabled: true }) });
  leere($('#ws-mitte')).append(el('div', { class: 'platte ws-karte ws-form', style: 'max-width:640px;margin-top:40px', 'data-ws-startfehler': (e && e.stichwort) || 'unerwartet' },
    mono('Das Werkzeug startet nicht'), el('h2', {}, text),
    el('p', {}, 'Die Prüfung läuft unabhängig vom Werkzeug und sagt, woran es liegt.'),
    el('div', { class: 'ws-reihe' }, el('a', { class: 'kn kn--d kn--klein', href: pruefLink(e && e.stichwort) }, el('span', {}, 'Prüfung öffnen'), el('i', { 'aria-hidden': 'true', html: PF })), taste('Noch einmal versuchen', () => location.reload()))));
}
async function start() {
  window.addEventListener('beforeunload', ev => { if (offenZahl()) { ev.preventDefault(); ev.returnValue = ''; } });
  window.addEventListener('error', ev => merke(ev.message || 'Fehler im Werkzeug', 'unerwartet'));
  window.addEventListener('unhandledrejection', ev => merke((ev.reason && (ev.reason.fehler || ev.reason.message)) || 'Fehler im Werkzeug', (ev.reason && ev.reason.stichwort) || 'unerwartet'));
  document.addEventListener('keydown', ev => { if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 's' && Z.d) { ev.preventDefault(); speichern(); } });
  document.documentElement.setAttribute('data-haus', 'tasty');
  try {
    Z.d = await ruf('GET', X('haeuser'));
    if (Array.isArray(Z.d.staende) && Z.d.staende.length) STAENDE.splice(0, STAENDE.length, ...Z.d.staende);
    letzteAenderung();
    const q = new URLSearchParams(location.search);
    let a = q.get('ansicht');
    if (q.get('haus') && haus(q.get('haus'))) a = 'haus:' + q.get('haus');   // Direktlink aus «Heute» der Zentrale
    if (!a && !q.has('rundgang')) { try { a = localStorage.getItem('kl-ort'); } catch (e) { /* ohne Merken */ } }
    if (a && (ansichtName(a) || a === 'start')) Z.ansicht = a;
    allesNeu();
    await zeichne({});
  } catch (e) { startFehler(e); }
}
window.KL = { geh, zustand: () => Z };   // für Rundgang und Prüflauf
start();
})();
