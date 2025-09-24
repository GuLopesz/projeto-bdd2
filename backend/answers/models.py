from django.db import models
from django.conf import settings
from questions.models import Question

class Answer(models.Model):
    answer_body = models.TextField()
    answer_date = models.DateTimeField(auto_now_add=True)

    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="answers")

    def __str__(self):
        return f"Resposta de {self.author.username} on {self.question_title}"

