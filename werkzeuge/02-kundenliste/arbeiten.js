/* arbeiten.js · «Was wir gemacht haben» je Bestandskunde (Robert 16.11.2026: «das müsste doch aus dem Sales Cockpit raus und dann bei Kunden rein, weil bei Kunden sind Bestandskunden»).
   Übernommen aus dem Sales Cockpit (Bereich «Unsere Kunden», Stand 14.11.2026), Bildschirme in arbeiten/. Felder je Arbeit: [Art, Titel, Satz, Adresse, Bild]. */
(function () {

/* ---------------------------------------------------------------- Unsere Kunden (Robert 14.11.2026: «dass Anna quasi einen Überblick hat, auch bei Kunden … dass sie sieht,
   was ich schon für den Kunden alles gemacht habe … so einen eigenen kleinen Bereich»). Je Kunde mit Vertrag ein Blatt mit allen Arbeiten im Laptop.
   Quellen: «Kunden» (haeuser.json: kurz, beigaben, seiten, werkzeuge), projekte.py (Adressen), Seitentitel der Arbeiten; alle Adressen am 14.11.2026 mit 200 geprüft.
   Bildschirme: schirme/kunde-<k>.webp, aufgenommen 14.11.2026 in 1440 px. */
const KSC = '/sales-cockpit/werkzeuge/02-kundenliste/arbeiten/kunde-', KSALES = 'https://tastyrob123.github.io/txtme-sales/', KTXT = 'https://txtme-social.sites.deploybase.eu/';
window.KUNDEN_ARBEITEN = {
  txtme: {
    buehne: { t: ['Die Sales-', 'Unterlagen.'], lead: 'Alle Unterlagen von txtme.social an einem Ort, zum Weiterschicken an Cafés, Partner und Botschafter. Dazu unsere Arbeiten für Kunden von txtme.social.',
      url: KSALES, bild: KSC + 'txtme-sales.webp',
      teile: [['Cafés & Restaurants', 'txtme.social für Orte', 'places/'], ['Partnerships', 'Partnerschaft und die Fassung für Custom95', 'partner/'],
        ['Ambassador', 'Die Einladung an Botschafter', 'ambassador/example/'], ['Business Inquiries', 'Physiotherapie Sylvia Sroka und die RKN-Präsentation', 'sylviaphysiotherapie/']] },
    arbeiten: [
      ['Website und Shop', 'Der Webshop', 'Die Website von txtme.social mit Shop, als Entwurf online.', KTXT, 'txtme-shop'],
      ['Werkbank', 'Werkbank 2.0', 'Alles rund um den Shop an einem Ort: Seiten, Werkzeuge und Unterlagen.', KTXT + 'werkbank/', 'txtme-werkbank'],
      ['Werkbuch', 'Von der ersten Mail zur fertigen Seite', 'Wie die Website Schritt für Schritt entstanden ist.', KTXT + 'werkbuch/', 'txtme-werkbuch'],
      ['Event', 'rkn.ofc × txtme.social × ade', 'Die Präsentation für die Special Edition zur ADE-Woche mit Kameras, Rahmen und Abzügen.', KTXT + 'rkn/', 'txtme-rkn'],
      ['Event', 'Sponsoring für Events', 'Das Portfolio für Sponsoren von Events.', KTXT + 'rkn/sponsoring/', 'txtme-sponsoring'],
      ['Landingpage', 'The platform that wants you offline', 'Die Seite für die Beta mit Warteliste.', KTXT + 'landing/', 'txtme-landing'],
      ['App', 'Die App-Studie', 'Wie die App von txtme.social aussehen kann, in der Sprache der Marke gestaltet.', KTXT + 'app/', 'txtme-app'],
      ['Drops', 'Saison-Welten', 'Ein Shop, elf Anlässe: die Drops durch das Jahr.', KTXT + 'drops/', 'txtme-drops'],
      ['Mails', 'Mail-Vorlagen', 'Elf Mails im Stil der Marke.', KTXT + 'mails/', 'txtme-mails'],
      ['Produktion', 'Launch Edition Box', 'Der Produktionsbrief für die erste Box: Masse, Material und Inhalt.', 'https://tastyrob123.github.io/txtme-launchbox/', 'txtme-launchbox']],
    ausserdem: ['Instagram-Kampagne, erster Schub, mit elf Canva-Vorlagen'] },
  culinarium: {
    arbeiten: [
      ['Website', 'Die neue Website', 'Neun Seiten, als Entwurf online.', 'https://tastyrob123.github.io/culinarium-entwurf/', 'culinarium-website'],
      ['Werkbank', 'Die Werkbank', 'Website, Werkzeuge und Unterlagen an einem Ort.', 'https://tastyrob123.github.io/culinarium-demo/werkbank/index.html', 'culinarium-werkbank'],
      ['Vergleich', 'Bisher und neu', 'Die heutige Seite und die neue nebeneinander, mit den Korrekturen des Hauses.', 'https://tastyrob123.github.io/culinarium-entwurf/vergleich/', 'culinarium-vergleich']] },
  wildside: {
    arbeiten: [
      ['Website', 'Die neue Bar-Website', 'Acht Seiten für die Nachbarschafts-Mixology-Bar in Linden, als Entwurf online.', 'https://tastyrob123.github.io/culinarium-entwurf/wildside/', 'wildside-website'],
      ['Werkzeug', 'Die Künstlerliste', 'Anfragen von DJs, Musikern und anderen Künstlern, die auf der Bühne der Bar auftreten wollen.', 'https://tastyrob123.github.io/culinarium-demo/werkzeuge/kuenstler/index.html', 'culinarium-kuenstler'],
      ['Film', 'Film für die Landingpage', 'Die erste Fassung.', 'https://tastyrob123.github.io/wildside-video/', 'wildside-video'],
      ['Film', 'Film für die Landingpage', 'Die zweite Fassung.', 'https://tastyrob123.github.io/wildside-video-v2/', 'wildside-video2']] }
};
})();
