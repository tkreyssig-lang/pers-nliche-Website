# Tom Kreyssig — Portfolio-Website

Statische Seite (reines HTML/CSS/JS, keine Build-Tools nötig).

## Struktur
- `index.html` — Startseite (Hero, Über mich, Showreel, Arbeiten, Produktionsfotos, Skills, Technik, Kunden, Kontakt)
- `impressum.html` — Impressum
- `contact.php` — Verarbeitet das Kontaktformular (siehe unten)
- `css/style.css` — Design (cinematic/dunkel)
- `js/main.js` — Navigation, Video-/Foto-Modal, Kontaktformular-Statusanzeige

## Lokal ansehen
Am zuverlässigsten über einen lokalen Server statt Doppelklick auf `index.html`
(manche Browser/Vorschau-Modi laden sonst Stylesheets nicht zuverlässig):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/server.ps1
```

Dann `http://localhost:5500` öffnen.

## Hosting
Wichtig: `contact.php` braucht einen Server mit **PHP-Unterstützung** (z. B. Hostinger).
Reine statische Hoster wie Netlify oder GitHub Pages können PHP nicht ausführen —
dort müsste das Kontaktformular auf einen externen Formular-Dienst (z. B. Formspree)
umgestellt werden. Einfach den kompletten Ordner (ohne `.claude/`) per Hostinger-
Dateimanager/FTP hochladen, kein Build-Schritt nötig.

## Kontaktformular
- Sendet per PHP `mail()` an `tom.kreyssig@web.de`, Antworten gehen direkt an die
  Absender-E-Mail (Reply-To)
- Einfacher Spam-Schutz über ein unsichtbares Honeypot-Feld
- Nach dem Absenden Redirect zurück zur Kontakt-Sektion mit Erfolgs-/Fehlermeldung
- **Offen**: In `contact.php` steht als Absenderadresse noch `webseite@tomkreyssig.de` —
  sobald die echte Domain feststeht, dort eintragen (verbessert Zustellbarkeit)

## Produktionsfotos hinzufügen
1. Bilddateien nach `assets/produktionsfotos/` kopieren
2. In `index.html` im Bereich `<div class="photo-grid" id="photoGrid">` je Foto eine Zeile ergänzen:
   ```html
   <img src="assets/produktionsfotos/DATEINAME.jpg" alt="Kurze Beschreibung" loading="lazy">
   ```
3. Klick auf ein Foto öffnet es groß im Lightbox-Modal (automatisch, kein weiterer Schritt nötig)
4. Die Galerie ist standardmäßig eingeklappt hinter dem Button "Fotos anzeigen"
