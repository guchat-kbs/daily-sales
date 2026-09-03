from django.contrib import admin

from .models import Entry


@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = (
        "entry_type",
        "number",
        "amount",
        "owner",
        "business_date",
        "created_at",
    )

    list_filter = (
        "entry_type",
        "business_date",
        "owner",
    )

    search_fields = (
        "number",
    )

    ordering = (
        "-created_at",
    )