from django.urls import path
from . import views

urlpatterns = [
    path('checkout/', views.checkout_create),
    path('verify-shipping/', views.verify_shipping),
    path('verify-payment/', views.verify_payment),
]
