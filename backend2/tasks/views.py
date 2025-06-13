from datetime import datetime, date
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.http import HttpResponse
from openpyxl import Workbook
from io import BytesIO
from .models import Task
from .serializers import TaskSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.utils.timezone import is_aware


# Updated utility to safely strip tz only from datetime
def strip_tz(dt):
    if isinstance(dt, datetime) and is_aware(dt):
        return dt.replace(tzinfo=None)
    return dt


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            'user_id': token.user_id,
            'username': token.user.username
        })


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def export(self, request):
        tasks = self.get_queryset()
        wb = Workbook()
        ws = wb.active
        ws.title = "Tasks"
        headers = ['ID', 'Title', 'Description', 'Effort (Days)', 'Due Date', 'Created At']
        ws.append(headers)

        for task in tasks:
            ws.append([
                task.id,
                task.title,
                task.description,
                task.effort,
                strip_tz(task.due_date),
                strip_tz(task.created_at)
            ])

        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        response = HttpResponse(
            buffer,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=tasks.xlsx'
        return response


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
