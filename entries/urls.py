from django.urls import path

from .views import home, entries_api, house_api, ending_api, delete_entry, master_total_api


urlpatterns = [
    path("", home, name="home"),

    path(
        "api/entries/",
        entries_api,
        name="entries-api",
    ),

    path(
        "api/entries/<int:pk>/",
        delete_entry,
        name="delete-entry",
    ),

    path(
    "api/house/",
    house_api,
    name="house-api",
),

path(
    "api/ending/",
    ending_api,
    name="ending-api",
),

path(
    "api/master-total/",
    master_total_api,
    name="master-total-api",
),

]