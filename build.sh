#!/usr/bin/env bash
# exit on error
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

python manage.py shell
from entries.models import Entry
Entry.objects.filter(owner__isnull=True).count()   # see how many will be deleted
Entry.objects.filter(owner__isnull=True).delete()   # delete them
exit()