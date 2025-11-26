from rest_framework import serializers
from .models import Note, NoteImage, Tag, Expense, Folder
from django.core.files.base import ContentFile
import base64
import uuid

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class NoteImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = NoteImage
        fields = ['id', 'image', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'name', 'created_at']

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    images = NoteImageSerializer(many=True, read_only=True)
    folder = serializers.PrimaryKeyRelatedField(queryset=Folder.objects.all(), required=False, allow_null=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50), write_only=True, required=False
    )
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Note
        fields = ['id', 'title', 'body', 'tags', 'tag_names', 'images', 'uploaded_images', 'created_at', 'updated_at', 'color', 'is_archived', 'is_trashed', 'folder', 'reminder']

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        uploaded_images = validated_data.pop('uploaded_images', [])
        note = Note.objects.create(**validated_data)

        for tag_name in tag_names:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            note.tags.add(tag)

        for image in uploaded_images:
            NoteImage.objects.create(note=note, image=image)

        return note

    def update(self, instance, validated_data):
        tag_names = validated_data.pop('tag_names', None)
        uploaded_images = validated_data.pop('uploaded_images', None)

        instance.title = validated_data.get('title', instance.title)
        instance.body = validated_data.get('body', instance.body)
        instance.color = validated_data.get('color', instance.color)
        instance.is_archived = validated_data.get('is_archived', instance.is_archived)
        instance.is_trashed = validated_data.get('is_trashed', instance.is_trashed)
        instance.folder = validated_data.get('folder', instance.folder)
        instance.reminder = validated_data.get('reminder', instance.reminder)
        instance.save()

        if tag_names is not None:
            instance.tags.clear()
            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                instance.tags.add(tag)

        if uploaded_images:
            for image in uploaded_images:
                NoteImage.objects.create(note=instance, image=image)

        return instance

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'amount', 'category', 'transaction_type', 'description', 'date', 'created_at', 'note']
