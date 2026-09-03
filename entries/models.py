from django.conf import settings
from django.db import models


class Entry(models.Model):
    class EntryType(models.TextChoices):
        FR = "FR", "FR"
        SR = "SR", "SR"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="entries",
        null=True,
        blank=True,
    )

    entry_type = models.CharField(
        max_length=2,
        choices=EntryType.choices,
    )

    number = models.CharField(
        max_length=50,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    business_date = models.DateField()

    class Meta:
        indexes = [
            models.Index(
                fields=["business_date", "entry_type"],
            ),
            models.Index(
                fields=["created_at"],
            ),
            models.Index(
                fields=["owner", "business_date", "entry_type"],
            ),
        ]

    def __str__(self):
        return f"{self.entry_type} - {self.number} - ₹{self.amount}"