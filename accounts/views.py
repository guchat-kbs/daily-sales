from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect, render
import time


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

    start = time.perf_counter()

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    auth_time = time.perf_counter() - start

    print(f"AUTHENTICATE TOOK: {auth_time:.3f} seconds")

    if user is not None:

        start = time.perf_counter()

        login(request, user)

        login_time = time.perf_counter() - start

        print(f"LOGIN SESSION TOOK: {login_time:.3f} seconds")

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