@echo off
cd /d "c:\Users\fauzi\Documents\github\mutabaah-pwa\mutabaah-pwa"
echo Starting build at %TIME% > build.log
npx next build >> build.log 2>&1
echo EXIT_CODE=%ERRORLEVEL% >> build.log
echo DONE >> build.done