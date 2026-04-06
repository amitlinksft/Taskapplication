from datetime import date
from rest_framework import serializers
from .models import Task, Attachment, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'symbol', 'color']
        read_only_fields = ['id']


class AttachmentSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = ['id', 'filename', 'url', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

    def get_url(self, obj):
        request = self.context.get('request')
        if request and obj.file:
            return request.build_absolute_uri(obj.file.url)
        return None


class TaskSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)
    is_overdue = serializers.SerializerMethodField()
    category_detail = CategorySerializer(source='category', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'due_date', 'created_at',
                  'attachments', 'is_overdue', 'category', 'category_detail']
        read_only_fields = ['id', 'created_at']

    def get_is_overdue(self, obj):
        if obj.due_date and obj.status != 'Completed':
            return obj.due_date < date.today()
        return False

    def validate_due_date(self, value):
        if value and value < date.today():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value

    def validate_category(self, value):
        if value:
            request = self.context.get('request')
            if request and value.user != request.user:
                raise serializers.ValidationError("Invalid category.")
        return value
