from rest_framework import generics, permissions
from .models import Answer
from .serializers import AnswerSerializer

class AnswerListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    #apenas logados podem postar
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        question_id = self.kwargs.get('question_pk')
        return Answer.objects.filter(question_id=question_id).order_by('answer_date')

    def perform_create(self, serializer):
        question_id = self.kwargs.get('question_pk')
        serializer.save(author=self.request.user, question_id=question_id)