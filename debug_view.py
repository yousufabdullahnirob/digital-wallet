import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'notes_backend.settings')
django.setup()

from rest_framework.test import APIRequestFactory
from api.views import NoteViewSet
from api.models import Note
from django.conf import settings

# Patch ALLOWED_HOSTS
settings.ALLOWED_HOSTS = ['testserver', '127.0.0.1', 'localhost']

try:
    print("Starting debug...")
    # Check if we can access the DB
    count = Note.objects.count()
    print(f"Note count: {count}")

    # Create a request
    factory = APIRequestFactory()
    request = factory.get('/api/notes/')
    
    # Instantiate the view
    view = NoteViewSet.as_view({'get': 'list'})
    
    # Run the view
    print("Executing view...")
    response = view(request)
    
    print(f"Response Status Code: {response.status_code}")
    if response.status_code != 200:
        print("Response Error Data:")
        print(response.data)
    else:
        print("View execution successful.")
        
except Exception as e:
    print("CRASHED:")
    import traceback
    traceback.print_exc()
