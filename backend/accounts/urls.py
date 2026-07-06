from django.urls import path

from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    CSRFView,
    DeleteAccountView,
    LogoutView,
    MeView,
    RegisterView,
)

urlpatterns = [
    path("register", RegisterView.as_view()),  # POST /api/register
    path("login", CookieTokenObtainPairView.as_view()),  # POST /api/login
    path("refresh", CookieTokenRefreshView.as_view()),  # refresh
    path("logout", LogoutView.as_view()),  # Logout
    path("delete-account", DeleteAccountView.as_view()),  # Delete
    path("me", MeView.as_view()),  # GET /api/me
    path("csrf", CSRFView.as_view()),
]
