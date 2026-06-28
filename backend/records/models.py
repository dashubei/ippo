from django.db import models
from django.conf import settings


# Create your models here.
class UserValue(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"], name="unique_user_value_name"
            )
        ]


class ExposureRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    value = models.ForeignKey(UserValue, on_delete=models.CASCADE)
    action = models.CharField(max_length=150)
    anxiety_before = models.IntegerField()
    anxiety_after = models.IntegerField(null=True, blank=True)
    memo_before = models.TextField(null=True, blank=True)
    memo_after = models.TextField(null=True, blank=True)
    done_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "done_at"]),
        ]
