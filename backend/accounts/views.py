from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {"access": str(refresh.access_token), "refresh": str(refresh)},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data["access"]
        refresh_token = response.data["refresh"]
        response.set_cookie(
            key=settings.AUTH_COOKIE["access"],
            value=access_token,
            max_age=settings.AUTH_COOKIE["access_max_age"],
            httponly=settings.AUTH_COOKIE["httponly"],
            secure=settings.AUTH_COOKIE["secure"],
            samesite=settings.AUTH_COOKIE["samesite"],
        )
        response.set_cookie(
            key=settings.AUTH_COOKIE["refresh"],
            value=refresh_token,
            max_age=settings.AUTH_COOKIE["access_max_age"],
            httponly=settings.AUTH_COOKIE["httponly"],
            secure=settings.AUTH_COOKIE["secure"],
            samesite=settings.AUTH_COOKIE["samesite"],
        )
        del response.data["access"]
        del response.data["refresh"]
        return response
