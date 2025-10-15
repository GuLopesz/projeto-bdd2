from rest_framework import viewsets, permissions
from .models import Question
from .serializers import QuestionSerializer
from django_filters.rest_framework import DjangoFilterBackend

class QuestionsViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-question_date')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subject', 'author']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

