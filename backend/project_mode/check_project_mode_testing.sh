#!/bin/sh

# Den Wert aus dem File lesen
PROJECTMODE=$(grep "const ProjectModeValue" ./backend/project_mode/mode/projectmode.ts | cut -d"=" -f2 | cut -d";" -f1 | tr -d '[:space:]')

# Überprüfen, ob der ProjectModeValue 'testing' ist
if [ "$PROJECTMODE" = "'testing'" ]; then
    echo "Project mode is set to testing. Continuing the pipeline."
    exit 0
else
    echo "Project mode is not set to testing. Aborting the pipeline."
    exit 1
fi
