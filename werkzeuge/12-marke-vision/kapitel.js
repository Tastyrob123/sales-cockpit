/* Marke & Vision · Inhalt der Kapitel (Runde 2, 07.11.2026). Gliederung nach Robert (07.11.2026, auftraege/12-marke-vision.md): eine Geschichte in acht Kapiteln,
   erst warum, dann woran man uns erkennt, dann wohin. Kapitel 1 (Auftakt) ist die Übersicht, Kapitel 8 (Annas Fragen) die Ansicht der Fragen; hier stehen 2 bis 7.
   Nur aus den Quellen in grundlagen/ (Abzug 06.11.2026), Sätze wörtlich oder eng daran gekürzt. Nicht verwendet: Teil 2 des Strategiepapiers (Partnerschaft, Geld),
   alles Persönliche über Robert, Preise ausser aus Angebot.md. Darum fehlen aus dem Fahrplan die Punkte zu Partnerschaft, Steuerberatung und Gründung.
   Belege: echte Häuser, die in den Quellen stehen. Bilder gibt es nur vom Culinarium Hannover (haeuser/, Herkunft in haeuser/herkunft.json);
   die übrigen Häuser (Familie Maeder, Schlössli, Schäfli, Grand Beau-Rivage) belegen mit Text, ohne erfundenes Bild.
   Bausteine (teile): mk = grosser Titel mit Satz · fenster = grosses Foto mit Satz · beleg = Bild eines echten Hauses mit dem, was es zeigt
   · vh = vorher und nachher an einem echten Haus · bilder = Reihe von Bildern eines Hauses · karten = drei Karten · reihen = Zeilen mit Linie
   · zahlen = grosse Zahlen · sonie = «So» und «Nie» · weg = Schritte · preise = Zeilen mit Betrag · verweis = Weg ins Markenbuch.
   foto = Schlüssel aus dem Kleid (Fotos der Agentur-Seite), bild = Datei in haeuser/ ohne Endung. */
'use strict';
window.MV_QUELLEN = {
  pos: 'grundlagen/Positionierung & Markenkern.md',
  str: 'grundlagen/Strategiepapier — Teil 1 Strategie (Stand 04.11.2026).md',
  brand: 'grundlagen/Branding.md',
  dna: 'grundlagen/Design-DNA — Vibe & Einflüsse.md',
  stil: 'grundlagen/Schreibstil.md',
  stimme: 'grundlagen/Meine LinkedIn-Stimme.md',
  ang: 'grundlagen/Angebot.md',
  proj: 'grundlagen/Projekte.md',
  wzb: 'grundlagen/Werkzeug-Bau — Die sieben Werkzeuge (Master).md'
};
/* Kapitel 1 (Übersicht) und 8 (Fragen): nur Titel und Kurzsatz, für Rand, Kacheln, Frage-Fenster und Prüfseite */
window.MV_RAHMEN = {
  auftakt: { titel: 'Auftakt', kurz: 'Ein Satz, ein Bild, ein Gruss: das ist Tasty Studios.', foto: 'studio',
    q: [['str', 'Kapitel 01 Stand (Satz «Tasty Studios is a Digital Hospitality Studio.», Robert, 10.10.2026)'], ['pos', 'Abschnitt «Digital Hospitality — Markenkern für die Website-Agentur»']] },
  fragen: { titel: 'Annas Fragen', kurz: 'Alle Fragen und Notizen von Anna zu den Kapiteln, mit Roberts Antworten.', foto: 'empfang', q: [] }
};
window.MV_KAPITEL = [
  {
    k: 'warum', gruppe: 'warum', titel: 'Warum es uns gibt', foto: 'tafel',
    h1: ['Warum es uns', 'gibt.'],
    satz: 'Die gastronomische Vielfalt bewahren, bevor kleine Betriebe von grossen Systemen mit Dumping-Preisen vom Markt verdrängt werden oder aussterben.',
    kurz: 'Das Wissen der KI-Welt für kleine Betriebe zugänglich machen und die gastronomische Vielfalt bewahren.',
    lage: [['Mission', 'Gastronomische Vielfalt bewahren'], ['Die Nische', 'KI für die Gastronomie'], ['Der Boden', 'Die Branche, nicht nur das Thema KI']],
    teile: [
      { art: 'mk', t: ['Wir stehen für', 'eine Bewegung.'], lead: 'KI für die Gastronomie, unter der Marke Tasty Studios. Getrieben von der Mission, nicht von einer Berufsbezeichnung. Die Selbstvorstellung sagt, was wir tun und wofür wir stehen: «Tasty Studios. KI für die Gastronomie.»' },
      { art: 'fenster', foto: 'terrasse', s: 'Das Wissen, das die KI-Welt gerade hervorbringt,', u: 'für genau diese kleinen Unternehmen zugänglich machen.', von: 'Mission, Positionierung & Markenkern' },
      { art: 'beleg', haus: 'Culinarium Hannover', bild: 'cu-tafel', b: 'Eine Abendreihe an einer langen Tafel.',
        p: 'Food-Pairing-Abende «Momo x Rudi» in der Bar Walk on the Wild Side, Hannover-Linden, dazu das Pop-up Dirty Chicken. Für Betriebe wie diesen gibt es seit dem 3. November den Netzwerkpreis Hannover: Website und Betreuung zu einem Betrag, den ein mittelständischer Gastronom ohne Kopfschmerzen zahlt.',
        von: 'Design-DNA, 25. bis 28.10.2026 · Angebot, 03.11.2026' },
      { art: 'reihen', t: ['Wofür die Leute', 'wirklich zahlen.'], lead: 'Das Wissen ist am Ende online verfügbar. Bezahlt wird für Selektion, Kontext und die Art, wie es vermittelt wird.', reihen: [
        ['Selektion', 'Nicht «alles», sondern das Relevante, vorgefiltert.'],
        ['Kontext', 'Die KI-Sachen in einen Zusammenhang gesetzt, der wirklich etwas bringt: Gastronomie, Claude Code, Second Brain und weitere Möglichkeiten.'],
        ['Was nicht überall gezeigt wird', 'Über die Grundlagen hinaus, zum Beispiel fertige Prompts für Bilder von Lebensmitteln.'],
        ['Die Art zu bauen', 'Wie hier gestaltet, gebaut und gedacht wird, ist ein Gut, das uns keiner nehmen kann.'],
        ['Die Erklärweise', 'Wie Dinge erklärt werden, ist der Kern der Markenidentität.']
      ] },
      { art: 'mk', t: ['Ein gemeinsamer Boden:', 'Gastronomie und KI.'], lead: 'Generalisten zeigen «alles mögliche». Ihre Gemeinschaft verbindet nur das Interesse an KI, Menschen aus allen Branchen ohne gemeinsamen Boden. Genau da setzen wir an: eine Gemeinschaft mit echtem gemeinsamem Nenner.' },
      { art: 'reihen', t: ['Was wir am Markt', 'gesehen haben.'], reihen: [
        ['Der offene Raum', 'Die Botschaft «Fundament für kleine und mittlere Gastronomie, System vor Tool, KI macht menschlicher» gibt es am Markt, aber nur von Einzelstimmen mit wenig Reichweite. Niemand besetzt sie mit Reichweite und Markenkern.'],
        ['Die Folge', 'Die Lücke wird enger. Wir besetzen das Thema zügig und unterscheiden uns über den Beweis: gebaute Systeme, eigene Zahlen.'],
        ['Was wir meiden', 'Das überfüllte Feld der Telefon-KI. Nicht als Hauptbotschaft.']
      ] },
      { art: 'beleg', haus: 'Culinarium Hannover', bild: 'cu-lachen', rechts: true, b: 'Menschen, die zusammen essen und lachen.',
        p: 'Die Seite des Culinarium ist dunkel und präzise, die Fotos zeigen den Abend selbst. Getragen haben die echten Abendfotos von Rudi, Tafel, Hände, Teller von oben, nicht die Plakate.',
        von: 'Design-DNA, «Was Culinarium Hannover über die DNA zeigt»' }
    ],
    q: [['pos', 'Abschnitte «Die Nische», «Mission», «USP», «Markt-Beleg», «Positionierung: Bewegung statt Titel»'], ['brand', 'Abschnitt «Markenkern (Nische · Mission · USP)»'], ['dna', 'Abschnitt «Was Culinarium Hannover über die DNA zeigt»'], ['ang', 'Abschnitt «Netzwerkpreis Hannover»']]
  },
  {
    k: 'glaube', gruppe: 'warum', titel: 'Woran wir glauben', foto: 'bar',
    h1: ['Woran wir', 'glauben.'],
    satz: 'Hospitality braucht nicht noch eine Webdesign-Agentur. Hotels brauchen jemanden, der Marke, Website, Gast, Betrieb und Technologie als ein zusammenhängendes System versteht.',
    kurz: 'Kein Baukasten, jedes Haus eine eigene Welt, Wertigkeit statt Masse, alles als ein System.',
    lage: [['Der Satz', 'Tasty Studios is a Digital Hospitality Studio.'], ['Kurzform', 'Strategy. Design. Technology. Hospitality.'], ['Seit', '10.10.2026 der Markenkern']],
    teile: [
      { art: 'mk', t: ['Die Website ist ein Teil', 'des Gästeerlebnisses.'], lead: 'Nie das ganze Produkt. Dahinter stehen immer Systeme: Werkzeuge für das Team, Kontrollpanel, Backoffice, KI. Deshalb gehört zu jeder Website das ganze Paket.' },
      { art: 'karten', t: ['Was uns', 'unterscheidet.'], karten: [
        { m: 'Ein System', b: 'Ein Partner statt sechs', p: 'Was ein Haus sonst bei Webagentur, Grafikbüro, SEO-Agentur und weiteren Firmen einkauft, entsteht bei uns aus einer Hand und passt zusammen.' },
        { m: 'Woher wir kommen', b: 'Aus dem Betrieb', p: 'Anna aus Front Office, Event, F&B und Hoteldirektion, Robert aus Gastronomie, Expansion und Systembau. Wir kennen den vollen Abend von innen.' },
        { m: 'Jedes Haus anders', b: 'Kein Baukasten', p: 'Jeder Auftritt entsteht aus der Welt des einen Hauses. Bei der Familie Maeder sind es vier Häuser und vier völlig verschiedene Websites, die man trotzdem als eine Familie erkennt.' }
      ] },
      { art: 'fenster', bild: 'cu-kerzen', s: 'Jede Arbeit für einen Betrieb', u: 'ist ein Erlebnis aus einem Guss. Eine Website ist keine Folge von Abschnitten, sondern eine Welt, in die man hineingeht.', von: 'Das Fundament der Design-DNA, 17.10.2026' },
      { art: 'karten', t: ['Jedes Haus', 'eine eigene Welt.'], lead: 'Vier Häuser der Familie Maeder, zwei Restaurants der Familie Kuchler, eine Abendreihe in Hannover. Dieselbe Machart, jedes Mal ein anderes Kleid.', karten: [
        { m: 'Familie Kuchler, Bottighofen', b: 'Wirtschaft am Schlössli', p: 'Am See, mediterran. Lebensgefühl: hell, Sommer am Hafen, ein Blau Ton in Ton aus dem Teller. Der Teller am See war das Leitbild, weil dort die Küche das Besondere ist.' },
        { m: 'Familie Kuchler, Wigoltingen', b: 'Taverne zum Schäfli', p: 'Riegelhaus, zwei Michelin-Sterne. Arbeit im besten Sinn: dunkles Holz, Sterne, Ernst. Getroffen hat das Haus selbst, gross, im hellen Tageslicht, Name im Himmel.' },
        { m: 'Hannover-Linden', b: 'Culinarium', p: 'Eine Abendreihe statt eines Hauses. Culinarium bleibt Nacht und Kerze, das Pop-up Dirty Chicken bekommt sein Violett mit eigener Wucht.' }
      ] },
      { art: 'beleg', haus: 'Culinarium Hannover', bild: 'cu-plakat', b: 'Leise Ironie nur in der Stimme des Hauses.',
        p: '«Dit is keen Burger. Dit Ding is \'ne Ansage.» blieb als Fenster und Sticker, weil es Dirty Chicken selbst so sagt. Erfundene Pointen, Stückzahlen, eine Vorgeschichte als Kneipe, Stimmungssätze, fielen alle.',
        von: 'Design-DNA, Gesetz 9' },
      { art: 'mk', t: ['Wertigkeit', 'statt Masse.'], lead: 'Jeder Satz und jedes Bild wertet das Haus auf: Sorgfalt, Handarbeit, der einzelne Gast, der einzelne Teller. Zahlen nur als Exklusivität, wenige Plätze, nie als Menge, die abgearbeitet wird.' },
      { art: 'mk', t: ['Die Website ist nicht', 'das Ende des Systems.'], lead: 'Sie ist der Output eines dahinterliegenden Systems. So steht es als Leitsatz auf der Agentur-Seite, wörtlich, seit dem 12.10.2026.' },
      { art: 'reihen', t: ['So nennen', 'wir uns.'], reihen: [
        ['In Texten und Angeboten', '«Digital Hospitality Studio» oder «Digital Hospitality & AI».'],
        ['Nicht', '«Webdesign-Agentur», «Website-Agentur», «Showcase».'],
        ['Zweites Standbein', 'Backoffice und Masterclass. Auf der Agentur-Seite laufen sie als Beleg dafür mit, dass wir Gastronomie von innen kennen. Langfristig sollen sie das Geschäft unabhängiger von einzelnen Aufträgen machen: einmal gebaut, beliebig oft verkauft.']
      ] }
    ],
    q: [['str', 'Kapitel 02 Marke'], ['pos', 'Abschnitte «Digital Hospitality — Markenkern für die Website-Agentur», «Was daraus folgt»'], ['dna', 'Abschnitte «Der Core» (Fundament), «Was die abgenommenen Häuser über die DNA zeigen», «Was Culinarium Hannover über die DNA zeigt»'], ['stil', 'Abschnitt «Kernregeln» (Wertigkeit)']]
  },
  {
    k: 'kunden', gruppe: 'warum', titel: 'Für wen wir arbeiten', foto: 'haus',
    h1: ['Für wen wir', 'arbeiten.'],
    satz: 'Der Schwerpunkt liegt in der Schweiz. Dort gibt es viele sehr gute Häuser, deren Auftritt im Netz nicht zu ihrem Niveau passt, und die Bereitschaft, dafür zu zahlen.',
    kurz: 'Unabhängige Häuser, vor allem in der Schweiz: Familien mit mehreren Häusern zuerst.',
    lage: [['Schwerpunkt', 'Schweiz'], ['Zuerst', 'Familien mit mehreren Häusern'], ['Deutschland', 'Über Empfehlungen, kein Schwerpunkt']],
    teile: [
      { art: 'fenster', foto: 'zimmer', s: 'Das Haus ist besser', u: 'als seine Website.', von: 'Woran wir ein passendes Haus erkennen' },
      { art: 'reihen', t: ['In dieser', 'Reihenfolge.'], lead: 'In Deutschland ist die Bereitschaft, für den Auftritt zu zahlen, deutlich geringer. Viele arbeiten mit Agenturen oder machen es selbst.', reihen: [
        ['Familien mit mehreren Häusern, Schweiz', 'Jedes Haus bekommt seinen eigenen Stil unter einem gemeinsamen Dach. Ein Gespräch führt zu mehreren Auftritten und einer Betreuung über alle Häuser. Beispiel: Familie Maeder.'],
        ['Familiengeführte Hotels und Landgasthöfe, Schweiz', 'Das Haus ist besser als seine Website. Die Familie entscheidet selbst und schnell.'],
        ['Sternerestaurants und Restaurants mit Handschrift, Schweiz', 'Kleinere monatliche Betreuung als bei Hotels, dafür kurze Wege zur Entscheidung.'],
        ['Gastronomie in Deutschland', 'Läuft über Empfehlungen mit einer eigenen Preisliste (Netzwerk Hannover, seit 03.11.2026). Kein Schwerpunkt der Akquise.']
      ] },
      { art: 'karten', t: ['An diesen Häusern', 'sieht man es.'], lead: 'Für jede Stufe der Reihenfolge gibt es schon ein Haus, an dem wir gearbeitet haben.', karten: [
        { m: 'Familie mit mehreren Häusern', b: 'Familie Maeder', p: 'Carlton-Europe, Waldhotel Doldenhorn, Landgasthof Ruedihus, Berghotel Gasterntal und eine Seite für die Familie. Vier Häuser, vier Websites, eine Familie.' },
        { m: 'Restaurants mit Handschrift', b: 'Schlössli und Schäfli', p: 'Zwei Restaurants der Familie Kuchler im Thurgau, von Robert Abschnitt für Abschnitt abgenommen. Betreuung als Einzelfall: CHF 200 und CHF 250 im Monat.' },
        { m: 'Gastronomie in Deutschland', b: 'Culinarium Hannover', p: 'Nach dem Gespräch mit Rudi, Momo und Derya am 2. November: Momo empfiehlt uns in seinem Netzwerk weiter. Daraus ist der Netzwerkpreis Hannover entstanden.' }
      ] },
      { art: 'beleg', haus: 'Culinarium Hannover', bild: 'cu-bar', rechts: true, b: 'Zuerst sagen, wo man ist.',
        p: 'Drei Konzepte unter einem Dach brauchten Ebenen, die ein Fremder sofort versteht. Das Haus, die Bar Walk on the Wild Side, ist das Dach, die Abende und das Pop-up laufen darin, keiner der Menschen dominiert.',
        von: 'Design-DNA, Gesetz 8' },
      { art: 'karten', t: ['Woran wir ein passendes', 'Haus erkennen.'], hinweis: 'Vorschlag', karten: [
        { m: 'Die Menschen', b: 'Entscheider sind erreichbar', p: 'Es wird von einer Familie oder den Inhabern geführt.' },
        { m: 'Das Niveau', b: 'Besser als die Website', p: 'Haus, Küche und Service sind sichtbar besser als die heutige Website.' },
        { m: 'Die Welt', b: 'Eine eigene Geschichte', p: 'Es hat eine eigene Geschichte oder einen besonderen Ort, aus dem wir eine Welt bauen können. Und eine KI gibt heute über das Haus falsche oder dünne Antworten. Das prüfen wir vorher.' }
      ] },
      { art: 'mk', t: ['Annas Netzwerk', 'zählt hier am meisten.'], lead: 'Häuser, die sie in der Schweizer Hotellerie kennt, öffnen die Tür leichter als ein Brief von Unbekannten.' },
      { art: 'fenster', foto: 'studio', s: 'Eine neue Website wird aufgeschoben.', u: 'Eine falsche KI-Antwort trifft das Haus beim nächsten Gast.', von: 'Annas Gedanke, 30.10.2026' }
    ],
    q: [['str', 'Kapitel 01 «Zum Ansehen», Kapitel 03 Kunden'], ['pos', 'Abschnitt «Was daraus folgt» (Zielgruppe der Agentur)'], ['ang', 'Abschnitte «Hotel-Portfolios» (Schlössli, Schäfli), «Netzwerkpreis Hannover»'], ['dna', 'Abschnitte «Was die abgenommenen Häuser über die DNA zeigen», «Was Culinarium Hannover über die DNA zeigt»']]
  },
  {
    k: 'erkennen', gruppe: 'wie', titel: 'Woran man uns erkennt', foto: 'speicherstadt',
    h1: ['Woran man uns', 'erkennt.'],
    satz: 'Ruhe, Klarheit, Ordnung und eine Form von Qualität, die nicht erklärt werden muss, weil sie im Aufbau sofort spürbar ist.',
    kurz: 'Die Bildwelt, das Licht, die Stimme. Logo, Schrift und Farben stehen im Markenbuch.',
    lage: [['Licht', 'Warmes Licht im Dunkeln'], ['Stimme', 'Ruhig, klar, ohne Show'], ['Logo, Schrift, Farben', 'Im Markenbuch']],
    teile: [
      { art: 'mk', t: ['Qualität, die man', 'im Aufbau spürt.'], lead: 'Apple-inspiriert in der Haltung dahinter, ohne Kopie und ohne Effekthascherei. Das Design ist präzise und bewusst geführt. Es vermittelt, dass hier jemand arbeitet, der nicht nur gestaltet, sondern Systeme mit Substanz baut.' },
      { art: 'fenster', foto: 'faehre', s: 'Warmes Licht im Dunkeln.', u: 'Kerze, Laterne, Abendsonne, beleuchtete Theke: kleine warme Lichtpunkte gegen dunkles Holz, dunkles Blau, Backstein oder Nacht.', von: 'Das erste Gesetz der Design-DNA' },
      { art: 'beleg', haus: 'Culinarium Hannover', bild: 'cu-glas', b: 'Hier ist das Licht das ganze Haus.',
        p: 'Nacht und Kerze, Gesichter im Kerzenlicht, Gläser im Gegenlicht. Fremde Akzente, Pink für eine Zahl, wurden sofort abgelehnt. Auszeichnungen wie Falstaff stehen im eigenen Originalton.',
        von: 'Design-DNA, Gesetze 1 und 6' },
      { art: 'reihen', t: ['Die', 'Bildwelt.'], reihen: [
        ['Film statt Hochglanz', 'Korn, Gegenlicht, goldene Stunde, echte Schatten. Nichts sieht nach Studio, Stock oder KI aus.'],
        ['Der Ort ist der Held', 'Produkt und Mensch gehören dazu, aber der Ort gibt die Stimmung. Was das Haus einzigartig macht, kommt nach vorn.'],
        ['Ein Farbpunkt pro Bild', 'Rot und Orange sind Punkte, nie Flächen. Alles andere bleibt gedeckt. Ein Punkt lenkt den Blick, fünf Punkte lenken ab.'],
        ['Gebrauchsspuren', 'Echt schlägt perfekt, aber nicht amateurhaft: Gebrauchsspuren gehören in das Motiv, nicht in die Aufnahme.'],
        ['Dicht heisst edel', 'Wenige, grosse, ruhige Bilder statt vieler kleiner.']
      ] },
      { art: 'bilder', haus: 'Culinarium Hannover', t: ['Die echten', 'Abendfotos.'], lead: 'Getragen haben die Fotos von Rudi, nicht die Plakate, so stark sie sind. Die Plakate wurden zum Archiv, nie zum grossen Bild.', bilder: [
        ['cu-teller', 'Der Teller von oben'], ['cu-tresen', 'Am Tresen'], ['cu-gaeste', 'Die lange Tafel'], ['cu-anstossen', 'Gläser im Gegenlicht']
      ] },
      { art: 'mk', t: ['Vertrauen entsteht', 'durch Ordnung.'], lead: 'Nicht über Testimonials, Badges oder laute Signale, sondern über Ordnung, Konsistenz und Präzision. Selbst Angebote und Projektunterlagen sehen aus wie Teile eines Markenauftritts.' },
      { art: 'mk', t: ['Sprache ist ein', 'Werkzeug.'], lead: 'Ruhig, klar, ohne Show. Jeder Satz hat einen Zweck. Wir sprechen wie jemand, der den Betrieb kennt, nicht wie eine Agentur, die etwas verkaufen will. Auf der Website und in Unterlagen siezen wir, auf LinkedIn duzen wir. Keine Emojis.' },
      { art: 'sonie', so: ['Gäste fragen heute eine KI, bevor sie buchen.', 'Jeder Teller von Hand angerichtet.', 'Eine Website, die sich anfühlt wie das Haus.'], nie: ['Vom Chaos zur Klarheit.', 'Klar statt laut.', 'Vierzehn Teller, jeden Abend.', 'Revolutionieren Sie Ihr Hotel mit KI!'] },
      { art: 'reihen', t: ['Was sofort', 'nach KI klingt.'], lead: 'Steht eins davon im Text, kommt es raus.', reihen: [
        ['Sprüche aus Gegensatzpaaren', 'Keine «Kein X, sondern Y»-Sätze und keine Kurz-Sprüche wie «Klar statt laut.». Stattdessen ein normaler Satz, der sagt, was passiert.'],
        ['Dreierreihen', 'Keine Dreierreihen als Stilmittel, zum Beispiel «rechnet, trackt und strukturiert».'],
        ['Gedankenstriche', 'Keine Gedankenstriche als Satztrenner.'],
        ['Marketing-Sprache', 'Keine grossen Versprechen, keine leeren Superlative, keine künstliche Dringlichkeit, keine aufgesetzte Begeisterung.'],
        ['Kundendaten', 'Namen, Preise und Formulierungen der Häuser werden aus dem Original übernommen, nie verschönert.']
      ] },
      { art: 'fenster', foto: 'anleger', s: 'Jedes Wort hat Arbeit zu leisten.', u: 'Klarheit ist eine Form von Respekt.', von: 'Die Stimme in einem Satz' },
      { art: 'verweis', ziel: '11-markenbuch', b: 'Logo, Schriften und Farben', p: 'Die Bausteine selbst, mit Farbwerten und Dateien, stehen im Markenbuch. Hier steht, warum sie so sind.' }
    ],
    q: [['brand', 'Abschnitte «Designphilosophie», «Vertrauensmechanik», «Der entscheidende Punkt»'], ['dna', 'Abschnitte «Der Core» (Gesetze 1, 2, 4, 6, 7), «Was Culinarium Hannover über die DNA zeigt»'], ['str', 'Kapitel 07 Stimme'], ['stil', 'Abschnitte «Grundton», «Kernregeln»'], ['stimme', 'Abschnitte «Die Stimme in einem Satz», «Anti-KI-Checkliste»']]
  },
  {
    k: 'bauen', gruppe: 'wie', titel: 'Was wir bauen', foto: 'bildschirm',
    h1: ['Was wir', 'bauen.'],
    satz: 'Die Website, die Werkzeuge für das Team und die Werkbank mit Unterlagen, Drucksachen, Feed-Vorschau und Potenzialanalyse. Ein kompletter Auftritt entsteht in rund zwei Tagen.',
    kurz: 'Website, Werkzeuge, Werkbank: gezeigt am Culinarium, mit vorher und nachher.',
    lage: [['Einmal, Festpreis', 'Website'], ['Monatlich, fest', 'Wartung'], ['Monatlich, je Werkzeug', 'Sieben Werkzeuge']],
    teile: [
      { art: 'mk', t: ['Ein Haus muss sich', 'nichts vorstellen.'], lead: 'Es kann seinen fertigen Auftritt anklicken. Wir bauen den Auftritt vor, zeigen ihn und reden erst dann über Geld. Das gilt seit dem 1. Oktober 2026.' },
      { art: 'vh', haus: 'Culinarium Hannover', t: ['Vorher', 'und nachher.'], lead: 'Links der Auftritt, wie er vorher war, rechts der gebaute Entwurf. Culinarium bleibt Nacht und Kerze, getragen von den echten Abendfotos.', paare: [
        ['cu-startseite-alt', 'cu-startseite-neu', 'Der erste Eindruck'], ['cu-abend-alt', 'cu-abend-neu', 'Ein Abend'], ['cu-abende-alt', 'cu-abende-neu', 'Alle Abende']
      ] },
      { art: 'reihen', t: ['Die drei', 'Teile.'], lead: 'Die Idee aus dem Gespräch am 4. November: drei klare Teile, die jedes Haus sofort versteht. Das Haus nimmt nur, was es braucht, und kann später dazunehmen.', hinweis: 'Vorschlag', reihen: [
        ['Website', 'Gestaltet aus der Welt des Hauses, mit der Buchung verbunden, lesbar für Gäste und KI. Einmal, Festpreis.'],
        ['Wartung', 'Server, Domain, Sicherungen, kleine Änderungen, das aktuell gehaltene Wissen der KI. Monatlich, fest. Den Verbrauch der KI zahlt das Haus direkt beim Anbieter.'],
        ['Werkzeuge', 'Jedes der sieben einzeln. Monatlich je Werkzeug.'],
        ['Gruppenbetreuung', 'Für Familien mit mehreren Häusern: Systeme, Inhalte, Technik und KI für alle Häuser aus einer Hand. Ein Gedanke vom 16.10.2026.']
      ] },
      { art: 'bilder', haus: 'Culinarium Hannover', t: ['Die Werkzeuge', 'für das Team.'], lead: 'Die Werkzeuge aus dem Grand Beau-Rivage stehen für Produkte, die sich auf jedes Haus übertragen lassen. Beim Culinarium heissen sie wie dort.', klein: true, geraet: true, bilder: [
        ['cu-werkzeug-maison', 'La Maison', 'Die Zentrale'], ['cu-werkzeug-bureau', 'Le Bureau', 'Website pflegen'], ['cu-werkzeug-carte', 'La Carte', 'Karten pflegen'],
        ['cu-werkzeug-reception', 'La Réception', 'Das Team hinter dem Gäste-Chat'], ['cu-werkzeug-livre', 'Le Livre', 'Die Marke zum Arbeiten'], ['cu-werkzeug-registre', 'Le Registre', 'Besuche der Website'],
        ['cu-werkzeug-imprimerie', 'L’Imprimerie', 'Drucksachen und Beiträge']
      ] },
      { art: 'bilder', haus: 'Culinarium Hannover', t: ['Die', 'Werkbank.'], lead: 'Zu jeder Website gehört das ganze Paket: Website, Drucksachen, Feed und Unterlagen, alles aus einem Guss.', geraet: true, bilder: [
        ['cu-werkbank-website', 'Website'], ['cu-werkbank-drucksachen', 'Drucksachen'], ['cu-werkbank-feed', 'Feed'], ['cu-werkbank-unterlagen', 'Unterlagen']
      ] },
      { art: 'karten', t: ['Der Einstieg:', 'der KI-Check.'], lead: 'Gäste fragen ChatGPT, bevor sie buchen. Deshalb gehen wir über dieses akute Problem ins Gespräch und nicht über «Sie brauchen eine neue Website». Der vorgebaute Auftritt ist dann die Lösung, die schon fertig daliegt.', hinweis: 'Vorschlag', karten: [
        { m: 'Fragen', b: 'Was die KI sagt', p: 'Wir stellen ChatGPT und Gemini die Fragen, die Gäste in der Region stellen, und halten fest, was über das Haus gesagt wird und was davon nicht stimmt.' },
        { m: 'Prüfen', b: 'Ob eine KI die Seite lesen kann', p: 'Angaben zum Haus in der Form, die Google und KI lesen, ein Teil mit Fragen und Antworten, eine Sitemap.' },
        { m: 'Zeigen', b: 'Bericht und fertiger Auftritt', p: 'Das Haus bekommt das Ergebnis als kurzen Bericht, zusammen mit dem vorgebauten Auftritt, der die Lücken schliesst. In der Betreuung wiederholen wir die Stichprobe jeden Monat.' }
      ] },
      { art: 'beleg', haus: 'Grand Beau-Rivage, Interlaken', b: 'Was wir aus dem Rivage gelernt haben.',
        p: 'Gäste bekamen das Rivage von einer KI empfohlen, kamen an und waren enttäuscht, weil die Antwort nicht der Wirklichkeit entsprach. Das Angebot ans Rivage ging raus, bevor die Eigentümer wussten, was dahintersteht. Am 1. Oktober haben sie sich gegen den Neubau entschieden. Seitdem gilt die umgekehrte Reihenfolge.',
        von: 'Strategiepapier, Kapitel 01 und 04' },
      { art: 'weg', t: ['Vom Haus', 'zur Betreuung.'], hinweis: 'Vorschlag', schritte: [
        ['Haus auswählen', 'Nach den Merkmalen im Kapitel «Für wen wir arbeiten». Anna bringt Häuser aus ihrem Netzwerk ein.', 'gemeinsam'],
        ['KI-Check und Auftritt vorbauen', 'Rund zwei Tage je Haus.', 'Robert'],
        ['Brief mit QR-Code', 'Auf gutem Papier, dazu ein kurzes Video, in dem wir dem Haus seine neue Seite zeigen.', 'gemeinsam'],
        ['Anrufen', 'Nach rund einer Woche anrufen und ein Gespräch vereinbaren.', 'Anna'],
        ['Gespräch', 'Mit Familie oder Direktion. Anna führt, Robert zeigt die Werkzeuge.', 'gemeinsam'],
        ['Fertigstellen', 'Alles vollständig prüfen, online stellen und das Team in die Werkzeuge einführen.', 'Robert'],
        ['Betreuung', 'Monat für Monat. Anna ist die Ansprechpartnerin, Robert kümmert sich um Technik und Inhalte.', 'gemeinsam']
      ] },
      { art: 'preise', t: ['Was schon einen', 'Preis hat.'], lead: 'Beträge nur aus dem Angebot. Seit dem 8. November gehen Angebote an die Designstudien mit Zahlen raus.', reihen: [
        ['Netzwerkpreis Hannover, Website', 'einmalig, netto', '1.900 €', 'Für die ersten zehn Betriebe aus Hannover (03.11.2026)'],
        ['Netzwerkpreis Hannover, Betreuung Basis', 'monatlich, netto', '59 €', 'Monatlich kündbar: Website online, Domain, Sicherungen, Die Tafel, eine kleine Änderung im Monat'],
        ['Netzwerkpreis Hannover, Betreuung Plus', 'monatlich, netto', '129 €', '12 Monate: zwei Werkzeuge nach Wahl, Änderungen bis eine Stunde im Monat'],
        ['Netzwerkpreis Hannover, Betreuung Komplett', 'monatlich, netto', '199 €', '12 Monate: alle sieben Werkzeuge, Vorrang bei Anfragen'],
        ['Designstudien Schweiz, Hotel', 'einmal, netto', 'CHF 10’000', 'Website und Werkzeuge je Haus; Betreuung Paket 1 CHF 500, Paket 2 CHF 1’200 im Monat (08.11.2026)'],
        ['Designstudien Schweiz, Restaurant', 'einmal, netto', 'CHF 5’000', 'Schäfli und Schlössli; Betreuung Paket 1 CHF 300, Paket 2 CHF 700 im Monat (08.11.2026)'],
        ['Backoffice nach Mass', 'einzeln', '2.000–2.500 EUR', 'Individuell zugeschnitten (18.06.2026)'],
        ['Masterclass Gastro Air · Studio · Max', 'Listenpreis, einmal', '499 € · 699 € · 899 €', 'Entschieden 24.07.2026; zum Start 299 € · 499 € · 649 €']
      ] }
    ],
    q: [['str', 'Kapitel 01 Stand, «Was wir aus dem Rivage gelernt haben», Kapitel 04 Einstieg, Kapitel 05 Angebot (ohne Beträge), Kapitel 06 Vertrieb'], ['pos', 'Abschnitt «Die Module, abstrahiert», «Was daraus folgt»'], ['ang', 'Abschnitte «Netzwerkpreis Hannover», «Hotel-Portfolios», «Ebene 2: B2B-Custom-Preis», «Gastronomy AI Masterclass»'], ['proj', 'Eintrag «Culinarium Hannover — Website»']]
  },
  {
    k: 'werkzeuge', gruppe: 'wie', titel: 'Unsere Werkzeuge', foto: 'plan',
    h1: ['Unsere', 'Werkzeuge.'],
    satz: 'Was jedes der sieben Werkzeuge kann, wie es in den einzelnen Häusern heisst und welche Werkzeuge nur ein Haus hat. Zum Nachlesen vor jedem Gespräch.',
    kurz: 'Die sieben Werkzeuge Funktion für Funktion, ihre Namen je Haus und die eigenen Werkzeuge einzelner Häuser.',
    lage: [['Für jedes Haus', 'Sieben Werkzeuge'], ['Je Haus', 'Eigene Namen'], ['Dazu', 'Eigene Werkzeuge']],
    teile: [
      { art: 'mk', t: ['Sieben Werkzeuge,', 'jedes Haus anders.'], lead: 'Jedes Haus bekommt dieselben sieben Werkzeuge, gekleidet und benannt in seiner eigenen Welt. Unten jedes Werkzeug Funktion für Funktion, mit echten Bildschirmen und einem kurzen Film, am Beispiel Culinarium. Im Grand Beau-Rivage heissen sie französisch, im Ruedihus wie in einer Stube, im Culinarium wie an einem Abend. Einzelne Häuser haben dazu eigene Werkzeuge, die nur sie brauchen.' },
      { art: 'bilder', haus: 'Culinarium Hannover', t: ['So sehen sie', 'aus.'], lead: 'Die sieben Werkzeuge am Beispiel Culinarium. In jedem Haus sind es dieselben Funktionen.', klein: true, geraet: true, bilder: [
        ['cu-werkzeug-maison', 'La Maison', 'Die Zentrale'], ['cu-werkzeug-bureau', 'Le Bureau', 'Website pflegen'], ['cu-werkzeug-carte', 'La Carte', 'Karten pflegen'],
        ['cu-werkzeug-reception', 'La Réception', 'Das Team hinter dem Gäste-Chat'], ['cu-werkzeug-livre', 'Le Livre', 'Die Marke zum Arbeiten'], ['cu-werkzeug-registre', 'Le Registre', 'Besuche der Website'],
        ['cu-werkzeug-imprimerie', 'L’Imprimerie', 'Drucksachen und Beiträge']
      ] },
      { art: 'werkzeug', k: 'maison', t: ['La Maison:', 'die Zentrale.'], lead: 'Der Eingang zu allen Werkzeugen des Hauses. Im Ruedihus «Die Stube», im Schlössli «Das Hafenbüro», im Culinarium «Der Tresen».', f: [
        ['Alle Werkzeuge an einem Ort', 'Jedes Werkzeug als Raum des Hauses im Bild, ein Klick öffnet es. Der Gruss richtet sich nach der Tageszeit, das Datum steht ausgeschrieben. Fährt man über ein Werkzeug, zeigt die Kachel eine Vorschau davon.', 'maison-start'],
        ['Der Stand jedes Werkzeugs', 'Unter jedem Werkzeug steht in einer Zeile, was gerade los ist, live aus dem Werkzeug gelesen: «8 Karten, alle veröffentlicht», «6 Anfragen offen». Antwortet ein Werkzeug nicht, steht ein Satz ohne Zahl. Geschätzt wird nie.', 'maison-saal'],
        ['Jedes Werkzeug erklärt sich', 'Zu jedem Werkzeug ein eigener Abschnitt mit echten Bildschirmen und «So geht’s» mit den Namen der Knöpfe, wie sie im Werkzeug stehen.', 'maison-saal2'],
        ['Besuche des Tages', 'Eine Zeile mit den Besuchen von heute und wie viele davon zur Buchung gingen, mit dem Weg in die Besucherliste. Unten alle Anleitungen, Schritt für Schritt.', 'maison-fuss'],
        ['Rundgang beim ersten Öffnen', 'Wer die Zentrale zum ersten Mal öffnet, wird in ein paar kurzen Schritten herumgeführt. Jedes Werkzeug hat dazu seine eigene Anleitung.', '']
      ] },
      { art: 'werkzeug', k: 'bureau', t: ['Le Bureau:', 'die Website pflegen.'], lead: 'Das Team ändert die Website selbst, ohne uns anzurufen. Im Carlton «Carlton Control», im Doldenhorn und Ruedihus «Studio», im Schäfli «Der Schreibtisch», im Schlössli und im Culinarium «Das Schaufenster».', f: [
        ['Übersicht', 'Was im Entwurf wartet, was auf der Website steht, die häufigsten Aufgaben und jeder Bereich der Website als Bild mit der Zahl offener Änderungen.', 'bureau-start'],
        ['Text direkt in der Seite', 'Links alle Texte einer Seite, rechts die Seite selbst, als Rechner oder Handy. Ein Klick auf einen Text öffnet ihn, beim Tippen ändert sich die Seite sofort. Steht derselbe Text mehrfach, ändert «Überall ändern» ihn auf einmal.', 'bureau-seite'],
        ['Fotos tauschen, Abschnitte ausblenden', 'Ein Foto aus den Fotos des Hauses wählen oder ein eigenes hochladen; es wird in alle Grössen gerechnet. Ein Abschnitt, eine Karte oder ein Angebot lässt sich ausblenden, ohne es zu löschen.', 'bureau-abend'],
        ['Angaben des Hauses', 'Telefon, Adresse, Öffnungstage und Links an einer Stelle. Das Werkzeug zeigt, wo jede Angabe überall steht, etwa «an 9 Stellen auf 8 Seiten», und prüft sie beim Speichern.', 'bureau-angaben'],
        ['Zeiten & Preise', 'Jede Uhrzeit, jeder Preis und jede Dauer der Website in einer Liste, mit Filter. «In der Seite» springt zur Stelle. Was auf mehreren Seiten gleich steht, wird einmal geändert.', 'bureau-zeiten'],
        ['Termine', 'Im Culinarium legt das Team hier die Abende an: Datum, Beginn, Preis und Plätze. Jeder Abend bekommt auf der Website sein eigenes Plakat.', 'bureau-termine'],
        ['Google-Texte', 'Titel und Beschreibung jeder Seite, wie sie bei Google erscheinen, mit Zähler für die Länge und einer Vorschau wie in der Trefferliste.', 'bureau-google'],
        ['Hinweis für Gäste', 'Ein Satz oben auf jeder Seite, etwa Betriebsferien oder ein besonderer Abend. Mit Zeitraum erscheint und verschwindet er von selbst.', 'bureau-hinweis'],
        ['Vorher und nachher', 'Alles wartet zuerst im Entwurf. Jede Änderung steht mit vorher und nachher da und lässt sich einzeln zurücknehmen. Erst «Veröffentlichen» stellt sie auf die Website.', 'bureau-entwurf'],
        ['Frühere Fassungen', 'Jede Veröffentlichung bleibt aufgehoben, mit Datum und Notiz, und lässt sich mit zwei Klicks zurückholen.', 'bureau-fassungen'],
        ['Sprachen', 'In Häusern mit mehreren Sprachen bekommt jeder geänderte Text ein Feld je Sprache, mit einem Vorschlag zur Übersetzung.', '']
      ] },
      { art: 'werkzeug', k: 'carte', t: ['La Carte:', 'die Karten.'], lead: 'Speisekarten, Weinkarten und Tagesmenüs aus einer Quelle für Website und PDF. Im Ruedihus und Schäfli «Die Tafel», im Schlössli «Das Kartenpult», im Culinarium «Die Pairing-Karte».', f: [
        ['Alle Karten an einem Ort', 'Die Karten des Hauses links, mit Datum der letzten PDF. Im Culinarium hat jeder Abend seine Karte, frühere Abende bleiben mit ihrem Plakat erhalten.', 'carte-start'],
        ['Einfach: eintragen, fertig', 'Gänge und Drinks in Feldern eintragen, rechts steht sofort die Karte, genau wie sie gedruckt wird. Ein Klick links oder rechts bringt beide Seiten auf dieselbe Stelle.', 'carte-karte'],
        ['Hinzufügen, verschieben, ausblenden', 'Neue Gerichte geführt anlegen, Rubriken verschieben, etwas kurz ausblenden. Preise kommen in der Schreibweise der Karte: aus «12,5» wird «12.50».', 'carte-tafel'],
        ['Fortgeschritten: gestalten', 'Direkt in der Karte schreiben, Elemente ziehen mit Einrasten, Ecken grösser und kleiner ziehen, Schrift, Grösse, Farbe und Abstände wählen. ⌘Z nimmt zurück.', 'carte-fortgeschritten'],
        ['Frühere Abende', 'Jede Karte eines früheren Abends lässt sich öffnen, ansehen und als Vorlage für den nächsten nehmen.', 'carte-frueher'],
        ['Mittagsmenü der Woche', 'In Häusern mit Mittag je Tag die Gänge eintragen; jeder Tag wird eine eigene Tageskarte, ruhig und mittig gesetzt. Die Küche veröffentlicht sie selbst.', ''],
        ['Probe, prüfen, veröffentlichen', 'Erst eine Probe-PDF. Beim Veröffentlichen druckt das Werkzeug die Karte, prüft sie Wort für Wort gegen die Eingaben und setzt die Restaurant-Seiten der Website in allen Sprachen. Frühere Fassungen bleiben abrufbar.', '']
      ] },
      { art: 'werkzeug', k: 'reception', t: ['La Réception:', 'das Team hinter dem Gäste-Chat.'], lead: 'Alles, was Gäste anfragen, landet hier. Im Ruedihus und Schäfli «Der Gastgeber», im Schlössli «Das Reservationsbuch», im Culinarium «Das Gästebuch».', f: [
        ['Übersicht', 'Wie viele Anfragen offen sind, welche Fragen der Chat nicht beantworten konnte und wie viel insgesamt gefragt wurde.', 'reception-start'],
        ['Eingang', 'Jede Anfrage aus dem Chat und den Formularen der Website, mit Gast, Datum, Personen und Wunsch. Dazu Hinweise fürs Team, aus den Angaben des Hauses: Ruhetag, mehr Personen als Plätze, eine Allergie.', 'reception-eingang'],
        ['Antwort im Ton des Hauses', 'Zu jeder Anfrage ein Antwortbrief aus den Vorlagen des Hauses, in der Sprache des Gastes, mit deutscher Fassung daneben. Als PDF-Brief oder Text zum Kopieren. Das Werkzeug verschickt nichts selbst.', 'reception-brief'],
        ['Die Abende', 'Im Culinarium für jeden Abend auf einen Blick: wie viele Plätze die Tafel hat, wie viele Tickets verkauft sind, wer fest zugesagt hat und was frei ist.', 'reception-abende'],
        ['Gutscheine', 'Gutscheine einlösen und ausstellen. Jeder bekommt eine eigene Nummer, und das Werkzeug sagt, ob ein Gutschein gilt.', 'reception-gutscheine'],
        ['Das wurde gefragt', 'Jede Frage an den Chat, nach Themen geordnet. Markiert ist, wo der Chat keine Antwort hatte.', 'reception-gefragt'],
        ['Einmal nachtragen', 'Fehlt dem Chat eine Antwort, trägt das Team sie einmal ein. Ab dann antwortet der Chat damit.', 'reception-nachgetragen'],
        ['Was der Chat weiss', 'Das ganze Wissen des Chats nach Bereichen: berichtigen, ausblenden, mit «gilt bis» ergänzen, einen Link oder eine Datei einlesen lassen.', 'reception-wissen'],
        ['Chat ausprobieren', 'Fragen wie ein Gast, im Fenster wie auf dem Handy, und sehen, was der Chat antwortet.', 'reception-chat']
      ] },
      { art: 'werkzeug', k: 'livre', t: ['Le Livre:', 'die Marke zum Arbeiten.'], lead: 'Alles, was das Haus für seinen Auftritt braucht. Im Ruedihus «Das Hausbuch», im Schlössli «Das Bildarchiv», im Culinarium «Das Markenbuch».', f: [
        ['Übersicht', 'Wie viele Fotos und Dateien da sind und was die Markenprüfung kann, mit dem Weg zu den Hausregeln.', 'livre-start'],
        ['Bildarchiv', 'Alle Fotos des Hauses, mit Suche und Filter nach Bereich, Format und Herkunft. Mit KI erzeugte Bilder sind gekennzeichnet, Fotos mit fremden Rechten auch.', 'livre-fotos'],
        ['Jedes Foto in fertigen Grössen', 'Ein Klick öffnet das Foto mit Beschreibung, Herkunft und Rechten, zum Laden für Instagram, Story, Website oder Druck. Bei nachgeschärften Fotos vorher und nachher.', 'livre-foto'],
        ['Logo & Dateien', 'Wortmarke, Logo, Tapete, Farben mit Werten zum Kopieren und Schriften, jede Datei einzeln oder alle zusammen. Hat das Haus Auszeichnungen, stehen ihre Logos in Originalfarben dabei.', 'livre-dateien'],
        ['Markenprüfung', 'Einen Entwurf hochladen, etwa ein Plakat einer Agentur. Das Werkzeug misst die Farben und prüft Bild, Schrift und Ton gegen die Marke, Punkt für Punkt.', 'livre-pruefung'],
        ['Die Hausregeln', 'Das Markenbuch zum Lesen, Seite für Seite, und als PDF.', '']
      ] },
      { art: 'werkzeug', k: 'registre', t: ['Le Registre:', 'die Besuche der Website.'], lead: 'Wer kommt, woher und was er sich ansieht. Im Ruedihus und Schäfli «Das Besucherbuch», im Schlössli und im Culinarium «Die Besucherliste».', f: [
        ['Übersicht', 'Besuche, angesehene Seiten, Zeit je Besuch und wie viele zur Buchung gingen, für 7, 30 oder 90 Tage.', 'registre-start'],
        ['Jeder Besuch', 'Ort, Tag und Uhrzeit, Gerät, Sprache, woher der Gast kam und sein Weg durch die Seiten, mit Sekunden je Seite.', 'registre-besuche'],
        ['Herkunft', 'Aus welchen Ländern und Orten die Gäste kommen, in welcher Sprache und über welche Website.', 'registre-herkunft'],
        ['Zeit', 'Zu welcher Stunde und an welchem Wochentag die Gäste vorbeischauen. So sieht das Haus, wann ein Beitrag am meisten bringt.', 'registre-zeit'],
        ['Seiten', 'Welche Seiten am meisten gesehen werden und wie lange.', 'registre-seiten'],
        ['Verlauf', 'Die Besuche Tag für Tag, neben dem Zeitraum davor.', 'registre-verlauf'],
        ['Was zur Buchung führt', 'Von welchen Seiten aus gebucht wird, als Anteil an allen Besuchen.', 'registre-platz'],
        ['Ohne Cookies', 'Keine Namen, keine Adresse im Speicher, was gezählt wird und was nie, steht im Werkzeug. Alle Besuche lassen sich als Tabelle sichern.', 'registre-zaehlung']
      ] },
      { art: 'werkzeug', k: 'imprimerie', t: ['L’Imprimerie:', 'Drucksachen und Beiträge.'], lead: 'Gedrucktes und Beiträge im Stil des Hauses, ohne Grafiker. Im Ruedihus und Schäfli «Die Werkstatt», im Schlössli «Die Hausdruckerei», im Culinarium «Die Plakatwerkstatt».', f: [
        ['In einem Satz sagen', 'Was entstehen soll, steht in einem Satz, etwa «ein Plakat für den nächsten Abend». Das Werkzeug wählt Format, Aufbau, Fotos und Farben des Hauses.', 'imprimerie-start'],
        ['Fünf Entwürfe zur Wahl', 'Aus dem Satz werden fünf Entwürfe. Einer wird gewählt und im Editor fertig gemacht.', 'imprimerie-entwuerfe'],
        ['Direkt auf dem Blatt', 'Bearbeiten wie in Canva: Text auf dem Blatt schreiben, Elemente ziehen mit Einrasten, rechts Schrift, Grösse und Farbe aus der Marke.', 'imprimerie-text'],
        ['Fotos des Hauses', 'Ein Klick tauscht das Foto, nur Fotos aus dem Markenbuch; eigene lassen sich dazulegen. Den Ausschnitt zieht man mit der Maus.', 'imprimerie-fotos'],
        ['Anlässe & Events', 'Die nächsten Abende und Anlässe des Hauses, zu jedem vier fertige Motive.', 'imprimerie-events'],
        ['Vorlagen in vielen Arten', 'Plakate, Menükarten, Platzkarten, Gutscheine, Aushänge, Beiträge und Storys, alle im Stil des Hauses.', 'imprimerie-arten'],
        ['Anderes Format', 'Hoch oder quer, A5 bis A3, Beitrag oder Story: Texte und Fotos bleiben, der Aufbau passt sich an.', 'imprimerie-format'],
        ['Fertig für die Druckerei', 'PDF mit Beschnitt und Schnittmarken, Fotos in Druckqualität. Vorher prüft das Werkzeug, ob etwas zu nah am Rand steht oder ein Foto zu klein ist.', 'imprimerie-druck']
      ] },
      { art: 'reihen', t: ['So heissen sie', 'in den Häusern.'], lead: 'Dieselben Werkzeuge in der Reihenfolge Zentrale, Website, Karten, Gäste, Marke, Besuche, Drucksachen.', reihen: [
        ['Grand Beau-Rivage', 'La Maison · Le Bureau · La Carte · La Réception · Le Livre · Le Registre · L’Imprimerie'],
        ['Carlton-Europe', 'La Maison · Carlton Control · La Carte · La Réception · Le Livre · Le Registre · L’Imprimerie'],
        ['Waldhotel Doldenhorn', 'La Maison · Studio · La Carte · La Réception · Le Livre · Le Registre · L’Imprimerie'],
        ['Ruedihus, Gasterntal', 'Die Stube · Studio · Die Tafel · Der Gastgeber · Das Hausbuch · Das Besucherbuch · Die Werkstatt'],
        ['Taverne zum Schäfli', 'Die Stube · Der Schreibtisch · Die Tafel · Der Gastgeber · Das Hausbuch · Das Besucherbuch · Die Werkstatt'],
        ['Wirtschaft am Schlössli', 'Das Hafenbüro · Das Schaufenster · Das Kartenpult · Das Reservationsbuch · Das Bildarchiv · Die Besucherliste · Die Hausdruckerei'],
        ['Culinarium Hannover', 'Der Tresen · Das Schaufenster · Die Pairing-Karte · Das Gästebuch · Das Markenbuch · Die Besucherliste · Die Plakatwerkstatt']
      ] },
      { art: 'karten', t: ['Eigene Werkzeuge', 'einzelner Häuser.'], lead: 'Nicht jedes Haus braucht dasselbe. Was ein Haus besonders macht, bekommt ein eigenes Werkzeug.', karten: [
        { m: 'Culinarium und Wild Side', b: 'Die Künstlerliste', p: 'Anfragen von Künstlern für die Abende in der Bar, gesammelt an einem Ort (seit 06.11.2026).' },
        { m: 'Grand Beau-Rivage', b: 'Le Banquet', p: 'Anlässe planen, kalkulieren und Angebote dafür schreiben (seit 16.10.2026, nur auf dem Rechner).' },
        { m: 'Angelina Strelow', b: 'Vier Werkzeuge für Gastgeberinnen', p: 'Anfragen & Angebote, Der Abendplan, Tischkarten & Menü und Nach dem Abend, gebaut rund um ihre Abende (Angebot vom 06.11.2026).' }
      ] },
      { art: 'karten', t: ['Keine Werkzeuge,', 'sondern Beigaben.'], lead: 'Zum Auftritt gehören Dinge, die wir einmal bauen und mitgeben. Sie sind keine Werkzeuge, mit denen das Team täglich arbeitet.', karten: [
        { m: 'Werkbank', b: 'Alles auf einer Seite', p: 'Website, Werkzeuge und Beigaben eines Hauses zum Durchklicken, für das Gespräch.' },
        { m: 'Gedrucktes', b: 'Drucksachen und Unterlagen', p: 'Karten, Plakate, Mappen und die Unterlagen des Hauses im neuen Stil; dazu Gegenstände wie Kofferetiketten, Zündhölzer oder Untersetzer.' },
        { m: 'Online', b: 'Feed und Mails', p: 'Der Feed als Handy-Vorschau und die Mail-Vorlagen für Gäste im Kleid des Hauses.' }
      ] }
    ],
    q: [['wzb', 'Abschnitt 4 «Die sieben Werkzeuge, Funktion für Funktion» und Abschnitt 1 (Namen je Haus)'], ['proj', 'Häuser und ihre Werkzeuge']]
  },
  {
    k: 'wohin', gruppe: 'wohin', titel: 'Wohin es geht', foto: 'faehre',
    h1: ['Wohin es', 'bis Ende 2027 geht.'],
    satz: 'Die Zeiten richten sich nach dem, was jeder von uns einbringen kann. Sie sind ein Rahmen zum Besprechen, kein Plan, an dem wir uns messen.',
    kurz: 'Was heute steht, der Fahrplan bis Ende 2027 und was wir bewusst nicht machen.',
    lage: [['Ein Auftritt', 'in rund zwei Tagen'], ['Vorgebaut', 'für rund zehn Häuser'], ['Masterclass', 'rund 60 Prozent']],
    teile: [
      { art: 'zahlen', t: ['Was es', 'heute gibt.'], lead: 'In den letzten zwei Jahren ist eine Grundlage entstanden, die man zeigen kann.', zahlen: [
        ['2', 'Tage', 'Ein kompletter Auftritt entsteht in rund zwei Tagen.'],
        ['80', 'Prozent', 'Die KI erledigt etwa 80 Prozent, die restlichen 20 Prozent machen ihn hochwertig.'],
        ['10', 'Häuser', 'Für rund zehn Häuser ist der Auftritt vorgebaut. Sie bekommen einen Brief mit QR-Code.'],
        ['60', 'Prozent', 'So weit ist die Masterclass. Modul 2 ist online zu sehen.']
      ] },
      { art: 'fenster', foto: 'speicherstadt', s: 'Ein Rahmen zum Besprechen,', u: 'kein Plan, an dem wir uns messen.', von: 'Kapitel 10 Fahrplan' },
      { art: 'weg', t: ['Der', 'Fahrplan.'], hinweis: 'Vorschlag', zeit: true, schritte: [
        ['Bis Ende 2026', 'Logo in Auftrag geben, Preise festlegen, den KI-Check als festen Ablauf beschreiben. Annas Foto, Mail-Adresse und Signatur. Erste Briefe an die vorbereiteten Häuser.', ''],
        ['Januar bis März 2027', 'Gespräche und erste Abschlüsse. LinkedIn im festen Rhythmus, erste YouTube-Folge.', ''],
        ['April bis Juni 2027', 'Die Betreuung bringt jeden Monat einen festen Betrag. Das Backoffice wird den betreuten Häusern angeboten. Pilot «Jedem Gast seine Seite» mit einem Haus.', ''],
        ['Zweites Halbjahr 2027', 'Masterclass fertig und im Verkauf. Pilot auswerten, danach der Marketing-Anlass «Jedem Gast seine Seite».', '']
      ] },
      { art: 'mk', t: ['Später: jedem Gast', 'seine Seite.'], lead: 'Die Website zeigt jedem Gast, was zu ihm passt, der Familie den Kinderclub, dem Paar das Spa. Wir versprechen das erst, wenn es erprobt ist: als Pilot mit einem Haus über zwei bis drei Monate.' },
      { art: 'reihen', t: ['Wo wir', 'sichtbar werden.'], reihen: [
        ['LinkedIn, der Schwerpunkt', 'Hier sitzen Hoteliers, Direktionen und Verbände. Persönliche Profile von Robert und Anna plus die Firmenseite. Themen: falsche KI-Antworten über Häuser, Einblicke in den Bau, der Betrieb aus Annas Sicht.'],
        ['Instagram und Facebook', 'Ein Inhalt, auf beiden gleichzeitig veröffentlicht. Der Feed zeigt die Welt der Marke: Hafen, Abendlicht, Arbeit an den Häusern.'],
        ['YouTube', 'Lange Videos, in denen man sieht, wie wir denken und bauen, und persönliche Videos für einzelne Häuser, nicht gelistet.'],
        ['Newsletter «Post aus dem Studio»', 'Gemeinsam, einmal im Monat.']
      ] },
      { art: 'mk', t: ['Neues Zeichen,', 'gleicher Name.'], lead: 'Der Name Tasty Studios bleibt. Das Logo wird neu: klein lesbar, auf Nachtblau und auf Creme, ruhig und hochwertig, kein Tech-Look. Es soll neben den Häusern bestehen, für die wir arbeiten, ohne sich vorzudrängen.' },
      { art: 'fenster', foto: 'anleger', s: 'Was wir bewusst', u: 'nicht machen. Manches lassen wir, weil der Aufwand im Moment nicht passt. Anderes versprechen wir erst, wenn es erprobt ist.', von: 'Kapitel 10 Fahrplan' },
      { art: 'reihen', t: ['Bewusst', 'gelassen.'], reihen: [
        ['Ein eigenes CRM für Gastronomie und Hotellerie', 'Der Aufwand passt im Moment nicht.'],
        ['Eine Buchungs-App in ChatGPT', 'Das ist eine eigene grosse Baustelle.'],
        ['«Jedem Gast seine Seite» verkaufen', 'Nicht, bevor der Pilot ausgewertet ist.'],
        ['Telefon-KI als Hauptbotschaft', 'Das Feld ist überfüllt. Wir stellen es nicht nach vorn.']
      ] },
      { art: 'karten', t: ['Was wir bauen können', 'und was nicht.'], karten: [
        { m: 'Können wir', b: 'Lesbar für Google und KI', p: 'Angaben zum Haus für Google und KI, Fragen und Antworten, monatliche Stichprobe in ChatGPT, Inhalte, die sich nach der Wahl des Gastes richten, nach Einstiegslink, Sprache und Land.' },
        { m: 'Nicht ohne Weiteres', b: 'Was eine eigene Baustelle wäre', p: 'Eine eigene Buchungs-App in ChatGPT, eine Vorhersage, wie wahrscheinlich ein Besucher bucht, und das Auslesen fremder Buchungsmasken.' },
        { m: 'Was wir nie sagen', b: 'Keine Marketing-Sprache', p: 'Keine künstliche Dringlichkeit, keine Emojis in Unterlagen. Nicht «Webdesign-Agentur», nicht «Website-Agentur».' }
      ] }
    ],
    q: [['str', 'Kapitel 01 Stand, Kapitel 05 «Später», Kapitel 08 Logo und Schrift, Kapitel 09 Kanäle, Kapitel 10 Fahrplan und «Was wir bewusst nicht machen» (ohne Partnerschaft, Steuerberatung und Gründung), Kapitel 04 «Was wir bauen können und was nicht»'], ['pos', 'Abschnitt «Markt-Beleg» (Telefon-KI meiden), «Was daraus folgt» (Selbstbeschreibung)']]
  }
];
