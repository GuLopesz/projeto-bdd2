from rest_framework import serializers
from answers.models import Answer

class AnswerSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Answer
        fields = ['id', 'answer_body', 'answer_date', 'question', 'author', 'author_name']

    def get_author_name(self, obj):
        user = obj.author
        if user.user_type == "professor":
            return f"{user.username} (professor)"
        elif user.user_type == "aluno":
            return f"{user.username} (aluno)"
        return user.username