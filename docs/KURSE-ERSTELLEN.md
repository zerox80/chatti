# Optionale eigene Kursaufträge

Im normalen Ablauf erstellt die Website den passenden Auftrag: Thema eingeben → **Kurs vorbereiten** → Angaben wählen → **Auftrag kopieren** → in Codex einfügen. Zum Weiter-Ausarbeiten gibt es beim Kurs ebenfalls einen Kopierbutton.

Die folgenden Beispiele sind optional für eigene Anpassungen. Du brauchst sie nicht für den ersten Kurs. Solche eigenen Aufträge kopierst du nach der Einrichtung **direkt in Codex**. Codex verwendet die verbundene Lesewerk-Erweiterung deiner eigenen Site. Die Website selbst erstellt keine Modellanfragen. Kein API-Schlüssel erforderlich; die Limits deines Chats gelten weiter.

## Neues Thema

Ersetze Thema und Lernziel in diesem Auftrag:

```text
Nutze meine Lesewerk-Erweiterung. Prüfe mit list_courses vorhandene Kurse.

Thema: LPIC-1.
Niveau: Einsteiger ohne Vorkenntnisse.
Sprache: Deutsch.
Tiefe: intensiv.
Ziel: Linux wirklich verstehen und die offiziellen Prüfungsziele praktisch erarbeiten.

Recherchiere bei Zertifizierungen die aktuelle offizielle Fassung und die Lernziele. Erstelle zuerst mit create_course einen didaktisch aufgebauten Kursplan. Keine Prüfungsgarantie oder offizielle Anerkennung behaupten.

Arbeite danach die erste Lektion vollständig aus. Zielumfang bei intensiven Einsteigerlektionen etwa 4.500–6.500 sinnvolle Wörter, sofern das Lernziel das braucht. Erkläre neue Begriffe, Abkürzungen, Voraussetzungen und Zwischenschritte. Bei Befehlen: Zweck, neue Argumente, erwartete Ausgabe und ihre Bedeutung. Mindestens zwei ausführliche Praxisbeispiele, typische Fehler, Übung mit getrennter Musterlösung und 3–5 Wissensfragen mit begründeten Lösungen.

Schreibe wie eine geduldige Fachperson: konkrete Beispiele, zusammenhängende Absätze, keine Floskeln, keine Werbesprache und keine Wiederholungen zur Wortzahlfüllung. Keine nummerierten Quellenmarker wie [1], sondern benannte direkte Quellenlinks. Keine unfertigen Platzhalter speichern.

Speichere diese Lektion mit save_lesson unter den tatsächlich zurückgegebenen IDs. Prüfe den gespeicherten Stand mit get_course und sage genau, welche Lektionen noch nicht ausgearbeitet sind.
```

Vier bis zwölf Module mit je drei bis sechs Lektionen sind ein möglicher Ausgangspunkt, kein festes Format. Große Pläne müssen zum Speicherlimit passen. Umfangreiche Themen gegebenenfalls in mehrere kleinere Kurse aufteilen und fertig gelernte Kurse extern sichern.

## Nächste Lektion

```text
Nutze meine Lesewerk-Erweiterung. Liste meine Kurse mit list_courses. Lies den Kurs „LPIC-1“ mit get_course; falls mehrere Kurse passen, kläre den richtigen Kurs vor Änderungen. Arbeite die nächste noch leere Lektion in Reihenfolge nach den bestehenden Niveau- und Tiefenvorgaben aus. Speichere sie einzeln mit save_lesson. Prüfe anschließend den Kursstand. Keine bereits ausgearbeiteten Texte oder Notizen ersetzen. Nenne die gespeicherte Lektion und die nächsten offenen Lektionen.
```

## Vorhandene Lektion verbessern

```text
Nutze meine Lesewerk-Erweiterung. Lies den passenden Kurs zuerst mit get_course und die ausgewählte Lektion mit read_lesson. Überarbeite nur diese Lektion anfängerfreundlicher: erkläre fehlende Voraussetzungen, neue Begriffe und Zwischenschritte; ergänze vollständig nachvollziehbare Praxisbeispiele statt Fülltext. Erhalte vorhandene Überschriften möglichst, damit gemerkte Lesestellen weiter passen. Speichere den vollständigen zusammengeführten Text mit save_lesson. Notizen, Lesezeichen und Fortschritt müssen erhalten bleiben. Prüfe den gespeicherten Text und die tatsächliche Wortzahl.
```

## Wenn die Erweiterung fehlt

Verbinde zuerst die von deiner Site erzeugte Erweiterung wie in [der Einrichtung](CHATGPT-SITES.md#4-eigene-lesewerk-erweiterung-verbinden) beschrieben. Als manueller Ersatz enthält der Web-Lernraum einen JSON-Import: Öffne dort den Importdialog, kopiere den passenden Auftrag in den Chat und füge dessen vollständige JSON-Ausgabe wieder in Lesewerk ein. Das verbindet keine Erweiterung; es überträgt die Inhalte manuell.

Nach Werkzeugaufrufen **Synchronisieren** klicken. Bei einer Unterhaltungspause bleiben fertig gespeicherte Lektionen online; der Chat schreibt ohne weitere Ausführung nicht im Hintergrund weiter.
