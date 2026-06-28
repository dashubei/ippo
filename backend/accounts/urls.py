from django.urls import path
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenRefreshView,
)

from .views import CookieTokenObtainPairView, RegisterView

urlpatterns = [
    path("register", RegisterView.as_view()),  # POST /api/register
    path("login", CookieTokenObtainPairView.as_view()),  # POST /api/login
    path("refresh", TokenRefreshView.as_view()),  # refresh
    path("logout", TokenBlacklistView.as_view()),  # Logout
]
