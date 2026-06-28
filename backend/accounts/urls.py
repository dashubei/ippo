from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView, TokenBlacklistView

urlpatterns = [
    path('register', RegisterView.as_view()),   # POST /api/register
    path('login',    TokenObtainPairView.as_view()),   # POST /api/login
    path('refresh',  TokenRefreshView.as_view()),   # POST
    path('logout',  TokenBlacklistView.as_view()),   # Logout
]