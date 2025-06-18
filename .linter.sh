#!/bin/bash
cd /home/kavia/workspace/code-generation/vividsphere-61465-9b5e6e6a/vividsphere
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

