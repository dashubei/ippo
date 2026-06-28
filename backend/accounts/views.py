from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
           user = serializer.save()
           refresh = RefreshToken.for_user(user)
           return Response({"access": str(refresh.access_token), "refresh": str(refresh)}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)