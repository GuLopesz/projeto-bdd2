from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from rest_framework import routers
from users import views as user_views
from questions import views as question_views
from subjects import views as subject_views
from answers import views as answer_views

router = routers.DefaultRouter()

router.register(r'users', user_views.UserViewSet)
router.register(r'questions', question_views.QuestionsViewSet, basename='questions')
router.register(r'subjects', subject_views.SubjectViewSet, basename='subjects')
router.register(r'answers', answer_views.AnswerViewSet, basename='answers')

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/questions/', include('questions.urls')),
    path('api/subjects/', include('subjects.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]