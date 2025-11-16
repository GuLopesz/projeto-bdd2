from rest_framework import viewsets
from .models import Subject
from .serializers import SubjectSerializer

class SubjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet que apenas permite listar (read-only) as disciplinas.
    """
    queryset = Subject.objects.all().order_by('subject_name')
    serializer_class = SubjectSerializer
class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    

