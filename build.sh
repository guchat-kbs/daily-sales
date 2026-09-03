#!/usr/bin/env bash
# exit on error
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# --- AUTO CREATE SUPERUSER ---
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
username = "sakal"
email = "sakalytshit@gmail.com"
password = "Salibill1"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superuser {username} created!")
else:
    print(f"Superuser {username} already exists")
END