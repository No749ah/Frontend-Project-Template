#!/bin/sh

# Den Wert aus dem File lesen
PROJECTMODE=$(grep "const ProjectModeValue" ./frontend/project_mode/mode/projectmode.ts | cut -d"=" -f2 | cut -d";" -f1 | tr -d '[:space:]')

# Überprüfen, ob der ProjectModeValue 'production' ist
if [ "$PROJECTMODE" == "'production'" ]; then
    echo "Project mode is set to production. Continuing the pipeline."
    exit 0
else
    echo "Project mode is not set to production. Aborting the pipeline."
    exit 1
fi
