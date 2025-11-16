from rest_framework import serializers
from users.models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'date_joined']
        read_only_fields = ['id', 'user_type', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate_email(self, value):
        email_lower = value.lower()
        if not (email_lower.endswith('@aluno.ifsp.edu.br') or email_lower.endswith('@ifsp.edu.br')):
            raise serializers.ValidationError('Somente dicentes ou docentes do IFSP são permitidos')
        return value
        
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError('As senhas não coincidem.')
        return data
        
    def create(self, validated_data):
        validated_data.pop('password_confirm')

        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)

        user.save()

        return user
class UserDetailSerializer(serializers.ModelSerializer):

    avatar_url = serializers.CharField(read_only=True) 

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar_url']

class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'} 
    )

    class Meta:
        fields = ['password']
