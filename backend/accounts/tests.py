from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase

from records.models import ExposureRecord, UserValue

User = get_user_model()


class RegisterViewTests(APITestCase):
    def test_register_success(self):
        response = self.client.post(
            "/api/register",
            {"email": "test@example.com", "password": "testpass123"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 1)
        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)


class DoubleUserTest(APITestCase):
    def test_register_success(self):
        User.objects.create_user(email="test@example.com", password="testpass123")
        response = self.client.post(
            "/api/register",
            {"email": "test@example.com", "password": "testpass123"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class LoginViewTest(APITestCase):
    def setUp(self):
        self.email = "user@example.com"
        self.password = "test123"
        User.objects.create_user(email=self.email, password=self.password)

    def test_login_success(self):
        response = self.client.post(
            "/api/login",
            {"email": self.email, "password": self.password},
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_login_wrong_password(self):
        response = self.client.post(
            "/api/login",
            {"email": self.email, "password": "testpass123"},
            format="json",
        )
        self.assertEqual(response.status_code, 401)

    def test_refresh_token(self):
        self.client.post(
            "/api/login",
            {"email": self.email, "password": self.password},
            format="json",
        )
        response = self.client.post(
            "/api/refresh",
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_refresh_without_login(self):
        response = self.client.post(
            "/api/refresh",
            format="json",
        )
        self.assertEqual(response.status_code, 401)


class LogoutView(APITestCase):
    def test_logout_success(self):
        response = self.client.post(
            "/api/logout",
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.cookies["access_token"].value, "")
        self.assertEqual(response.cookies["access_token"]["max-age"], 0)

    def test_logout_without_login(self):
        response = self.client.post(
            "/api/logout",
            format="json",
        )
        self.assertEqual(response.status_code, 200)


class DeleteAccountViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=True)
        self.email = "user@example.com"
        self.password = "test123"
        self.user = User.objects.create_user(email=self.email, password=self.password)
        self.client.post(
            "/api/login",
            {"email": self.email, "password": self.password},
            format="json",
        )

    def test_delete_account_success(self):
        self.client.get("/api/csrf")
        csrf_token = self.client.cookies["csrftoken"].value

        response = self.client.post(
            "/api/delete-account",
            {"password": self.password},
            format="json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(response.status_code, 204)

    def test_delete_account_wrong_password(self):
        self.client.get("/api/csrf")
        csrf_token = self.client.cookies["csrftoken"].value

        response = self.client.post(
            "/api/delete-account",
            {"password": "fdjkfd"},
            format="json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(response.status_code, 400)

    def test_delete_account_without_csrf_header(self):
        response = self.client.post(
            "/api/delete-account",
            {"password": self.password},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_delete_account_cascades_related_records(self):
        value = UserValue.objects.create(user=self.user, name="家族")
        ExposureRecord.objects.create(
            user=self.user, value=value, action="挨拶する", anxiety_before=50
        )
        self.client.get("/api/csrf")
        csrf_token = self.client.cookies["csrftoken"].value

        self.client.post(
            "/api/delete-account",
            {"password": self.password},
            format="json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(UserValue.objects.count(), 0)
        self.assertEqual(ExposureRecord.objects.count(), 0)


class MeViewTest(APITestCase):
    def setUp(self):
        self.email = "user@example.com"
        self.password = "test123"
        User.objects.create_user(email=self.email, password=self.password)

    def test_me_authenticated(self):
        self.client.post(
            "/api/login",
            {"email": self.email, "password": self.password},
            format="json",
        )
        response = self.client.get("/api/me")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["email"], self.email)

    def test_me_unauthenticated(self):
        response = self.client.get("/api/me")
        self.assertEqual(response.status_code, 401)


class CSRFViewTest(APITestCase):
    def test_csrf_success(self):
        response = self.client.get("/api/csrf")
        self.assertEqual(response.status_code, 200)
