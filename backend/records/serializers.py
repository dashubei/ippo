from rest_framework import serializers
from .models import UserValue, ExposureRecord


class UserValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserValue
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        user = self.context["request"].user
        qs = UserValue.objects.filter(user=user, name=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("この価値はすでに登録されています")
        return value


class ExposureRecordSerializer(serializers.ModelSerializer):
    anxiety_before = serializers.IntegerField(min_value=0, max_value=100)
    anxiety_after = serializers.IntegerField(
        min_value=0, max_value=100, allow_null=True, required=False
    )

    def validate_value(self, value):
        if value.user != self.context["request"].user:
            raise serializers.ValidationError("自分の価値のみ指定できます")
        return value

    class Meta:
        model = ExposureRecord
        fields = [
            "id",
            "user",
            "value",
            "action",
            "anxiety_before",
            "anxiety_after",
            "memo_before",
            "memo_after",
            "done_at",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]
