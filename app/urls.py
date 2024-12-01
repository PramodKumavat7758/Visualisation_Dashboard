from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('api/filtered-data/', views.get_filtered_data, name='get_filtered_data'),
]
