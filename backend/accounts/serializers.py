from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()  # settings.AUTH_USER_MODEL のUserを取得


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "name"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
