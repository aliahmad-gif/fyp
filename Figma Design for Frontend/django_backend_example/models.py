"""
Django models for Smartfitao checkout/orders.
Add these to your Django app (e.g. orders/models.py) and run migrations.
"""
from django.db import models


class CheckoutSnapshot(models.Model):
    """Stores checkout payload when user clicks 'Go to Shipping'."""
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    raw_payload = models.JSONField(default=dict, help_text="Full payload from frontend")

    class Meta:
        ordering = ['-created_at']


class OrderItem(models.Model):
    """One line item in an order (from cart)."""
    checkout = models.ForeignKey(
        CheckoutSnapshot, on_delete=models.CASCADE, related_name='items', null=True, blank=True
    )
    product_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField(default=1)
    category = models.CharField(max_length=100, blank=True)
    image = models.URLField(blank=True)
    color = models.CharField(max_length=100, blank=True)


class ShippingAddress(models.Model):
    """Shipping details (verified from frontend form)."""
    checkout = models.OneToOneField(
        CheckoutSnapshot, on_delete=models.CASCADE, related_name='shipping', null=True, blank=True
    )
    email = models.EmailField()
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    address = models.TextField()
    shipping_note = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    province = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='Pakistan')
    save_info = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class PaymentInfo(models.Model):
    """Payment details (verified from frontend)."""
    checkout = models.OneToOneField(
        CheckoutSnapshot, on_delete=models.CASCADE, related_name='payment', null=True, blank=True
    )
    card_last_four = models.CharField(max_length=4, blank=True)  # never store full card
    holder_name = models.CharField(max_length=255, blank=True)
    vat_number = models.CharField(max_length=100, blank=True)
    pec = models.CharField(max_length=255, blank=True)
    billing_same_as_shipping = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
