# Diesen Text in Codex einfügen

Repository klonen und den Ordner in Codex öffnen. Dann den gesamten Text aus diesem Block in Codex einfügen. Codex übernimmt die Einrichtung.

```text
Richte mir aus dem hier geöffneten Repository zerox80/chatti eine eigene Lesewerk-Lernplattform mit ChatGPT Sites ein. Führe die Einrichtung selbst aus; gib mir nicht bloß eine Anleitung.

Ich möchte eine eigene veröffentlichte ChatGPT-Site in meinem Konto, mit eigenem dauerhaftem D1-Speicher, ChatGPT-Anmeldung und eigener Lesewerk-Erweiterung. Kein eigener Server, kein Docker, kein OpenAI-API-Schlüssel und keine Modell-API-Aufrufe aus der Web-App.

Lies zuerst README.md, AGENTS.md und docs/CHATGPT-SITES.md des Repositorys sowie den verfügbaren Sites-Skill. Verwende den vorhandenen Quellcode und erhalte seine Funktionen. Nutze den geöffneten Checkout; nur falls er fehlt, klone https://github.com/zerox80/chatti. Übertrage seine versionierten Dateien ohne .git und ohne lokale Laufzeitdaten in einen separaten persönlichen Site-Ordner.

Die Vorlage hat absichtlich keine project_id. Registriere genau eine neue Site über das Sites-Tool in meinem Konto und schreibe die tatsächlich zurückgegebene project_id ausschließlich in .openai/hosting.json meiner persönlichen Kopie. Erhalte d1: "DB", r2: null und capabilities: ["mcp"]. Verwende niemals eine fremde Site-ID, Domain, Datenbank, Erweiterung oder alte Veröffentlichung. Bei einer Fortsetzung verwende die bereits in meiner persönlichen Kopie registrierte Site weiter. Ändere die öffentliche GitHub-Vorlage nicht und pushe meine persönlichen Site-Daten nicht dorthin.

Veröffentliche meine Site nach dem aktuellen Sites-Workflow. Nutze die vorhandenen SQL-Migrationen und die Anmeldung von ChatGPT Sites; lege keine eigenen Cloudflare-Zugangsdaten oder API-Schlüssel an. Neue Site zunächst privat lassen. Führe passende Tests, TypeScript-Prüfung und Produktionsbuild aus. Übertrage den geprüften Quellstand in das von Sites zugewiesene Source-Repository, speichere eine Version und veröffentliche sie. Warte auf den erfolgreichen Abschluss.

Nutze anschließend die von Sites für genau diese Site erzeugte Erweiterung. Prüfe get_site mit include_mcp_connection: true. Wenn nötig, zeige mir über suggest_plugins mit der tatsächlich zurückgegebenen plugin_id die Installation an. Keine lokale MCP-Konfiguration und kein Plugin mit einer fremden URL. Prüfe die Verbindung nach Möglichkeit mit list_courses; behaupte keinen erfolgreichen Werkzeugtest, wenn die Erweiterung noch nicht verbunden ist.

Gib mir am Ende meine echte veröffentlichte URL, den Status der Erweiterung und den Hinweis, dass ich Kursaufträge direkt auf meiner Website über „Kurs vorbereiten“ und „Auftrag kopieren“ erstelle und anschließend in Codex einfüge. Ich möchte Einrichtung und Kurserstellung ausschließlich über Codex steuern. Falls Sites in meinem Konto fehlt oder die Veröffentlichung scheitert, nenne den konkreten fehlenden Schritt. Erfinde keine Live-URL und ersetze Sites nicht durch einen lokalen Server.
```
