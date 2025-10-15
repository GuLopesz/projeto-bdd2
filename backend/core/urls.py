from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from rest_framework import routers
from users import views as user_views
from questions import views as question_views
from subjects import views as subject_views

router = routers.DefaultRouter()

router.register(r'users', user_views.UserViewSet)
router.register(r'questions', question_views.QuestionsViewSet, basename='questions')
router.register(r'subjects', subject_views.SubjectViewSet, basename='subjects')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
]