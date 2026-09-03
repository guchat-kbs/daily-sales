from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect, render


def is_master(user):
    return (
        user.is_authenticated
        and user.groups.filter(name="Master").exists()
    )


def login_view(request):

    if request.user.is_authenticated:

        if is_master(request.user):
            return redirect("master")

        return redirect("home")

    if request.method == "POST":

        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        user = authenticate(
            request,
            username=username,
            password=password,
        )

        if user is not None:

            login(request, user)

            if is_master(user):
                return redirect("master")

            return redirect("home")

        messages.error(
            request,
            "Invalid username or password.",
        )

    return render(request, "accounts/login.html")


@login_required
def master_view(request):

    if not is_master(request.user):
        raise PermissionDenied

    return render(request, "master.html")


@login_required
def logout_view(request):

    logout(request)

    return redirect("login")