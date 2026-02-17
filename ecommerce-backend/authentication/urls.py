from django.urls import path
from .views import RegisterView, UserDetailView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/user/', UserDetailView.as_view(), name='auth_user'),
]