from django.contrib import admin
from .models import CheckoutSnapshot, OrderItem, ShippingAddress, PaymentInfo


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(CheckoutSnapshot)
class CheckoutSnapshotAdmin(admin.ModelAdmin):
    list_display = ('id', 'subtotal', 'delivery_fee', 'total', 'created_at')
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'checkout', 'name', 'size', 'quantity', 'price')


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name', 'city', 'country')


@admin.register(PaymentInfo)
class PaymentInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'checkout', 'holder_name', 'card_last_four')
