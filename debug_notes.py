import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'notes_backend.settings')
django.setup()

from api.models import Note
from api.serializers import NoteSerializer

try:
    notes = Note.objects.all()
    print(f"Found {notes.count()} notes.")
    serializer = NoteSerializer(notes, many=True)
    print("Serialization successful.")
    # print(serializer.data) 
except Exception as e:
    print("Error during serialization:")
    import traceback
    traceback.print_exc()
