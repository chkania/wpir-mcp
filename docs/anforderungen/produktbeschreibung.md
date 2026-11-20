# Produktbeschreibung

Fachlicher Rahmen von wpir-mcp. Er gilt für jede neue oder geänderte Anforderung: Der `requirements-reviewer` prüft, dass eine Anforderung in diesen Rahmen passt und vom Nutzer gefordert ist. Was hier steht, ist gesetzt; eine Anforderung, die dem widerspricht, braucht eine ausdrückliche Entscheidung des Nutzers und eine Änderung dieses Dokuments.

## Zweck

Ein MCP-Server (Model Context Protocol) mit **Förderprogrammen und gesetzlichen Regelungen** rund um den Umstieg von Gas oder Öl auf eine Wärmepumpe (KfW 458, KfW 358/359, § 35c EStG, Darlehensrecht). Er ist die gepflegte, mit Quellen belegte Wissensbasis, gegen die der Wärmepumpen-Investitionsrechner (Repo `wpir`) seine Standardwerte auf Aktualität prüfen lässt. Er beantwortet: **Was gilt laut Quelle, seit wann und wie sicher – und stimmt der Wert im Rechner damit überein?**

## Benutzer

- **Primär: Agenten** (Claude Code) im Repo `wpir`, die Standardwerte des Rechners prüfen.
- **Pflegende:** der Projektinhaber, der die Fakten aktuell hält.
- **Nicht gemeint:** Endnutzer des Rechners; sie sprechen nicht mit diesem Server.

## Hauptfunktionen

- Fakten abrufen: Regel, Referenzwerte je Feld des Rechners, Gültigkeit, Status, Prüfdatum, Quellen (`get_facts`, `list_topics`, `list_sources`, `list_keys`).
- Einen Wert des Rechners gegen den Referenzwert prüfen (`check_value`): gleich, abweichend oder unbekannt, mit Quelle.

## Grundentscheidungen

- **Nur lesend, öffentlich, zustandslos:** keine Anmeldung, nichts wird gespeichert oder verändert; jede Anfrage steht für sich.
- **Keine Nutzerdaten:** der Server verarbeitet nur Feldpfade und Werte, die der Agent sendet, und protokolliert sie nicht.
- **Belegt statt behauptet:** jeder Fakt hat Quelle, Lesedatum, Prüfdatum und Status (bestätigt, Sekundärquelle, Annahme); Unsicheres steht als Hinweis am Fakt.
- **Daten im Code:** Die Wissensbasis liegt als typisierte Dateien im Repo und wird mit dem Server ausgeliefert; Änderungen laufen über Pull Requests.
- **Gehostet bei Vercel** als Funktion, ohne Datenbank und ohne Secrets.
- **Schnittstelle stabil halten:** Der Rechner-Agent hängt an Werkzeugnamen, Eingaben und Ausgabeformat.

## Was wpir-mcp nicht ist

- **Kein Ersatz für Rechtsberatung oder Förderberatung** und keine amtliche Quelle; er verweist auf die Originale.
- **Keine Preis- und Marktdaten:** Energie-, Zins- und Kostenmärkte (z. B. Gaspreis, Strompreis) gehören nicht hinein, nur Regeln und Fördersätze mit Rechtsgrundlage.
- **Kein Rechenkern:** Er rechnet nichts durch; die Berechnung bleibt im Rechner.
- **Keine automatische Aktualisierung** der Daten und kein Abruf der Quellen zur Laufzeit; Prüfen und Pflegen sind Aufgaben des Projekts.
- **Kein Online-Dienst mit Konten, Schreibzugriff oder Benachrichtigungen.**

## Leitplanken für neue Anforderungen

Eine Anforderung ist **gedeckt**, wenn sie (1) auf einen ausdrücklichen Wunsch des Nutzers oder eine bestehende Anforderung zurückgeht, (2) zu Zweck und Benutzern oben passt und (3) keiner Grundentscheidung widerspricht. Prüfe jede Anforderung so:

- **Nicht erfunden:** Jeder Punkt lässt sich auf die Eingabe des Nutzers, eine bestehende Anforderung oder eine zwingende Folge (Sicherheit, Fehlerfälle, Dokumentation) zurückführen. Zusätzliche Werkzeuge, Felder oder Themen „für später“ sind nicht gedeckt.
- **Nicht zu komplex:** Die einfachste Lösung, die den Wunsch erfüllt, wird gewählt.
- **Kein Widerspruch:** kein Schreibzugriff, keine Anmeldung, keine Speicherung von Anfragen, keine Marktdaten, keine Berechnung.
- **Maß halten bei Folgearbeit:** Grenzfälle, Fehlertexte, Tests und Dokumentation sind gedeckt; neue Nebenfunktionen daraus nicht.

Ist eine Anforderung nicht gedeckt, streicht der Reviewer sie oder legt sie dem Nutzer als offenen Punkt vor.
