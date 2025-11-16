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

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action # Importe o 'action'

from .models import Question # Importe seu modelo Question
from .serializers import QuestionSerializer # Importe seu QuestionSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para visualizar, criar, editar e deletar Perguntas.
    """
    queryset = Question.objects.all().order_by('-question_date') # Ex: ordenar pelas mais recentes
    serializer_class = QuestionSerializer

    def get_permissions(self):
        """
        Define permissões diferentes para cada ação.
        """
        # Qualquer um pode ver a lista de perguntas ou uma pergunta específica
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        
        # Apenas usuários logados podem criar, editar, deletar ou salvar
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """
        Associa automaticamente o usuário logado como o autor da pergunta.
        
        Isso é mais limpo do que sobrescrever 'create' (como você fez em User),
        porque você não precisa trocar de serializer.
        """
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        """
        Permite que apenas o autor original (ou um admin) edite a pergunta.
        """
        question = self.get_object() # Pega a pergunta que está sendo editada
        
        # Verifica se o usuário logado NÃO é o autor da pergunta
        if question.author != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Você só pode editar suas próprias perguntas.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Se for o autor ou staff, continua com a atualização normal
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """
        Permite que apenas o autor original (ou um admin) edite a pergunta (PATCH).
        """
        question = self.get_object()
        
        if question.author != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Você só pode editar suas próprias perguntas.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Permite que apenas o autor original (ou um admin) delete a pergunta.
        """
        question = self.get_object()
        
        if question.author != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Você só pode deletar suas próprias perguntas.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Se for o autor ou staff, continua com a deleção normal
        return super().destroy(request, *args, **kwargs)

    # --- BÔNUS: Ação para 'Salvar' (como no seu frontend) ---
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def save(self, request, pk=None):
        """
        Permite que um usuário logado salve ou 'des-salve' uma pergunta.
        
        (Isso assume que você tem um campo ManyToMany 'saved_by' no seu
         modelo Question: `saved_by = models.ManyToManyField(User, related_name='saved_questions')`
        """
        question = self.get_object()
        user = request.user

        if user in question.saved_by.all():
            # Se já salvou, remove (unsave)
            question.saved_by.remove(user)
            return Response(
                {'status': 'Pergunta removida dos salvos'},
                status=status.HTTP_200_OK
            )
        else:
            # Se não salvou, adiciona (save)
            question.saved_by.add(user)
            return Response(
                {'status': 'Pergunta salva com sucesso'},
                status=status.HTTP_200_OK
            )