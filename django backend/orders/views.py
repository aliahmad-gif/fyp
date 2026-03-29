"""
Checkout API: save snapshot when user goes to shipping; verify shipping/payment forms.
"""
import json
from decimal import Decimal
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.validators import validate_email, ValidationError

from .models import CheckoutSnapshot, OrderItem


@csrf_exempt
@require_http_methods(["POST"])
def checkout_create(request):
    """
    POST /api/checkout/
    Body: { "cartItems": [...], "subtotal", "deliveryFee", "total", "createdAt" }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    subtotal = data.get("subtotal")
    delivery_fee = data.get("deliveryFee", 0)
    total = data.get("total")

    if subtotal is None or total is None:
        return JsonResponse({"error": "subtotal and total required"}, status=400)

    snapshot = CheckoutSnapshot.objects.create(
        subtotal=Decimal(str(subtotal)),
        delivery_fee=Decimal(str(delivery_fee)),
        total=Decimal(str(total)),
        raw_payload=data,
    )
    for item in data.get("cartItems", []):
        OrderItem.objects.create(
            checkout=snapshot,
            product_id=item.get("id", ""),
            name=item.get("name", ""),
            price=Decimal(str(item.get("price", 0))),
            size=item.get("size", ""),
            quantity=int(item.get("quantity", 1)),
            category=item.get("category", ""),
            image=item.get("image", "")[:500],
            color=item.get("color", ""),
        )
    return JsonResponse({"ok": True, "id": snapshot.pk})


@csrf_exempt
@require_http_methods(["POST"])
def verify_shipping(request):
    """
    POST /api/verify-shipping/
    Body: { "email", "firstName", "lastName", "address", "city", "postalCode", "province", "country" }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"valid": False, "errors": {"form": "Invalid JSON"}}, status=400)

    errors = {}
    email = (data.get("email") or "").strip()
    if not email:
        errors["email"] = "Email is required"
    else:
        try:
            validate_email(email)
        except ValidationError:
            errors["email"] = "Enter a valid email"

    for field in ("firstName", "lastName", "address", "city", "postalCode", "province", "country"):
        if not (data.get(field) or "").strip():
            key = field[0].lower() + field[1:]
            errors[key] = "This field is required"

    if errors:
        return JsonResponse({"valid": False, "errors": errors})
    return JsonResponse({"valid": True})


@csrf_exempt
@require_http_methods(["POST"])
def verify_payment(request):
    """
    POST /api/verify-payment/
    Body: { "cardNumber", "holderName", "expiration", "cvv" }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"valid": False, "errors": {"form": "Invalid JSON"}}, status=400)

    errors = {}
    card = (data.get("cardNumber") or "").replace(" ", "")
    if len(card) < 13 or len(card) > 19 or not card.isdigit():
        errors["cardNumber"] = "Enter a valid card number"
    if not (data.get("holderName") or "").strip():
        errors["holderName"] = "Card holder name is required"
    exp = (data.get("expiration") or "").strip()
    if not exp or "/" not in exp:
        errors["expiration"] = "Use MM/YY format"
    cvv = (data.get("cvv") or "").strip()
    if len(cvv) < 3 or len(cvv) > 4 or not cvv.isdigit():
        errors["cvv"] = "Enter a valid CVV"

    if errors:
        return JsonResponse({"valid": False, "errors": errors})
    return JsonResponse({"valid": True})
