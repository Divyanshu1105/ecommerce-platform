@echo off
mkdir backups 2>nul
python manage.py dumpdata --natural-foreign --natural-primary --indent 2 -o backups\db_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.json
echo Backup created: backups\db_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.json
pause
