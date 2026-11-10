# Eigene Lesewerk-Site mit ChatGPT Sites

## Voraussetzungen

Du brauchst Codex mit verfügbarer **Sites-Erweiterung** und Berechtigung zum Erstellen und Veröffentlichen einer Site in deinem eigenen Konto. Repo klonen, Ordner in Codex öffnen und den Text aus `CODEX-START.md` einfügen. Alles Weitere erledigt Codex; diese Seite erklärt den Ablauf und muss nicht manuell abgearbeitet werden. Die Lesewerk-Verbindung verwendet die Erweiterung, die Sites für deine Veröffentlichung erstellt. Ohne diese Funktionen kann diese Vorlage keine ChatGPT-Site bereitstellen. Es ist kein OpenAI-API-Schlüssel vorgesehen.

Der fertige Einrichtungsprompt steht direkt in der [README](../README.md#das-kopierst-du-in-codex). Er ist der empfohlene Einstieg. Die folgenden Schritte erklären, was Codex dabei erledigt.

## 1. Quellcode als eigene Kopie übernehmen

Codex liest oder klont `https://github.com/zerox80/chatti`, prüft `AGENTS.md` und verwendet die versionierten Dateien als Vorlage. Für die persönliche Site wird ein **separater Ordner ohne das GitHub-`.git`** angelegt. Das verhindert, dass der Sites-Veröffentlichungsworkflow versehentlich auf das öffentliche Vorlagen-Repository angewendet wird.

Keine lokale Datenbank, Cookies, `.env`, Buildausgaben, Zugangsdaten oder Kurssicherungen übertragen. Der gekennzeichnete Demo-Kurs gehört zum Quellcode und darf mitkommen. Das Repository liefert keine private Bibliothek mit.

## 2. Genau eine neue Site registrieren

Codex verwendet die nativen Sites-Tools und den **aktuell installierten Sites-Skill**. Es erstellt eine neue Site in deinem Konto. Die tatsächlich zurückgegebene `project_id` wird in `.openai/hosting.json` deiner persönlichen Kopie geschrieben. Die öffentliche Vorlage bleibt ohne ID.

Vor der Registrierung sieht die Datei so aus:

```json
{
  "d1": "DB",
  "r2": null,
  "capabilities": ["mcp"]
}
```

Nach der Registrierung kommt das Feld `project_id` mit der exakten von Sites gelieferten ID hinzu. Keine Beispiel-ID übernehmen oder eine ID selbst ausdenken. Auch keine Domain oder Plugin-ID eines anderen Nutzers verwenden.

Wurde die Registrierung unterbrochen, prüft Codex zuerst den persönlichen Ordner und den bereits gestarteten Sites-Versuch. Eine vorhandene persönliche ID wird wiederverwendet. **Nicht bei jedem erneuten Prompt eine neue Site erstellen.**

## 3. Speicher, Anmeldung und Veröffentlichung

- Sites stellt die D1-Bindung `DB` bereit. `drizzle/0000_steep_the_fallen.sql` erzeugt die Tabelle `libraries`; die vorhandenen Migrationen werden bei der Veröffentlichung durch Sites angewendet. Keine eigenen Cloudflare-Credentials beschaffen.
- Die App verwendet die Anmeldung und vertrauenswürdigen Identitätsheader von ChatGPT Sites. Jeder Datenzugriff wird auf die angemeldete Site-Identität beschränkt. Die lokale Test-Anmeldung ist nur für die Entwicklung bestimmt.
- Codex installiert die zum Lockfile passenden Abhängigkeiten, prüft Tests und TypeScript und baut die App. Dann folgt es dem aktuellen Sites-Workflow: persönliches Source-Repository öffnen, den geprüften Stand pushen, Archiv/Version speichern und veröffentlichen.
- Eine neue persönliche Site bleibt zunächst privat. Sites-Freigaben später nur ändern, wenn du das möchtest.
- Erst ein erfolgreiches Deployment liefert die bestätigte Live-Adresse. „Lokal gestartet“ und „Version gespeichert“ sind noch keine Veröffentlichung.

Die Anwendung braucht danach keinen laufenden lokalen Computer. Nur die einmalige Einrichtung und spätere Änderungen am Quellcode verwenden die Entwicklungsumgebung.

## 4. Eigene Lesewerk-Erweiterung verbinden

Durch `capabilities: ["mcp"]` und `POST /mcp` kann Sites bei der Veröffentlichung eine persönliche App und Erweiterung erzeugen. Verwende **genau diese**, damit neue Texte in deiner eigenen Site landen.

Codex prüft `get_site` mit `include_mcp_connection: true`. Sind die Werkzeuge noch nicht verfügbar, verwendet es die tatsächlich zurückgegebene `plugin_id` mit `suggest_plugins`, damit du installieren oder verbinden kannst. Je nach Oberfläche findest du die Erweiterung auch unter Plugins → Persönlich / Von dir erstellt. Wenn sie bereits installiert ist, aber im laufenden Chat nicht erscheint, öffne einen neuen Chat und wähle sie dort aus.

Für diesen Sites-Weg brauchst du weder eine selbst geschriebene `.mcp.json` noch `codex mcp add`, lokale MCP-Prozesse oder ein fremdes Plugin-ZIP. Die Werkzeuge aus diesem Repository werden bei einer erneuten Veröffentlichung von Sites aktualisiert.

Vor dem ersten Schreibvorgang mit `list_courses` prüfen. Die zurückgegebenen Kurse müssen zu deiner eigenen Bibliothek gehören. Der Demo-Kurs wird beim ersten Öffnen des Web-Lernraums angelegt; vor diesem Besuch kann die Liste leer sein.

## 5. Lernen und Inhalte erstellen

Öffne die veröffentlichte Site und melde dich mit demselben Konto an, mit dem du ihre Erweiterung verwendest. Gib auf der Website dein Thema ein und wähle **Kurs vorbereiten**. Stelle Niveau, Sprache, Tiefe und Lernziel ein. Mit **Auftrag kopieren** erzeugst du den passenden Auftrag aus deinen Angaben und fügst ihn in Codex ein. Codex schreibt die Texte, die Werkzeuge speichern sie. Anschließend auf der Site **Synchronisieren** klicken.

Das Konto braucht Zugriff auf die eigene Site und die Erweiterung. Ein zweites Konto erhält nicht automatisch deine Bibliothek. Eine neue Site bekommt eigene IDs und neuen Speicher. Für einen Umzug zuerst JSON-Sicherung exportieren und in der neuen Site importieren. Kurs- und Lektions-IDs können sich beim Import ändern; alte Direktlinks gelten dann nicht für die neue Site.

## Wenn etwas fehlt

| Beobachtung | Nächster Schritt |
| --- | --- |
| Sites-Tool fehlt | Sites in diesem Konto/Workspace verfügbar machen; keine lokale Installation als fertige Site ausgeben. |
| Veröffentlichung läuft noch | Vorhandenes Deployment abfragen und abwarten, statt weitere Sites anzulegen. |
| Site ist online, Werkzeuge fehlen | Verbindung aus `get_site(include_mcp_connection: true)` prüfen und die eigene Erweiterung installieren/verbinden. |
| Werkzeuge trotz Installation unsichtbar | Neuen Chat öffnen und die eigene Lesewerk-Erweiterung auswählen. |
| Neue Texte fehlen im Leseraum | Auf Synchronisieren klicken und prüfen, ob Chat und Website dasselbe Konto und dieselbe Site verwenden. |
| Gleichzeitige Änderung gemeldet | Ungespeicherte Änderungen zuerst als JSON sichern, dann neu laden. Die App erkennt Versionskonflikte. |
| Bibliothek voll | JSON exportieren und ältere Kurse entfernen. Aktuelles Limit: ungefähr 1,75 MB pro Bibliothek, maximal 40 Kurse. |

## Auftrag zum Fortsetzen einer Einrichtung

```text
Setze die Einrichtung meiner Lesewerk-Site aus zerox80/chatti fort. Lies den bisherigen Stand und die .openai/hosting.json meiner persönlichen Site-Kopie. Verwende die dort gespeicherte project_id und den bereits angelegten Sites-Versuch. Erstelle keine zusätzliche Site und ändere die GitHub-Vorlage nicht. Prüfe Veröffentlichung, D1-Migrationen und die von dieser Site erzeugte Erweiterung. Beende die noch fehlenden Schritte nach dem aktuellen Sites-Skill und nenne meine echte Live-URL sowie den geprüften Verbindungsstatus.
```
