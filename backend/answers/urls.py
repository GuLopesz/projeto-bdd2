from django.urls import path
from .views import AnswerListCreateAPIView 

urlpatterns = [
    path('', AnswerListCreateAPIView.as_view(), name='answer-list-create'),
]