from rest_framework import serializers
from .models import Question
from users.serializers import UserDetailSerializer

class QuestionSerializer(serializers.ModelSerializer):
    
    author_details = UserDetailSerializer(source='author', read_only=True)
    reply_count = serializers.SerializerMethodField()
    save_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    
    # --- 1. ADICIONA ESTA LINHA ---
    # Isto vai pegar no 'subject' (que é um ID) e substituí-lo
    # pelo resultado do __str__ do modelo Subject (que é o nome)
    subject_name = serializers.StringRelatedField(source='subject', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 
            'question_title', 
            'question_body',
            'question_date', 
            'anonymous',
            'author',
            'author_details',
            'subject',          # O ID da disciplina
            'subject_name',   # <-- 2. ADICIONA O NOVO CAMPO AQUI
            'reply_count',
            'save_count',
            'is_saved'
        ]
        read_only_fields = ['author']

    # --- (As tuas funções get_reply_count, etc. continuam aqui em baixo) ---
    
    def get_reply_count(self, obj):
        if hasattr(obj, 'answers'):
            return obj.answers.count()
        return 0

    def get_save_count(self, obj):
        if hasattr(obj, 'saved_by'):
             return obj.saved_by.count()
        return 0

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if hasattr(obj, 'saved_by'):
            return obj.saved_by.filter(id=request.user.id).exists()
        return False