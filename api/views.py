from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Note, Tag, Expense, Folder
from .serializers import NoteSerializer, TagSerializer, ExpenseSerializer, FolderSerializer
# import pytesseract
from PIL import Image
# import openai # Uncomment if using OpenAI

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-date', '-created_at')
    serializer_class = ExpenseSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        # Stats endpoint for the dashboard
        expenses = self.get_queryset()
        
        total_income = sum(e.amount for e in expenses if e.transaction_type == 'income')
        total_expense = sum(e.amount for e in expenses if e.transaction_type == 'expense')
        total_balance = total_income - total_expense
        
        recent_expenses = expenses[:5]
        serializer = self.get_serializer(recent_expenses, many=True)
        
        return Response({
            'total_amount': total_balance, # Reusing this field name for compatibility, but it represents balance now
            'total_income': total_income,
            'total_expense': total_expense,
            'recent': serializer.data
        })

# Mock AI Views (Placeholders)
from rest_framework.views import APIView

class OCRView(APIView):
    def post(self, request):
        # In a real app, you'd handle the image upload and pass it to Tesseract or Vision API
        # image = request.FILES.get('image')
        # text = pytesseract.image_to_string(Image.open(image))
        return Response({'text': "Extracted text from image (Mock)"})

class SummarizeView(APIView):
    def post(self, request):
        text = request.data.get('text')
        # summary = openai.Completion.create(...)
        return Response({'summary': f"Summary of: {text[:20]}... (Mock)"})
