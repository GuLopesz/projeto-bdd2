from rest_framework import serializers
from .models import Answer
from users.serializers import UserDetailSerializer 

class AnswerSerializer(serializers.ModelSerializer):
    author_details = UserDetailSerializer(source='author', read_only=True)
    author_name = serializers.SerializerMethodField()
    answer_date = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Answer
        fields = [
            'id', 
            'answer_body', 
            'answer_date', 
            'question', 
            'author_details',
            'author_name',
        ]
        read_only_fields = ['author_details', 'author_name', 'answer_date', 'question', 'author'] 

    def get_author_name(self, obj):
        user = obj.author
        if user.user_type == "professor":
            return f"{user.username} (Professor)"
        elif user.user_type == "aluno":
            return f"{user.username} (Aluno)"
        return user.username