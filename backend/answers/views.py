from rest_framework import viewsets, permissions
from .models import Answer
from .serializers import AnswerSerializer

class isAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff
    
class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.select_related('author', 'question').all()
    serializer_class = AnswerSerializer
    permissions_classes = [permissions.IsAuthenticatedOrReadOnly, isAuthor]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)