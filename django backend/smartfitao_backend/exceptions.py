"""
Custom exception handling for the API.
"""
from rest_framework.views import exception_handler
from rest_framework.exceptions import ParseError
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    """Return a clear message when JSON body is empty or invalid."""
    if isinstance(exc, ParseError):
        return Response(
            {
                "detail": "Invalid or empty JSON. Send a JSON body, e.g.: "
                         '{"name": "User Name", "email": "user@example.com", "password": "secret123", "phone": "0300..."}',
            },
            status=400,
        )
    return exception_handler(exc, context)
