#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

python manage.py shell -c "
from entries.models import Entry
deleted_count = Entry.objects.filter(owner__isnull=True).count()
print(f'Deleting {deleted_count} orphaned entries...')
Entry.objects.filter(owner__isnull=True).delete()
"