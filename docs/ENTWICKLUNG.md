# Technik und Entwicklung

## Anwendung

- `app/studio.tsx`: Web-Lernraum, Kurse, Lesemodus, Quiz, Import/Export und Bearbeitung.
- `app/api/library/route.ts`: Bibliothek der angemeldeten Site-Identität mit Revisionsprüfung.
- `app/mcp/route.ts`: stateless JSON-RPC-Werkzeuge für die von Sites erzeugte Erweiterung.
- `app/chatgpt-auth.ts`: Anmeldung über die Identitätsheader von ChatGPT Sites.
- `db/schema.ts`, `drizzle/`: D1-Schema und Migrationen.
- `lib/teaching.ts`: Vorgaben für ausführliche, anfängergerechte Texte.
- `hooks/use-browser-navigation.ts`: URL und Browserhistorie.
- `.openai/hosting.json`: logische Bindungen. Die öffentliche Vorlage hat keine Site-Identität.

Site-spezifische Tokens, private Daten und eine persönliche `project_id` gehören ausschließlich zur persönlichen Site-Kopie und ihrem von Sites zugewiesenen Source-Repository. Die Vorlage enthält keine eigene Modell-API und keinen API-Schlüssel.

## Prüfungen der öffentlichen Vorlage

Node.js ab 22.13, Git und für Sites-Pakete `tar` bereitstellen. Für eine reine Quellcodeprüfung:

```sh
npm ci
npm run check:template
npm test
npm run typecheck
npm run build
```

`check:template` prüft, dass die öffentliche Vorlage keine persönliche Site-ID, feste ChatGPT-Site-Domain oder mitgelieferten Laufzeitdaten enthält. **Nicht auf die registrierte persönliche Kopie anwenden:** Diese benötigt ihre eigene ID zum Veröffentlichen.

Für eine Einrichtung mit Sites die Installations- und Buildhelfer des aktuell installierten Sites-Skills verwenden. Dieser kennt die passende Ausführungsumgebung. Die üblichen Projektskripte bleiben im Quellcode enthalten; es werden keine absoluten Pfade zu einer fremden Codex-Installation benötigt.

## Lokale Vorschau für Entwickler

Die Vorschau ist optional und kein Ersatz für die Veröffentlichung. Vor Browser-QA den zur Umgebung passenden Preview-Abschnitt des Sites-Skills lesen. Auf Windows, macOS oder portablem Linux verwendet ein sauberer Checkout das Profil `portable`; die Umgebung kann mit dem Sites-Konfigurationshelfer passend eingestellt werden.

Nach Installation und Build die vorhandene Migration auf die **lokale** D1-Datenbank anwenden:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_steep_the_fallen.sql
npm run dev -- --port 4173
```

Nur bei einer frischen lokalen Datenbank die initiale SQL-Datei direkt anwenden. Auf einer bereits initialisierten Datenbank nicht blind erneut ausführen. Bei späteren Schemaversionen den aktuellen Migrationsworkflow des Sites-Skills verwenden.

Die vom Server ausgegebene lokale URL öffnen. Das portable Entwicklungsprofil bietet eine lokale Test-Anmeldung über `/signin-with-chatgpt?return_to=/`. Sie ist für Loopback-Entwicklung vorgesehen und wird nicht als Produktionsauthentifizierung ausgeliefert. `npm start` startet einen gebauten Worker lokal; es veröffentlicht keine Site und stellt keine produktive ChatGPT-Anmeldung bereit.

Die Vorschau speichert in `.wrangler/state`. Diese Dateien niemals in Git oder eine fremde Site kopieren. Hosted D1 und lokale D1 sind getrennt. Bei einer Sites-Veröffentlichung werden die versionierten Migrationen durch Sites angewendet.

## Datenmodell und Grenzen

Eine Bibliothek wird derzeit als JSON in `libraries` mit `user_id` und `revision` gespeichert. REST-Schreibvorgänge prüfen die Revision; MCP-Änderungen lesen und versuchen die Aktualisierung bei Konflikten erneut. Die Datenbankabfragen verwenden ausschließlich die authentifizierte Identität. Das Importformat enthält Kurse, Module und Lektionen einschließlich Notizen und Lesezustand.

Die Größenprüfung bleibt bei ungefähr 1,75 MB gespeicherter Bibliothek. Für größere Lernsammlungen wäre eine Migration auf einzelne Kurs-/Lektionszeilen erforderlich. Einfach die Grenze heraufzusetzen ersetzt diese Umstellung nicht.

## Herkunft und Lizenz

Die Anwendung wurde aus Lesewerk als eigenständige ChatGPT-Sites-Vorlage übernommen. Das bestehende Repository steht unter Apache-2.0; mitgelieferte Drittanbieterhinweise in `scripts/vite/sites-vite-plugin.LICENSE` und `vendor/` bleiben erhalten. Abhängigkeiten haben ihre jeweiligen Lizenzen.
