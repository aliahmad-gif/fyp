# Django Backend for Smartfitao Checkout

1. Copy `models.py` into your Django app and run:
   ```bash
   python manage.py makemigrations yourapp
   python manage.py migrate
   ```

2. Copy `views.py` and `urls.py` into your app. In `views.py`, uncomment the lines that import and use `CheckoutSnapshot` and `OrderItem` (replace `yourapp` with your app name).

3. In your project `urls.py` add:
   ```python
   path('api/', include('yourapp.urls')),
   ```

4. Set frontend env so Django is used:
   ```env
   VITE_DJANGO_API_URL=http://localhost:8000/api
   ```

5. CORS: allow your frontend origin in Django (e.g. `django-cors-headers` or `CORS_ALLOWED_ORIGINS`).

Form verification: call `POST /api/verify-shipping/` and `POST /api/verify-payment/` from ShippingPage and PaymentPage before submitting; show backend `errors` on the form.
