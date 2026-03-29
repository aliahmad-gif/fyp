from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


class UserProfile(models.Model):
    """
    Extra profile information for each user.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'Profile({self.user.username})'


class OTP(models.Model):
    """
    Stores one-time codes (for signup verification and password reset).
    """

    PURPOSE_SIGNUP = 'signup'
    PURPOSE_LOGIN = 'login'
    PURPOSE_RESET = 'reset'

    PURPOSE_CHOICES = [
        (PURPOSE_SIGNUP, 'Signup'),
        (PURPOSE_LOGIN, 'Login'),
        (PURPOSE_RESET, 'Reset Password'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=10, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'purpose', 'created_at']),
        ]

    def __str__(self) -> str:
        return f'OTP({self.user.username}, {self.purpose})'

    @classmethod
    def create_otp(cls, user: User, purpose: str, ttl_minutes: int = 10) -> "OTP":
        """
        Helper to generate and store a new OTP.
        """
        import random

        code = f"{random.randint(0, 999999):06d}"
        now = timezone.now()
        otp = cls.objects.create(
            user=user,
            code=code,
            purpose=purpose,
            expires_at=now + timedelta(minutes=ttl_minutes),
        )
        return otp

    def is_valid(self, code: str) -> bool:
        """
        Check if the provided code matches, is not used, and not expired.
        """
        now = timezone.now()
        return (
            not self.used
            and self.code == code
            and self.expires_at >= now
        )

