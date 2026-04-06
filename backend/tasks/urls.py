from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list, name='task-list'),
    path('<int:pk>/', views.task_detail, name='task-detail'),
    path('<int:pk>/attachments/<int:attachment_id>/', views.delete_attachment, name='delete-attachment'),
    path('categories/', views.category_list, name='category-list'),
    path('categories/<int:pk>/', views.category_detail, name='category-detail'),
]
