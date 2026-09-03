from django.urls import path

from .views import (
    login_view,
    logout_view,
    master_view,
)


urlpatterns = [

    path(
        "login/",
        login_view,
        name="login",
    ),

    path(
        "logout/",
        logout_view,
        name="logout",
    ),

    path(
        "master/",
        master_view,
        name="master",
    ),

]