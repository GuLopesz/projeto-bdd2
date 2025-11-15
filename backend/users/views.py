from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer, PasswordSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return[AllowAny()]
        return[IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action == 'change_password':
            return PasswordSerializer
        return UserSerializer
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        user = self.get_object()
        if request.user.id != user.id and not request.user.is_staff:
            return Response({'error': 'Você só pode editar seu perfil'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, pk)
    
    @action(detail=True, methods=['post'], serializer_class=PasswordSerializer)
    def change_password(self, request, pk=None):
        user = self.get_object()
        
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            password = serializer.validated_data['password']
            user.set_password(password)
            user.save()

            return Response({'status': 'Senha alterada com sucesso'}, status=status.HTTP_200_OK)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    