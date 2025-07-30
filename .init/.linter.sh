#!/bin/bash
cd /home/kavia/workspace/code-generation/browser-tic-tac-toe-7283-7349/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

