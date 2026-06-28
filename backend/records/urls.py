from django.urls import path
from .views import UserValueViewSet, ExposureRecordViewSet

urlpatterns = [
    path("values", UserValueViewSet.as_view({"get": "list", "post": "create"})),
    path(
        "values/<int:pk>",
        UserValueViewSet.as_view({"patch": "update", "delete": "destroy"}),
    ),
    path("exposures", ExposureRecordViewSet.as_view({"get": "list", "post": "create"})),
    path(
        "exposures/<int:pk>",
        ExposureRecordViewSet.as_view(
            {"get": "retrieve", "patch": "update", "delete": "destroy"}
        ),
    ),
]
