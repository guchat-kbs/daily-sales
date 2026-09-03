from django.utils import timezone
from rest_framework import serializers

from .models import Entry


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = [
            "id",
            "entry_type",
            "number",
            "amount",
            "created_at",
            "business_date",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "business_date",
        ]

    def validate_number(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Number cannot be empty."
            )

        return value

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Amount must be greater than zero."
            )

        return value

    def create(self, validated_data):
        validated_data["business_date"] = timezone.localdate()

        return Entry.objects.create(**validated_data)