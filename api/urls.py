from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, TagViewSet, ExpenseViewSet, FolderViewSet, OCRView, SummarizeView

router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'tags', TagViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'folders', FolderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('ocr/', OCRView.as_view(), name='ocr'),
    path('summarize/', SummarizeView.as_view(), name='summarize'),
]
