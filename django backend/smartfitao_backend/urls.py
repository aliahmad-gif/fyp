"""
URL configuration for smartfitao_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from accounts import views as accounts_views

urlpatterns = [
    path('', accounts_views.api_root, name='api-root'),
    path('admin/', admin.site.urls),
    # Auth + profile API for frontend apps
    path('api/auth/register/', accounts_views.register, name='register'),
    path('api/auth/verify-signup-otp/', accounts_views.verify_signup_otp, name='verify-signup-otp'),
    path('api/auth/login/', accounts_views.login_view, name='login'),
    path('api/auth/request-password-reset/', accounts_views.request_password_reset, name='request-password-reset'),
    path('api/auth/reset-password/', accounts_views.reset_password, name='reset-password'),
    path('api/auth/profile/', accounts_views.profile, name='profile'),
    # Checkout: save cart when "Go to Shipping", verify shipping/payment forms
    path('api/', include('orders.urls')),
    # Tailors: dashboard and Discovery (list/create/update/delete)
    path('api/', include('tailors.urls')),
]
