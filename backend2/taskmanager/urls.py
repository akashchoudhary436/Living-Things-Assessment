from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet, register_user, CustomAuthToken 

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', register_user),  # Public registration endpoint
    path('api/login/', CustomAuthToken.as_view()),  # Django token login
]
