"""
Django API views for checkout and form verification.
Add to your app views.py and wire URLs to /api/checkout/, /api/verify-shipping/, /api/verify-payment/.
"""
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.validators import validate_email, ValidationError


# If using Django REST framework, use @api_view and serializers instead.
# This example uses plain Django for minimal setup.

@csrf_exempt
@require_http_methods(["POST"])
def checkout_create(request):
    """
    POST /api/checkout/
    Body: { "cartItems": [...], "subtotal": number, "deliveryFee": number, "total": number, "createdAt": string }
    Saves checkout snapshot and returns { "ok": true, "id": <pk> } or 400.
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    subtotal = data.get("subtotal")
    delivery_fee = data.get("deliveryFee", 0)
    total = data.get("total")
    created_at = data.get("createdAt", "")

    if subtotal is None or total is None:
        return JsonResponse({"error": "subtotal and total required"}, status=400)

    # Import your models (adjust app name)
    # from yourapp.models import CheckoutSnapshot, OrderItem
    # snapshot = CheckoutSnapshot.objects.create(
    #     subtotal=subtotal, delivery_fee=delivery_fee, total=total, raw_payload=data
    # )
    # for item in data.get("cartItems", []):
    #     OrderItem.objects.create(
    #         checkout=snapshot,
    #         product_id=item.get("id", ""),
    #         name=item.get("name", ""),
    #         price=item.get("price", 0),
    #         size=item.get("size", ""),
    #         quantity=item.get("quantity", 1),
    #         category=item.get("category", ""),
    #         image=item.get("image", ""),
    #         color=item.get("color", ""),
    #     )
    # return JsonResponse({"ok": True, "id": snapshot.pk})

    # Placeholder response when models are not yet in project:
    return JsonResponse({"ok": True, "message": "Checkout received. Add CheckoutSnapshot model and save."})


@csrf_exempt
@require_http_methods(["POST"])
def verify_shipping(request):
    """
    POST /api/verify-shipping/
    Body: { "email", "firstName", "lastName", "address", "city", "postalCode", "province", "country" }
    Returns { "valid": true } or { "valid": false, "errors": {...} } after Django validation.
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"valid": False, "errors": {"form": "Invalid JSON"}}, status=400)

    errors = {}
    email = data.get("email", "").strip()
    if not email:
        errors["email"] = "Email is required"
    else:
        try:
            validate_email(email)
        except ValidationError:
            errors["email"] = "Enter a valid email"

    for field in ("firstName", "lastName", "address", "city", "postalCode", "province", "country"):
        if not (data.get(field) or "").strip():
            key = field[0].lower() + field[1:]  # camelCase
            errors[key] = "This field is required"

    if errors:
        return JsonResponse({"valid": False, "errors": errors})
    return JsonResponse({"valid": True})


@csrf_exempt
@require_http_methods(["POST"])
def verify_payment(request):
    """
    POST /api/verify-payment/
    Body: { "cardNumber", "holderName", "expiration", "cvv", ... }
    Returns { "valid": true } or { "valid": false, "errors": {...} }.
    Do NOT store full card number; only validate format.
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
