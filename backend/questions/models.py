from django.db import models
from django.conf import settings
from subjects.models import Subject

class Question(models.Model):
    question_title = models.CharField(max_length=100, null=True, blank=True)
    question_body = models.TextField()
    anonymous = models.BooleanField(default=False)
    question_date = models.DateTimeField(auto_now_add=True)
    questions_status = models.BooleanField(default=False)

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="questions")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="questions")

def __str__(self):
        if self.question_title:
            return self.question_title
        if self.question_body:
            return (self.question_body[:75] + '...') if len(self.question_body) > 75 else self.question_body
        return f"Pergunta ID: {self.id}" # Fallback