import type { Course, Question } from "./course";

const shell = `## Deine erste Begegnung mit der Shell

Ein Terminal ist zunächst ein Fenster, über das du mit einem laufenden Programm kommunizierst. Dieses Programm ist häufig eine Shell: Sie nimmt Befehle entgegen, interpretiert ihre Struktur und startet die passenden Programme. Terminal und Shell sind deshalb nicht dasselbe. Du kannst in demselben Terminal verschiedene Shells starten, etwa Bash oder Zsh. In dieser Lektion verwenden wir Bash und gewöhnliche GNU-Werkzeuge. Einzelheiten können auf anderen Systemen abweichen.

Für die Übungen reicht ein normaler Benutzer in einer Linux-Übungsumgebung. Administratorrechte brauchst du hier nicht. Eine virtuelle Maschine ist besonders praktisch, weil du dort unabhängig von deinem Alltagssystem lernen kannst. Auch eine Linux-Umgebung unter WSL eignet sich für diese grundlegenden Shell-Befehle; Bootvorgänge und Dienste können sich dort allerdings von einem vollständigen Linux-System unterscheiden.

### Was die Eingabeaufforderung verrät

Eine typische Eingabeaufforderung sieht ungefähr so aus:

\`\`\`text
anna@lernrechner:~$
\`\`\`

Hier ist anna der Benutzername, lernrechner der Rechnername und die Tilde steht für das persönliche Home-Verzeichnis. Das Dollarzeichen wird häufig für normale Benutzer verwendet. Ein Nummernzeichen kennzeichnet oft eine Root-Shell. Diese Darstellung ist konfigurierbar: Ein Prompt ist ein Hinweis und kein zuverlässiger Beweis dafür, welche Rechte ein Prozess tatsächlich besitzt. Den aktuellen Benutzernamen prüfst du mit whoami, die Benutzer- und Gruppenkennungen mit id.

Gib nur den Befehl ein, nicht die Zeichen der Eingabeaufforderung. Wenn du in einer Anleitung eine Zeile mit einem vorangestellten Dollarzeichen siehst, ist dieses meistens als Prompt gemeint.

## Wie ein Befehl aufgebaut ist

Ein einfacher Aufruf besteht aus dem Programmnamen sowie optionalen Optionen und Argumenten. Optionen verändern das Verhalten; Argumente benennen beispielsweise die zu bearbeitenden Dateien.

\`\`\`bash
ls -l /etc
\`\`\`

ls listet Verzeichniseinträge auf. Die Option -l fordert eine ausführliche Darstellung an. /etc ist der Verzeichnispfad, dessen Inhalt angezeigt wird. Du kannst viele Programme zunächst mit --help erkunden. Eine umfassendere lokale Dokumentation liefert häufig die Handbuchseite, die du etwa mit man ls öffnest. In der üblichen Anzeige blätterst du mit den Pfeiltasten und beendest die Ansicht mit q. Ein minimales System enthält möglicherweise noch keine Handbuchseiten.

Die Shell trennt Argumente normalerweise an ungeschützten Leerzeichen. Deshalb haben die folgenden Aufrufe unterschiedliche Bedeutungen:

\`\`\`bash
printf '%s\\n' Hallo Welt
printf '%s\\n' 'Hallo Welt'
\`\`\`

Im ersten Fall erhält printf nach dem Format zwei Argumente und schreibt sie in zwei Zeilen. Im zweiten Fall ist Hallo Welt ein einziges Argument; beide Wörter erscheinen gemeinsam in einer Zeile. Einfache Anführungszeichen schützen den eingeschlossenen Text vor den üblichen Ersetzungen der Shell. Doppelte Anführungszeichen schützen ebenfalls Leerzeichen, erlauben aber beispielsweise Variablenersetzungen. Diesen Unterschied brauchst du später beim Skripten.

## Praxisbeispiel: Orientierung gewinnen

Stell dir vor, du meldest dich an einem fremden Testsystem an. Bevor du irgendetwas veränderst, möchtest du wissen, als wer du arbeitest und wo du dich befindest.

\`\`\`bash
whoami
pwd
printf '%s\\n' "$HOME"
\`\`\`

whoami nennt den Benutzer. pwd zeigt den absoluten Pfad des aktuellen Arbeitsverzeichnisses. Die letzte Zeile gibt den Wert der Umgebungsvariable HOME aus. Nach einer gewöhnlichen Anmeldung können die beiden Pfade gleich sein. Nach einem Verzeichniswechsel sind sie es nicht mehr: HOME bezeichnet weiterhin dein Home-Verzeichnis, während pwd deinen momentanen Standort meldet. Programme können HOME verändern; es handelt sich um eine Variable und nicht um eine unveränderliche Systemeigenschaft.

## Praxisbeispiel: Fehlermeldungen verstehen

Rufe einen absichtlich nicht vorhandenen Befehl auf, zum Beispiel lesewerk-befehl-gibt-es-nicht. Bash meldet normalerweise, dass der Befehl nicht gefunden wurde. Das bedeutet nicht, dass die Shell kaputt ist. Sie konnte den Namen lediglich keinem ausführbaren Programm oder einer anderen passenden Befehlsart zuordnen. Prüfe zunächst die Schreibweise. Anschließend kannst du mit command -v nach einem vorhandenen Programm suchen.

\`\`\`bash
command -v ls
command -v lesewerk-befehl-gibt-es-nicht
\`\`\`

Der erste Aufruf liefert typischerweise einen Pfad wie /usr/bin/ls. Der zweite findet nichts und endet mit einem von null verschiedenen Status. Den Status des unmittelbar vorherigen Befehls gibt printf '%s\\n' "$?" aus. Merke dir: Der Status null steht üblicherweise für Erfolg; andere Werte tragen eine programmspezifische Bedeutung. Nach einem weiteren Befehl bezieht sich $? bereits auf diesen neueren Befehl.

### Häufige Stolperstellen

- Linux unterscheidet bei vielen Namen Groß- und Kleinschreibung. LS ist daher nicht einfach eine andere Schreibweise von ls.
- Ein Dateipfad mit Leerzeichen muss passend geschützt werden, etwa durch Anführungszeichen.
- Eine Befehlszeile aus dem Internet kann mehrere Aktionen enthalten. Lies sie vollständig, bevor du sie ausführst.
- Strg+C sendet normalerweise ein Unterbrechungssignal an die Vordergrund-Prozessgruppe. Das ist etwas anderes als Text aus dem Terminal zu kopieren.

## Deine Übung

Ermittle deinen Benutzernamen, deinen momentanen Standort und den Speicherort des Programms pwd. Gib danach den Text Linux lernen macht Fortschritt als genau eine Zeile aus. Öffne, wenn verfügbar, die Handbuchseite von printf und schließe sie wieder. Überlege anschließend: Warum sind die Ausgabe von pwd und der in HOME gespeicherte Pfad nicht immer identisch?

### Musterlösung

\`\`\`bash
whoami
pwd
command -v pwd
printf '%s\\n' 'Linux lernen macht Fortschritt'
man printf
\`\`\`

command -v pwd kann pwd ohne vollständigen Dateipfad melden, weil viele Shells pwd als eingebauten Befehl anbieten. Das ist ein korrektes Ergebnis. Die Handbuchseite kann dagegen die eigenständige Programmvariante beschreiben. Das aktuelle Arbeitsverzeichnis ist veränderlich, HOME bleibt bei gewöhnlichen Verzeichniswechseln gleich.

## Was du mitnimmst

Die Shell interpretiert deine Eingabe; das Terminal stellt die Verbindung zur Bedienung bereit. Du kannst einen Aufruf in Befehl, Optionen und Argumente zerlegen. Anführungszeichen beeinflussen, welche Argumente ein Programm erhält. Mit whoami, pwd, command -v und lokalen Hilfen findest du dich zurecht, bevor du Änderungen am System vornimmst.`;

const paths = `## Das Dateisystem als gemeinsamer Verzeichnisbaum

Unter Linux werden Dateien und Verzeichnisse in einem Baum organisiert. Die Wurzel dieses Baums wird mit einem einzelnen Schrägstrich geschrieben: /. Alle absoluten Pfade beginnen dort. Anders als bei Laufwerksbuchstaben erscheint ein zusätzlich eingehängtes Dateisystem ebenfalls an einer Stelle dieses Baums. Ein USB-Datenträger könnte beispielsweise unter /media/anna/usb erreichbar sein. Wo genau ein System Geräte einhängt, hängt von seiner Konfiguration ab.

Ein Verzeichnis ist nicht einfach nur ein grafischer Ordner. Es enthält Zuordnungen von Namen zu Dateisystemobjekten. Für deinen Einstieg genügt das Bild einer verzweigten Struktur: Von / aus erreichst du Unterverzeichnisse wie etc, home und usr. Innerhalb von /home liegt auf vielen Systemen das persönliche Verzeichnis eines Benutzers, etwa /home/anna. Der Benutzer root hat typischerweise /root als Home-Verzeichnis. Diese Namen sollten dich nicht dazu verleiten, / und /root gleichzusetzen.

## Absolute und relative Pfade

Ein absoluter Pfad beschreibt den Weg von der Wurzel aus vollständig. /etc/hosts bleibt deshalb derselbe absolute Pfad, egal in welchem Verzeichnis deine Shell gerade arbeitet. Ein relativer Pfad startet dagegen beim aktuellen Arbeitsverzeichnis. Wenn du dich in /home/anna befindest, bezeichnet Dokumente/notizen.txt die Datei /home/anna/Dokumente/notizen.txt.

Zwei besondere Komponenten helfen bei der Navigation: Ein einzelner Punkt steht für das aktuelle Verzeichnis, zwei Punkte für das übergeordnete Verzeichnis. Deshalb bezeichnet ./notizen.txt eine Datei im aktuellen Verzeichnis und ../notizen.txt eine Datei eine Ebene darüber. An der Wurzel führt .. wieder zur Wurzel. Symbolische Links bringen zusätzliche Feinheiten mit sich; darauf gehen wir in einer späteren Lektion ein.

### Praxisbeispiel: sicher navigieren

\`\`\`bash
cd /etc
pwd
cd ..
pwd
cd
pwd
\`\`\`

Die erste Ausgabe sollte /etc sein, die zweite /. cd ohne Argument wechselt in einer üblichen Bash-Umgebung zum durch HOME bezeichneten Verzeichnis. Die letzte Ausgabe ist daher meist dein Home-Pfad. cd verändert das Arbeitsverzeichnis der aktuellen Shell. Würde es nur als gewöhnlicher Kindprozess arbeiten, könnte es den Zustand der aufrufenden Shell nicht dauerhaft ändern. Daher gehört cd zu den eingebauten Shell-Befehlen.

Auch die Tilde kann einen Weg abkürzen. Ein ungeschütztes ~ wird von Bash unter üblichen Bedingungen zum Home-Verzeichnis erweitert. Diese Ersetzung ist eine Leistung der Shell. In einfachen Anführungszeichen bleibt die Tilde dagegen wörtlicher Text. cd '~' sucht daher normalerweise ein Verzeichnis mit dem tatsächlichen Namen ~ im aktuellen Verzeichnis.

## Verzeichnisse mit unterschiedlichen Aufgaben

/etc enthält vorwiegend systemweite Konfiguration. /var beherbergt veränderliche Daten, beispielsweise Protokolle und Warteschlangen. /tmp ist für temporäre Dateien gedacht; auf ihre dauerhafte Aufbewahrung solltest du dich nicht verlassen. /usr enthält einen großen Teil der installierten Programme und zugehöriger Daten. Der Name bedeutet nicht, dass dort deine persönlichen Dokumente hingehören. /home ist auf vielen Systemen dafür der passende Ausgangspunkt.

Virtuelle Dateisysteme wie /proc und /sys stellen Informationen und Schnittstellen des Kernels bereit. Ihre Einträge sind nicht einfach gewöhnliche, dauerhaft auf einer Festplatte gespeicherte Dokumente. Ein Lesen kann einen aktuellen Zustand liefern; ein Schreiben kann unter passenden Berechtigungen das Systemverhalten verändern. Für die folgende Übung bleiben wir deshalb bei selbst angelegten Dateien im Home-Verzeichnis.

## Praxisbeispiel: ein eigenes Übungsverzeichnis

\`\`\`bash
mkdir -p "$HOME/lesewerk-labor/notizen"
cd "$HOME/lesewerk-labor"
pwd
ls
ls -a
\`\`\`

mkdir -p legt fehlende Zwischenverzeichnisse an und meldet einen schon vorhandenen Verzeichnisnamen nicht als Fehler. Es garantiert jedoch nicht, dass ein vorhandener Pfad ein beschreibbares Verzeichnis ist. Das anschließende cd kann weiterhin fehlschlagen, etwa wenn Berechtigungen fehlen. Prüfe deshalb die tatsächliche Ausgabe, statt allein vom geplanten Ablauf auszugehen.

ls zeigt im Übungsverzeichnis mindestens notizen an. ls -a zeigt zusätzlich Namen, die mit einem Punkt beginnen, darunter normalerweise . und ... Ein führender Punkt ist die verbreitete Konvention für versteckte Einträge. Diese Dateien sind weder besonders geschützt noch automatisch verschlüsselt; gewöhnliches ls blendet sie lediglich standardmäßig aus.

### Was bedeutet Permission denied?

Wenn cd in ein Verzeichnis scheitert, fehlen möglicherweise passende Suchrechte auf einem Bestandteil des Pfads. Wenn das Anlegen einer Datei fehlschlägt, kann die Ursache am Zielverzeichnis liegen. Antworte auf solche Meldungen nicht reflexartig mit sudo. Kontrolliere zuerst den Pfad, den Benutzer und die vorgesehenen Rechte. In einem persönlichen Übungsverzeichnis sind Administratorrechte normalerweise überflüssig.

## Deine Übung

Lege innerhalb von lesewerk-labor die Verzeichnisse projekte und projekte/linux an. Wechsle in projekte/linux und finde von dort mit einem relativen Pfad zurück nach lesewerk-labor. Wechsle dann über einen absoluten Pfad wieder nach projekte/linux. Kontrolliere deinen Standort jeweils mit pwd. Erkläre danach einem anderen Lernenden den Unterschied zwischen /root, / und deinem eigenen Home-Verzeichnis.

### Musterlösung

\`\`\`bash
mkdir -p "$HOME/lesewerk-labor/projekte/linux"
cd "$HOME/lesewerk-labor/projekte/linux"
pwd
cd ../..
pwd
cd "$HOME/lesewerk-labor/projekte/linux"
pwd
\`\`\`

Nach cd ../.. wurden zwei Verzeichnisebenen nach oben durchlaufen. Der absolute Pfad in der letzten cd-Zeile ist von deinem vorherigen Standort unabhängig. Achte beim Nachvollziehen darauf, dass HOME durch die Shell ersetzt wird; der tatsächlich verwendete Pfad beginnt anschließend mit /.

## Was du mitnimmst

Ein absoluter Pfad startet an /, ein relativer beim aktuellen Arbeitsverzeichnis. Mit ., .., cd und pwd bewegst du dich bewusst durch den Baum. Wichtige Verzeichnisse haben unterschiedliche Aufgaben. Versteckte Dateien sind eine Namenskonvention, und ein Home-Verzeichnis ist nicht dasselbe wie die Wurzel des Dateisystems.`;

const files = `## Dateien gezielt anlegen und lesen

Für die folgenden Übungen verwendest du ausschließlich ein eigenes Laborverzeichnis. Ziel ist nicht, möglichst viele Befehle auswendig zu lernen, sondern deren Wirkung präzise vorherzusagen. Wer vor jeder Aktion Quelle, Ziel und möglichen Datenverlust benennen kann, arbeitet bereits deutlich verlässlicher.

Erstelle zuerst die Arbeitsumgebung und kontrolliere deinen Standort:

\`\`\`bash
mkdir -p "$HOME/lesewerk-labor/dateien"
cd "$HOME/lesewerk-labor/dateien"
pwd
\`\`\`

Lies die Ausgabe von pwd. Wenn der Wechsel fehlschlägt, arbeitest du sonst möglicherweise an einer unerwarteten Stelle weiter. Ein Befehl ist nicht schon deshalb erfolgreich, weil er in einer Anleitung steht. Die Rückmeldung deines Systems ist entscheidend.

## Text mit printf und Umleitungen schreiben

\`\`\`bash
printf '%s\\n' 'Linux' 'Shell' 'Dateien' > themen.txt
cat themen.txt
\`\`\`

printf erzeugt drei Zeilen. Das Zeichen > wird von der Shell verarbeitet und leitet die Standardausgabe in eine Datei um. Existiert themen.txt noch nicht, wird sie bei passenden Rechten angelegt. Existiert sie schon, wird sie üblicherweise vor der Programmausführung auf Länge null gekürzt. Das ist eine wichtige Eigenschaft: Auch wenn ein aufgerufenes Programm später fehlschlägt, kann die Datei bereits geleert worden sein. Verlasse dich deshalb bei wertvollen Daten niemals auf ein unbedachtes >.

Die Umleitung >> hängt an eine bestehende Datei an, statt ihren Inhalt zu überschreiben. Falls die Datei fehlt, kann auch sie angelegt werden. Umleitungen sind keine besonderen Optionen von printf oder cat. Die Shell stellt sie für viele Programme bereit.

\`\`\`bash
printf '%s\\n' 'Berechtigungen' >> themen.txt
cat themen.txt
wc -l themen.txt
\`\`\`

Jetzt enthält die Datei vier mit Zeilenumbrüchen abgeschlossene Zeilen. wc -l zählt Zeilenumbruchzeichen. In diesem Beispiel liefert es deshalb vier. Eine letzte Textzeile ohne abschließenden Zeilenumbruch ist eine häufige Ursache dafür, dass die gefühlte Zeilenzahl von diesem Ergebnis abweicht.

## Kopieren und Verschieben

cp erzeugt eine Kopie; mv verschiebt oder benennt einen Eintrag um. Beide Befehle können bei passenden Umständen eine vorhandene Zieldatei ersetzen. Nutze für die Übungen eindeutige Namen und prüfe vor dem Ausführen, ob dein Ziel bereits existiert.

\`\`\`bash
cp -i themen.txt themen-kopie.txt
mv -i themen-kopie.txt lernplan.txt
ls -l
\`\`\`

Die Option -i fordert bei diesen GNU-Programmen vor dem Überschreiben eines bestehenden Ziels eine Rückfrage an. Am Ende sollten themen.txt und lernplan.txt vorhanden sein. Ein Vergleich mit cmp themen.txt lernplan.txt bleibt bei identischen Dateien normalerweise ohne Ausgabe und beendet sich erfolgreich. Das Ausbleiben einer Ausgabe bedeutet hier also nicht, dass nichts passiert ist: Es ist der erwartete Erfolgsfall.

### Praxisbeispiel: eine Arbeitskopie bearbeiten

Hänge eine weitere Zeile nur an lernplan.txt an und vergleiche anschließend beide Dateien:

\`\`\`bash
printf '%s\\n' 'Prozesse' >> lernplan.txt
diff -u themen.txt lernplan.txt
\`\`\`

diff zeigt den Unterschied in einem vereinheitlichten Format. Die zusätzliche Zeile wird mit einem Pluszeichen dargestellt. Diese Anzeige ist kein Befehl, den du wiederum im Terminal ausführen sollst. Der Rückgabestatus 1 von diff bedeutet, dass Unterschiede gefunden wurden. Das ist ein gutes Beispiel dafür, dass ein von null verschiedener Status nicht automatisch einen Betriebsfehler bezeichnet. Ein höherer Status kann bei diff hingegen auf einen Fehler hinweisen.

## Große Dateien bequem ansehen

cat ist gut für kurze Texte. Für große Dateien ist ein Pager wie less angenehmer, weil du darin suchen und blättern kannst. Mit / gefolgt von einem Suchbegriff suchst du vorwärts, mit n zum nächsten Treffer und mit q beendest du die Ansicht. head und tail zeigen standardmäßig einen Anfangs- beziehungsweise Endausschnitt. Die genaue Anzahl kannst du mit -n angeben.

\`\`\`bash
head -n 2 lernplan.txt
tail -n 2 lernplan.txt
\`\`\`

Der erste Befehl zeigt Linux und Shell. Der zweite zeigt Berechtigungen und Prozesse, sofern du alle vorherigen Schritte genau einmal ausgeführt hast. Wenn du das Anhängen wiederholst, enthält die Datei weitere Zeilen. Programme bearbeiten den tatsächlichen Zustand deiner Dateien, nicht den Zustand, den die Anleitung erwartet.

## Löschen mit Bedacht

rm entfernt Verzeichniseinträge. Es verschiebt Dateien nicht automatisch in einen grafischen Papierkorb. Für diese Übung verwenden wir eine Rückfrage und löschen nur die selbst erstellte Kopie:

\`\`\`bash
rm -i lernplan.txt
ls
\`\`\`

Bestätige nur, wenn der angezeigte Name stimmt. themen.txt bleibt erhalten. Ein leeres Verzeichnis kannst du mit rmdir entfernen. Das ist eine nützliche Begrenzung: Enthält es noch Dateien, lehnt rmdir das Entfernen ab. Rekursive Löschoptionen sind für dieses Lernziel nicht erforderlich.

## Deine Übung

Erstelle eine Datei aufgaben.txt mit drei Lernaufgaben. Lege eine Kopie namens morgen.txt an und ergänze ausschließlich dort eine vierte Aufgabe. Prüfe mit wc -l die Zeilenzahlen und mit diff -u die Unterschiede. Benenne morgen.txt anschließend in naechste-sitzung.txt um. Lösche zum Abschluss nur diese Arbeitskopie und kontrolliere, dass das Original noch existiert.

### Musterlösung

\`\`\`bash
printf '%s\\n' 'Pfade üben' 'Dateien kopieren' 'Texte vergleichen' > aufgaben.txt
cp -i aufgaben.txt morgen.txt
printf '%s\\n' 'Rechte verstehen' >> morgen.txt
wc -l aufgaben.txt morgen.txt
diff -u aufgaben.txt morgen.txt
mv -i morgen.txt naechste-sitzung.txt
rm -i naechste-sitzung.txt
ls -l aufgaben.txt
\`\`\`

## Was du mitnimmst

Du kannst Textdateien erstellen, lesen, kopieren, vergleichen, umbenennen und bewusst entfernen. Du kennst den entscheidenden Unterschied zwischen > und >>. Prüfe Quelle und Ziel vor Änderungen und interpretiere Rückgabestatus immer im Kontext des jeweiligen Programms.`;

const quizzes: Question[][] = [
 [{question:"Was unterscheidet Shell und Terminal?",options:["Beide Begriffe bezeichnen genau dasselbe.","Die Shell interpretiert Befehle; das Terminal stellt die Bedienverbindung bereit.","Ein Terminal benötigt immer Root-Rechte.","Die Shell ist ausschließlich ein Texteditor."],correct:1,explanation:"Eine Shell ist ein Befehlsinterpreter. Das Terminal stellt die Ein- und Ausgabe bereit."},{question:"Was passiert bei printf '%s\\n' 'Hallo Welt'?",options:["Zwei getrennte Zeilen werden ausgegeben.","Die Shell wird beendet.","Hallo Welt wird als ein Argument in einer Zeile ausgegeben.","Ein Verzeichnis wird angelegt."],correct:2,explanation:"Die einfachen Anführungszeichen schützen das Leerzeichen, sodass ein Argument entsteht."},{question:"Worauf bezieht sich $? in Bash?",options:["Auf den Status der zuletzt ausgeführten Pipeline.","Auf den freien Speicher.","Auf den Benutzer root.","Auf den Pfad zur Shell."],correct:0,explanation:"Bei einem einzelnen Befehl ist dies dessen Rückgabestatus. Ein weiterer Befehl verändert diesen Wert."}],
 [{question:"Welcher Pfad ist absolut?",options:["../notizen","./linux","Dokumente/test.txt","/etc/hosts"],correct:3,explanation:"Ein absoluter Pfad beginnt mit / und startet an der Wurzel des Verzeichnisbaums."},{question:"Wohin führt cd ../.. aus /home/anna/projekte/linux?",options:["/home/anna","/home","/","/home/anna/projekte"],correct:0,explanation:"Zwei Ebenen nach oben: zuerst projekte, dann anna."},{question:"Was bedeutet ein Punkt am Anfang eines Dateinamens?",options:["Die Datei ist verschlüsselt.","Die Datei gehört immer root.","Gewöhnliches ls blendet den Eintrag standardmäßig aus.","Die Datei kann nicht gelöscht werden."],correct:2,explanation:"Ein führender Punkt ist eine Namenskonvention für versteckte Einträge, kein Schutzmechanismus."}],
 [{question:"Was bewirkt >> gegenüber >?",options:["Es schreibt nur Fehlermeldungen.","Es hängt Ausgabe an, statt eine vorhandene Datei zu leeren.","Es kopiert Verzeichnisse.","Es verschlüsselt die Ausgabe."],correct:1,explanation:"> leert eine bestehende Zieldatei normalerweise. >> hängt neue Ausgabe an."},{question:"Was bedeutet Rückgabestatus 1 bei diff?",options:["Dateien sind identisch.","Der Rechner muss neu gestartet werden.","Die Dateien unterscheiden sich.","Die Shell ist nicht installiert."],correct:2,explanation:"diff nutzt Status 1 für gefundene Unterschiede. Das ist kein allgemeiner Betriebsfehler."},{question:"Was zählt wc -l?",options:["Zeilenumbruchzeichen","Wörter","Dateigröße in Bytes","Verzeichnisse"],correct:0,explanation:"Eine letzte Textzeile ohne abschließenden Zeilenumbruch wird nicht als zusätzlicher Zeilenumbruch gezählt."}]
];
const plan=[
 ["Ankommen auf der Kommandozeile",["Die Shell verstehen","Pfade und Verzeichnisse","Dateien sicher bearbeiten"]],
 ["Texte, Datenströme & Werkzeuge",["Pipes und Umleitungen","Text mit grep, sed und awk filtern","Archive und Kompression"]],
 ["Das Linux-System verstehen",["Hardware und Kernel erkunden","Bootvorgang und systemd","Pakete installieren und verwalten"]],
 ["Dateisysteme & Berechtigungen",["Partitionen und Dateisysteme","Besitzrechte und Zugriffsrechte","Links, Mounts und Speicherplatz"]],
 ["Administration im Alltag",["Benutzer und Gruppen verwalten","Prozesse und geplante Aufgaben","Shell-Skripte entwickeln"]],
 ["Netzwerk, Sicherheit & Dienste",["IP-Adressen und Namensauflösung","SSH und grundlegende Sicherheit","Systemdienste und Diagnose"]]
] as const;
export function demoCourse():Course {
 return {id:"lpic-demo",title:"LPIC-1: Linux wirklich verstehen",description:"Dein Einstieg in die Linux-Administration. Von der ersten Shell bis zu Netzwerken und Diensten — mit verständlichen Erklärungen und praktischen Aufgaben. Beispielkurs mit 3 ausgearbeiteten Lektionen; die weiteren Kapitel sind ein editierbarer Entwurf. Kein vollständiger Prüfungsvorbereitungskurs.",topic:"LPIC-1",level:"Einsteiger",depth:"intensiv",language:"Deutsch",demo:true,created:"2026-11-10T12:00:00.000Z",modules:plan.map(([title,titles],mi)=>({id:`demo-m${mi}`,title,lessons:titles.map((title,li)=>({id:`demo-${mi}-${li}`,title,goal:mi===0?["Shell, Terminal und Befehlsaufbau unterscheiden und erste Befehle sicher ausführen.","Absolute und relative Pfade verwenden und sich im Linux-Verzeichnisbaum orientieren.","Textdateien gezielt anlegen, lesen, kopieren, vergleichen und entfernen."][li]:`Die Grundlagen zum Thema „${title}“ erklären und selbstständig in einer Linux-Übungsumgebung anwenden.`,content:mi===0?[shell,paths,files][li]:"",quiz:mi===0?quizzes[li]:[],completed:false,bookmarked:false,note:""}))}))};
}
