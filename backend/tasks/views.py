from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Task, Attachment, Category
from .serializers import TaskSerializer, CategorySerializer


DEFAULT_CATEGORIES = [
    {'name': 'Work', 'symbol': '\U0001f4bc', 'color': '#4a6cf7'},
    {'name': 'Personal', 'symbol': '\U0001f3e0', 'color': '#27ae60'},
    {'name': 'Shopping', 'symbol': '\U0001f6d2', 'color': '#e67e22'},
    {'name': 'Health', 'symbol': '\u2764\ufe0f', 'color': '#e74c3c'},
    {'name': 'Study', 'symbol': '\U0001f4da', 'color': '#8e44ad'},
    {'name': 'Finance', 'symbol': '\U0001f4b0', 'color': '#2ecc71'},
    {'name': 'Travel', 'symbol': '\u2708\ufe0f', 'color': '#3498db'},
    {'name': 'Fitness', 'symbol': '\U0001f3cb\ufe0f', 'color': '#f39c12'},
]


class TaskPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 20


# ---------- Category views ----------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def category_list(request):
    if request.method == 'GET':
        if not Category.objects.filter(user=request.user).exists():
            for cat in DEFAULT_CATEGORIES:
                Category.objects.create(user=request.user, **cat)
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail(request, pk):
    try:
        category = Category.objects.get(pk=pk, user=request.user)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------- Task views ----------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.filter(user=request.user)

        status_filter = request.query_params.get('status')
        if status_filter in ['Pending', 'Completed']:
            tasks = tasks.filter(status=status_filter)

        category_filter = request.query_params.get('category')
        if category_filter:
            tasks = tasks.filter(category_id=category_filter)

        paginator = TaskPagination()
        page = paginator.paginate_queryset(tasks, request)
        serializer = TaskSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            task = serializer.save(user=request.user)
            files = request.FILES.getlist('files')
            for f in files:
                Attachment.objects.create(task=task, file=f, filename=f.name)
            return Response(
                TaskSerializer(task, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk, user=request.user)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(task, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(task, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            files = request.FILES.getlist('files')
            for f in files:
                Attachment.objects.create(task=task, file=f, filename=f.name)
            return Response(TaskSerializer(task, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_attachment(request, pk, attachment_id):
    try:
        task = Task.objects.get(pk=pk, user=request.user)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        attachment = Attachment.objects.get(id=attachment_id, task=task)
    except Attachment.DoesNotExist:
        return Response({'error': 'Attachment not found'}, status=status.HTTP_404_NOT_FOUND)

    attachment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
