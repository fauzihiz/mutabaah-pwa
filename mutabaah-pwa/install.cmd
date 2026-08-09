@echo off
cd /d "c:\Users\fauzi\Documents\github\mutabaah-pwa\mutabaah-pwa"
echo Starting npm install...
npm install
echo npm install exit code: %ERRORLEVEL% > npm-result.txt
echo DONE >> npm-result.txt