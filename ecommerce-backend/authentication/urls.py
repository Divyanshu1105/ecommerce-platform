from django.urls import path
from .views import RegisterView, UserDetailView

urlpatterns = [
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/auth/user/', UserDetailView.as_view(), name='auth_user'),
]