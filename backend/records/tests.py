from datetime import datetime

from django.contrib.auth import get_user_model
from django.utils.timezone import make_aware
from rest_framework.test import APIClient, APITestCase

from .models import ExposureRecord, UserValue

User = get_user_model()


class RecordsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=True)
        self.password = "test123"
        self.user = User.objects.create_user(
            email="user@example.com", password=self.password
        )
        self.other = User.objects.create_user(
            email="other@example.com", password=self.password
        )
        self.client.post(
            "/api/login",
            {"email": self.user.email, "password": self.password},
            format="json",
        )

    def csrf_headers(self):
        self.client.get("/api/csrf")
        return {"HTTP_X_CSRFTOKEN": self.client.cookies["csrftoken"].value}


class UserValueViewSetTests(RecordsTestCase):
    def test_list_only_own_values(self):
        UserValue.objects.create(user=self.user, name="家族")
        UserValue.objects.create(user=self.other, name="仕事")

        response = self.client.get("/api/values")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "家族")

    def test_create_value_success(self):
        response = self.client.post(
            "/api/values",
            {"name": "健康"},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(UserValue.objects.filter(user=self.user).count(), 1)

    def test_create_duplicate_value_fails(self):
        UserValue.objects.create(user=self.user, name="家族")

        response = self.client.post(
            "/api/values",
            {"name": "家族"},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 400)

    def test_update_own_value(self):
        value = UserValue.objects.create(user=self.user, name="家族")

        response = self.client.patch(
            f"/api/values/{value.id}",
            {"name": "友人関係"},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 200)
        value.refresh_from_db()
        self.assertEqual(value.name, "友人関係")

    def test_cannot_update_other_users_value(self):
        value = UserValue.objects.create(user=self.other, name="仕事")

        response = self.client.patch(
            f"/api/values/{value.id}",
            {"name": "乗っ取り"},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 404)

    def test_destroy_own_value(self):
        value = UserValue.objects.create(user=self.user, name="家族")

        response = self.client.delete(
            f"/api/values/{value.id}",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(UserValue.objects.count(), 0)

    def test_cannot_destroy_other_users_value(self):
        value = UserValue.objects.create(user=self.other, name="仕事")

        response = self.client.delete(
            f"/api/values/{value.id}",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(UserValue.objects.count(), 1)


class ExposureRecordViewSetTests(RecordsTestCase):
    def setUp(self):
        super().setUp()
        self.value = UserValue.objects.create(user=self.user, name="家族")
        self.other_value = UserValue.objects.create(user=self.other, name="仕事")

    def test_list_only_own_exposures(self):
        ExposureRecord.objects.create(
            user=self.user, value=self.value, action="挨拶する", anxiety_before=50
        )
        ExposureRecord.objects.create(
            user=self.other,
            value=self.other_value,
            action="発表する",
            anxiety_before=80,
        )

        response = self.client.get("/api/exposures")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_own_exposure(self):
        record = ExposureRecord.objects.create(
            user=self.user, value=self.value, action="挨拶する", anxiety_before=50
        )

        response = self.client.get(f"/api/exposures/{record.id}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["action"], "挨拶する")

    def test_cannot_retrieve_other_users_exposure(self):
        record = ExposureRecord.objects.create(
            user=self.other,
            value=self.other_value,
            action="発表する",
            anxiety_before=80,
        )

        response = self.client.get(f"/api/exposures/{record.id}")

        self.assertEqual(response.status_code, 404)

    def test_create_exposure_success(self):
        response = self.client.post(
            "/api/exposures",
            {"value": self.value.id, "action": "挨拶する", "anxiety_before": 50},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(ExposureRecord.objects.filter(user=self.user).count(), 1)

    def test_create_exposure_with_other_users_value_fails(self):
        response = self.client.post(
            "/api/exposures",
            {"value": self.other_value.id, "action": "挨拶する", "anxiety_before": 50},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 400)

    def test_create_exposure_anxiety_out_of_range_fails(self):
        response = self.client.post(
            "/api/exposures",
            {"value": self.value.id, "action": "挨拶する", "anxiety_before": 101},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 400)

    def test_update_exposure_success(self):
        record = ExposureRecord.objects.create(
            user=self.user, value=self.value, action="挨拶する", anxiety_before=50
        )

        response = self.client.patch(
            f"/api/exposures/{record.id}",
            {"anxiety_after": 30},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 200)
        record.refresh_from_db()
        self.assertEqual(record.anxiety_after, 30)

    def test_cannot_update_other_users_exposure(self):
        record = ExposureRecord.objects.create(
            user=self.other,
            value=self.other_value,
            action="発表する",
            anxiety_before=80,
        )

        response = self.client.patch(
            f"/api/exposures/{record.id}",
            {"anxiety_after": 10},
            format="json",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 404)

    def test_destroy_own_exposure(self):
        record = ExposureRecord.objects.create(
            user=self.user, value=self.value, action="挨拶する", anxiety_before=50
        )

        response = self.client.delete(
            f"/api/exposures/{record.id}",
            **self.csrf_headers(),
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(ExposureRecord.objects.count(), 0)

    def test_list_filters_by_date_range(self):
        ExposureRecord.objects.create(
            user=self.user,
            value=self.value,
            action="1月の記録",
            anxiety_before=50,
            done_at=make_aware(datetime(2026, 1, 15, 10, 0)),
        )
        ExposureRecord.objects.create(
            user=self.user,
            value=self.value,
            action="6月の記録",
            anxiety_before=50,
            done_at=make_aware(datetime(2026, 6, 15, 10, 0)),
        )

        response = self.client.get("/api/exposures?from=2026-06-01&to=2026-06-30")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["action"], "6月の記録")
