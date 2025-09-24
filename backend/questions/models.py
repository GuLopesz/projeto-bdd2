from django.db import models
from django.conf import settings
from subjects.models import Subject

# Create your models here.
class Question(models.Model):
    question_title = models.CharField(max_length=100)
    question_body = models.TextField()
    anonymous = models.BooleanField(default=False)
    question_date = models.DateTimeField(auto_now_add=True)
    questions_status = models.BooleanField(default=False)

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="questions")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="questions")

    def __str__(self):
        return self.question_title