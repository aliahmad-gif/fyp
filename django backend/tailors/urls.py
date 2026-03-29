from django.urls import path
from . import views

urlpatterns = [
    path('tailors/', views.tailor_list),
    path('tailors/create/', views.tailor_create),
    path('tailors/<int:pk>/', views.tailor_detail),
    path('tailors/<int:pk>/update/', views.tailor_update),
    path('tailors/<int:pk>/delete/', views.tailor_delete),
]
