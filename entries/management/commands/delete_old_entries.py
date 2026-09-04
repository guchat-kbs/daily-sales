from django.core.management.base import BaseCommand
from django.utils import timezone

from entries.models import Entry


class Command(BaseCommand):
    help = "Delete all entries from previous business dates."

    def handle(self, *args, **options):
        today = timezone.localdate()

        deleted_count, _ = (
            Entry.objects
            .filter(business_date__lt=today)
            .delete()
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Deleted {deleted_count} old entry records."
            )
        )