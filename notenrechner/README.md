# [RWTH Notenrechner](https://phillecl.github.io/notenrechner/)

Ein Rechner für die Gesamtnote und die optimale Kombination an gestrichenen Modulen
für verschiedene Studiengänge der RWTH Aachen.

Es wird die Gesamtnote für jede mögliche Kombination an gestrichenen Modulen berechnet
und nach aufsteigender (=schlechter werdender) Gesamtnote sortiert angezeigt.

## Hinzufügen von neuen Studiengängen

Du kannst gerne [einen Issue öffnen](https://github.com/PhilLecl/PhilLecl.github.io/issues/new), um einen neuen
Studiengang vorzuschlagen.  
Auch [Pull-Requests](https://github.com/PhilLecl/PhilLecl.github.io/pulls), die neue Studiengänge hinzufügen, werden
gerne akzeptiert.
Hierfür muss nur ein neuer Eintrag
in [curricula.json](https://github.com/PhilLecl/PhilLecl.github.io/blob/main/notenrechner/curricula.json) hinzugefügt
werden.

### Aufbau eines Studiengang-Eintrags

- `"id"`: Eine eindeutige ID. Ich nehme z.B. `abschluss.fach.jahrDerPrüfungsordnung`
- `"name"`: Der bei der Studiengangs-Wahl angezeigte Name
- `"max_drop"`: Die maximale Anzahl Module
- `"max_drop_cp"`: Die maximale Anzahl streichbarer CP
- `"modules"`: Eine JSON-Liste der benoteten Module

### Aufbau eines Modul-Eintrags

- `"id"`: Eine (innerhalb dieses Studiengangs) eindeutige ID
- `"name"`: Der angezeigte Modulname
- `"cp"`: Die Anzahl der Credit-Points
- `"weight"`: Gewichtungsfaktor des Moduls
- `"droppable"`: `true` wenn das Modul gestrichen werden kann, sonst `false`
