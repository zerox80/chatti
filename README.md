# Chatti · Lesewerk für deine eigene ChatGPT-Site

Eine Lernplattform für ausführliche **Textkurse statt Videos**. Du nennst zum Beispiel „LPIC-1“. ChatGPT erstellt das Inhaltsverzeichnis, ordnet es in Module und arbeitet die Lektionen einzeln aus. Lesen, Übungen, Notizen und Fortschritt findest du in deiner eigenen Website.

**Dieses Repository ist eine Vorlage für ChatGPT Sites.** Jeder Nutzer erstellt seine eigene Site in seinem eigenen Konto, mit eigenem Speicher und einer eigenen Lesewerk-Erweiterung. Du brauchst keinen OpenAI-API-Schlüssel und keinen eigenen Server. Die App sendet selbst keine Modell-API-Anfragen: Die Texte entstehen in deinem Chat und werden über die Erweiterung gespeichert.

## Das kopierst du in Codex

**Repo klonen → Ordner in Codex öffnen → den folgenden Text einfügen.** Codex erledigt Einrichtung, Speicher und Veröffentlichung. Du brauchst keine Befehle aus dieser README selbst auszuführen und nicht in einen anderen Chat zu wechseln. Der Text liegt auch separat in [CODEX-START.md](CODEX-START.md).

Voraussetzung: Die **Sites-Erweiterung muss in deinem Codex-Konto verfügbar sein**. Falls das Konto eine Anmeldung oder Installationsbestätigung verlangt, zeigt Codex den konkreten Schritt an.

```text
Richte mir aus dem hier geöffneten Repository zerox80/chatti eine eigene Lesewerk-Lernplattform mit ChatGPT Sites ein. Führe die Einrichtung selbst aus; gib mir nicht bloß eine Anleitung.

Ich möchte eine eigene veröffentlichte ChatGPT-Site in meinem Konto, mit eigenem dauerhaftem D1-Speicher, ChatGPT-Anmeldung und eigener Lesewerk-Erweiterung. Kein eigener Server, kein Docker, kein OpenAI-API-Schlüssel und keine Modell-API-Aufrufe aus der Web-App.

Lies zuerst README.md, AGENTS.md und docs/CHATGPT-SITES.md des Repositorys sowie den verfügbaren Sites-Skill. Verwende den vorhandenen Quellcode und erhalte seine Funktionen. Nutze den geöffneten Checkout; nur falls er fehlt, klone https://github.com/zerox80/chatti. Übertrage seine versionierten Dateien ohne .git und ohne lokale Laufzeitdaten in einen separaten persönlichen Site-Ordner.

Die Vorlage hat absichtlich keine project_id. Registriere genau eine neue Site über das Sites-Tool in meinem Konto und schreibe die tatsächlich zurückgegebene project_id ausschließlich in .openai/hosting.json meiner persönlichen Kopie. Erhalte d1: "DB", r2: null und capabilities: ["mcp"]. Verwende niemals eine fremde Site-ID, Domain, Datenbank, Erweiterung oder alte Veröffentlichung. Bei einer Fortsetzung verwende die bereits in meiner persönlichen Kopie registrierte Site weiter. Ändere die öffentliche GitHub-Vorlage nicht und pushe meine persönlichen Site-Daten nicht dorthin.

Veröffentliche meine Site nach dem aktuellen Sites-Workflow. Nutze die vorhandenen SQL-Migrationen und die Anmeldung von ChatGPT Sites; lege keine eigenen Cloudflare-Zugangsdaten oder API-Schlüssel an. Neue Site zunächst privat lassen. Führe passende Tests, TypeScript-Prüfung und Produktionsbuild aus. Übertrage den geprüften Quellstand in das von Sites zugewiesene Source-Repository, speichere eine Version und veröffentliche sie. Warte auf den erfolgreichen Abschluss.

Nutze anschließend die von Sites für genau diese Site erzeugte Erweiterung. Prüfe get_site mit include_mcp_connection: true. Wenn nötig, zeige mir über suggest_plugins mit der tatsächlich zurückgegebenen plugin_id die Installation an. Keine lokale MCP-Konfiguration und kein Plugin mit einer fremden URL. Prüfe die Verbindung nach Möglichkeit mit list_courses; behaupte keinen erfolgreichen Werkzeugtest, wenn die Erweiterung noch nicht verbunden ist.

Gib mir am Ende meine echte veröffentlichte URL, den Status der Erweiterung und den Hinweis, dass ich Kursaufträge direkt auf meiner Website über „Kurs vorbereiten“ und „Auftrag kopieren“ erstelle und anschließend in Codex einfüge. Ich möchte Einrichtung und Kurserstellung ausschließlich über Codex steuern. Falls Sites in meinem Konto fehlt oder die Veröffentlichung scheitert, nenne den konkreten fehlenden Schritt. Erfinde keine Live-URL und ersetze Sites nicht durch einen lokalen Server.
```

Codex richtet die Site ein und nennt dir ihre echte Adresse. Falls eine Installation oder Anmeldung angezeigt wird, schließt du diesen Schritt in deinem Konto ab. Die Bezeichnungen in der Oberfläche und die Verfügbarkeit von Sites hängen vom Konto und Workspace ab. Der Prompt kann fehlende Sites-Berechtigungen nicht ersetzen.

Die ausführlichen Schritte und die Wiederaufnahme einer unterbrochenen Einrichtung stehen in [ChatGPT Sites einrichten](docs/CHATGPT-SITES.md).

## Kurse über die Website vorbereiten

Nach der Einrichtung nutzt du die veröffentlichte Website:

1. Thema eingeben und **Kurs vorbereiten** anklicken.
2. Vorwissen, Sprache, Tiefe und Lernziel auswählen.
3. **Auftrag kopieren** anklicken und in Codex einfügen. Codex schreibt und speichert den Kurs über deine Lesewerk-Erweiterung.
4. Auf der Website **Synchronisieren** anklicken und lesen.

Den passenden Auftrag erzeugt die Website selbst aus deinen Angaben. Auch zum Weiter-Ausarbeiten vorhandener Kurse gibt es dort einen Kopierbutton. Du brauchst dafür keinen zusätzlichen Prompt aus dieser README.

## Was du bekommst

- Kurse mit Modulen, Lernzielen und ausführlichen Markdown-Lektionen.
- Lesemodus für Computer und Handy, Schriftgröße und Wissensfragen.
- Notizen, Lesezeichen und als gelesen markierte Lektionen.
- Eine gemerkte „Ab hier“-Stelle pro Lektion. Speichern und Springen sind getrennte Aktionen.
- Eigene URLs für Kurse und Lektionen; Browser-Zurück, Vorwärts und Neuladen.
- Entfernen von Kursen und Lektionen sowie JSON-Sicherung und Markdown-Export.
- Werkzeugzugriff über die eigene Site-Erweiterung: `list_courses`, `get_course`, `read_lesson`, `create_course`, `save_lesson`.

## Daten und Grenzen

Die Vorlage enthält einen gekennzeichneten Beispielkurs, keine privaten Nutzerkurse. Deine Kurse werden in der D1-Datenbank deiner Site gespeichert und der angemeldeten Site-Identität zugeordnet. Andere Besucher sehen bei einer geteilten Site ihre eigene Bibliothek. Eine zweite Site oder ein anderes Konto übernimmt deine Daten nicht automatisch; nutze dafür JSON-Export und Import.

Pro Nutzerbibliothek gelten aktuell maximal 40 Kurse und rund 1,75 MB gespeicherte JSON-Daten. Lange Kurse können diese Grenze deutlich vor 40 Kursen erreichen. Sichere deine Bibliothek regelmäßig über **Bibliothek sichern**. Für erheblich größere Bibliotheken müsste die Speicherung auf einzelne Lektionen umgestellt werden.

Lesen braucht nach der Veröffentlichung keinen lokal laufenden Prozess. Deine PC-Verfügbarkeit spielt für das Hosting keine Rolle. Die Verfügbarkeit der Site selbst richtet sich nach ChatGPT Sites und deinem Konto. Für neue KI-Texte gelten die jeweiligen ChatGPT-/Codex-Limits; „ohne API-Schlüssel“ bedeutet keine unbegrenzte oder automatisch kostenlose KI-Nutzung. Große Kurse entstehen in mehreren Gesprächsrunden. Prüfe Lerninhalte fachlich.

## Entwicklung

React, Vinext, Cloudflare Worker und D1 innerhalb von ChatGPT Sites. Kein zusätzlicher eigener Cloudflare-Account für den beschriebenen Sites-Workflow. [Technik und lokale Vorschau](docs/ENTWICKLUNG.md) · [Apache-2.0-Lizenz](LICENSE).

Die Codex-Verbindung nutzt das von Sites erzeugte Plugin, nicht `codex mcp add`. Für die konkrete Veröffentlichung und Verbindung ist der in Codex installierte Sites-Skill maßgeblich.
