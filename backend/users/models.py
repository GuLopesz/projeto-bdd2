from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    
    USER_TYPE_CHOICES = [
        ("aluno", "Aluno"),
        ("professor", "Professor"),
    ]

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, blank=True)

    def save(self, *args, **kwargs):
        if self.email:
            email = self.email.lower()
            if email.endswith("@aluno.ifsp.edu.br"):
                self.user_type = "aluno"
            elif email.endswith("@ifsp.edu.br"):
                self.user_type = "professor"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.user_type})"