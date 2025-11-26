from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    title = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    color = models.CharField(max_length=20, default='white')
    is_archived = models.BooleanField(default=False)
    is_trashed = models.BooleanField(default=False)
    folder = models.ForeignKey('Folder', on_delete=models.SET_NULL, null=True, blank=True, related_name='notes')
    reminder = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title or "Untitled Note"

class Folder(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class NoteImage(models.Model):
    note = models.ForeignKey(Note, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='note_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"Image for {self.note.title}"

class Expense(models.Model):
    TRANSACTION_TYPES = (
        ('expense', 'Expense'),
        ('income', 'Income'),
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, default='expense')
    description = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    # Optional: Link an expense to a note (e.g., "Trip to Paris" note linked to flight expense)
    note = models.ForeignKey(Note, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')

    def __str__(self):
        return f"{self.category}: ${self.amount}"
