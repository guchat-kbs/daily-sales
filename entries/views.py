from django.db.models import Sum
from django.shortcuts import redirect, render
from django.utils import timezone

from django.db import transaction

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Entry
from .serializers import EntrySerializer

from django.contrib.auth.decorators import login_required


def is_master(user):
    return (
        user.is_authenticated
        and user.groups.filter(name="Master").exists()
    )


@login_required
def home(request):

    if is_master(request.user):
        return redirect("master")

    return render(request, "home.html")


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def entries_api(request):

    today = timezone.localdate()

    if request.method == "GET":

        entry_type = request.query_params.get("type", "FR").upper()

        if entry_type not in ["FR", "SR"]:
            return Response(
                {"error": "Invalid entry type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        entries = (
            Entry.objects
            .filter(
                business_date=today,
                entry_type=entry_type,
                owner=request.user,
            )
            .order_by("-created_at")
        )

        serializer = EntrySerializer(entries, many=True)

        total = (
            entries.aggregate(
                total=Sum("amount")
            )["total"]
            or 0
        )

        return Response({
            "entry_type": entry_type,
            "date": today,
            "entries": serializer.data,
            "grand_total": total,
        })

    # POST

    data = request.data

    if not isinstance(data, list):
        return Response(
            {"error": "Expected a list of entries."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(data) == 0:
        return Response(
            {"error": "No entries provided."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(data) > 15:
        return Response(
            {"error": "Maximum 15 entries allowed at once."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    created_entries = []

    for item in data:

        entry_type = item.get("entry_type", "").upper()

        if entry_type not in ["FR", "SR"]:
            return Response(
                {"error": "Invalid entry type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EntrySerializer(
            data={
                "entry_type": entry_type,
                "number": item.get("number", ""),
                "amount": item.get("amount"),
            }
        )

        serializer.is_valid(raise_exception=True)

        created_entries.append(
            serializer.save(owner=request.user)
        )

    return Response(
        EntrySerializer(
            created_entries,
            many=True,
        ).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def house_api(request):

    data = request.data

    if not isinstance(data, list):
        return Response(
            {"error": "Expected a list of House entries."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(data) == 0:
        return Response(
            {"error": "No House entries provided."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(data) > 3:
        return Response(
            {"error": "Maximum 3 House entries allowed at once."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    today = timezone.localdate()

    entries_to_create = []

    for item in data:

        entry_type = item.get("entry_type", "").upper()
        house = str(item.get("house", "")).strip()
        amount = item.get("amount")

        if entry_type not in ["FR", "SR"]:
            return Response(
                {"error": "Invalid entry type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not house.isdigit() or len(house) != 1:
            return Response(
                {"error": "House must be a single digit from 0 to 9."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid amount."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if amount <= 0:
            return Response(
                {"error": "Amount must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for ending in range(10):

            number = f"{house}{ending}"

            entries_to_create.append(
                Entry(
                    owner=request.user,
                    entry_type=entry_type,
                    number=number,
                    amount=amount,
                    business_date=today,
                )
            )

    with transaction.atomic():

        created_entries = Entry.objects.bulk_create(
            entries_to_create
        )

    return Response(
        {
            "message": (
                f"{len(created_entries)} entries created successfully."
            ),
            "entries": EntrySerializer(
                created_entries,
                many=True,
            ).data,
        },
        status=status.HTTP_201_CREATED,
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ending_api(request):

    data = request.data

    if not isinstance(data, list):
        return Response(
            {"error": "Expected a list of Ending entries."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(data) == 0:
        return Response(
            {"error": "No Ending entries provided."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(data) > 3:
        return Response(
            {"error": "Maximum 3 Ending entries allowed at once."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    today = timezone.localdate()

    entries_to_create = []

    for item in data:

        entry_type = item.get("entry_type", "").upper()
        ending = str(item.get("ending", "")).strip()
        amount = item.get("amount")

        if entry_type not in ["FR", "SR"]:
            return Response(
                {"error": "Invalid entry type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not ending.isdigit() or len(ending) != 1:
            return Response(
                {
                    "error":
                    "Ending must be a single digit from 0 to 9."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid amount."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if amount <= 0:
            return Response(
                {"error": "Amount must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for house in range(10):

            number = f"{house}{ending}"

            entries_to_create.append(
                Entry(
                    owner=request.user,
                    entry_type=entry_type,
                    number=number,
                    amount=amount,
                    business_date=today,
                )
            )

    with transaction.atomic():

        created_entries = Entry.objects.bulk_create(
            entries_to_create
        )

    return Response(
        {
            "message": (
                f"{len(created_entries)} entries created successfully."
            ),
            "entries": EntrySerializer(
                created_entries,
                many=True,
            ).data,
        },
        status=status.HTTP_201_CREATED,
    )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_entry(request, pk):

    today = timezone.localdate()

    entry = get_object_or_404(
        Entry,
        id=pk,
        business_date=today,
        owner=request.user,
    )

    entry.delete()

    return Response(
        {
            "message": "Entry deleted successfully."
        },
        status=status.HTTP_200_OK,
    )



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def master_total_api(request):

    if not request.user.groups.filter(
        name="Master"
    ).exists():

        return Response(
            {"error": "Master access required."},
            status=status.HTTP_403_FORBIDDEN,
        )


    entry_type = request.query_params.get(
        "type",
        "FR",
    ).upper()


    if entry_type not in ["FR", "SR"]:

        return Response(
            {"error": "Invalid entry type."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    today = timezone.localdate()

    # Per-number (00-99) breakdown for the selected entry type.
    # Numbers are zero-padded in Python so that older, non-padded
    # values (e.g. "5") and newer padded values (e.g. "05") are
    # merged into the same bucket.

    by_number = {
        f"{n:02d}": 0
        for n in range(100)
    }

    type_entries = (
        Entry.objects
        .filter(
            business_date=today,
            entry_type=entry_type,
        )
        .values_list("number", "amount")
    )

    total = 0

    for number, amount in type_entries:

        padded = number.strip().zfill(2)

        if padded in by_number:
            by_number[padded] += amount
        else:
            by_number[padded] = by_number.get(padded, 0) + amount

        total += amount

    fr_total = (
        Entry.objects
        .filter(
            business_date=today,
            entry_type="FR",
        )
        .aggregate(
            total=Sum("amount")
        )["total"]
        or 0
    )

    sr_total = (
        Entry.objects
        .filter(
            business_date=today,
            entry_type="SR",
        )
        .aggregate(
            total=Sum("amount")
        )["total"]
        or 0
    )

    overall_total = fr_total + sr_total

    return Response({
        "entry_type": entry_type,
        "date": today,
        "grand_total": total,
        "fr_total": fr_total,
        "sr_total": sr_total,
        "overall_total": overall_total,
        "by_number": by_number,
    })