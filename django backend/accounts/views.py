from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile, OTP


@api_view(["GET"])
@permission_classes([AllowAny])
def api_root(request):
    """Root URL: backend me saare folders / pages attach – sab endpoints yahan."""
    return Response({
        "message": "SmartFitao API – backend me sab pages attach he",
        "base_url": "http://localhost:8000",
        "apps": {
            "accounts": {
                "register": "/api/auth/register/",
                "verify_signup_otp": "/api/auth/verify-signup-otp/",
                "login": "/api/auth/login/",
                "request_password_reset": "/api/auth/request-password-reset/",
                "reset_password": "/api/auth/reset-password/",
                "profile": "/api/auth/profile/",
            },
            "orders": {
                "checkout": "/api/checkout/",
                "verify_shipping": "/api/verify-shipping/",
                "verify_payment": "/api/verify-payment/",
            },
            "tailors": {
                "list": "/api/tailors/",
                "create": "/api/tailors/create/",
                "detail": "/api/tailors/<id>/",
                "update": "/api/tailors/<id>/update/",
                "delete": "/api/tailors/<id>/delete/",
            },
        },
        "endpoints_flat": [
            "/api/auth/register/",
            "/api/auth/verify-signup-otp/",
            "/api/auth/login/",
            "/api/auth/request-password-reset/",
            "/api/auth/reset-password/",
            "/api/auth/profile/",
            "/api/checkout/",
            "/api/verify-shipping/",
            "/api/verify-payment/",
            "/api/tailors/",
            "/api/tailors/create/",
            "/api/tailors/<id>/",
            "/api/tailors/<id>/update/",
            "/api/tailors/<id>/delete/",
        ],
    })


def _generate_tokens(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def _sync_user_to_firebase(user: User) -> None:
    """
    Optional: mirror the user into Firebase (Auth/Firestore).

    To enable this, you must:
    - Create a Firebase service account JSON.
    - Point the GOOGLE_APPLICATION_CREDENTIALS env var to it.
    - Uncomment the firebase_admin imports and implementation.
    """
    try:
        # Example placeholder – implement according to your Firebase setup.
        # from firebase_admin import auth as fb_auth
        # fb_auth.get_user_by_email(user.email)
        # If not found, create:
        # fb_auth.create_user(email=user.email, display_name=user.username)
        pass
    except Exception:
        # In dev we silently ignore Firebase sync failures.
        pass


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user and send an OTP for email verification.

    Expected JSON:
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "secret123",
      "phone": "0300..."
    }
    """
    data = request.data
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    phone = data.get("phone", "").strip()

    if not name or not email or not password:
        return Response({"detail": "Name, email and password are required."},
                        status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "User with this email already exists."},
                        status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name,
        )
        profile = UserProfile.objects.create(
            user=user,
            phone=phone,
            is_verified=False,
        )
        otp = OTP.create_otp(user=user, purpose=OTP.PURPOSE_SIGNUP)

    # In real app you would send otp.code via email / SMS.
    # For now we return it in response so frontend can show it in dev.

    return Response(
        {
            "detail": "User registered. Please verify with OTP.",
            "otp": otp.code,
            "user": {
                "id": user.id,
                "name": name,
                "email": email,
                "phone": phone,
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_signup_otp(request):
    """
    Verify OTP after signup.

    Expected JSON:
    {
      "email": "user@example.com",
      "code": "123456"
    }
    """
    data = request.data
    email = data.get("email", "").strip().lower()
    code = data.get("code", "").strip()

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "User not found."},
                        status=status.HTTP_404_NOT_FOUND)

    otp = (
        OTP.objects.filter(
            user=user,
            purpose=OTP.PURPOSE_SIGNUP,
            used=False,
        )
        .order_by("-created_at")
        .first()
    )
    if not otp or not otp.is_valid(code):
        return Response({"detail": "Invalid or expired OTP."},
                        status=status.HTTP_400_BAD_REQUEST)

    otp.used = True
    otp.save(update_fields=["used"])

    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.is_verified = True
    profile.save(update_fields=["is_verified"])

    # Optionally sync to Firebase after successful verification
    _sync_user_to_firebase(user)

    tokens = _generate_tokens(user)

    return Response(
        {
            "detail": "Account verified successfully.",
            "tokens": tokens,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login with email + password.

    Expected JSON:
    {
      "email": "user@example.com",
      "password": "secret123"
    }
    """
    data = request.data
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = authenticate(request, username=email, password=password)
    if not user:
        return Response({"detail": "Invalid credentials."},
                        status=status.HTTP_401_UNAUTHORIZED)

    profile, _ = UserProfile.objects.get_or_create(user=user)
    if not profile.is_verified:
        return Response(
            {"detail": "Account not verified. Please verify OTP first."},
            status=status.HTTP_403_FORBIDDEN,
        )

    tokens = _generate_tokens(user)

    # Optional: also create Django session (not required for SPA, but harmless)
    login(request, user)

    return Response(
        {
            "detail": "Login successful.",
            "tokens": tokens,
            "user": {
                "id": user.id,
                "name": user.first_name or user.username,
                "email": user.email,
            },
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    Start password reset: generate OTP and (in real app) send to email.

    Expected JSON:
    {
      \"email\": \"user@example.com\"
    }
    """
    email = request.data.get("email", "").strip().lower()
    if not email:
        return Response({"detail": "Email is required."},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Do not reveal that the email doesn't exist
        return Response(
            {"detail": "If this email exists, a reset code has been sent."},
            status=status.HTTP_200_OK,
        )

    otp = OTP.create_otp(user=user, purpose=OTP.PURPOSE_RESET)

    return Response(
        {
            "detail": "Reset code generated.",
            "otp": otp.code,  # For dev only
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Complete password reset using OTP.

    Expected JSON:
    {
      \"email\": \"user@example.com\",
      \"code\": \"123456\",
      \"new_password\": \"newpass123\"
    }
    """
    data = request.data
    email = data.get("email", "").strip().lower()
    code = data.get("code", "").strip()
    new_password = data.get("new_password", "")

    if not email or not code or not new_password:
        return Response(
            {"detail": "Email, code and new password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "User not found."},
                        status=status.HTTP_404_NOT_FOUND)

    otp = (
        OTP.objects.filter(
            user=user,
            purpose=OTP.PURPOSE_RESET,
            used=False,
        )
        .order_by("-created_at")
        .first()
    )
    if not otp or not otp.is_valid(code):
        return Response({"detail": "Invalid or expired OTP."},
                        status=status.HTTP_400_BAD_REQUEST)

    otp.used = True
    otp.save(update_fields=["used"])

    user.set_password(new_password)
    user.save(update_fields=["password"])

    return Response(
        {"detail": "Password has been reset successfully."},
        status=status.HTTP_200_OK,
    )


def _profile_response(user, profile_obj):
    return {
        "id": user.id,
        "name": user.first_name or user.username,
        "email": user.email,
        "phone": profile_obj.phone,
        "is_verified": profile_obj.is_verified,
        "created_at": profile_obj.created_at,
    }


@api_view(["GET", "PATCH", "PUT"])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    GET: return current user's profile.
    PATCH/PUT: update name, phone.
    """
    user = request.user
    profile_obj, _ = UserProfile.objects.get_or_create(user=user)
    if request.method in ("PATCH", "PUT"):
        data = request.data
        if "name" in data and data["name"] is not None:
            name = str(data["name"]).strip()
            if name:
                user.first_name = name
                user.save(update_fields=["first_name"])
        if "phone" in data:
            profile_obj.phone = str(data["phone"]).strip() if data["phone"] is not None else ""
            profile_obj.save(update_fields=["phone"])
    return Response(_profile_response(user, profile_obj))
