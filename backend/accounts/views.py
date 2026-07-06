from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = []
    throttle_scope = "register"

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            response = Response(status=status.HTTP_201_CREATED)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            set_auth_cookie(
                response=response, access=access_token, refresh=refresh_token
            )
            return response
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CookieTokenObtainPairView(TokenObtainPairView):
    throttle_scope = "login"

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data["access"]
        refresh_token = response.data["refresh"]
        set_auth_cookie(response=response, access=access_token, refresh=refresh_token)
        del response.data["access"]
        del response.data["refresh"]
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE["refresh"])
        if refresh_token is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)
        access_token = response.data["access"]
        refresh_token = response.data["refresh"]
        set_auth_cookie(response=response, access=access_token, refresh=refresh_token)
        del response.data["access"]
        del response.data["refresh"]
        return response


class LogoutView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE["refresh"])
        if refresh_token is not None:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                pass
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie(settings.AUTH_COOKIE["access"])
        response.delete_cookie(settings.AUTH_COOKIE["refresh"])
        return response


class DeleteAccountView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE["refresh"])
        password = request.data.get("password")
        if not request.user.check_password(password):
            return Response({"password": ["パスワードが正しくありません"]}, status=400)
        if refresh_token is not None:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                pass
        request.user.delete()
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(settings.AUTH_COOKIE["access"])
        response.delete_cookie(settings.AUTH_COOKIE["refresh"])
        return response


def set_auth_cookie(response, access, refresh):
    response.set_cookie(
        key=settings.AUTH_COOKIE["access"],
        value=access,
        max_age=settings.AUTH_COOKIE["access_max_age"],
        httponly=settings.AUTH_COOKIE["httponly"],
        secure=settings.AUTH_COOKIE["secure"],
        samesite=settings.AUTH_COOKIE["samesite"],
    )
    response.set_cookie(
        key=settings.AUTH_COOKIE["refresh"],
        value=refresh,
        max_age=settings.AUTH_COOKIE["refresh_max_age"],
        httponly=settings.AUTH_COOKIE["httponly"],
        secure=settings.AUTH_COOKIE["secure"],
        samesite=settings.AUTH_COOKIE["samesite"],
    )


class MeView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(
            {
                "id": request.user.id,
                "email": request.user.email,
                "name": request.user.name,
            }
        )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response(status=status.HTTP_200_OK)
