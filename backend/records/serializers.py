from rest_framework import serializers
from .models import UserValue, ExposureRecord


class UserValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserValue
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

class ExposureRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExposureRecord
        fields = ['id', 'user', 'value', 'action', 'anxiety_before', 'anxiety_after', 'memo_before', 'memo_after', 'done_at', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']