from django.contrib import admin
from .models import Tailor


@admin.register(Tailor)
class TailorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'specification', 'available_status', 'created_at')
    list_filter = ('available_status', 'specification')
    search_fields = ('name', 'location', 'specification')
    list_editable = ('available_status',)
    ordering = ('name',)
