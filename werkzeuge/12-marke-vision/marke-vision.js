/* Marke & Vision · Tasty Studios (Neubau im Kleid, 07.11.2026). Umbau von Le Livre des Culinarium (vorlage/culinarium-demo/werkzeuge/livre/, livre.js):
   gleicher Aufbau (Kopf, Rand, Startbild mit Gruss, Lage mit drei Fächern, Kacheln mit Foto, Ansichten je Bereich, Leiste, Fenster, Meldung, Auftritte),
   statt Bildarchiv und Dateien erzählt Tasty Studios sich selbst in neun Kapiteln nach Roberts Gliederung (kapitel.js): Auftakt = Übersicht, 2 bis 7 = Kapitel, 8 = Annas Fragen, dazu Annas Fragen an Robert (api.py, Ablage daten/12-marke-vision/).
   Kleid aus /zentrale/oberflaeche/ (nie ändern). Jede Änderung zeigt eine Quittung mit vorher und nachher und «Rückgängig»; Löschen nur nach Rückfrage. */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ZU = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 9.67 2.67 6.33 6 3M2.67 6.33h7.33a3.33 3.33 0 0 1 0 6.67h-2"/></svg>';   // wie Le Livre: kein «×», der Zurück-Pfeil
const ORDNER = '12-marke-vision', API = '/sales-cockpit/api/' + ORDNER + '/';
const H = window.WO_HAUS || {};
/* Das Kleid kennt Werkzeug 12 noch nicht (namen und fotoJe enden bei 11): hier nur für diese Seite ergänzt, das Kleid bleibt unverändert (siehe UEBERGABE.md) */
if (H.namen && !H.namen[ORDNER]) H.namen[ORDNER] = 'Marke & Vision';
const NAME = (H.namen && H.namen[ORDNER]) || 'Marke & Vision';
const KAP = window.MV_KAPITEL || [], Q = window.MV_QUELLEN || {}, RA = window.MV_RAHMEN || { auftakt: { titel: 'Auftakt' }, fragen: { titel: 'Annas Fragen' } };
const GESAMT = KAP.length + 2;   // Auftakt + Kapitel + Annas Fragen
const FOTO = k => (H.fotos && H.fotos[k]) || H.foto;
/* Bild eines Bausteins: bild = echtes Haus (haeuser/), foto = Foto der Agentur-Seite aus dem Kleid */
const BILD = b => b.bild ? 'haeuser/' + b.bild + '.webp' : FOTO(b.foto);
const WEBSITE = (H.wege && H.wege.website) || 'https://tastystudios.vercel.app/';
const MARKENBUCH = (H.wege && H.wege['11-markenbuch']) || '/sales-cockpit/werkzeuge/11-markenbuch/';
const zahl = n => Number(n).toLocaleString('de-DE');
const datum = s => { const m = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d:\d\d))?/.exec(s || ''); return m ? `${+m[3]}.${+m[2]}.${m[1]}${m[4] ? ', ' + m[4] : ''}` : ''; };

/* ---------------------------------------------------------------- Zustand */
const S = { ansicht: 'start', fragen: [], probe: false, server: null, kapitelNamen: {} };
const ANSICHTEN = ['start', ...KAP.map(k => k.k), 'fragen'];
const kapVon = k => KAP.find(x => x.k === k);
const kapName = k => (kapVon(k) || {}).titel || (k === 'auftakt' ? RA.auftakt.titel : '') || S.kapitelNamen[k] || 'Allgemein';
const kapZiel = k => kapVon(k) ? k : k === 'auftakt' ? 'start' : 'fragen';
const GRUPPEN = [['warum', 'Warum'], ['wie', 'Woran man uns erkennt'], ['wohin', 'Wohin']];
const offen = () => S.fragen.filter(f => !f.antwort);
const WER = () => H.wer || 'Robert';

/* ---------------------------------------------------------------- Grundgerüst: Kopf, Rand, Leiste aus dem Paket */
function kopf() {
  const k = kapVon(S.ansicht);
  const titel = S.ansicht === 'start' ? RA.auftakt.titel : S.ansicht === 'fragen' ? RA.fragen.titel : k.titel;
  const o = offen().length;
  const st = `${GESAMT} Kapitel · ${o === 1 ? 'eine Frage offen' : (o ? zahl(o) : 'keine') + ' Fragen offen'}`;
  $('#kopf').innerHTML = WO.kopf({ werkzeug: ORDNER, unter: 'Marke', titel, stand: st, anleitung: 'anleitung.html', pruefung: 'pruefung.html', website: WEBSITE, marke: 'data-gehe="start"', markeHref: '#start' });
  $$('#kopf [data-gehe]').forEach(x => x.onclick = e => { e.preventDefault(); gehe(x.dataset.gehe); });
}
function rand() {
  const e = (key, text, z = '') => ({ text, zahl: z, an: S.ansicht === key, attr: `data-gehe="${key}"` });
  const o = offen().length;
  $('#rand').innerHTML = WO.rand([
    { eintraege: [e('start', RA.auftakt.titel)] },
    ...GRUPPEN.map(([g, t]) => ({ titel: t, eintraege: KAP.filter(k => k.gruppe === g).map(k => e(k.k, k.titel)).concat(g === 'wohin' ? [e('fragen', RA.fragen.titel, o ? zahl(o) : '')] : []) }))
  ], { website: WEBSITE, anleitung: 'anleitung.html', pruefung: 'pruefung.html' });
  $('#rand .wo-rand__wege').insertAdjacentHTML('afterbegin', `<a href="${H.wege && H.wege.zentrale || '/'}">${esc(WO.name('zentrale'))}${WO.ic('haus')}</a><a href="${MARKENBUCH}">${esc((H.namen && H.namen['11-markenbuch']) || 'Markenbuch')}${WO.ic('pfeil')}</a>`);
  /* Der Rand steht ab dem ersten Bild still wie in Le Livre: bewegung.js des Kleids lässt die Einträge sonst hochschweben, dabei lagen sie kurz über den Gruppentiteln. */
  $$('#rand .wo-re, #rand .wo-zw, #rand h2, #rand h3').forEach(x => x.setAttribute('data-wo-bw-nie', ''));
  $$('#rand [data-gehe]').forEach(b => b.onclick = () => gehe(b.dataset.gehe));
  if (window.MV_RUNDGANG_WEG) window.MV_RUNDGANG_WEG();
}
function leiste() {
  const k = kapVon(S.ansicht), o = offen().length, b = S.fragen.length - o;
  const titel = k ? `Frage zu «${k.titel}»` : S.ansicht === 'start' ? 'Frage zum Auftakt' : S.ansicht === 'fragen' ? `${o === 1 ? 'Eine' : o ? zahl(o) : 'Keine'} offen · ${b === 1 ? 'eine' : b ? zahl(b) : 'keine'} beantwortet` : 'Fragen an Robert';
  const satz = S.server === false ? 'Ohne den Server lassen sich keine Fragen speichern. Gezeigt werden die Beispiele.'
    : WER() === 'Anna' ? 'Was unklar ist, hier hinterlassen. Robert sieht es im Kapitel «Annas Fragen» und antwortet hier.'
    : 'Annas offene Fragen stehen im Kapitel «Annas Fragen», dort wird auch geantwortet.';
  $('#leiste').innerHTML = WO.leiste({ titel, satz, knoepfe: (S.ansicht !== 'fragen' ? WO.knopf('Alle Fragen', 'chat', 'glas', { klein: true, attr: 'data-gehe="fragen"' }) : '') + WO.knopf('Frage stellen', 'plus', 'gold', { klein: true, attr: 'data-neu' }) });
  $$('#leiste [data-gehe]').forEach(x => x.onclick = () => gehe(x.dataset.gehe));
  $$('#leiste [data-neu]').forEach(x => x.onclick = () => frageFenster(null, k ? k.k : S.ansicht === 'start' ? 'auftakt' : ''));
}

function gehe(a, still = false) {
  S.ansicht = a;
  try { localStorage.setItem('tasty-mv-ansicht', a); } catch (e) { /* privat */ }
  history.replaceState(null, '', location.pathname + location.search + '#' + a);
  kopf(); rand(); leiste(); zeichne(still);
  scrollTo({ top: 0 });
}

function zeichne(still = false) {
  const el = $('#ansicht'), a = S.ansicht;
  el.innerHTML = a === 'start' ? start() : a === 'fragen' ? fragenAnsicht() : kapitel(kapVon(a));
  $$('#ansicht [data-gehe]').forEach(b => b.onclick = e => { e.preventDefault(); gehe(b.dataset.gehe); });
  $$('#ansicht [data-neu]').forEach(b => b.onclick = () => frageFenster(null, b.dataset.neu || ''));
  if (a === 'fragen') fragenLeben();
  werkzeugLeben(el);
  auftritte(el, still);
}

/* Werkzeug-Abschnitte: Klick auf eine Funktion zeigt ihren Bildschirm; am Rechner wählt auch das Scrollen durch die Liste die Funktion in der Mitte.
   «Film ansehen» spielt die Bedienung im Laptop, «Bilder» führt zurück. Es läuft immer nur ein Film. */
function werkzeugLeben(r) {
  const alle = $$('[data-wz]', r); if (!alle.length) return;
  const filme = () => $$('[data-wz] video', r);
  alle.forEach(sec => {
    const fs = $$('.mv-wz__f', sec), imgs = $$('.mv-geraet__schirm img', sec), vid = $('video', sec), was = $('.mv-wz__was', sec), kn = $('[data-wz-film]', sec);
    const knText = t => { const s = kn && kn.querySelector('span'); if (s) s.textContent = t; };
    const filmAus = () => { if (!sec.classList.contains('film')) return; sec.classList.remove('film'); vid.pause(); knText('Film ansehen'); const f = $('.mv-wz__f.an', sec); if (f) was.textContent = f.querySelector('b').textContent; };
    const waehle = (i, vonScroll) => {
      const f = fs[i]; if (!f) return; if (!vonScroll) filmAus(); else if (sec.classList.contains('film')) return;
      fs.forEach(x => x.classList.toggle('an', x === f)); was.textContent = f.querySelector('b').textContent;
      const b = f.dataset.bild; if (b) imgs.forEach(im => im.classList.toggle('an', im.dataset.b === b));
    };
    const hof = $('.mv-wz__hof', sec), schmal = () => !matchMedia('(min-width: 1000px)').matches;
    const zeigeHof = () => { if (schmal()) { const r = hof.getBoundingClientRect(); if (r.top < 70 || r.bottom > innerHeight - 90) hof.scrollIntoView({ behavior: RUHIG() ? 'auto' : 'smooth', block: 'center' }); } };
    fs.forEach((f, i) => f.onclick = () => { waehle(i); zeigeHof(); });
    /* Klick auf den Bildschirm: die Aufnahme gross in einem neuen Fenster */
    $('.mv-geraet__schirm', sec).onclick = () => { if (sec.classList.contains('film')) return; const im = $('.mv-geraet__schirm img.an', sec); if (im) open(im.src, '_blank', 'noopener'); };
    if (kn) kn.onclick = e => { e.preventDefault();
      if (sec.classList.contains('film')) { filmAus(); return; }
      filme().forEach(v => { if (v !== vid) { v.pause(); v.closest('[data-wz]').classList.remove('film'); const k2 = v.closest('[data-wz]').querySelector('[data-wz-film] span'); if (k2) k2.textContent = 'Film ansehen'; } });
      if (!vid.src) vid.src = vid.dataset.film;
      sec.classList.add('film'); knText('Bilder'); was.textContent = 'Der Film: so wird es bedient'; vid.currentTime = 0; vid.play().catch(() => {}); zeigeHof(); };
    if ('IntersectionObserver' in window && matchMedia('(min-width: 1000px)').matches) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) waehle(fs.indexOf(e.target), true); }), { rootMargin: '-48% 0px -48% 0px' });
      fs.forEach(f => io.observe(f));
    }
    /* der Film hält an, sobald der Abschnitt aus dem Bild ist */
    if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting && sec.classList.contains('film')) vid.pause(); else if (e.isIntersecting && sec.classList.contains('film')) vid.play().catch(() => {}); })).observe(sec);
  });
}

/* Auftritte wie Le Livre (R17): federnd, sobald im Bild, nur transform; deckend ab dem ersten Bild; was beim Scrollen nachkommt, steht sofort.
   Ausnahme hier: die grossen Fotos (Fenster) und die Kapitel-Titel kommen erst, wenn man hinscrollt, mit derselben Feder (Le Livre buch.js). */
let IO = null;
const RUHIG = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function auftritte(r, still) {
  const alle = $$('[data-r]', r).filter(x => !x.classList.contains('da'));
  if (IO) IO.disconnect();
  if (still || RUHIG()) { alle.forEach(x => x.classList.add('da', 'steht')); return; }
  const H0 = innerHeight; let n = 0;
  IO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { IO.unobserve(e.target); e.target.classList.add('da'); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
  alle.forEach(x => {
    const b = x.getBoundingClientRect();
    if (b.top < H0 && b.bottom > 0 && n < 22) { x.style.setProperty('--i', Math.min(n++, 6)); requestAnimationFrame(() => requestAnimationFrame(() => x.classList.add('da'))); }
    else if (IO && x.hasAttribute('data-spaet')) IO.observe(x);
    else x.classList.add('da', 'steht');
  });
}

/* ---------------------------------------------------------------- Übersicht */
function gruss() { const g = WO.gruss().replace(/\.$/, ''); return `${g}, ${WER()}.`; }
function start() {
  const o = offen().length;
  const lg = (ic, mk, b, p, ziel) => `<div class="wo-lg"><i class="wo-lg__z">${WO.ic(ic)}</i><span class="wo-mk">${esc(mk)}</span><b>${b}</b><p>${esc(p)}</p><a class="wo-lk" href="#${ziel}" data-gehe="${ziel}">Öffnen</a></div>`;
  const ag = (k, i) => `<button type="button" data-gehe="${k.k}" class="wo-ag" data-r style="--i:${i}">
      <span class="wo-ag__b"><img src="${esc(FOTO(k.foto))}" alt="" ${i > 2 ? 'loading="lazy" ' : ''}decoding="async"></span><span class="wo-ag__t"><i class="wo-ag__z">${WO.ic(k.k === 'fragen' ? 'chat' : i < 3 ? 'buch' : 'pfeil')}</i><b>${esc(k.titel)}</b><span>${esc(k.kurz).replace(/ (\S+)$/, '&nbsp;$1')}</span></span></button>`;
  const erste = KAP[0], warum = KAP.filter(k => k.gruppe === 'warum');
  const rest = KAP.filter(k => k.gruppe !== 'warum').concat([{ k: 'fragen', titel: RA.fragen.titel, kurz: RA.fragen.kurz, foto: RA.fragen.foto }]);
  return `${WO.startbild({ werkzeug: ORDNER, art: 'voll', h1: `${esc(gruss())} <em>Das ist Tasty Studios.</em>`, zier: esc(`Kapitel 1 von ${GESAMT} · ${RA.auftakt.titel}`),
      satz: 'Tasty Studios ist ein Digital Hospitality Studio: Wir bauen für unabhängige Hotels und Restaurants die Website und das System dahinter. Hier steht in neun Kapiteln, warum es uns gibt, woran man uns erkennt und wohin es geht. Zu jedem Kapitel kannst du Robert eine Frage hinterlassen.',
      knoepfe: WO.knopf('Lesen', 'rechts', 'gold', { attr: `data-gehe="${erste.k}"` }) + WO.knopf('Anleitung', 'buch', 'glas', { href: 'anleitung.html', neu: true }) })}
    <div class="wo-lage" data-r>
      ${lg('buch', 'Kapitel', zahl(GESAMT), 'Vom Auftakt bis zu deinen Fragen. Jedes Kapitel zeigt echte Häuser als Beleg und nennt unten seine Quelle.', erste.k)}
      ${lg('pfeil', 'Fahrplan', 'Ende 2027', 'Was heute steht, was bis Ende 2027 passieren soll und was wir bewusst nicht machen.', 'wohin')}
      ${lg('chat', RA.fragen.titel, o ? zahl(o) + ' offen' : 'keine offen', `${zahl(S.fragen.length - o)} beantwortet. Robert sieht neue Fragen in der Zentrale.`, 'fragen')}
    </div>
    <div class="mv-satz" data-r data-spaet><p>Tasty Studios is a Digital Hospitality Studio.</p><small>Robert, 10.10.2026</small></div>
    <h2 class="wo-zw">Warum <em>es uns gibt</em></h2>
    <div class="wo-aufg li-aufg mv-aufg">${warum.map(ag).join('')}</div>
    <h2 class="wo-zw">Woran man uns erkennt <em>und wohin es geht</em></h2>
    <div class="wo-aufg li-aufg mv-aufg mv-aufg--4">${rest.map((k, i) => ag(k, i + 3)).join('')}</div>`;
}

/* ---------------------------------------------------------------- Kapitel */
const zwei = t => `${esc(t[0])} <em>${esc(t[1] || '')}</em>`;
const kopfBlock = (b, satzKl = 'mv-lead') => `<header class="mv-kopf" data-r data-spaet><h2 class="mv-t">${zwei(b.t)}</h2>${b.lead ? `<p class="${satzKl}">${esc(b.lead)}</p>` : ''}${b.hinweis ? `<p class="mv-hinweis">${esc(b.hinweis)}: so im Strategiepapier, noch nicht entschieden.</p>` : ''}</header>`;
const BAU = {
  mk: b => `<section class="mv-mk" data-r data-spaet><h2 class="mv-t mv-t--gross">${zwei(b.t)}</h2><p class="mv-lead">${esc(b.lead)}</p></section>`,
  fenster: b => `<figure class="mv-fenster${b.unten ? ' mv-fenster--unten' : ''}" data-r data-spaet><img src="${esc(BILD(b))}" alt="" loading="lazy" decoding="async"><figcaption><p class="mv-fenster__s">${esc(b.s)}</p>${b.u ? `<p class="mv-fenster__u">${esc(b.u)}</p>` : ''}${b.von ? `<small>${esc(b.von)}</small>` : ''}</figcaption></figure>`,
  /* Beleg: ein echtes Haus zeigt, was das Kapitel sagt. Mit Bild (Culinarium) oder, wo es kein Bild gibt, nur mit Text. */
  beleg: b => `<figure class="mv-beleg${b.rechts ? ' mv-beleg--rechts' : ''}${b.bild || b.foto ? '' : ' mv-beleg--text'}" data-r data-spaet>${b.bild || b.foto ? `<span class="mv-beleg__b"><img src="${esc(BILD(b))}" alt="" loading="lazy" decoding="async"></span>` : ''}
      <figcaption><span class="wo-mk">Am Haus · ${esc(b.haus)}</span><b>${esc(b.b)}</b><p>${esc(b.p)}</p>${b.von ? `<small>${esc(b.von)}</small>` : ''}</figcaption></figure>`,
  /* Vorher und nachher an einem echten Haus: je Paar links vorher, rechts nachher */
  vh: b => `<section class="mv-block">${kopfBlock(b)}<div class="mv-vh">${b.paare.map(([alt, neu, was], i) => `<figure class="mv-vh__paar" data-r data-spaet style="--i:${i}">
      <span class="mv-vh__b mv-vh__b--alt"><img src="haeuser/${esc(alt)}.webp" alt="${esc(was)}, vorher" loading="lazy" decoding="async"><em>Vorher</em></span>
      <span class="mv-vh__b"><img src="haeuser/${esc(neu)}.webp" alt="${esc(was)}, nachher" loading="lazy" decoding="async"><em>Nachher</em></span>
      <figcaption><span class="wo-mk">${esc(b.haus)}</span><b>${esc(was)}</b></figcaption></figure>`).join('')}</div></section>`,
  /* Reihe von Bildern eines Hauses (Abendfotos, Werkzeuge, Werkbank) */
  bilder: b => `<section class="mv-block">${kopfBlock(b)}<div class="mv-bilder${b.klein ? ' mv-bilder--klein' : ''}${b.geraet ? ' mv-bilder--geraet' : ''}">${b.bilder.map(([f, n, u], i) => `<figure data-r data-spaet style="--i:${i % 4}">${b.geraet ? `<span class="mv-geraet"><span class="mv-geraet__schirm"><img src="haeuser/${esc(f)}.webp" alt="${esc(n)}" loading="lazy" decoding="async"></span><img class="mv-geraet__haus" src="/sales-cockpit/zentrale/img/laptop.webp" alt="" loading="lazy" decoding="async"></span>` : `<span><img src="haeuser/${esc(f)}.webp" alt="${esc(n)}" loading="lazy" decoding="async"></span>`}<figcaption><b>${esc(n)}</b>${u ? `<small>${esc(u)}</small>` : ''}</figcaption></figure>`).join('')}</div><p class="mv-bilder__haus">${esc(b.haus)}</p></section>`,
  karten: b => `<section class="mv-block">${kopfBlock(b)}<div class="mv-karten">${b.karten.map((c, i) => `<article class="mv-karte" data-r data-spaet style="--i:${i}"><span class="wo-mk">${esc(c.m)}</span><b>${esc(c.b)}</b><p>${esc(c.p)}</p></article>`).join('')}</div></section>`,
  reihen: b => `<section class="mv-block">${kopfBlock(b)}<dl class="mv-reihen" data-r data-spaet>${b.reihen.map(r => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl></section>`,
  /* Ein Werkzeug Funktion für Funktion (Robert 08.11.2026: «keine Bilder, Beispielscreenshots, Animationen … trifft bei weitem nicht, was die Tools können»):
     links die Funktionen, rechts ein Blender-Laptop mit dem echten Bildschirm der gewählten Funktion; «Film ansehen» spielt die Bedienung im Laptop.
     Aufnahmen: haeuser/wz/<werkzeug>-<ansicht>.webp, Filme haeuser/wz/<werkzeug>.mp4, alles aus den Werkzeugen des Culinarium (08.11.2026). */
  werkzeug: b => {
    const erstes = (b.f.find(x => x[2]) || [])[2];
    const bilder = [...new Set(b.f.map(x => x[2]).filter(Boolean))];
    return `<section class="mv-block mv-wz" data-wz="${esc(b.k)}">${kopfBlock(b)}
    <div class="mv-wz__buehne">
      <ol class="mv-wz__liste">${b.f.map(([t, p, bild], i) => `<li><button type="button" class="mv-wz__f${i === 0 ? ' an' : ''}" data-i="${i}" data-bild="${esc(bild || '')}"><b>${esc(t)}</b><span>${esc(p)}</span></button></li>`).join('')}</ol>
      <div class="mv-wz__hof">
        <span class="mv-geraet mv-wz__geraet"><span class="mv-geraet__schirm">${bilder.map(f => `<img src="haeuser/wz/${esc(f)}.webp" data-b="${esc(f)}" class="${f === erstes ? 'an' : ''}" alt="" loading="lazy" decoding="async">`).join('')}<video muted playsinline loop preload="none" poster="haeuser/wz/${esc(b.k)}-film.webp" data-film="haeuser/wz/${esc(b.k)}.mp4"></video></span><img class="mv-geraet__haus" src="/sales-cockpit/zentrale/img/laptop.webp" alt="" loading="lazy" decoding="async"></span>
        <div class="mv-wz__fuss"><p><small>Am Beispiel Culinarium</small><b class="mv-wz__was">${esc(b.f[0][0])}</b></p>${WO.knopf('Film ansehen', 'rechts', 'gold', { attr: 'data-wz-film' })}</div>
      </div>
    </div></section>`;
  },
  zahlen: b => `<section class="mv-block">${kopfBlock(b)}<div class="mv-zahlen" data-r data-spaet>${b.zahlen.map(z => `<div><b>${esc(z[0])}<small>${esc(z[1])}</small></b><p>${esc(z[2])}</p></div>`).join('')}</div></section>`,
  sonie: b => `<section class="mv-sonie" data-r data-spaet><div class="mv-so"><span class="wo-mk">So</span>${b.so.map(s => `<p>${esc(s)}</p>`).join('')}</div><div class="mv-nie"><span class="wo-mk">Nie</span>${b.nie.map(s => `<p><s>${esc(s)}</s></p>`).join('')}</div></section>`,
  weg: b => `<section class="mv-block">${kopfBlock(b)}<ol class="mv-weg${b.zeit ? ' mv-weg--zeit' : ''}" data-r data-spaet>${b.schritte.map(s => `<li><b>${esc(s[0])}</b>${s[1] ? `<p>${esc(s[1])}</p>` : ''}${s[2] ? `<span class="mv-wer">${esc(s[2])}</span>` : ''}</li>`).join('')}</ol></section>`,
  preise: b => `<section class="mv-block">${kopfBlock(b)}<div class="mv-preise" data-r data-spaet>${b.reihen.map(r => `<div><span><b>${esc(r[0])}</b><small>${esc(r[3])}</small></span><em>${esc(r[1])}</em><strong>${esc(r[2])}</strong></div>`).join('')}</div></section>`,
  verweis: b => `<a class="mv-verweis" href="${MARKENBUCH}" data-r data-spaet><img src="${esc(FOTO((H.fotoJe || {})[b.ziel] || 'bar'))}" alt="" loading="lazy" decoding="async"><span><span class="wo-mk">Im Werkzeug ${esc((H.namen && H.namen[b.ziel]) || 'Markenbuch')}</span><b>${esc(b.b)}</b><p>${esc(b.p)}</p></span><i>${WO.ic('pfeil')}</i></a>`
};
function quelleText(k) {
  if (!k.q || !k.q.length) return ''; return k.q.map(([s, wo]) => `${(Q[s] || s).replace(/^grundlagen\//, '').replace(/\.md$/, '')}: ${wo}`).join(' · '); }
function kapitel(k) {
  const i = KAP.indexOf(k), naechst = KAP[i + 1];
  return `${WO.startbild({ werkzeug: ORDNER, art: 'buehne', foto: FOTO(k.foto), h1: zwei(k.h1), zier: esc(`Kapitel ${i + 2} von ${GESAMT} · ${(GRUPPEN.find(g => g[0] === k.gruppe) || ['', ''])[1]}`), satz: esc(k.satz),
      knoepfe: WO.knopf('Frage stellen', 'plus', 'gold', { attr: `data-neu="${k.k}"` }) + (naechst ? WO.knopf('Nächstes Kapitel', 'rechts', 'glas', { attr: `data-gehe="${naechst.k}"`, titel: 'Weiter: ' + naechst.titel }) : WO.knopf(RA.fragen.titel, 'chat', 'glas', { attr: 'data-gehe="fragen"' })) })}
    <div class="wo-lage li-lage mv-lage" data-r>${k.lage.map(([a, b]) => `<div class="wo-lg"><span class="wo-mk">${esc(a)}</span><b>${esc(b)}</b></div>`).join('')}</div>
    <div class="mv-kapitel">${k.teile.map(b => (BAU[b.art] || (() => ''))(b)).join('')}</div>
    <footer class="mv-ende">
      <div class="mv-ende__frage" data-r data-spaet><b>Etwas unklar in «${esc(k.titel)}»?</b><p>Hinterlass Robert eine Frage oder Notiz. Sie wird gespeichert, du siehst sie im Kapitel «${esc(RA.fragen.titel)}».</p>${WO.knopf('Frage stellen', 'plus', 'dunkel', { attr: `data-neu="${k.k}"` })}</div>
      ${naechst ? `<button type="button" class="mv-weiter" data-gehe="${naechst.k}" data-r data-spaet><img src="${esc(FOTO(naechst.foto))}" alt="" loading="lazy" decoding="async"><span><small>Weiter mit Kapitel ${i + 2}</small><b>${esc(naechst.titel)}</b><span>${esc(naechst.kurz)}</span></span><i>${WO.ic('rechts')}</i></button>`
        : `<button type="button" class="mv-weiter" data-gehe="fragen" data-r data-spaet><img src="${esc(FOTO(RA.fragen.foto))}" alt="" loading="lazy" decoding="async"><span><small>Weiter mit Kapitel ${GESAMT}</small><b>${esc(RA.fragen.titel)}</b><span>${esc(RA.fragen.kurz)}</span></span><i>${WO.ic('rechts')}</i></button>`}
      <p class="mv-quelle">Quelle: ${esc(quelleText(k))}</p>
    </footer>`;
}

/* ---------------------------------------------------------------- Fragen an Robert */
function fragenAnsicht() {
  const o = offen(), b = S.fragen.filter(f => f.antwort);
  const satz = WER() === 'Anna' ? 'Was beim Lesen unklar war, steht hier. Robert antwortet direkt darunter. Ändern und Löschen geht, solange du willst; Löschen fragt vorher nach.'
    : 'Annas Fragen und Notizen zu den Kapiteln. Offene zuerst. Die Antwort steht direkt unter der Frage.';
  const karte = (f, i) => `<article class="mv-fr${f.antwort ? '' : ' mv-fr--offen'}" id="fragen-${esc(f.id)}" data-r style="--i:${i}">
      <header><button type="button" class="mv-fr__kap" data-gehe="${esc(kapZiel(f.kapitel))}">${esc(kapName(f.kapitel))}</button><span>${esc(f.von)} · ${esc(datum(f.zeit))}</span>${f.antwort ? '' : '<em>offen</em>'}</header>
      <p class="mv-fr__t">${esc(f.text)}</p>
      ${f.antwort ? `<div class="mv-fr__a"><span>Robert · ${esc(datum(f.antwort_zeit))}</span><p>${esc(f.antwort)}</p></div>` : ''}
      <div class="mv-fr__kn">${WER() === 'Robert' ? WO.knopf(f.antwort ? 'Antwort ändern' : 'Antworten', 'chat', f.antwort ? 'hell' : 'gold', { klein: true, attr: `data-antwort="${esc(f.id)}"`, disabled: S.server === false }) : ''}
        ${WO.knopf('Ändern', 'stift', 'hell', { klein: true, attr: `data-aendern="${esc(f.id)}"`, disabled: S.server === false })}${WO.knopf('Löschen', 'zurueck', 'hell', { klein: true, attr: `data-loeschen="${esc(f.id)}"`, disabled: S.server === false })}</div>
    </article>`;
  return `${WO.startbild({ werkzeug: ORDNER, art: 'buehne', foto: FOTO(RA.fragen.foto), h1: 'Annas <em>Fragen</em>', zier: esc(`Kapitel ${GESAMT} von ${GESAMT} · Wohin`), satz: esc(satz),
      knoepfe: WO.knopf('Frage stellen', 'plus', 'gold', { attr: 'data-neu=""' }) + WO.knopf('Zum Auftakt', 'links', 'glas', { attr: 'data-gehe="start"' }) })}
    <div class="wo-lage li-lage mv-lage" data-r><div class="wo-lg"><span class="wo-mk">Offen</span><b>${zahl(o.length)}</b></div><div class="wo-lg"><span class="wo-mk">Beantwortet</span><b>${zahl(b.length)}</b></div><div class="wo-lg"><span class="wo-mk">Du arbeitest als</span><b>${esc(WER())}</b></div></div>
    ${S.probe ? `<p class="mv-probe">${S.server === false ? 'Ohne den Server: Das sind die Beispiele aus den Probedaten, Speichern geht nicht. Starten mit python3 zentrale/server.py.' : 'Noch keine eigenen Fragen: Das sind Beispiele. Mit der ersten gespeicherten Frage werden sie zu deinem Stand.'}</p>` : ''}
    ${S.fragen.length ? `<h2 class="wo-zw">Offen <em>${zahl(o.length)}</em></h2><div class="mv-frl">${o.map(karte).join('') || '<p class="mv-leer">Keine offene Frage.</p>'}</div>
      <h2 class="wo-zw">Beantwortet <em>${zahl(b.length)}</em></h2><div class="mv-frl">${b.map((f, i) => karte(f, i + o.length)).join('') || '<p class="mv-leer">Noch keine Antwort.</p>'}</div>`
      : '<p class="mv-leer">Noch keine Frage. Unten rechts oder am Ende jedes Kapitels: «Frage stellen».</p>'}`;
}
function fragenLeben() {
  $$('[data-antwort]').forEach(b => b.onclick = () => antwortFenster(S.fragen.find(f => f.id === b.dataset.antwort)));
  $$('[data-aendern]').forEach(b => b.onclick = () => frageFenster(S.fragen.find(f => f.id === b.dataset.aendern)));
  $$('[data-loeschen]').forEach(b => b.onclick = () => loeschFrage(S.fragen.find(f => f.id === b.dataset.loeschen)));
}
function zeigeFrage(id) {
  const el = document.getElementById('fragen-' + id); if (!el) return;
  el.scrollIntoView({ block: 'center' }); el.classList.add('mv-fr--hier'); setTimeout(() => el.classList.remove('mv-fr--hier'), 2400);
}

/* ---------------------------------------------------------------- Server */
async function api(methode, weg, daten) {
  const r = await fetch(API + weg, { method: methode, headers: { 'Content-Type': 'application/json' }, body: daten ? JSON.stringify(daten) : undefined, cache: 'no-store' });
  let j = {}; try { j = await r.json(); } catch (e) { /* leer */ }
  if (!r.ok) throw new Error(j.fehler || 'Der Server antwortete mit Fehler ' + r.status + '.');
  return j;
}
async function ladeFragen() {
  try { const j = await api('GET', 'fragen'); S.fragen = j.fragen || []; S.probe = !!j.probe; S.kapitelNamen = j.kapitel || {}; S.server = true; }
  catch (e) {
    S.server = false;
    try { const r = await fetch('probedaten/fragen.json', { cache: 'no-store' }); S.fragen = r.ok ? await r.json() : []; } catch (x) { S.fragen = []; }
    S.probe = true;
  }
}
function neuZeichnen() { kopf(); rand(); leiste(); zeichne(true); }

/* ---------------------------------------------------------------- Fenster: Frage stellen, ändern, beantworten */
let VORHER_FOKUS = null;
function fenster(html, label) {
  const f = $('#fenster');
  VORHER_FOKUS = document.activeElement;
  f.innerHTML = `<div class="fenster__k mv-fk" role="dialog" aria-modal="true" aria-label="${esc(label)}"><button class="wo-kn wo-kn--rund fenster__zu" type="button" data-zu aria-label="Schliessen">${ZU}</button>${html}</div>`;
  f.hidden = false; document.body.classList.add('li-zu');
  $$('[data-zu]', f).forEach(b => b.onclick = fensterZu);
  f.onclick = e => { if (e.target === f) fensterZu(); };
}
function fensterZu() {
  $('#fenster').hidden = true; $('#fenster').innerHTML = ''; document.body.classList.remove('li-zu');
  if (VORHER_FOKUS && VORHER_FOKUS.focus && document.contains(VORHER_FOKUS)) VORHER_FOKUS.focus({ preventScroll: true });
}
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#fenster').hidden) fensterZu(); });

/* Speichern-Knopf wie im Paket (R09): grau ohne Eingabe, gelb mit offener Eingabe, grün «Gespeichert» */
function speicherKnopf(knopf, zustand) {
  knopf.classList.remove('wo-kn--glas', 'wo-kn--wartet', 'wo-kn--fertig');
  knopf.classList.add(zustand === 'fertig' ? 'wo-kn--fertig' : zustand === 'wartet' ? 'wo-kn--wartet' : 'wo-kn--glas');
  knopf.disabled = zustand !== 'wartet';
  knopf.querySelector('span').textContent = zustand === 'fertig' ? 'Gespeichert' : 'Speichern';
}
function feldFenster({ kopfMk, kopfB, feldName, wert, mitKapitel, kapitel, hilfe, speichere }) {
  const wahl = mitKapitel ? `<label class="wo-feld"><span>Kapitel</span><select data-kap><option value="auftakt"${kapitel === 'auftakt' ? ' selected' : ''}>${esc(RA.auftakt.titel)}</option>${KAP.map(k => `<option value="${k.k}"${k.k === kapitel ? ' selected' : ''}>${esc(k.titel)}</option>`).join('')}<option value="allgemein"${!kapitel || kapitel === 'allgemein' ? ' selected' : ''}>Allgemein</option></select></label>` : '';
  fenster(`<div class="wo-fe mv-fe"><div class="wo-fe__kopf"><span class="wo-mk">${esc(kopfMk)}</span><b>${esc(kopfB)}</b></div>
      ${wahl}<label class="wo-feld"><span>${esc(feldName)}</span><textarea data-text rows="6" maxlength="2000">${esc(wert || '')}</textarea></label>
      <p class="mv-fe__hilfe">${esc(hilfe)}</p>
      <div class="wo-fe__reihe wo-fe__reihe--u"><span></span><div class="wo-fe__kn">${WO.knopf('Abbrechen', 'zurueck', 'hell', { klein: true, attr: 'data-zu' })}${WO.knopf('Speichern', 'haken', 'glas', { klein: true, attr: 'data-sp', disabled: true })}</div></div></div>`, kopfMk);
  const f = $('#fenster'), ta = $('[data-text]', f), sel = $('[data-kap]', f), kn = $('[data-sp]', f);
  $$('[data-zu]', f).forEach(b => b.onclick = fensterZu);
  const anfang = [ta.value.trim(), sel ? sel.value : ''].join('|');
  const pruef = () => speicherKnopf(kn, ta.value.trim() && [ta.value.trim(), sel ? sel.value : ''].join('|') !== anfang && S.server !== false ? 'wartet' : 'glas');
  ta.oninput = pruef; if (sel) sel.onchange = pruef;
  kn.onclick = async () => {
    kn.disabled = true;
    try { await speichere(ta.value.trim(), sel ? sel.value : ''); speicherKnopf(kn, 'fertig'); setTimeout(fensterZu, 900); }
    catch (e) { melde(e.message, true); pruef(); }
  };
  setTimeout(() => ta.focus({ preventScroll: true }), 60);
}
function frageFenster(f, kapitel) {
  if (S.server === false) return melde('Ohne den Server lässt sich nichts speichern. Starten mit python3 zentrale/server.py.', true);
  if (f) return feldFenster({ kopfMk: 'Frage ändern', kopfB: kapName(f.kapitel), feldName: 'Deine Frage oder Notiz', wert: f.text, mitKapitel: true, kapitel: f.kapitel,
    hilfe: 'Nach dem Speichern siehst du vorher und nachher und kannst es rückgängig machen.',
    speichere: async (text, kap) => { const j = await api('PUT', 'fragen/' + f.id, { text, kapitel: kap, wer: WER() }); nachAenderung(j.frage, j.vorher, 'Frage geändert'); } });
  feldFenster({ kopfMk: 'Frage an Robert', kopfB: kapitel ? kapName(kapitel) : 'Neue Frage', feldName: 'Deine Frage oder Notiz', wert: '', mitKapitel: true, kapitel,
    hilfe: 'Robert sieht sie im Kapitel «Annas Fragen» und antwortet dort.',
    speichere: async (text, kap) => { const j = await api('POST', 'fragen', { text, kapitel: kap, wer: WER() }); nachNeu(j.frage); } });
}
function antwortFenster(f) {
  if (!f) return;
  feldFenster({ kopfMk: f.antwort ? 'Antwort ändern' : 'Antwort an ' + f.von, kopfB: f.text.length > 90 ? f.text.slice(0, 88) + ' …' : f.text, feldName: 'Antwort', wert: f.antwort, mitKapitel: false,
    hilfe: `${f.von} sieht die Antwort direkt unter der Frage.`,
    speichere: async text => { const j = await api('PUT', 'fragen/' + f.id, { antwort: text, wer: WER() }); nachAenderung(j.frage, j.vorher, f.antwort ? 'Antwort geändert' : 'Antwort gespeichert'); } });
}
function loeschFrage(f) {
  if (!f) return;
  fenster(`<div class="mv-rueck"><span class="wo-mk">Wirklich löschen?</span><b>${esc(kapName(f.kapitel))}</b><p>«${esc(f.text)}»</p>${f.antwort ? `<p class="mv-rueck__a">Die Antwort von Robert geht mit.</p>` : ''}
    <div class="wo-fe__kn">${WO.knopf('Behalten', 'zurueck', 'hell', { klein: true, attr: 'data-zu' })}${WO.knopf('Löschen', 'haken', 'dunkel', { klein: true, attr: 'data-ja' })}</div></div>`, 'Löschen');
  $$('#fenster [data-zu]').forEach(b => b.onclick = fensterZu);
  $('#fenster [data-ja]').onclick = async () => {
    try { const j = await api('DELETE', 'fragen/' + f.id); fensterZu(); S.fragen = S.fragen.filter(x => x.id !== f.id); neuZeichnen();
      quittung('Frage gelöscht', `«${kurz(f.text)}» ist gelöscht.`, { vorher: f, nachher: null }, async () => { const w = await api('POST', 'fragen/' + f.id + '/zurueck', { frage: j.weg }); S.fragen.push(w.frage); await ladeFragen(); neuZeichnen(); melde('Zurückgeholt'); }); }
    catch (e) { melde(e.message, true); }
  };
}
const kurz = (t, n = 60) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + ' …' : t; };
async function nachNeu(f) {
  await ladeFragen(); neuZeichnen(); if (S.ansicht === 'fragen') zeigeFrage(f.id);
  quittung('Frage gespeichert', `Zu «${kapName(f.kapitel)}». Robert sieht sie in der Zentrale.`, { vorher: null, nachher: f }, async () => { await api('DELETE', 'fragen/' + f.id); await ladeFragen(); neuZeichnen(); melde('Rückgängig gemacht'); });
}
async function nachAenderung(f, vorher, titel) {
  await ladeFragen(); neuZeichnen(); if (S.ansicht === 'fragen') zeigeFrage(f.id);
  quittung(titel, `«${kurz(f.text)}»`, { vorher, nachher: f }, async () => {
    await api('PUT', 'fragen/' + f.id, { text: vorher.text, kapitel: vorher.kapitel, antwort: vorher.antwort, wer: WER() }); await ladeFragen(); neuZeichnen(); melde('Rückgängig gemacht');
  });
}

/* ---------------------------------------------------------------- Quittung (vorher, nachher, Rückgängig) und Meldung */
function quittung(titel, satz, vn, zurueck) {
  const m = $('#meldung'); while (m.children.length >= 2) m.firstChild.remove();
  const q = document.createElement('div');
  q.className = 'wo-quittung'; q.setAttribute('role', 'status');
  q.innerHTML = `<i>${WO.ic('haken')}</i><span><b>${esc(titel)}</b>${esc(satz)}</span><a href="#" data-vn>Vorher, nachher</a><a href="#" data-rg>Rückgängig</a><button type="button" aria-label="Schliessen">${WO.ic('x')}</button>`;
  let zeit = setTimeout(() => q.remove(), 12000);
  q.onmouseenter = () => clearTimeout(zeit);
  q.querySelector('button').onclick = () => q.remove();
  q.querySelector('[data-vn]').onclick = e => { e.preventDefault(); vorherNachher(titel, vn); };
  q.querySelector('[data-rg]').onclick = async e => { e.preventDefault(); q.remove(); try { await zurueck(); } catch (x) { melde(x.message, true); } };
  m.appendChild(q);
}
function vorherNachher(titel, { vorher, nachher }) {
  const teil = (f, leer) => f ? `<p class="mv-vn__kap">${esc(kapName(f.kapitel))}</p><p>${esc(f.text)}</p>${f.antwort ? `<p class="mv-vn__a"><span>Antwort</span>${esc(f.antwort)}</p>` : ''}` : `<p class="mv-vn__leer">${esc(leer)}</p>`;
  fenster(`<div class="mv-vn"><span class="wo-mk">${esc(titel)}</span><div class="mv-vn__zwei"><div><b>Vorher</b>${teil(vorher, 'Noch nicht da.')}</div><div><b>Nachher</b>${teil(nachher, 'Gelöscht.')}</div></div></div>`, 'Vorher, nachher');
}
function melde(text, fehl = false) {
  const m = $('#meldung'); while (m.children.length >= 3) m.firstChild.remove();
  const q = document.createElement('div');
  q.className = 'quit' + (fehl ? ' fehl' : '');
  q.innerHTML = `<div><b>${esc(text)}</b></div><button type="button" aria-label="Schliessen">${ZU}</button>`;
  q.querySelector('button').onclick = () => q.remove();
  m.appendChild(q);
  setTimeout(() => q.remove(), fehl ? 9000 : 2600);
}

/* ---------------------------------------------------------------- Start */
function startfehler(grund) {
  window.MV_BEREIT = true; clearTimeout(window.MV_LADE);
  document.documentElement.classList.remove('mv-wartet');
  $('#ansicht').innerHTML = `<div class="platte li-tuer" role="alert"><h1>${esc(NAME)} startet nicht.</h1><p class="li-tuer__g">${esc(grund)}</p><p>Hilft «Neu laden» nicht: die Anleitung öffnen oder Robert Bescheid geben.</p>
    <div class="li-tuer__kn">${WO.knopf('Neu laden', 'zurueck', 'dunkel', { attr: 'data-neu-laden' })}${WO.knopf('Anleitung', 'buch', 'hell', { href: 'anleitung.html', neu: true })}</div></div>`;
  const b = $('#ansicht [data-neu-laden]'); if (b) b.onclick = () => location.reload();
}
/* Auftakt wie Le Livre (R02): warten, bis die Schriften und das Foto der ersten Bühne da sind, höchstens 1,2 s, dann alles auf einmal */
function bereit(ansicht) {
  const k = kapVon(ansicht), src = ansicht === 'start' ? H.foto : ansicht === 'fragen' ? FOTO(RA.fragen.foto) : FOTO(k.foto);
  const bild = new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = src; if (i.decode) i.decode().then(r, r); });
  return Promise.race([Promise.all([document.fonts ? document.fonts.ready : 0, bild]), new Promise(r => setTimeout(r, 1200))]);
}
function ansichtAusHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (/^fragen-/.test(h)) return { a: 'fragen', id: h.slice(7) };
  return ANSICHTEN.includes(h) ? { a: h } : null;
}
(async function () {
  try {
    if (!KAP.length || !window.WO) throw new Error(!KAP.length ? 'Der Inhalt der Kapitel (kapitel.js) fehlt.' : 'Das Kleid (oberflaeche.js) fehlt.');
    document.title = `${NAME} · Tasty Studios`;
    let ziel = ansichtAusHash();
    if (!ziel) { try { const l = localStorage.getItem('tasty-mv-ansicht'); ziel = { a: ANSICHTEN.includes(l) && !H.imRahmen ? l : 'start' }; } catch (e) { ziel = { a: 'start' }; } }
    S.ansicht = ziel.a;
    await Promise.all([bereit(S.ansicht), ladeFragen()]);
    clearTimeout(window.MV_LADE);
    kopf(); rand(); leiste(); zeichne();
    document.documentElement.classList.remove('mv-wartet');
    if (ziel.id) setTimeout(() => zeigeFrage(ziel.id), 400);
    document.body.classList.add('li-bereit'); window.MV_BEREIT = true;
  } catch (e) { return startfehler(String(e && e.message || e).slice(0, 200)); }
  addEventListener('hashchange', () => { const z = ansichtAusHash(); if (!z) return; if (z.a !== S.ansicht) gehe(z.a); if (z.id) setTimeout(() => zeigeFrage(z.id), 300); });
})();
