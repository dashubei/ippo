from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import UserValue, ExposureRecord
from .serializers import ExposureRecordSerializer, UserValueSerializer


class UserValueViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = UserValue.objects.filter(user=request.user)
        serializer = UserValueSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = UserValueSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        instance = get_object_or_404(UserValue, pk=pk, user=request.user)
        serializer = UserValueSerializer(
            instance, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        instance = get_object_or_404(UserValue, pk=pk, user=request.user)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExposureRecordViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = ExposureRecord.objects.filter(user=request.user)
        date_from = request.query_params.get("from")
        date_to = request.query_params.get("to")
        if date_from:
            queryset = queryset.filter(done_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(done_at__lte=date_to)
        serializer = ExposureRecordSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        instance = get_object_or_404(ExposureRecord, pk=pk, user=request.user)
        serializer = ExposureRecordSerializer(instance)
        return Response(serializer.data)

    def create(self, request):
        serializer = ExposureRecordSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        instance = get_object_or_404(ExposureRecord, pk=pk, user=request.user)
        serializer = ExposureRecordSerializer(
            instance, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        instance = get_object_or_404(ExposureRecord, pk=pk, user=request.user)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
