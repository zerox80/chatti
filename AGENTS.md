# Chatti / Lesewerk: Vorlage für ChatGPT Sites

## Zweck

Wenn jemand diese Vorlage für sich einrichten lässt, ist das Ziel eine **eigene ChatGPT-Site im Konto dieses Nutzers** mit eigenem D1-Speicher und eigener Site-Erweiterung. Der Nutzer klont das Repo, öffnet es in Codex und fügt `CODEX-START.md` ein. Codex führt die vollständige Einrichtung aus; nicht bloß eine weitere Anleitung liefern oder den Nutzer zu ChatGPT umleiten. Auch Kurse sollen direkt in Codex erstellt und gespeichert werden. Keine Docker-/VPS-Variante, keine OpenAI-Modell-API und kein API-Schlüssel. Codex schreibt die Texte im Chat; `/mcp` speichert sie. Lies `docs/CHATGPT-SITES.md` und den aktuellen verfügbaren Sites-Skill.

## Persönliche Einrichtung

- Prüfe die verfügbaren Sites-Tools. Fehlen sie, benenne das Hindernis; behaupte keine Veröffentlichung und weiche nicht ungefragt auf einen anderen Hostinganbieter aus.
- Diese öffentliche Vorlage hat absichtlich **keine** `project_id`. Exportiere die versionierten Dateien ohne `.git` in einen separaten persönlichen Site-Ordner. Registriere dort über Sites genau eine neue Site. Bewahre die exakte zurückgegebene ID in dessen `.openai/hosting.json` auf. Bei Wiederaufnahme verwende die persönliche ID weiter, statt eine weitere Site zu erzeugen.
- Bewahre `d1: "DB"`, `r2: null` und `capabilities: ["mcp"]`. Erhalte Worker, Authentifizierung, `/mcp`, Migrationen und die Nutzertrennung. Keine erfundene ID, keine fremde Domain, keine Produktionsdaten aus anderen Installationen.
- Veröffentliche nach dem aktuellen Sites-Skill im vom Anbieter zugewiesenen Source-Repository. Halte neue Sites zunächst privat; vorhandene Freigaben nur auf ausdrücklichen Nutzerwunsch ändern.
- Verwende die von Sites automatisch erzeugte persönliche Erweiterung. Ermittle ihre ID über `get_site(include_mcp_connection: true)`. Bei Bedarf `suggest_plugins` mit genau dieser ID. Kein vorkonfiguriertes Plugin-ZIP mit fremder URL, keine separate App und kein `codex mcp add` erforderlich.
- Teste nach dem Verbinden bevorzugt lesend mit `list_courses`. Nenne Veröffentlichung und Plugin-Verbindung getrennt, wenn nur die Veröffentlichung geprüft werden konnte.
- Berichte erst nach erfolgreichem Deployment die echte Live-URL. Bei Problemen den vorhandenen Versuch fortsetzen und den konkreten Fehler nennen.
- Füge einer persönlichen Einrichtung keine fremden Kursinhalte hinzu. Es gibt nur den gekennzeichneten Demo-Kurs. Migrationen enthalten ausschließlich Schemaänderungen.

## Arbeiten an der öffentlichen Vorlage

- Änderungen an der Vorlage werden im GitHub-Repository versioniert. Eine persönliche Site-ID, Plugin-ID, Domain, Credentials, Kurssicherungen und lokale Zustände gehören nicht in dieses Repository.
- `npm run check:template` prüft diese Grenze. Der Check ist **nur für die öffentliche Vorlage**, nicht für die bereits registrierte persönliche Kopie gedacht.
- `npm test`, `npm run typecheck` und ein Produktionsbuild sind die passenden Basisprüfungen. Für Browser-QA den Preview-Abschnitt des aktuellen Sites-Skills lesen.
- `.wrangler`, `.sites-runtime`, `node_modules`, Buildausgaben und `.env` bleiben ignoriert. Keine Zugangsdaten in Befehle, Logs, Commits oder Archive schreiben.
- Neue Branch-Namen kurz und aussagekräftig halten; niemals mit `codex/` beginnen.
