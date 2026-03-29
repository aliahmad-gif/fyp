"""
Tailors app – tables for managing tailors (dashboard).
Sync to Firebase from admin or via API so Tailor Discovery page can read from Firebase.
"""
from django.db import models


class Tailor(models.Model):
    """
    Tailor profile: name, location, specification, available status, about.
    Table name in DB: tailors_tailor
    """
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    specification = models.CharField(max_length=255, help_text="e.g. Wedding Gowns, Bespoke Suits")
    available_status = models.BooleanField(
        default=True,
        help_text="Yes=True, No=False"
    )
    about = models.TextField(blank=True)
    image = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Tailor'
        verbose_name_plural = 'Tailors'
        db_table = 'tailors_tailor'

    def __str__(self):
        return self.name

    @property
    def available_status_display(self):
        return 'yes' if self.available_status else 'no'
