from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailBackend(ModelBackend):
    """
    Autentica o utilizador usando o email.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # A API vai enviar o email no campo 'username'
            # Nós procuramos um utilizador cujo email bate com esse valor
            user = UserModel.objects.get(email=username)
        except UserModel.DoesNotExist:
            return None
        
        # Verifica a senha
        if user.check_password(password):
            return user
        return None