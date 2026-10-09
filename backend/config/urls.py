from django.contrib import admin
from django.urls import path
from weather.views import health, cities, forecast

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health, name='health'),
    path('api/cities/', cities, name='cities'),
    path('api/forecast/', forecast, name='forecast'),
]