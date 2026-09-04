#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

python manage.py shell -c "
from django.contrib.auth import get_user_model

User = get_user_model()

username = '${DJANGO_SUPERUSER_USERNAME}'
email = '${DJANGO_SUPERUSER_EMAIL}'
password = '${DJANGO_SUPERUSER_PASSWORD}'

if not User.objects.filter(username=username).exists():
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
    )
    print(f'Superuser {username} created successfully.')
else:
    print(f'Superuser {username} already exists.')
"

python manage.py shell -c "
from entries.models import Entry
deleted_count = Entry.objects.filter(owner__isnull=True).count()
print(f'Deleting {deleted_count} orphaned entries...')
Entry.objects.filter(owner__isnull=True).delete()
"